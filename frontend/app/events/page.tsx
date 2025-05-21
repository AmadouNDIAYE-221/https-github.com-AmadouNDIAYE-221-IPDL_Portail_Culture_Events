"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { EventList } from "@/components/events/event-list"
import { EventSearch, EventFilters } from "@/components/events/event-search"
import { Spinner } from "@/components/ui/spinner"
import { useEvents } from "@/hooks/useEvents"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default function EventsPage() {
  const searchParams = useSearchParams();
  const [activeFilters, setActiveFilters] = useState<EventFilters>({});
  const [filterDescription, setFilterDescription] = useState<string>("");
  
  // Initialize filters from URL parameters
  useEffect(() => {
    const filters: EventFilters = {};
    
    if (searchParams.has('q')) {
      filters.query = searchParams.get('q') || undefined;
    }
    
    if (searchParams.has('location')) {
      filters.location = searchParams.get('location') || undefined;
    }
    
    if (searchParams.has('category')) {
      filters.category = searchParams.get('category') || undefined;
    }
    
    if (searchParams.has('start')) {
      const startDate = searchParams.get('start');
      if (startDate) {
        filters.startDate = new Date(startDate);
      }
    }
    
    if (searchParams.has('end')) {
      const endDate = searchParams.get('end');
      if (endDate) {
        filters.endDate = new Date(endDate);
      }
    }
    
    if (Object.keys(filters).length > 0) {
      setActiveFilters(filters);
      updateFilterDescription(filters);
    }
  }, [searchParams]);
  
  // Generate a human-readable description of the active filters
  const updateFilterDescription = (filters: EventFilters) => {
    const parts: string[] = [];
    
    if (filters.query) {
      parts.push(`"${filters.query}"`); 
    }
    
    if (filters.location) {
      parts.push(`à ${filters.location}`);
    }
    
    if (filters.category) {
      parts.push(`dans la catégorie "${filters.category}"`);
    }
    
    if (filters.startDate && filters.endDate) {
      parts.push(`entre le ${format(filters.startDate, 'dd MMMM yyyy', { locale: fr })} et le ${format(filters.endDate, 'dd MMMM yyyy', { locale: fr })}`);
    } else if (filters.startDate) {
      parts.push(`à partir du ${format(filters.startDate, 'dd MMMM yyyy', { locale: fr })}`);
    } else if (filters.endDate) {
      parts.push(`jusqu'au ${format(filters.endDate, 'dd MMMM yyyy', { locale: fr })}`);
    }
    
    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      if (filters.minPrice === 0 && filters.maxPrice >= 100000) {
        // Do not add price filter description if it's the full range
      } else if (filters.maxPrice >= 100000) {
        parts.push(`à partir de ${filters.minPrice} FCFA`);
      } else if (filters.minPrice === 0) {
        parts.push(`jusqu'à ${filters.maxPrice} FCFA`);
      } else {
        parts.push(`entre ${filters.minPrice} et ${filters.maxPrice} FCFA`);
      }
    }
    
    const description = parts.join(' ');
    setFilterDescription(description);
  };
  
  const handleSearch = (filters: EventFilters) => {
    setActiveFilters(filters);
    updateFilterDescription(filters);
  };
  
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-amber-900">Tous les événements</h1>
          <p className="text-muted-foreground">
            Découvrez la richesse culturelle de l'Afrique à travers nos événements
          </p>
        </div>

        {/* Search Component */}
        <EventSearch onSearch={handleSearch} />
        
        {/* Active Filter Description */}
        {filterDescription && (
          <div className="text-sm text-muted-foreground">
            <span>Résultats pour les événements {filterDescription}</span>
          </div>
        )}

        <Separator />

        {/* Events List Component */}
        <EventList 
          showLoadMore={true} 
          filterLocation={activeFilters.location} 
          filterCategory={activeFilters.category}
          filterQuery={activeFilters.query}
          filterStartDate={activeFilters.startDate}
          filterEndDate={activeFilters.endDate}
          filterMinPrice={activeFilters.minPrice}
          filterMaxPrice={activeFilters.maxPrice}
        />
      </div>
    </div>
  )
}
