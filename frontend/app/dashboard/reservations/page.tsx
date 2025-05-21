"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Calendar, 
  MapPin, 
  Clock, 
  AlertCircle, 
  Search, 
  Download, 
  Tag, 
  QrCode, 
  DownloadCloud, 
  Share2, 
  ChevronDown, 
  Filter,
  X
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Spinner } from "@/components/ui/spinner"
import { useReservations } from "@/hooks/useReservations"
import { authService } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

// Type pour les statuts de réservation
type ReservationStatus = 'confirmed' | 'pending' | 'cancelled';

// Type pour les tabs actifs
type ActiveTab = 'all' | 'upcoming' | 'past';

// Interface pour l'événement
interface Event {
  id: string | number;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  price: number;
  startDate?: string; // Optionnel pour compatibilité
  endDate?: string;   // Optionnel pour compatibilité
  category?: string;  // Optionnel pour compatibilité
  imageUrl?: string;  // Optionnel pour compatibilité
}

// Interface pour la réservation
interface Reservation {
  id: string | number;
  eventId: string | number;
  event: Event;
  reservationDate: string;
  numberOfTickets: number;
  status: ReservationStatus;
  userName: string;
  userEmail: string;
}

export default function ReservationsPage() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { reservations, isLoading, error, cancelReservation } = useReservations();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("all");
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "all">("all");
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!authService.isAuthenticated()) {
      setIsRedirecting(true);
      router.push('/login?redirect=/dashboard/reservations');
    }
  }, [router]);
  
  // Filtrer les réservations selon les critères sélectionnés
  useEffect(() => {
    console.log('Début du filtrage des réservations:', reservations);
    
    if (!reservations || reservations.length === 0) {
      console.log('Aucune réservation à filtrer');
      setFilteredReservations([]);
      return;
    }
    
    console.log(`Filtrage de ${reservations.length} réservations`);
    
    // Débogage: Examinons la structure des réservations
    console.log('Structure complète d’une réservation:', reservations[0]);
    
    let filtered = [...reservations];
    
    // Appliquer le filtre de recherche
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(reservation => {
        const titleMatch = reservation.event?.title?.toLowerCase().includes(query) || false;
        const locationMatch = reservation.event?.location?.toLowerCase().includes(query) || false;
        return titleMatch || locationMatch;
      });
      console.log(`Après filtre de recherche: ${filtered.length} réservations`);
    }
    
    // Appliquer le filtre de statut
    if (statusFilter !== "all") {
      filtered = filtered.filter(reservation => {
        const match = reservation.status === statusFilter;
        console.log(`Réservation ${reservation.id} - Status: ${reservation.status}, Filtre: ${statusFilter}, Match: ${match}`);
        return match;
      });
      console.log(`Après filtre de statut: ${filtered.length} réservations`);
    }
    
    // Appliquer le filtre d'onglet (tous, à venir, passés)
    const now = new Date();
    console.log('Date actuelle pour filtrage:', now);
    
    if (activeTab === "upcoming") {
      filtered = filtered.filter(reservation => {
        if (!reservation.event?.date) {
          console.log(`Réservation ${reservation.id} sans date d'événement`);
          return false;
        }
        
        // Prendre startDate si disponible, sinon utiliser date
        let eventDate: Date;
        const event = reservation.event as Event; // Cast explicite pour éviter les erreurs TypeScript
        
        if (event.startDate) {
          eventDate = new Date(event.startDate);
        } else {
          eventDate = new Date(event.date);
        }
        
        // Si l'heure est 00:00:00, c'est probablement juste une date sans heure spécifiée
        // Dans ce cas, comparer les dates sans tenir compte de l'heure
        const isTimeSpecified = eventDate.getHours() !== 0 || eventDate.getMinutes() !== 0;
        
        // Si on a une heure spécifiée, utiliser la comparaison exacte
        // Sinon, comparer juste les dates (jour/mois/année)
        let isUpcoming;
        if (isTimeSpecified) {
          // Comparaison exacte avec date et heure
          isUpcoming = eventDate >= now && reservation.status.toLowerCase() !== 'cancelled';
        } else {
          // Comparaison de juste la date (sans l'heure)
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
          isUpcoming = eventDay >= today && reservation.status.toLowerCase() !== 'cancelled';
        }
        
        console.log(`Réservation ${reservation.id} - Date: ${eventDate}, Status: ${reservation.status}, Upcoming: ${isUpcoming}`);
        return isUpcoming;
      });
      console.log(`Après filtre 'upcoming': ${filtered.length} réservations`);
    } else if (activeTab === "past") {
      filtered = filtered.filter(reservation => {
        if (!reservation.event?.date) {
          console.log(`Réservation ${reservation.id} sans date d'événement`);
          return false;
        }
        
        // Prendre startDate si disponible, sinon utiliser date
        let eventDate: Date;
        const event = reservation.event as Event; // Cast explicite pour éviter les erreurs TypeScript
        
        if (event.startDate) {
          eventDate = new Date(event.startDate);
        } else {
          eventDate = new Date(event.date);
        }
        
        // Si l'heure est 00:00:00, c'est probablement juste une date sans heure spécifiée
        // Dans ce cas, comparer les dates sans tenir compte de l'heure
        const isTimeSpecified = eventDate.getHours() !== 0 || eventDate.getMinutes() !== 0;
        
        // Logique similaire à "upcoming" mais inversée pour les événements passés
        let isPast;
        
        // On considère également comme "passés" les événements annulés
        if (reservation.status.toLowerCase() === 'cancelled') {
          isPast = true;
        } else if (isTimeSpecified) {
          // Comparaison exacte avec date et heure
          isPast = eventDate < now;
        } else {
          // Comparaison de juste la date (sans l'heure)
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
          isPast = eventDay < today;
        }
        
        console.log(`Réservation ${reservation.id} - Date: ${eventDate}, Est passée: ${isPast}`);
        return isPast;
      });
      console.log(`Après filtre 'past': ${filtered.length} réservations`);
    }
    
    // Trier les réservations (à venir d'abord, puis passées)
    filtered.sort((a, b) => {
      if (!a.event?.date || !b.event?.date) return 0;
      
      const dateA = new Date(a.event.date);
      const dateB = new Date(b.event.date);
      
      if (activeTab === "upcoming") {
        // Pour les événements à venir, trier du plus proche au plus éloigné
        return dateA.getTime() - dateB.getTime();
      } else if (activeTab === "past") {
        // Pour les événements passés, trier du plus récent au plus ancien
        return dateB.getTime() - dateA.getTime();
      } else {
        // Pour tous les événements, trier par date (à venir d'abord, puis passés)
        return dateA.getTime() - dateB.getTime();
      }
    });
    
    console.log('Réservations filtrées finales:', filtered);
    setFilteredReservations(filtered);
  }, [reservations, searchQuery, statusFilter, activeTab]);

  // Annuler une réservation
  const handleCancelReservation = async (id: string | number) => {
    try {
      const success = await cancelReservation(id);
      if (success) {
        toast({
          title: "Réservation annulée",
          description: "Votre réservation a été annulée avec succès."
        });
      } else {
        toast({
          title: "Erreur",
          description: "Impossible d'annuler la réservation. Veuillez réessayer.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de l'annulation de la réservation.",
        variant: "destructive"
      });
    }
  };
  
  // Télécharger un billet
  const handleDownloadTicket = (reservationId: string | number) => {
    setIsDownloading(String(reservationId));
    
    // Simulation du téléchargement
    setTimeout(() => {
      toast({
        title: "Billet téléchargé",
        description: "Votre billet a été téléchargé avec succès."
      });
      setIsDownloading(null);
    }, 1500);
  };
  
  // Partager une réservation
  const handleShareReservation = (eventId: string | number) => {
    if (navigator.share) {
      navigator.share({
        title: "Ma réservation pour un événement",
        text: "J'ai réservé un événement sur AfricaEvents. Rejoins-moi !",
        url: `${window.location.origin}/events/${eventId}`,
      })
      .then(() => {
        toast({
          title: "Partagé avec succès",
          description: "Votre réservation a été partagée avec succès."
        });
      })
      .catch((error) => {
        console.error("Erreur lors du partage:", error);
      });
    } else {
      // Fallback pour les navigateurs qui ne supportent pas l'API de partage
      const url = `${window.location.origin}/events/${eventId}`;
      navigator.clipboard.writeText(url);
      toast({
        title: "Lien copié",
        description: "Le lien de l'événement a été copié dans votre presse-papiers."
      });
    }
  };
  
  // Générer un badge de statut formaté
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmé</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800">En attente</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Annulé</Badge>;
      default:
        return <Badge className="border border-gray-200 text-gray-800">Inconnu</Badge>;
    }
  };

  if (isRedirecting) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner size="lg" />
        <span className="ml-2">Redirection vers la page de connexion...</span>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-amber-900">Mes réservations</h1>
          <p className="text-muted-foreground">Consultez et gérez vos réservations d&apos;événements</p>
        </div>
        <div className="flex flex-col items-center justify-center py-12">
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Chargement de vos réservations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-amber-900">Mes réservations</h1>
          <p className="text-muted-foreground">Consultez et gérez vos réservations d&apos;événements</p>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-red-300 p-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">Erreur de chargement</h2>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-amber-600 hover:bg-amber-700"
          >
            Réessayer
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-amber-900">Mes réservations</h1>
          <p className="text-muted-foreground">Consultez et gérez vos réservations d&apos;événements</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-[220px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                Filtrer
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <div className="p-2">
                <Label htmlFor="status-filter" className="text-xs font-medium">Statut</Label>
                <Select 
                  value={statusFilter} 
                  onValueChange={(value: string) => setStatusFilter(value as ReservationStatus | "all")}
                >
                  <SelectTrigger id="status-filter" className="mt-1">
                    <SelectValue placeholder="Tous les statuts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="confirmed">Confirmés</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="cancelled">Annulés</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ActiveTab)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">À venir</TabsTrigger>
          <TabsTrigger value="past">Passés</TabsTrigger>
          <TabsTrigger value="all">Tous</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {filteredReservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h2 className="text-lg font-semibold">
            {searchQuery || statusFilter !== "all" 
              ? "Aucune réservation correspondant à vos critères" 
              : activeTab === "upcoming" 
                ? "Aucune réservation à venir" 
                : activeTab === "past" 
                  ? "Aucun historique de réservation" 
                  : "Aucune réservation"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchQuery || statusFilter !== "all" 
              ? "Essayez avec d'autres critères de recherche" 
              : "Vous n'avez pas encore réservé d'événement."}
          </p>
          <Button asChild className="mt-4 bg-amber-600 hover:bg-amber-700">
            <Link href="/events">Explorer les événements</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredReservations.map((reservation) => {
            const eventDate = new Date(reservation.event.date);
            const isPast = eventDate < new Date();
            const isCancelled = reservation.status === 'cancelled';
          
            return (
              <Card 
                key={reservation.id} 
                className={`overflow-hidden ${isPast ? 'border-muted' : ''} ${isCancelled ? 'opacity-70' : ''}`}
              >
                <div className="aspect-video overflow-hidden relative">
                  <Image
                    src={reservation.event.image || "/placeholder.svg"}
                    alt={reservation.event.title}
                    width={600}
                    height={400}
                    className={`object-cover ${(isPast || isCancelled) ? 'brightness-75' : ''}`}
                    onError={(e) => {
                      // Remplacer l'image par une image par défaut en cas d'erreur
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // Éviter les boucles infinies
                      target.src = '/placeholder.svg';
                    }}
                  />
                  {/* Badge de statut en haut à droite */}
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(reservation.status)}
                  </div>
                </div>
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="line-clamp-1">{reservation.event.title}</CardTitle>
                    {isPast && !isCancelled && (
                      <Badge className="ml-auto whitespace-nowrap border border-gray-200 bg-slate-100">
                        Terminé
                      </Badge>
                    )}
                    {!isCancelled && !isPast && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="ml-auto h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleCancelReservation(reservation.id)}
                        title="Annuler la réservation"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(reservation.event.date), "d MMMM yyyy", { locale: fr })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{reservation.event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {(() => {
                          const event = reservation.event as Event;
                          if (event.startDate && event.endDate) {
                            return `${new Date(event.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.endDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
                          } else {
                            return event.time || "Horaire non spécifié";
                          }
                        })()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Tag className="h-4 w-4" />
                      <span>{reservation.event.category || "Catégorie non spécifiée"}</span>
                    </div>
                  </div>
                  <div className="mt-4 rounded-md bg-amber-50 p-3">
                    <div className="flex justify-between text-sm">
                      <span>Réservé le:</span>
                      <span className="font-medium">
                        {format(new Date(reservation.reservationDate), "d MMM yyyy", { locale: fr })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Nombre de places:</span>
                      <span className="font-medium">{reservation.numberOfTickets}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Numéro de réservation:</span>
                      <span className="font-medium">#{reservation.id.toString().padStart(6, '0')}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  {/* Actions de réservation */}
                  {!isCancelled && !isPast ? (
                    <div className="flex w-full gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1" 
                        onClick={() => handleDownloadTicket(reservation.id)}
                        disabled={isDownloading === String(reservation.id)}
                      >
                        {isDownloading === String(reservation.id) ? (
                          <>
                            <Spinner className="mr-2 h-4 w-4" />
                            Patientez...
                          </>
                        ) : (
                          <>
                            <QrCode className="mr-2 h-4 w-4" />
                            Billet
                          </>
                        )}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <ChevronDown className="h-4 w-4 mr-2" />
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                          <DropdownMenuItem asChild>
                            <Link 
                              href={`/events/${reservation.event.id}`}
                              className="cursor-pointer"
                            >
                              Détails de l'événement
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleShareReservation(reservation.event.id)}
                          >
                            Partager l'événement
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleCancelReservation(reservation.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            Annuler la réservation
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ) : (
                    <div className="flex w-full gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link href={`/events/${reservation.event.id}`}>
                          Voir l'événement
                        </Link>
                      </Button>
                      {!isCancelled && isPast && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1" 
                          onClick={() => handleDownloadTicket(reservation.id)}
                          disabled={isDownloading === String(reservation.id)}
                        >
                          <DownloadCloud className="mr-2 h-4 w-4" />
                          Historique
                        </Button>
                      )}
                    </div>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
      </TabsContent>
      </Tabs>
    </div>
  )
}
