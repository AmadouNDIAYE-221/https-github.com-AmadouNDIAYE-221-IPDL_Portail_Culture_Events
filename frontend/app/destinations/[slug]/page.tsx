import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Calendar, ArrowLeft, Clock, Tag } from "lucide-react";
import { eventService } from "@/services/event-service";
import { Event } from "@/types/event";

// Création d'un service pour les destinations
// Interface pour les destinations avec validation de type
// Interface pour les points d'intu00e9ru00eat (highlights)
interface Highlight {
  name: string;
  description: string;
  image?: string;
}

interface DestinationData {
  id: number;
  name: string;
  slug: string;
  image: string;
  description: string;
  history?: string;
  eventCount?: number;
  highlights?: Highlight[];
}

// Service pour récupérer une destination par son slug
async function getDestinationBySlug(slug: string): Promise<DestinationData | null> {
  try {
    const response = await fetch(`http://localhost:8080/api/destinations/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store' // Désactive la mise en cache pour toujours obtenir les données les plus récentes
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Erreur lors de la récupération de la destination: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Validation et normalisation des données
    const validatedDestination: DestinationData = {
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
            return null;
          }).filter(Boolean)
        : []
    };
    
    return validatedDestination;
  } catch (error) {
    console.error('Erreur lors de la récupération de la destination:', error);
    return null;
  }
}

// Service pour récupérer les événements liés à une destination
async function getEventsByDestination(destinationId: number) {
  try {
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
    
    // Filtrer les événements liés à cette destination
    // et s'assurer que tous les champs nécessaires existent
    return events
      .filter((event: any) => {
        // Vérifier si l'événement est lié à cette destination
        return event && (event.destinationId === destinationId || event.destination?.id === destinationId);
      })
      .map((event: any) => ({
        // S'assurer que tous les champs requis existent et sont du bon type
        id: event.id?.toString() || `event-${Math.random().toString(36).substr(2, 9)}`,
        title: typeof event.title === 'string' ? event.title : 'Événement sans titre',
        description: typeof event.description === 'string' ? event.description : '',
        location: typeof event.location === 'string' ? event.location : '',
        date: typeof event.date === 'string' ? event.date : new Date().toISOString(),
        // Utilisation des heures de début et de fin plutôt que le champ time
        time: event.startDate && event.endDate 
          ? `${new Date(event.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.endDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` 
          : (typeof event.time === 'string' ? event.time : '00:00'),
        startDate: typeof event.startDate === 'string' ? event.startDate : undefined,
        endDate: typeof event.endDate === 'string' ? event.endDate : undefined,
        price: typeof event.price === 'number' ? event.price : 0,
        capacity: typeof event.capacity === 'number' ? event.capacity : 0,
        availableSeats: typeof event.availableSeats === 'number' ? event.availableSeats : 0,
        imageUrl: typeof event.imageUrl === 'string' ? event.imageUrl : '/placeholder.svg',
        type: typeof event.type === 'string' ? event.type : 'Autre',
        organizer: {
          id: typeof event.organizer?.id === 'number' ? event.organizer.id : 0,
          name: typeof event.organizer?.name === 'string' ? event.organizer.name : 'Organisateur',
        },
        createdAt: typeof event.createdAt === 'string' ? event.createdAt : new Date().toISOString(),
        updatedAt: typeof event.updatedAt === 'string' ? event.updatedAt : new Date().toISOString(),
        slug: typeof event.slug === 'string' ? event.slug : `event-${Math.random().toString(36).substr(2, 9)}`,
        featured: !!event.featured,
      }));
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    return [];
  }
}

interface DestinationPageProps {
  params: {
    slug: string;
  };
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  // Récupérer la destination depuis l'API
  const destination = await getDestinationBySlug(params.slug);

  // Si la destination n'existe pas, rediriger vers la page 404
  if (!destination) {
    notFound();
  }
  
  // Débogage des points d'intérêt
  console.log('Points d\'intérêt de la destination:', destination.highlights);
  
  // Récupérer les événements liés à cette destination
  let events: Event[] = [];
  try {
    // Essayer d'abord de récupérer les événements spécifiques à la destination
    const destinationEvents = await getEventsByDestination(destination.id);
    if (destinationEvents && destinationEvents.length > 0) {
      events = destinationEvents.slice(0, 3); // Limiter à 3 événements
    } else {
      // Si aucun événement lié à la destination, récupérer les événements généraux
      const allEvents = await eventService.getAllEvents();
      events = allEvents.slice(0, 3); // Afficher seulement les 3 premiers événements
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des événements:', error);
    events = [];
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <Link href="/destinations" className="flex items-center gap-2 text-amber-600 hover:text-amber-700 mb-6">
        <ArrowLeft className="h-4 w-4" />
        <span>Retour aux destinations</span>
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        {/* En-tête et informations principales */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-amber-900">{destination.name}</h1>
            <div className="flex items-center text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>Sénégal</span>
            </div>
          </div>

          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={typeof destination.image === 'string' 
                ? (destination.image.startsWith('http') 
                  ? destination.image 
                  : destination.image.startsWith('/api/uploads/') 
                    ? `http://localhost:8080${destination.image}` 
                    : destination.image.startsWith('/') 
                      ? `http://localhost:8080${destination.image}` 
                      : destination.image.includes('placeholder') 
                        ? destination.image 
                        : `http://localhost:8080/api/uploads/${destination.image}`)
                : "/placeholder.svg"}
              alt={typeof destination.name === 'string' ? destination.name : 'Destination'}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2 text-amber-800">À propos de {destination.name}</h2>
            <p className="text-muted-foreground">{destination.description}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3 text-amber-800">Points d'intérêt</h2>
            {destination.highlights && destination.highlights.length > 0 ? (
              <ul className="grid gap-4 sm:grid-cols-2">
                {destination.highlights.map((highlight: Highlight, index: number) => {
                  // Débogage des images de point d'intérêt
                  console.log(`Point d'intérêt #${index}:`, highlight)
                  console.log(`URL d'image brute pour #${index}:`, highlight.image)
                  
                  // Construire l'URL complète pour l'image
                  let fullImageUrl = '/placeholder.svg';
                  
                  if (highlight.image && typeof highlight.image === 'string') {
                    if (highlight.image.startsWith('http')) {
                      fullImageUrl = highlight.image;
                    } else if (highlight.image.startsWith('/api/uploads/')) {
                      fullImageUrl = `http://localhost:8080${highlight.image}`;
                    } else if (highlight.image.startsWith('/')) {
                      fullImageUrl = `http://localhost:8080${highlight.image}`;
                    } else {
                      fullImageUrl = `http://localhost:8080/api/uploads/${highlight.image}`;
                    }
                  }
                  
                  console.log(`URL d'image finale pour #${index}:`, fullImageUrl)
                  
                  return (
                    <li key={index} className="flex items-start gap-3 bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                      {highlight.image && (
                        <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
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

        {/* Événements liés à la destination */}
        <div>
          <div className="bg-amber-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4 text-amber-800">Événements à {destination.name}</h2>
            <p className="mb-4">Découvrez les événements culturels à venir dans cette destination.</p>
            <Button className="w-full bg-amber-600 hover:bg-amber-700">
              <Calendar className="h-4 w-4 mr-2" />
              Voir tous les événements
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Événements à venir</h3>
            
            {events.length > 0 ? (
              <div className="space-y-4">
                {events.map((event: Event) => (
                  <Link href={`/events/${event.id}`} key={event.id}>
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative h-24 sm:h-auto sm:w-32 flex-shrink-0">
                          <Image
                            src={typeof event.imageUrl === 'string' 
                              ? (event.imageUrl.startsWith('http') 
                                ? event.imageUrl 
                                : event.imageUrl.startsWith('/api/uploads/') 
                                  ? `http://localhost:8080${event.imageUrl}` 
                                  : event.imageUrl.startsWith('/') 
                                    ? `http://localhost:8080${event.imageUrl}` 
                                    : `http://localhost:8080/api/uploads/${event.imageUrl}`)
                              : "/placeholder.svg?height=200&width=200"}
                            alt={typeof event.title === 'string' ? event.title : 'Événement'}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="p-4 flex-1">
                          <h4 className="font-medium text-amber-900 mb-1 line-clamp-1">{event.title}</h4>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{typeof event.date === 'string' ? new Date(event.date).toLocaleDateString() : 'Date non spécifiée'}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>
                                {event.startDate && event.endDate 
                                  ? `${new Date(event.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.endDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` 
                                  : (typeof event.time === 'string' ? event.time : 'Heure non spécifiée')}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Tag className="h-3 w-3 mr-1" />
                              <span>{typeof event.type === 'string' ? event.type : 'Type non spécifié'}</span>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <p className="text-muted-foreground">Aucun événement à venir pour le moment.</p>
                <p className="text-sm mt-2">Revenez plus tard pour découvrir les nouveaux événements.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
