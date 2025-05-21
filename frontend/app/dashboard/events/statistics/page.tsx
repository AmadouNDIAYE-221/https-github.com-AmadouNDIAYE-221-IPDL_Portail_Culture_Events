"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// Importation directe depuis recharts pour tous les composants nécessaires
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Sector
} from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { authService, eventService } from "@/lib/api"
import { Download, TrendingUp, Users, DollarSign, Calendar } from "lucide-react"
import { format, subDays, startOfMonth, endOfMonth, differenceInDays } from "date-fns"
import { fr } from "date-fns/locale"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A0522D", "#8884D8", "#FF6B6B", "#6B66FF"]

type StatPeriod = "7days" | "30days" | "90days" | "all"

export default function EventStatisticsPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [events, setEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<string>("all")
  const [selectedPeriod, setSelectedPeriod] = useState<StatPeriod>("30days")
  const [stats, setStats] = useState<any>({
    totalAttendees: 0,
    totalRevenue: 0,
    averageAttendeeRate: 0,
    upcomingEvents: 0,
    attendeesByEvent: [],
    revenueByEvent: [],
    attendeesTrend: [],
    categoryDistribution: []
  })
  
  useEffect(() => {
    // Vérifier l'authentification et le rôle d'organisateur
    if (!authService.isAuthenticated()) {
      router.push('/login?redirect=/dashboard/events/statistics')
      return
    }
    
    async function checkUserRole() {
      try {
        const userData = await authService.getCurrentUser()
        if (userData.role !== 'ORGANIZER') {
          toast({
            title: "Accès refusé",
            description: "Vous n'avez pas les droits d'organisateur nécessaires pour accéder à cette page.",
            variant: "destructive"
          })
          router.push('/dashboard')
          return
        }
        
        fetchOrganizerEvents()
      } catch (error) {
        console.error('Error checking user role:', error)
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification de vos droits d'accès.",
          variant: "destructive"
        })
      }
    }
    
    checkUserRole()
  }, [router])
  
  useEffect(() => {
    if (events.length > 0) {
      fetchStatistics()
    }
  }, [events, selectedEvent, selectedPeriod])
  
  const fetchOrganizerEvents = async () => {
    try {
      setIsLoading(true)
      const userEvents = await eventService.getOrganizerEvents()
      setEvents(userEvents)
    } catch (error) {
      console.error('Error fetching organizer events:', error)
      toast({
        title: "Erreur",
        description: "Impossible de récupérer vos événements.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const fetchStatistics = async () => {
    try {
      setIsLoading(true)
      
      // Dans une application réelle, cette logique serait gérée par le backend
      // Simulation des données de statistiques
      
      // Période de filtrage
      let startDate: Date
      const today = new Date()
      
      switch(selectedPeriod) {
        case "7days":
          startDate = subDays(today, 7)
          break
        case "30days":
          startDate = subDays(today, 30)
          break
        case "90days":
          startDate = subDays(today, 90)
          break
        case "all":
        default:
          startDate = new Date(0) // Depuis le début
          break
      }
      
      // Filtrer les événements en fonction de la sélection
      const filteredEvents = selectedEvent === "all" 
        ? events 
        : events.filter(event => event.id === selectedEvent)
      
      // Simuler les données pour chaque événement
      const eventsData = filteredEvents.map(event => {
        const eventDate = new Date(event.date)
        const totalCapacity = event.capacity
        const bookedCapacity = Math.floor(Math.random() * totalCapacity)
        const revenue = bookedCapacity * event.price
        
        // Pour les tendances, générer des données journalières
        const trendDays = differenceInDays(today, startDate)
        const dailyTrend = Array.from({ length: trendDays }, (_, i) => {
          const date = subDays(today, trendDays - i)
          return {
            date: format(date, "yyyy-MM-dd"),
            attendees: Math.floor(Math.random() * 10) // Réservations quotidiennes
          }
        })
        
        return {
          id: event.id,
          title: event.title,
          date: eventDate,
          capacity: totalCapacity,
          attendees: bookedCapacity,
          revenue: revenue,
          attendanceRate: (bookedCapacity / totalCapacity) * 100,
          category: event.category,
          dailyTrend
        }
      })
      
      // Agréger les données
      const totalAttendees = eventsData.reduce((sum, event) => sum + event.attendees, 0)
      const totalRevenue = eventsData.reduce((sum, event) => sum + event.revenue, 0)
      const averageAttendeeRate = eventsData.length > 0 
        ? eventsData.reduce((sum, event) => sum + event.attendanceRate, 0) / eventsData.length
        : 0
      const upcomingEvents = events.filter(event => new Date(event.date) > today).length
      
      // Préparer les données pour les graphiques
      const attendeesByEvent = eventsData.map(event => ({
        name: event.title,
        value: event.attendees
      }))
      
      const revenueByEvent = eventsData.map(event => ({
        name: event.title,
        value: event.revenue
      }))
      
      // Fusionner les tendances quotidiennes
      let attendeesTrend: any[] = []
      if (eventsData.length > 0) {
        // Créer un objet pour agréger par date
        const trendByDate: Record<string, number> = {}
        
        eventsData.forEach(event => {
          event.dailyTrend.forEach((day: any) => {
            if (!trendByDate[day.date]) {
              trendByDate[day.date] = 0
            }
            trendByDate[day.date] += day.attendees
          })
        })
        
        // Convertir en tableau pour le graphique
        attendeesTrend = Object.entries(trendByDate).map(([date, attendees]) => ({
          date,
          attendees
        })).sort((a, b) => a.date.localeCompare(b.date))
      }
      
      // Distribution par catégorie
      const categoryCounts: Record<string, number> = {}
      eventsData.forEach(event => {
        if (!categoryCounts[event.category]) {
          categoryCounts[event.category] = 0
        }
        categoryCounts[event.category] += event.attendees
      })
      
      const categoryDistribution = Object.entries(categoryCounts).map(([category, count]) => ({
        name: category,
        value: count
      }))
      
      setStats({
        totalAttendees,
        totalRevenue,
        averageAttendeeRate,
        upcomingEvents,
        attendeesByEvent,
        revenueByEvent,
        attendeesTrend,
        categoryDistribution
      })
      
    } catch (error) {
      console.error('Error fetching statistics:', error)
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les statistiques. Veuillez réessayer plus tard.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Fonction pour l'exportation des données (simulation)
  const exportData = (format: string) => {
    toast({
      title: "Export en cours",
      description: `Vos données sont en cours d'exportation au format ${format.toUpperCase()}.`
    })
    
    // Dans une application réelle, cela déclencherait un téléchargement
    setTimeout(() => {
      toast({
        title: "Export terminé",
        description: `Vos données ont été exportées avec succès au format ${format.toUpperCase()}.`
      })
    }, 2000)
  }
  
  if (isLoading && events.length === 0) {
    return (
      <div className="flex items-center justify-center h-full py-12">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Chargement des statistiques...</p>
        </div>
      </div>
    )
  }
  
  if (events.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Statistiques</h2>
          <p className="text-muted-foreground">
            Suivez la performance de vos événements
          </p>
        </div>
        
        <Card className="border-dashed">
          <CardContent className="py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium">Aucune statistique disponible</h3>
              <p className="mt-2 text-muted-foreground">
                Vous n'avez pas encore d'événements pour générer des statistiques.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => router.push('/dashboard/events/create')}
              >
                Créer votre premier événement
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Statistiques</h2>
          <p className="text-muted-foreground">
            Suivez la performance de vos événements
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Select 
            value={selectedEvent} 
            onValueChange={(value) => setSelectedEvent(value)}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Sélectionner un événement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les événements</SelectItem>
              {events.map(event => (
                <SelectItem key={event.id} value={event.id}>
                  {event.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select 
            value={selectedPeriod} 
            onValueChange={(value) => setSelectedPeriod(value as StatPeriod)}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Sélectionner une période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 derniers jours</SelectItem>
              <SelectItem value="30days">30 derniers jours</SelectItem>
              <SelectItem value="90days">90 derniers jours</SelectItem>
              <SelectItem value="all">Toutes les périodes</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="flex" onClick={() => exportData('csv')}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Spinner />
        </div>
      ) : (
        <>
          {/* Cards - Vue d'ensemble */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total des participants
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAttendees}</div>
                <p className="text-xs text-muted-foreground">
                  Taux de remplissage moyen : {stats.averageAttendeeRate.toFixed(1)}%
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Revenus générés
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} FCFA</div>
                <p className="text-xs text-muted-foreground">
                  {(stats.totalAttendees > 0
                    ? (stats.totalRevenue / stats.totalAttendees).toFixed(2)
                    : "0.00"
                  )} FCFA par participant
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Taux de participation
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageAttendeeRate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  Moyenne sur {selectedEvent === "all" ? "tous les événements" : "l'événement"}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Événements à venir
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.upcomingEvents}</div>
                <p className="text-xs text-muted-foreground">
                  Prochains événements planifiés
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Graphiques */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="attendees">Participants</TabsTrigger>
              <TabsTrigger value="revenue">Revenus</TabsTrigger>
              <TabsTrigger value="trends">Tendances</TabsTrigger>
            </TabsList>
            
            {/* Vue d'ensemble */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Participation par événement</CardTitle>
                    <CardDescription>
                      Nombre de participants pour chaque événement
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={stats.attendeesByEvent}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} participants`, 'Participants']} />
                        <Bar dataKey="value" fill="#8884d8" name="Participants" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Distribution par catégorie</CardTitle>
                    <CardDescription>
                      Répartition des participants par catégorie d'événement
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={stats.categoryDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {stats.categoryDistribution.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} participants`, 'Participants']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Participants */}
            <TabsContent value="attendees">
              <Card>
                <CardHeader>
                  <CardTitle>Détail des participants</CardTitle>
                  <CardDescription>
                    Analyse détaillée de la participation à vos événements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={stats.attendeesByEvent}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} participants`, 'Participants']} />
                      <Legend />
                      <Bar dataKey="value" fill="#8884d8" name="Participants" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Revenus */}
            <TabsContent value="revenue">
              <Card>
                <CardHeader>
                  <CardTitle>Analyse des revenus</CardTitle>
                  <CardDescription>
                    Répartition des revenus générés par événement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={stats.revenueByEvent}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} FCFA`, 'Revenus']} />
                      <Legend />
                      <Bar dataKey="value" fill="#82ca9d" name="Revenus (FCFA)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Tendances */}
            <TabsContent value="trends">
              <Card>
                <CardHeader>
                  <CardTitle>Tendances de participation</CardTitle>
                  <CardDescription>
                    Évolution du nombre de participants au fil du temps
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={stats.attendeesTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} participants`, 'Participants']} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="attendees" 
                        stroke="#8884d8" 
                        name="Participants"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
