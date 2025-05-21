"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { toast } from "sonner"
import { Search, Download, FileText } from "lucide-react"
import { eventService, reservationService } from "@/lib/api"

interface Ticket {
  id: number
  eventId: number
  eventTitle: string
  userName: string
  userEmail: string
  numberOfTickets: number
  totalPrice: number
  status: string
  reservationDate: string
}

export default function TicketsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedEvent, setSelectedEvent] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [activeTab, setActiveTab] = useState<string>("tickets")

  // Chargement des événements de l'organisateur
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true)
        const data = await eventService.getOrganizerEvents()
        setEvents(data)
      } catch (error) {
        console.error("Erreur lors du chargement des événements:", error)
        toast.error("Impossible de charger vos événements")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Chargement des tickets (réservations)
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true)
        
        // Si un événement spécifique est sélectionné
        if (selectedEvent && selectedEvent !== "all") {
          const eventId = parseInt(selectedEvent)
          const reservations = await reservationService.getEventReservations(eventId)
          
          // Transformer les réservations en tickets
          const formattedTickets = reservations.map((reservation: any) => ({
            id: reservation.id,
            eventId: reservation.event.id,
            eventTitle: reservation.event.title,
            userName: reservation.user.name,
            userEmail: reservation.user.email,
            numberOfTickets: reservation.numberOfTickets,
            totalPrice: reservation.totalPrice || (reservation.numberOfTickets * reservation.event.price),
            status: reservation.status,
            reservationDate: reservation.reservationDate
          }))
          
          setTickets(formattedTickets)
        } else {
          // Récupérer les tickets pour tous les événements
          let allTickets: Ticket[] = []
          
          for (const event of events) {
            try {
              const reservations = await reservationService.getEventReservations(event.id)
              
              const eventTickets = reservations.map((reservation: any) => ({
                id: reservation.id,
                eventId: reservation.event.id,
                eventTitle: reservation.event.title,
                userName: reservation.user.name,
                userEmail: reservation.user.email,
                numberOfTickets: reservation.numberOfTickets,
                totalPrice: reservation.totalPrice || (reservation.numberOfTickets * reservation.event.price),
                status: reservation.status,
                reservationDate: reservation.reservationDate
              }))
              
              allTickets = [...allTickets, ...eventTickets]
            } catch (error) {
              console.error(`Erreur lors du chargement des réservations pour l'événement ${event.id}:`, error)
            }
          }
          
          setTickets(allTickets)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des tickets:", error)
        toast.error("Impossible de charger les ventes de billets")
      } finally {
        setIsLoading(false)
      }
    }

    if (events.length > 0) {
      fetchTickets()
    }
  }, [events, selectedEvent])

  // Filtrer les tickets par recherche
  const filteredTickets = tickets.filter(ticket => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      ticket.eventTitle.toLowerCase().includes(query) ||
      ticket.userName.toLowerCase().includes(query) ||
      ticket.userEmail.toLowerCase().includes(query)
    )
  })

  // Pagination des tickets
  const itemsPerPage = 10
  const paginatedTickets = filteredTickets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    setTotalPages(Math.ceil(filteredTickets.length / itemsPerPage))
    // Réinitialiser à la page 1 si la page actuelle dépasse le nombre total de pages
    if (currentPage > Math.ceil(filteredTickets.length / itemsPerPage)) {
      setCurrentPage(1)
    }
  }, [filteredTickets, currentPage])

  // Fonction pour exporter les tickets en CSV
  const exportToCsv = () => {
    try {
      const headers = ["ID", "Événement", "Nom", "Email", "Billets", "Prix Total", "Statut", "Date"]
      const csvRows = [
        headers.join(","),
        ...filteredTickets.map(ticket => [
          ticket.id,
          `"${ticket.eventTitle.replace(/"/g, '""')}"`,
          `"${ticket.userName.replace(/"/g, '""')}"`,
          ticket.userEmail,
          ticket.numberOfTickets,
          ticket.totalPrice,
          ticket.status,
          new Date(ticket.reservationDate).toLocaleString("fr-FR")
        ].join(","))
      ]

      const csvString = csvRows.join("\n")
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `tickets-export-${new Date().toISOString().split("T")[0]}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success("Export CSV réussi")
    } catch (error) {
      console.error("Erreur lors de l'export CSV:", error)
      toast.error("Erreur lors de l'export CSV")
    }
  }

  // Fonction pour générer un rapport PDF
  const generateReport = () => {
    toast.info("Génération du rapport en cours...")

    try {
      // Créer une nouvelle fenêtre pour le rapport
      const reportWindow = window.open('', '_blank');
      
      if (!reportWindow) {
        toast.error("Impossible d'ouvrir une nouvelle fenêtre. Veuillez autoriser les pop-ups pour ce site.");
        return;
      }

      // Obtenir les statistiques
      const reportStats = calculateStats();

      // Construire le contenu HTML du rapport
      const reportContent = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Rapport des ventes de billets</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              padding: 20px;
              max-width: 1000px;
              margin: 0 auto;
            }
            h1 {
              color: #d97706;
              text-align: center;
              margin-bottom: 10px;
            }
            .report-date {
              text-align: center;
              color: #666;
              margin-bottom: 30px;
            }
            .stats-container {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 15px;
              margin-bottom: 30px;
            }
            .stat-card {
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 15px;
              text-align: center;
            }
            .stat-value {
              font-size: 24px;
              font-weight: bold;
              color: #d97706;
              margin: 10px 0;
            }
            .stat-label {
              font-size: 14px;
              color: #6b7280;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #e5e7eb;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #f3f4f6;
              font-weight: bold;
            }
            tr:nth-child(even) {
              background-color: #f9fafb;
            }
            .status-confirmed {
              color: #047857;
              background-color: #ecfdf5;
              padding: 3px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: bold;
            }
            .status-cancelled {
              color: #b91c1c;
              background-color: #fef2f2;
              padding: 3px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: bold;
            }
            .status-pending {
              color: #92400e;
              background-color: #fffbeb;
              padding: 3px 8px;
              border-radius: 4px;
              font-size: 12px;
              font-weight: bold;
            }
            .print-button {
              display: block;
              margin: 30px auto;
              background-color: #d97706;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 16px;
            }
            @media print {
              .print-button {
                display: none;
              }
            }
          </style>
        </head>
        <body>
          <h1>Rapport des ventes de billets</h1>
          <p class="report-date">Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
          
          <div class="stats-container">
            <div class="stat-card">
              <div class="stat-value">${reportStats.totalRevenue} FCFA</div>
              <div class="stat-label">Total des ventes</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${reportStats.totalTickets}</div>
              <div class="stat-label">Billets vendus</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${reportStats.confirmedTickets}</div>
              <div class="stat-label">Billets confirmés</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${reportStats.cancelledTickets}</div>
              <div class="stat-label">Billets annulés</div>
            </div>
          </div>

          <h2>Liste détaillée des billets</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Événement</th>
                <th>Client</th>
                <th>Billets</th>
                <th>Prix</th>
                <th>Date</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTickets.map(ticket => `
                <tr>
                  <td>${ticket.id}</td>
                  <td>${ticket.eventTitle}</td>
                  <td>${ticket.userName}<br><span style="font-size: 12px; color: #6b7280;">${ticket.userEmail}</span></td>
                  <td>${ticket.numberOfTickets}</td>
                  <td>${ticket.totalPrice} FCFA</td>
                  <td>${new Date(ticket.reservationDate).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <span class="status-${ticket.status === "CONFIRMED" ? "confirmed" : 
                                     ticket.status === "CANCELLED" ? "cancelled" : "pending"}">
                      ${ticket.status === "CONFIRMED" ? "Confirmé" : 
                        ticket.status === "CANCELLED" ? "Annulé" : "En attente"}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <button class="print-button" onclick="window.print(); setTimeout(() => window.close(), 500);">
            Imprimer / Télécharger PDF
          </button>

          <script>
            // Auto-imprimer après 500ms pour laisser le temps au rendu
            setTimeout(() => {
              document.querySelector('.print-button').click();
            }, 500);
          </script>
        </body>
        </html>
      `;

      // Écrire le contenu HTML dans la nouvelle fenêtre
      reportWindow.document.write(reportContent);
      reportWindow.document.close();

      toast.success("Rapport généré avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération du rapport:", error);
      toast.error("Erreur lors de la génération du rapport");
    }
  }

  // Calculer les statistiques
  const calculateStats = () => {
    const totalTickets = tickets.reduce((sum, ticket) => sum + ticket.numberOfTickets, 0)
    const totalRevenue = tickets.reduce((sum, ticket) => sum + ticket.totalPrice, 0)
    const confirmedTickets = tickets
      .filter(ticket => ticket.status === "CONFIRMED")
      .reduce((sum, ticket) => sum + ticket.numberOfTickets, 0)
    const cancelledTickets = tickets
      .filter(ticket => ticket.status === "CANCELLED")
      .reduce((sum, ticket) => sum + ticket.numberOfTickets, 0)
    
    return {
      totalTickets,
      totalRevenue,
      confirmedTickets,
      cancelledTickets
    }
  }

  const stats = calculateStats()

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-amber-900">Ventes de billets</h1>
          <p className="text-muted-foreground">Gérez les ventes de billets pour vos événements</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportToCsv}>
            <Download className="mr-2 h-4 w-4" />
            Exporter CSV
          </Button>
          <Button variant="outline" onClick={generateReport}>
            <FileText className="mr-2 h-4 w-4" />
            Générer rapport
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total des ventes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue} FCFA</div>
            <p className="text-xs text-muted-foreground">Pour tous les événements</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Billets vendus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTickets}</div>
            <p className="text-xs text-muted-foreground">Au total pour tous les événements</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Billets confirmés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmedTickets}</div>
            <p className="text-xs text-muted-foreground">Nombre de billets confirmés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Billets annulés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cancelledTickets}</div>
            <p className="text-xs text-muted-foreground">Nombre de billets annulés</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tickets">Billets</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>
        <TabsContent value="tickets" className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher un billet..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Tous les événements" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les événements</SelectItem>
                  {events.map((event) => (
                    <SelectItem key={event.id} value={event.id.toString()}>
                      {event.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-8">
              <Spinner className="h-8 w-8" />
              <span className="ml-2">Chargement des billets...</span>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-muted-foreground">Aucun billet trouvé</p>
              {searchQuery && (
                <Button variant="link" onClick={() => setSearchQuery("")}>Effacer la recherche</Button>
              )}
            </div>
          ) : (
            <>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Événement</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Billets</TableHead>
                        <TableHead>Prix</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedTickets.map((ticket) => (
                        <TableRow key={ticket.id}>
                          <TableCell className="font-medium">{ticket.id}</TableCell>
                          <TableCell>{ticket.eventTitle}</TableCell>
                          <TableCell>
                            <div>{ticket.userName}</div>
                            <div className="text-xs text-muted-foreground">{ticket.userEmail}</div>
                          </TableCell>
                          <TableCell>{ticket.numberOfTickets}</TableCell>
                          <TableCell>{ticket.totalPrice} FCFA</TableCell>
                          <TableCell>{new Date(ticket.reservationDate).toLocaleDateString("fr-FR")}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={ticket.status === "CONFIRMED" ? "default" : 
                                      ticket.status === "CANCELLED" ? "destructive" : "outline"}
                            >
                              {ticket.status === "CONFIRMED" ? "Confirmé" :
                               ticket.status === "CANCELLED" ? "Annulé" : "En attente"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink 
                          onClick={() => setCurrentPage(i + 1)}
                          isActive={currentPage === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rapports de ventes</CardTitle>
              <CardDescription>Générez des rapports détaillés pour vos événements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="event-report">Événement</Label>
                  <Select>
                    <SelectTrigger id="event-report">
                      <SelectValue placeholder="Tous les événements" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les événements</SelectItem>
                      {events.map((event) => (
                        <SelectItem key={event.id} value={event.id.toString()}>
                          {event.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="report-type">Type de rapport</Label>
                  <Select>
                    <SelectTrigger id="report-type">
                      <SelectValue placeholder="Ventes globales" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Ventes globales</SelectItem>
                      <SelectItem value="attendees">Liste des participants</SelectItem>
                      <SelectItem value="revenue">Revenus par jour</SelectItem>
                      <SelectItem value="detailed">Rapport détaillé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-date">Date de début</Label>
                  <Input type="date" id="from-date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to-date">Date de fin</Label>
                  <Input type="date" id="to-date" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Prévisualiser</Button>
                <Button onClick={generateReport}>Générer le rapport</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
