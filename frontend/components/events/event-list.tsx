"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, Search } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { useEvents, Event } from "@/hooks/useEvents"

interface EventListProps {
  limit?: number
  showLoadMore?: boolean
  filterLocation?: string
  filterCategory?: string
  filterQuery?: string
  filterStartDate?: Date | null
  filterEndDate?: Date | null
  filterMinPrice?: number
  filterMaxPrice?: number
}

export function EventList({ 
  limit = 6, 
  showLoadMore = false,
  filterLocation,
  filterCategory,
  filterQuery,
  filterStartDate,
  filterEndDate,
  filterMinPrice,
  filterMaxPrice
}: EventListProps) {
  const [displayLimit, setDisplayLimit] = useState(limit)
  const { events, isLoading, error } = useEvents()

  // Apply filters
  const filteredEvents = events
    // Filter by location - amélioré pour prendre en compte multiple champs et normalisation
    .filter(event => {
      if (!filterLocation) return true;
      
      const normalizedFilter = filterLocation.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
      // Chercher dans tous les champs qui pourraient contenir des informations de lieu
      const locationMatches = event.location && event.location.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedFilter);
      const destinationMatches = event.destinationName && event.destinationName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedFilter);
      
      return locationMatches || destinationMatches;
    })
    // Filter by category - amélioration de la comparaison avec normalisation
    .filter(event => {
      if (!filterCategory) return true;
      
      const normalizedFilter = filterCategory.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
      // Vérifier la catégorie explicite
      const categoryMatches = event.category && 
        event.category.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedFilter);
      
      // Vérifier aussi dans la destination qui peut contenir des infos de catégorie
      const destinationMatches = event.destinationName && 
        event.destinationName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedFilter);
      
      return categoryMatches || destinationMatches;
    })
    // Filter by search query - recherche améliorée avec normalisation pour accents et casse
    .filter(event => {
      if (!filterQuery) return true;
      
      const normalizedQuery = filterQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      
      // Recherche dans tous les champs pertinents
      const titleMatches = event.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedQuery);
      const descriptionMatches = event.description && 
        event.description.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedQuery);
      const locationMatches = event.location && 
        event.location.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedQuery);
      const destinationMatches = event.destinationName && 
        event.destinationName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalizedQuery);
      
      // Retourner vrai si le terme est trouvé dans l'un des champs
      return titleMatches || descriptionMatches || locationMatches || destinationMatches;
    })
    // Filter by date range
    .filter(event => {
      if (!filterStartDate && !filterEndDate) return true;
      
      const eventDate = new Date(event.date);
      
      if (filterStartDate && filterEndDate) {
        return eventDate >= filterStartDate && eventDate <= filterEndDate;
      }
      
      if (filterStartDate) {
        return eventDate >= filterStartDate;
      }
      
      if (filterEndDate) {
        return eventDate <= filterEndDate;
      }
      
      return true;
    })
    // Filter by price range
    .filter(event => {
      if (filterMinPrice === undefined && filterMaxPrice === undefined) return true;
      
      if (filterMinPrice !== undefined && filterMaxPrice !== undefined) {
        return event.price >= filterMinPrice && event.price <= filterMaxPrice;
      }
      
      if (filterMinPrice !== undefined) {
        return event.price >= filterMinPrice;
      }
      
      if (filterMaxPrice !== undefined) {
        return event.price <= filterMaxPrice;
      }
      
      return true;
    })
    // Apply pagination
    .slice(0, displayLimit)

  const loadMore = () => {
    setDisplayLimit(prev => prev + 6)
  }

  if (isLoading) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center">
        <Spinner size="lg" />
        <p className="mt-4 text-muted-foreground">Chargement des événements...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-red-500">Une erreur est survenue lors du chargement des événements.</p>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (filteredEvents.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-xl font-semibold">Aucun événement trouvé</p>
        <p className="text-muted-foreground">
          Aucun événement ne correspond à vos critères de recherche. Essayez d'autres filtres.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.map((event) => (
          <Link href={`/events/${event.id}`} key={event.id} className="group">
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <div className="aspect-video overflow-hidden">
                <Image
                  src={event.imageUrl ? 
                      (event.imageUrl.startsWith('http') ? event.imageUrl : `http://localhost:8080${event.imageUrl}`) 
                      : "/images/event-placeholder.jpg"}
                  alt={event.title}
                  width={600}
                  height={400}
                  className="object-cover transition-transform group-hover:scale-105 h-full w-full"
                  unoptimized // Permet de charger les images depuis le serveur backend
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg text-amber-900 line-clamp-1">{event.title}</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>{new Date(event.date).toLocaleDateString('fr-FR', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>
                      {event.startDate && event.endDate 
                        ? `${new Date(event.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.endDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` 
                        : event.time || "Horaire non spécifié"}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{event.destinationName || event.location || 'Emplacement non spécifié'}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex justify-between items-center">
                <span className="font-semibold">{event.price === 0 ? 'Gratuit' : `${event.price} FCFA`}</span>
                <span className="text-sm text-muted-foreground">
                  {event.availableSeats || event.availableCapacity || event.capacity || 'Nombre de'} places disponibles
                </span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {showLoadMore && events.length > displayLimit && (
        <div className="flex justify-center mt-8">
          <Button 
            onClick={loadMore} 
            variant="outline" 
            className="border-amber-600 text-amber-600 hover:bg-amber-50"
          >
            Voir plus d'événements
          </Button>
        </div>
      )}
    </div>
  )
}
