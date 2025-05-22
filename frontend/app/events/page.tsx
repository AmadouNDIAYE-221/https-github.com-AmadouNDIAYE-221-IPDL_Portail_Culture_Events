"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { EventList } from "@/components/events/event-list"
import { EventSearch, EventFilters } from "@/components/events/event-search"
import { Spinner } from "@/components/ui/spinner"
import { useEvents } from "@/hooks/useEvents"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, Music, Filter, Tag, Clock, Users } from "lucide-react"

// Types d'événements avec icônes correspondantes pour l'affichage visuel
const EVENT_TYPES = [
  { name: 'Festival', icon: <Music className="h-4 w-4 mr-2" /> },
  { name: 'Concert', icon: <Music className="h-4 w-4 mr-2" /> },
  { name: 'Exposition', icon: <Tag className="h-4 w-4 mr-2" /> },
  { name: 'Conférence', icon: <Users className="h-4 w-4 mr-2" /> },
  { name: 'Théâtre', icon: <Users className="h-4 w-4 mr-2" /> },
  { name: 'Danse', icon: <Users className="h-4 w-4 mr-2" /> },
  { name: 'Gastronomie', icon: <Tag className="h-4 w-4 mr-2" /> },
  { name: 'Atelier', icon: <Users className="h-4 w-4 mr-2" /> },
];

export default function EventsPage() {
  const searchParams = useSearchParams();
  const [activeFilters, setActiveFilters] = useState<EventFilters>({});
  const [filterDescription, setFilterDescription] = useState<string>("");
  const { events, isLoading, error } = useEvents();
  
  // Stats calculables sur les événements
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    categories: {} as Record<string, number>,
    locations: {} as Record<string, number>
  });
  
  // Initialiser les statistiques des événements
  useEffect(() => {
    if (events.length > 0) {
      const now = new Date();
      const upcoming = events.filter(event => {
        const eventDate = new Date(event.startDate || event.date);
        return eventDate >= now;
      }).length;
      
      // Compter les événements par catégorie
      const categories: Record<string, number> = {};
      const locations: Record<string, number> = {};
      
      events.forEach(event => {
        // Pour les catégories
        if (event.category) {
          categories[event.category] = (categories[event.category] || 0) + 1;
        }
        
        // Pour les lieux
        const location = event.location || event.destinationName;
        if (location) {
          locations[location] = (locations[location] || 0) + 1;
        }
      });
      
      setStats({
        total: events.length,
        upcoming,
        categories,
        locations
      });
    }
  }, [events]);
  
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
  
  // Trouver les 3 catégories les plus populaires pour l'affichage
  const topCategories = Object.entries(stats.categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name);
    
  const getCategoryIcon = (category: string) => {
    const found = EVENT_TYPES.find(type => type.name.toLowerCase() === category.toLowerCase());
    return found ? found.icon : <Tag className="h-4 w-4 mr-2" />;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
      {/* Hero Section - Design amélioré et stable */}
      <section className="bg-gradient-to-br from-amber-800 to-amber-900 text-white overflow-hidden relative">
        {/* Nouveau motif d'arrière-plan avec position fixe */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-amber-700 rounded-bl-full opacity-10"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-600 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-full h-16 bg-white opacity-10"></div>
        </div>
        
        {/* Overlay sombre pour garantir la lisibilité */}
        <div className="absolute inset-0 bg-amber-950 opacity-10"></div>

        <div className="container relative z-10 px-4 py-16 md:py-24 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <Badge className="bg-amber-600 text-white hover:bg-amber-700 mb-4 py-1.5">
              {isLoading ? 'Chargement...' : `${stats.upcoming} événements à venir`}
            </Badge>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white drop-shadow-sm">
              Événements Culturels du Sénégal
            </h1>
            
            <p className="text-black font-medium text-lg md:text-xl max-w-2xl mx-auto drop-shadow-sm bg-white/80 px-4 py-2 rounded-md backdrop-blur-sm">
              Découvrez toute la richesse culturelle du Sénégal à travers une sélection unique d'événements à ne pas manquer.
            </p>
          </div>
          
          {/* Category Highlights */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {topCategories.map((category) => (
              <Button 
                key={category} 
                variant="outline" 
                className="bg-amber-700/30 hover:bg-amber-700/50 text-white border-amber-500/50 hover:border-amber-400"
                onClick={() => {
                  const newFilters = { ...activeFilters, category };
                  setActiveFilters(newFilters);
                  updateFilterDescription(newFilters);
                }}
              >
                {getCategoryIcon(category)}
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 text-amber-50">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 left-0">
            <path fill="currentColor" fillOpacity="1" d="M0,160L48,170.7C96,181,192,203,288,202.7C384,203,480,181,576,186.7C672,192,768,224,864,224C960,224,1056,192,1152,176C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>
      
      <div className="container px-4 py-12 md:px-6">
        {/* Search Box Card - Elevated Design */}
        <Card className="rounded-xl shadow-lg border-0 bg-white mb-12 -mt-8 relative z-20">
          <CardContent className="p-6">
            <EventSearch onSearch={handleSearch} className="" />
          </CardContent>
        </Card>

        <div className="flex flex-col gap-8">
          {/* Active Filter Description */}
          {filterDescription && (
            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-amber-600 mr-2" />
                <h2 className="font-medium text-amber-900">Filtres actifs</h2>
              </div>
              <p className="text-amber-700 mt-1">
                Résultats pour les événements {filterDescription}
              </p>
            </div>
          )}

          {/* Statistics Cards */}
          {!isLoading && !error && events.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm font-medium text-amber-600">Événements totaux</p>
                    <p className="text-3xl font-bold text-amber-900">{stats.total}</p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-full">
                    <Calendar className="h-6 w-6 text-amber-700" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm font-medium text-amber-600">Événements à venir</p>
                    <p className="text-3xl font-bold text-amber-900">{stats.upcoming}</p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-full">
                    <Clock className="h-6 w-6 text-amber-700" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
                <CardContent className="flex items-center justify-between p-6">
                  <div>
                    <p className="text-sm font-medium text-amber-600">Lieux d'événements</p>
                    <p className="text-3xl font-bold text-amber-900">{Object.keys(stats.locations).length}</p>
                  </div>
                  <div className="p-3 bg-amber-100 rounded-full">
                    <MapPin className="h-6 w-6 text-amber-700" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Events List Section with Title */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-amber-900">Découvrez nos événements</h2>
                <p className="text-muted-foreground mt-1">
                  {isLoading 
                    ? 'Chargement des événements...' 
                    : error 
                      ? 'Une erreur est survenue lors du chargement des événements.' 
                      : events.length === 0 
                        ? 'Aucun événement disponible pour le moment.' 
                        : 'Explorez notre sélection d\'événements culturels à travers le Sénégal.'}
                </p>
              </div>
              
              {/* Reset Filters Button */}
              {Object.keys(activeFilters).length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setActiveFilters({});
                    setFilterDescription('');
                  }}
                  className="border-amber-200 text-amber-800 hover:bg-amber-50"
                >
                  Réinitialiser les filtres
                </Button>
              )}
            </div>

            <Separator className="bg-amber-100" />

            {/* Events List Component */}
            <div className="relative">
              {/* Décoration */}
              <div className="absolute -inset-4 bg-gradient-to-br from-amber-50/50 to-white rounded-2xl -z-10"></div>
              
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
        </div>
      </div>
    </div>
  )
}
