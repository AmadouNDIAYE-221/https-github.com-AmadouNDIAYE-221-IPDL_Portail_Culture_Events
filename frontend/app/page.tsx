"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Calendar, MapPin, Clock, ArrowRight, Music, Theater, Book, Camera, Users, Coffee, Sparkles, ChevronRight } from "lucide-react"
import { EventList } from "@/components/events/event-list"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { destinationService, eventService } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { useRouter } from "next/navigation"
import { format, formatDistanceToNow, isPast, isToday, isTomorrow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Destination {
  id: number;
  name: string;
  description?: string;
  history?: string;
  image: string;
  slug: string;
  highlights?: any[];
  gallery?: string[];
}

interface Event {
  id: number;
  title: string;
  description?: string;
  location?: string;
  date: string;
  startDate?: string;
  endDate?: string;
  time?: string;
  price: number;
  imageUrl?: string;
  destinationId?: number;
  destinationName?: string;
  category?: string;
  availableSeats?: number;
  totalSeats?: number;
}

export default function Home() {
  const router = useRouter();
  
  // États pour les destinations et événements
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(true);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [destinationError, setDestinationError] = useState<string | null>(null);
  const [eventsError, setEventsError] = useState<string | null>(null);
  
  // États pour le formulaire de recherche
  const [searchLocation, setSearchLocation] = useState<string>('');
  const [searchDate, setSearchDate] = useState<string>('');
  const [searchCategory, setSearchCategory] = useState<string>('');
  
  // Récupération des destinations depuis l'API
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setIsLoadingDestinations(true);
        const data = await destinationService.getAllDestinations();
        setDestinations(data);
      } catch (err) {
        console.error('Erreur lors de la récupération des destinations:', err);
        setDestinationError('Impossible de charger les destinations. Veuillez réessayer plus tard.');
      } finally {
        setIsLoadingDestinations(false);
      }
    };
    
    fetchDestinations();
  }, []);
  
  // Récupération et tri des événements depuis l'API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoadingEvents(true);
        const data = await eventService.getAllEvents();
        
        // Filtrer pour ne garder que les événements à venir et les trier par date (du plus proche au plus éloigné)
        const now = new Date();
        const upcoming = data
          .filter(event => {
            const eventDate = event.startDate ? new Date(event.startDate) : new Date(event.date);
            return eventDate >= now;
          })
          .sort((a, b) => {
            const dateA = a.startDate ? new Date(a.startDate) : new Date(a.date);
            const dateB = b.startDate ? new Date(b.startDate) : new Date(b.date);
            return dateA.getTime() - dateB.getTime();
          });
        
        setUpcomingEvents(upcoming);
      } catch (err) {
        console.error('Erreur lors de la récupération des événements:', err);
        setEventsError('Impossible de charger les événements. Veuillez réessayer plus tard.');
      } finally {
        setIsLoadingEvents(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  // Fonction pour gérer la soumission du formulaire de recherche
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construire l'URL avec les paramètres de recherche
    const params = new URLSearchParams();
    
    // N'ajouter que les paramètres qui ont une valeur significative (pas 'all')
    if (searchLocation && searchLocation !== 'all') {
      params.append('location', searchLocation);
    }
    
    if (searchDate) {
      params.append('date', searchDate);
    }
    
    if (searchCategory && searchCategory !== 'all') {
      params.append('category', searchCategory);
    }
    
    // Rediriger vers la page de recherche d'événements avec les paramètres
    router.push(`/events?${params.toString()}`);
  };
  
  // Formater une date pour l'affichage avec indication de proximitu00e9 (aujourd'hui, demain, etc.)
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return `Aujourd'hui, ${format(date, 'HH:mm', { locale: fr })}`;
    } else if (isTomorrow(date)) {
      return `Demain, ${format(date, 'HH:mm', { locale: fr })}`;
    } else {
      return `${format(date, 'dd MMM', { locale: fr })} (${formatDistanceToNow(date, { addSuffix: true, locale: fr })})`;
    }
  };
  
  // Exemple de catégories pour les tags rapides
  const quickCategories = [
    { name: 'Festivals', icon: <Sparkles className="h-3 w-3 mr-1" /> },
    { name: 'Concerts', icon: <Music className="h-3 w-3 mr-1" /> },
    { name: 'Expositions', icon: <Camera className="h-3 w-3 mr-1" /> },
    { name: 'Ateliers', icon: <Users className="h-3 w-3 mr-1" /> },
    { name: 'Gastronomie', icon: <Coffee className="h-3 w-3 mr-1" /> },
  ];

  return (
    <div className="flex flex-col gap-12 pb-12">
      {/* Hero Section */}
      <section className="relative w-full py-16 md:py-24 lg:py-32 overflow-hidden">
        {/* Background avec gradient et motif */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-amber-100 to-orange-50 opacity-70"></div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=50&width=50')] bg-repeat opacity-5"></div>
        
        {/* Décoration */}
        <div className="absolute top-20 left-10 w-24 h-24 rounded-full bg-amber-300 opacity-20 blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-amber-500 opacity-10 blur-3xl"></div>
        
        <div className="container relative z-10 px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-6">
              <Badge className="w-fit bg-amber-100 text-amber-800 hover:bg-amber-200 px-4 py-1 text-sm" variant="secondary">
                Explorez la culture sénégalaise
              </Badge>
              
              <div className="space-y-4">
                <h1 className="text-3xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none text-amber-900">
                  Découvrez la richesse culturelle de l&apos;Afrique
                </h1>
                <p className="max-w-[600px] text-gray-600 md:text-xl">
                  Explorez les festivals, concerts et visites touristiques au Sénégal et partout en Afrique. 
                  <span className="text-amber-700 font-medium">Vivez des expériences authentiques et inoubliables.</span>
                </p>
              </div>
              
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700 py-6 px-8 text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Link href="/events" className="flex items-center">
                    Explorer les événements
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="py-6 px-8 text-base border-amber-300 text-amber-800 hover:bg-amber-50 rounded-xl">
                  <Link href="/organizer">Créer un événement</Link>
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {quickCategories.map((category, index) => (
                  <Link key={index} href={`/events?category=${category.name.toLowerCase()}`} className="inline-flex items-center bg-white hover:bg-amber-50 text-sm text-gray-700 hover:text-amber-700 py-1 px-3 rounded-full border border-gray-200 hover:border-amber-200 transition-colors">
                    {category.icon}
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="relative group lg:order-last">
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-amber-600 rounded-2xl blur-xl opacity-25 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative">
                {/* Affichage du prochain événement */}
                {isLoadingEvents ? (
                  // Affichage pendant le chargement
                  <>
                    <Skeleton className="w-full aspect-square rounded-2xl shadow-xl" />
                    <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3 border border-gray-100">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div>
                          <Skeleton className="h-3 w-24 mb-1" />
                          <Skeleton className="h-4 w-36" />
                        </div>
                      </div>
                    </div>
                  </>
                ) : eventsError ? (
                  // Affichage en cas d'erreur
                  <div className="w-full aspect-square rounded-2xl shadow-xl flex items-center justify-center bg-red-50">
                    <p className="text-red-600 text-center p-4">Impossible de charger les événements</p>
                  </div>
                ) : upcomingEvents.length === 0 ? (
                  // Affichage si aucun événement à venir
                  <div className="w-full aspect-square rounded-2xl shadow-xl flex items-center justify-center bg-amber-50">
                    <div className="text-center p-4">
                      <Calendar className="h-10 w-10 mx-auto mb-2 text-amber-600" />
                      <p className="text-amber-800 font-medium">Aucun événement à venir</p>
                    </div>
                  </div>
                ) : (
                  // Affichage du prochain événement (premier du tableau trié)
                  <>
                    <Link href={`/events/${upcomingEvents[0].id}`}>
                      <Image
                        src={upcomingEvents[0].imageUrl && upcomingEvents[0].imageUrl.startsWith('http') 
                          ? upcomingEvents[0].imageUrl 
                          : upcomingEvents[0].imageUrl 
                            ? `http://localhost:8080${upcomingEvents[0].imageUrl}` 
                            : "/images/event-placeholder.jpg"}
                        width={600}
                        height={600}
                        alt={upcomingEvents[0].title || "Événement à venir"}
                        className="w-full aspect-square object-cover rounded-2xl shadow-xl hover:opacity-95 transition-opacity"
                        priority
                        unoptimized
                      />
                    </Link>
                    <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3 border border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="bg-amber-100 text-amber-700 p-2 rounded-lg">
                          <Calendar className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Prochain événement</p>
                          <Link href={`/events/${upcomingEvents[0].id}`} className="font-medium hover:text-amber-600 transition-colors">
                            {upcomingEvents[0].title}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="container px-4 md:px-6 -mt-6">
        <div className="mx-auto max-w-4xl">
          <Card className="rounded-xl shadow-lg border-gray-100 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 pb-4">
              <CardTitle className="text-xl text-amber-900 flex items-center gap-2">
                <Search className="h-5 w-5 text-amber-600" />
                Trouvez votre prochaine expérience culturelle
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form className="space-y-5" onSubmit={handleSearch}>
                <div className="grid gap-5 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium">Destination</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                      <Select value={searchLocation} onValueChange={setSearchLocation}>
                        <SelectTrigger id="location" className="pl-10 py-6 rounded-lg border-gray-200">
                          <SelectValue placeholder="Toutes les destinations" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les destinations</SelectItem>
                          {destinations.map(destination => (
                            <SelectItem key={destination.id} value={destination.slug}>{destination.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-medium">Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                      <Input 
                        type="date" 
                        id="date" 
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        className="pl-10 py-6 rounded-lg border-gray-200" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium">Catégorie</Label>
                    <div className="relative">
                      <Theater className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                      <Select value={searchCategory} onValueChange={setSearchCategory}>
                        <SelectTrigger id="category" className="pl-10 py-6 rounded-lg border-gray-200">
                          <SelectValue placeholder="Toutes les catégories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les catégories</SelectItem>
                          <SelectItem value="festival">Festivals</SelectItem>
                          <SelectItem value="concert">Concerts</SelectItem>
                          <SelectItem value="exposition">Expositions</SelectItem>
                          <SelectItem value="atelier">Ateliers</SelectItem>
                          <SelectItem value="gastronomie">Gastronomie</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 py-6 px-8 text-base rounded-lg shadow transition-all duration-300 float-right">
                  Rechercher
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Prochains Événements Section - Version Améliorée */}
      <section className="container px-4 md:px-6 py-12">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 mb-3">Agenda culturel</Badge>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Prochains événements à ne pas manquer</h2>
              <p className="text-gray-600 mt-2">Découvrez les événements culturels à venir au Sénégal</p>
            </div>
            <Button variant="outline" asChild className="border-amber-200 text-amber-800 hover:bg-amber-50 self-start md:self-auto">
              <Link href="/events">
                Voir tous les événements
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          {/* Effet de décoration */}
          <div className="relative">
            <div className="absolute -left-4 -right-4 h-[450px] top-20 bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl -z-10 opacity-70 hidden lg:block"></div>
          
            {/* État de chargement */}
            {isLoadingEvents ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="rounded-xl overflow-hidden bg-white shadow-md">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-5">
                      <Skeleton className="h-6 w-3/4 mb-4" />
                      <div className="space-y-3">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-1/3" />
                      </div>
                      <div className="flex justify-between items-center mt-6">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : eventsError ? (
              <div className="text-center py-12 bg-red-50 rounded-lg">
                <p className="text-red-600">{eventsError}</p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={() => {
                    setIsLoadingEvents(true);
                    setEventsError(null);
                    eventService.getAllEvents()
                      .then(data => {
                        const now = new Date();
                        const upcoming = data
                          .filter(event => {
                            const eventDate = event.startDate ? new Date(event.startDate) : new Date(event.date);
                            return eventDate >= now;
                          })
                          .sort((a, b) => {
                            const dateA = a.startDate ? new Date(a.startDate) : new Date(a.date);
                            const dateB = b.startDate ? new Date(b.startDate) : new Date(b.date);
                            return dateA.getTime() - dateB.getTime();
                          });
                        setUpcomingEvents(upcoming);
                      })
                      .catch(err => {
                        console.error('Erreur lors de la récupération des événements:', err);
                        setEventsError('Impossible de charger les événements. Veuillez réessayer plus tard.');
                      })
                      .finally(() => setIsLoadingEvents(false));
                  }}
                >
                  Réessayer
                </Button>
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="text-center py-12 bg-amber-50 rounded-lg">
                <p className="text-amber-800 font-medium">Aucun événement à venir n'est disponible pour le moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.slice(0, 3).map((event) => {
                  const eventDate = event.startDate ? new Date(event.startDate) : new Date(event.date);
                  const formattedDate = formatEventDate(event.startDate || event.date);
                  const imageUrl = event.imageUrl && event.imageUrl.startsWith('http') 
                    ? event.imageUrl 
                    : event.imageUrl 
                      ? `http://localhost:8080${event.imageUrl}` 
                      : "/images/event-placeholder.jpg";
                      
                  return (
                    <Link href={`/events/${event.id}`} key={event.id} className="group">
                      <Card className="overflow-hidden transition-all hover:shadow-xl relative h-full flex flex-col">
                        {/* Badge pour montrer la proximité temporelle */}
                        {isToday(eventDate) && (
                          <Badge className="absolute top-3 right-3 z-10 bg-green-500 text-white"
                                 variant="secondary">Aujourd'hui</Badge>
                        )}
                        {isTomorrow(eventDate) && !isToday(eventDate) && (
                          <Badge className="absolute top-3 right-3 z-10 bg-blue-500 text-white"
                                 variant="secondary">Demain</Badge>
                        )}
                        
                        <div className="aspect-video overflow-hidden">
                          <Image
                            src={imageUrl}
                            alt={event.title}
                            width={600}
                            height={400}
                            className="object-cover transition-transform duration-700 group-hover:scale-110 h-full w-full"
                            unoptimized
                          />
                          {/* Overlay avec dégradé */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        </div>
                        
                        <CardContent className="p-5 flex-1">
                          <h3 className="font-bold text-lg text-amber-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                            {event.title}
                          </h3>
                          <div className="mt-3 space-y-2 text-sm">
                            <div className="flex items-center text-amber-700">
                              <Calendar className="mr-2 h-4 w-4" />
                              <span>{formattedDate}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <MapPin className="mr-2 h-4 w-4" />
                              <span>{event.destinationName || event.location || 'Emplacement non spécifié'}</span>
                            </div>
                            {/* Catégorie de l'événement */}
                            {event.category && (
                              <Badge variant="outline" className="mt-2 border-amber-200 text-amber-700">
                                {event.category}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                        
                        <CardFooter className="p-5 pt-0 flex justify-between items-center border-t border-gray-100 mt-auto">
                          <span className="font-semibold text-amber-900">
                            {event.price === 0 ? 'Gratuit' : `${event.price} FCFA`}
                          </span>
                          <div className="flex items-center text-amber-700 font-medium group-hover:translate-x-1 transition-transform">
                            <span>Détails</span>
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </div>
                        </CardFooter>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="container px-4 md:px-6 py-16">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div className="max-w-2xl">
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200 mb-3">Découvrez le Sénégal</Badge>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Destinations les plus populaires</h2>
              <p className="text-gray-600 mt-2 md:text-lg">
                Explorez les plus beaux endroits du Sénégal et leurs événements culturels à venir
              </p>
            </div>
            <Button variant="outline" asChild className="border-amber-200 text-amber-800 hover:bg-amber-50 self-start md:self-auto">
              <Link href="/destinations">
                Explorer toutes les destinations
              </Link>
            </Button>
          </div>
          
          {/* Affichage de l'état de chargement */}
          {isLoadingDestinations ? (
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="rounded-xl shadow-md overflow-hidden bg-white">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3 mt-2" />
                    <div className="mt-6">
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : destinationError ? (
            <div className="bg-red-50 p-6 rounded-lg text-center">
              <p className="text-red-600">{destinationError}</p>
              <Button 
                variant="outline" 
                className="mt-4" 
                onClick={() => {
                  setIsLoadingDestinations(true);
                  setDestinationError(null);
                  destinationService.getAllDestinations()
                    .then(data => setDestinations(data))
                    .catch(err => {
                      console.error('Erreur lors de la récupération des destinations:', err);
                      setDestinationError('Impossible de charger les destinations. Veuillez réessayer plus tard.');
                    })
                    .finally(() => setIsLoadingDestinations(false));
                }}
              >
                Réessayer
              </Button>
            </div>
          ) : (
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {destinations.length === 0 ? (
                <p className="col-span-full text-center text-gray-500">Aucune destination disponible pour le moment.</p>
              ) : (
                destinations.map((destination) => {
                  // Déterminer l'URL de l'image à afficher
                  const imageUrl = destination.image && destination.image.startsWith('http') 
                    ? destination.image 
                    : destination.image 
                      ? `http://localhost:8080${destination.image}` 
                      : "/placeholder.svg?height=500&width=400";
                      
                  // Déterminer la description à afficher
                  const displayDescription = destination.description || destination.history?.substring(0, 50) || "Découvrez cette magnifique destination";
                  
                  return (
                    <Link 
                      href={`/destinations/${destination.slug}`} 
                      key={destination.id} 
                      className="group flex flex-col overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 bg-white"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={destination.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          unoptimized={imageUrl.startsWith('http')}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        {destination.highlights && (
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <Badge className="bg-white/80 backdrop-blur-sm text-amber-800">{destination.highlights.length} points d'intérêt</Badge>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors">{destination.name}</h3>
                        <p className="text-gray-600 mt-1 line-clamp-2">{displayDescription}</p>
                        <div className="mt-auto pt-4 flex items-center text-amber-600 font-medium text-sm">
                          <span>Découvrir</span>
                          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-16 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4 mb-10">
            <Badge className="bg-white text-amber-800 mb-2">Témoignages</Badge>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Ce que disent nos visiteurs</h2>
            <p className="text-gray-600 max-w-[700px] md:text-lg">
              Découvrez les expériences authentiques de ceux qui ont participé à nos événements culturels à travers le Sénégal
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: "Fatou Diop",
                avatar: "/placeholder.svg?height=100&width=100",
                location: "Dakar, Sénégal",
                quote:
                  "J'ai découvert des festivals incroyables grâce à cette plateforme. Une expérience authentique qui m'a permis de mieux connaître ma propre culture.",
                rating: 5
              },
              {
                name: "Thomas Müller",
                avatar: "/placeholder.svg?height=100&width=100",
                location: "Berlin, Allemagne",
                quote:
                  "En tant que touriste, ce site a été une mine d'or pour planifier mon séjour au Sénégal. J'ai pu assister à des événements que je n'aurais jamais trouvés autrement.",
                rating: 5
              },
              {
                name: "Amadou Sow",
                avatar: "/placeholder.svg?height=100&width=100",
                location: "Saint-Louis, Sénégal",
                quote:
                  "En tant qu'organisateur, j'ai pu toucher un public plus large pour mon festival. La plateforme est simple à utiliser et très efficace.",
                rating: 5
              },
            ].map((testimonial, index) => (
              <Card key={index} className="text-left h-full border-none bg-white/70 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-2">
                    {Array(testimonial.rating)
                      .fill(0)
                      .map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 text-amber-500"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-gray-700 italic">"<span className="not-italic text-black">{testimonial.quote}</span>"</p>
                  </div>
                  
                  <div className="flex items-center gap-3 pt-3 mt-auto border-t border-gray-100">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-amber-100">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button variant="outline" className="bg-white border-gray-200 hover:bg-gray-50">
              Voir plus de témoignages
            </Button>
          </div>
        </div>
      </section>
      
      {/* Call to Action Section */}
      <section className="container px-4 md:px-6 py-16">
        <div className="relative overflow-hidden rounded-2xl bg-amber-600 shadow-xl">
          {/* Décoration */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-amber-700 rounded-full opacity-50 blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-8 md:p-12">
            <div className="max-w-2xl text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Prêt à vivre des expériences culturelles inoubliables ?</h2>
              <p className="text-amber-100 md:text-lg">
                Rejoignez notre communauté pour découvrir les meilleurs événements culturels au Sénégal et dans toute l'Afrique de l'Ouest.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-white text-amber-700 hover:bg-amber-50 py-6 px-8 rounded-xl shadow-lg">
                <Link href="/register">Créer un compte</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-amber-500 py-6 px-8 rounded-xl">
                <Link href="/events">Voir les événements</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
