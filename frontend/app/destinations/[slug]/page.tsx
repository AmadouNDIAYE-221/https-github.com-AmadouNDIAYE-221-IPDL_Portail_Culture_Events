import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, ArrowLeft, Clock, Tag, Users, Share2, Camera, Info, ChevronRight } from "lucide-react";
import { eventService, destinationService } from "@/lib/api";

// Interface pour les points d'intérêt
interface Highlight {
  name: string;
  description: string;
  image?: string;
}

// Interface pour les destinations
interface Destination {
  id: number;
  name: string;
  slug: string;
  image: string;
  description: string;
  history?: string;
  eventCount: number;
  highlights: Highlight[];
}

// Interface pour les événements
interface Event {
  id: string | number;
  title: string;
  description: string;
  location: string;
  date: string;
  time?: string;
  startDate?: string;
  endDate?: string;
  price: number;
  imageUrl: string;
  type: string;
  featured?: boolean;
  slug: string;
  destinationId?: number;
  destination?: {
    id: number;
    name: string;
    slug?: string;
  };
}

// Service pour récupérer une destination par son slug
async function getDestinationBySlug(slug: string): Promise<Destination | null> {
  try {
    // Essayer d'abord de récupérer depuis l'API avec le destinationService
    try {
      const destination = await destinationService.getDestinationBySlug(slug);
      return {
        ...destination,
        highlights: Array.isArray(destination.highlights) 
          ? destination.highlights.map((h: any) => {
              if (typeof h === 'string') {
                return { name: h, description: '', image: '' };
              } else if (typeof h === 'object' && h !== null) {
                return {
                  name: typeof h.name === 'string' ? h.name : 'Point d\'intérêt',
                  description: typeof h.description === 'string' ? h.description : '',
                  image: typeof h.image === 'string' ? h.image : undefined
                };
              }
              return { name: 'Point d\'intérêt', description: '', image: '' };
            })
          : []
      };
    } catch (error) {
      console.error('Erreur avec destinationService, utilisation du fetch direct', error);
    }

    // Si le service échoue, utiliser fetch directement
    const response = await fetch(`http://localhost:8080/api/destinations/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Erreur lors de la récupération de la destination: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validation et normalisation des données
    const validatedDestination: Destination = {
      id: typeof data.id === 'number' ? data.id : 0,
      name: typeof data.name === 'string' ? data.name : 'Destination inconnue',
      slug: typeof data.slug === 'string' ? data.slug : slug,
      image: typeof data.image === 'string' ? data.image : '/placeholder.svg',
      description: typeof data.description === 'string' ? data.description : '',
      history: typeof data.history === 'string' ? data.history : undefined,
      eventCount: typeof data.eventCount === 'number' ? data.eventCount : 0,
      highlights: Array.isArray(data.highlights) 
        ? data.highlights.map((h: any) => {
            if (typeof h === 'string') {
              return { name: h, description: '', image: '' };
            } else if (typeof h === 'object' && h !== null) {
              return {
                name: typeof h.name === 'string' ? h.name : 'Point d\'intérêt',
                description: typeof h.description === 'string' ? h.description : '',
                image: typeof h.image === 'string' ? h.image : undefined
              };
            }
            return { name: 'Point d\'intérêt', description: '', image: '' };
          })
        : []
    };
    
    return validatedDestination;
  } catch (error) {
    console.error('Erreur lors de la récupération de la destination:', error);
    return null;
  }
}

// Service pour récupérer les événements liés à une destination
async function getEventsByDestination(destinationId: number, destinationSlug: string, destinationName?: string): Promise<Event[]> {
  try {
    console.log(`Recherche d'événements pour la destination ID: ${destinationId}, slug: ${destinationSlug}`);
    
    // Pour le moment, récupérons tous les événements car l'API ne permet pas encore de filtrer par destination
    const response = await fetch('http://localhost:8080/api/events', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des événements: ${response.status}`);
    }
    
    const events = await response.json();
    
    // Vérifier que events est un tableau
    if (!Array.isArray(events)) {
      console.error('Les événements retournés ne sont pas un tableau:', events);
      return [];
    }
    
    // Filtrer les événements liés à cette destination (par ID ou par nom/slug)
    const filteredEvents = events.filter((event: any) => {
      // Correspondance par ID (la plus précise)
      const matchesById = event.destinationId === destinationId || event.destination?.id === destinationId;
      if (matchesById) return true;
      
      // Si pas de correspondance par ID, vérifions le nom exact de la destination
      const destinationNameLower = destinationName ? destinationName.toLowerCase() : destinationSlug.replace(/-/g, ' ').toLowerCase();
      const destinationSlugLower = destinationSlug.toLowerCase();
      const destinationSlugWithSpaces = destinationSlug.replace(/-/g, ' ').toLowerCase();
      
      // Correspondance exacte sur la destination de l'événement
      if (event.destination) {
        // Par nom
        if (event.destination.name && 
            event.destination.name.toLowerCase() === destinationNameLower) {
          return true;
        }
        
        // Par slug
        if (event.destination.slug && 
            event.destination.slug.toLowerCase() === destinationSlugLower) {
          return true;
        }
      }
      
      // Correspondance exacte sur la localisation
      if (event.location && typeof event.location === 'string') {
        const locationLower = event.location.toLowerCase();
        
        // Vérifier si le nom de la destination est la localisation complète
        if (locationLower === destinationNameLower || locationLower === destinationSlugWithSpaces) {
          return true;
        }
        
        // Vérifier si la localisation commence ou se termine par le nom de la destination
        // avec un séparateur (virgule, espace, etc.)
        const locationWords = locationLower.split(/[\s,]+/); // Séparer par espaces ou virgules
        if (locationWords.includes(destinationNameLower) || locationWords.includes(destinationSlugWithSpaces)) {
          return true;
        }
      }
      
      // Aucune correspondance trouvée
      return false;
    });
    
    console.log(`${filteredEvents.length} événements trouvés pour la destination ${destinationSlug}`);
    
    return filteredEvents.map((event: any) => ({
      id: event.id?.toString() || `event-${Math.random().toString(36).substr(2, 9)}`,
      title: typeof event.title === 'string' ? event.title : 'Événement sans titre',
      description: typeof event.description === 'string' ? event.description : '',
      location: typeof event.location === 'string' ? event.location : '',
      date: typeof event.date === 'string' ? event.date : new Date().toISOString(),
      time: event.startDate && event.endDate 
        ? `${new Date(event.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.endDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` 
        : (typeof event.time === 'string' ? event.time : '00:00'),
      startDate: typeof event.startDate === 'string' ? event.startDate : undefined,
      endDate: typeof event.endDate === 'string' ? event.endDate : undefined,
      price: typeof event.price === 'number' ? event.price : 0,
      imageUrl: typeof event.imageUrl === 'string' ? event.imageUrl : '/placeholder.svg',
      type: typeof event.type === 'string' ? event.type : 'Autre',
      slug: typeof event.slug === 'string' ? event.slug : `event-${Math.random().toString(36).substr(2, 9)}`,
      featured: !!event.featured,
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    return [];
  }
}

// Props pour la page de destination
interface DestinationPageProps {
  params: {
    slug: string;
  };
}

// Composant principal de la page
export default async function DestinationPage({ params }: DestinationPageProps) {
  // Récupérer la destination depuis l'API
  const destination = await getDestinationBySlug(params.slug);

  // Si la destination n'existe pas, rediriger vers la page 404
  if (!destination) {
    notFound();
  }
  
  // Récupérer les événements liés à cette destination
  let events: Event[] = [];
  let totalEventsCount = destination.eventCount || 0;
  let eventsDisplayed = 0;
  
  try {
    // Solution radicale - récupérer tous les événements et filtrer côté client
    const allEvents = await eventService.getAllEvents();
    console.log(`Total des événements récupérés: ${allEvents.length}`);
    
    // Filtrage très strict - ne garder que les événements qui correspondent exactement à cette destination
    const strictlyFilteredEvents = allEvents.filter((event: any) => {
      // Vérifier correspondance exacte par ID
      const matchesById = event.destinationId === destination.id || 
                         (event.destination && event.destination.id === destination.id);
      
      // Vérifier correspondance exacte par slug (si disponible)
      const matchesBySlug = event.destination && 
                            event.destination.slug && 
                            event.destination.slug.toLowerCase() === destination.slug.toLowerCase();
      
      // Vérifier correspondance exacte par nom
      const matchesByName = event.destination && 
                           event.destination.name && 
                           event.destination.name.toLowerCase() === destination.name.toLowerCase();
      
      // Débogage
      if (matchesById || matchesBySlug || matchesByName) {
        console.log(`Événement correspondant pour ${destination.name}: ${event.title}`);
      }
      
      return matchesById || matchesBySlug || matchesByName;
    });
    
    console.log(`${strictlyFilteredEvents.length} événements strictement filtrés pour ${destination.name}`);
    
    // Mettre à jour le nombre total d'événements pour cette destination
    totalEventsCount = strictlyFilteredEvents.length;
    destination.eventCount = totalEventsCount;
    
    // Limiter à 4 événements pour l'affichage
    events = strictlyFilteredEvents.slice(0, 4);
    eventsDisplayed = events.length;
    
    // Ne pas utiliser d'événements de substitution si aucun n'est trouvé - c'est plus propre
    // Si nous voulons vraiment montrer quelque chose, nous pourrions ajouter une option plus tard
    console.log(`${eventsDisplayed} événements à afficher pour ${destination.name}`);
    
    // Vérification supplémentaire - s'assurer que les événements sont bien pour cette destination
    events.forEach(event => {
      console.log(`Événement ${event.title} - Destination: ${event.destination?.name || 'Non spécifiée'}`);
    });
    
    // Mise à jour du compteur d'événements dans l'objet destination
    destination.eventCount = totalEventsCount;
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    events = [];
  }

  // Fonction pour construire l'URL complète d'une image
  const getFullImageUrl = (imagePath: string | undefined) => {
    if (!imagePath) return '/placeholder.svg';
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    } else if (imagePath.startsWith('/api/uploads/')) {
      return `http://localhost:8080${imagePath}`;
    } else if (imagePath.startsWith('/')) {
      return `http://localhost:8080${imagePath}`;
    } else if (imagePath.includes('placeholder')) {
      return imagePath;
    } else {
      return `http://localhost:8080/api/uploads/${imagePath}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white pb-12">
      {/* Hero section avec image en arrière-plan */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        {/* Image d'arrière-plan */}
        <div className="absolute inset-0">
          <Image
            src={getFullImageUrl(destination.image)}
            alt={destination.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10"></div>
        </div>
        
        {/* Contenu du hero */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
          <div className="container mx-auto">
            <Link href="/destinations" className="inline-flex items-center gap-2 text-white hover:text-amber-200 mb-4 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Retour aux destinations</span>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-sm">{destination.name}</h1>
            <div className="flex items-center text-amber-100 mb-4">
              <MapPin className="h-5 w-5 mr-2" />
              <span className="text-lg">Sénégal</span>
            </div>
            
            {/* Badge nombre d'événements */}
            <div className="inline-flex items-center bg-amber-600/90 text-white px-3 py-1.5 rounded-full text-sm font-medium">
              <Calendar className="h-4 w-4 mr-2" />
              {totalEventsCount} événements
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation rapide */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto">
          <div className="flex overflow-x-auto py-4 px-4 md:px-6 gap-6 text-sm font-medium text-amber-800 no-scrollbar">
            <a href="#about" className="flex items-center hover:text-amber-600 whitespace-nowrap">
              <Info className="h-4 w-4 mr-1.5" />
              À propos
            </a>
            <a href="#highlights" className="flex items-center hover:text-amber-600 whitespace-nowrap">
              <Camera className="h-4 w-4 mr-1.5" />
              Points d'intérêt
            </a>
            <a href="#events" className="flex items-center hover:text-amber-600 whitespace-nowrap">
              <Calendar className="h-4 w-4 mr-1.5" />
              Événements
            </a>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container px-4 pt-8 md:px-6 md:pt-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Informations principales - prend 2 colonnes sur 3 */}
          <div className="md:col-span-2 space-y-8">
            <div id="about" className="bg-white rounded-xl p-6 shadow-sm border border-amber-100">
              <h2 className="text-2xl font-semibold mb-4 text-amber-800">À propos de {destination.name}</h2>
              <p className="text-muted-foreground leading-relaxed">{destination.description}</p>
              {destination.history && (
                <div className="mt-4 pt-4 border-t border-amber-100">
                  <h3 className="text-lg font-medium mb-2 text-amber-700">Histoire</h3>
                  <p className="text-muted-foreground leading-relaxed">{destination.history}</p>
                </div>
              )}
            </div>

            <div id="highlights" className="bg-white rounded-xl p-6 shadow-sm border border-amber-100">
              <h2 className="text-2xl font-semibold mb-4 text-amber-800">Points d'intérêt</h2>
              {destination.highlights && destination.highlights.length > 0 ? (
                <ul className="grid gap-4 sm:grid-cols-2">
                  {destination.highlights.map((highlight: Highlight, index: number) => {
                    const fullImageUrl = getFullImageUrl(highlight.image);
                    
                    return (
                      <li key={index} className="flex items-start gap-3 bg-amber-50/50 p-4 rounded-lg border border-amber-100 hover:shadow-sm transition-shadow">
                        {highlight.image && (
                          <div className="relative h-20 w-20 rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={fullImageUrl}
                              alt={highlight.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-medium text-amber-800">{highlight.name}</h3>
                          {highlight.description && (
                            <p className="text-sm text-muted-foreground mt-1">{highlight.description}</p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-muted-foreground">Aucun point d'intérêt n'a été ajouté pour cette destination.</p>
              )}
            </div>
          </div>

          {/* Sidebar - prend 1 colonne sur 3 */}
          <div className="space-y-6">
            
            {/* CTA pour événements */}
            <div id="events" className="bg-gradient-to-br from-amber-600 to-amber-700 p-6 rounded-xl text-white shadow-sm">
              <h3 className="text-lg font-semibold mb-3">Événements à {destination.name}</h3>
              <p className="text-sm text-amber-100 mb-4">Découvrez les événements culturels à venir dans cette destination.</p>
              <div className="text-center text-3xl font-bold mb-4">{totalEventsCount}</div>
              <Button className="w-full bg-white text-amber-800 hover:bg-amber-50 shadow-sm">
                <Calendar className="h-4 w-4 mr-2" />
                Voir tous les événements
              </Button>
            </div>
            
            {/* Partager */}
            <div className="bg-white rounded-xl p-5 border border-amber-100 shadow-sm">
              <h3 className="font-medium text-amber-800 mb-3">Partager cette destination</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" /> Partager
                </Button>
              </div>
            </div>
          </div>

          {/* Section Événements */}
          <div className="md:col-span-2 mt-8">
            <h2 className="text-2xl font-semibold mb-6 text-amber-800">Événements à venir</h2>
              
            {events.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {events.map((event: Event) => (
                  <Link href={`/events/${event.id}`} key={event.id}>
                    <Card className="overflow-hidden hover:shadow-md transition-shadow h-full border-amber-100">
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={getFullImageUrl(event.imageUrl)}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-amber-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                          {event.type || 'Autre'}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-medium text-amber-900 mb-3 line-clamp-2">{event.title}</h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1.5 text-amber-600" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1.5 text-amber-600" />
                            <span>
                              {event.startDate && event.endDate 
                                ? `${new Date(event.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.endDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` 
                                : (event.time || 'Heure non spécifiée')}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-amber-50/50 rounded-lg border border-amber-100">
                <p className="text-muted-foreground">Aucun événement à venir pour le moment.</p>
                <p className="text-sm mt-2">Revenez plus tard pour découvrir les nouveaux événements.</p>
                <Button variant="outline" className="mt-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  Voir tous les événements
                </Button>
              </div>
            )}
            
            {/* Appel à l'action */}
            <div className="mt-12 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-8 border border-amber-100 shadow-sm text-center">
              <h3 className="text-xl font-bold text-amber-900 mb-2">Organisez votre voyage à {destination.name}</h3>
              <p className="text-muted-foreground mb-6">Contactez-nous pour un itinéraire personnalisé et découvrez tous les trésors cachés de cette destination.</p>
              <Button className="bg-amber-600 hover:bg-amber-700 shadow-sm">
                Nous contacter
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
