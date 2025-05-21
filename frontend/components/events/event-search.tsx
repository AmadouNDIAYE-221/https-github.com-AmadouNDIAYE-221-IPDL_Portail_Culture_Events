"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { DatePicker } from "@/components/ui/date-picker"
import { Calendar, MapPin, Search, Filter, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { eventService, destinationService } from "@/lib/api"

interface EventSearchProps {
  onSearch: (filters: EventFilters) => void
  className?: string
}

export interface EventFilters {
  query?: string
  location?: string
  category?: string
  startDate?: Date | null
  endDate?: Date | null
  minPrice?: number
  maxPrice?: number
}

const PRICE_RANGES = [
  { min: 0, max: 1000, label: "0 - 1 000 FCFA" },
  { min: 1000, max: 5000, label: "1 000 - 5 000 FCFA" },
  { min: 5000, max: 10000, label: "5 000 - 10 000 FCFA" },
  { min: 10000, max: 20000, label: "10 000 - 20 000 FCFA" },
  { min: 20000, max: 50000, label: "20 000 - 50 000 FCFA" },
  { min: 50000, max: 100000, label: "50 000+ FCFA" },
]

export function EventSearch({ onSearch, className = "" }: EventSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  
  // Locations available in Senegal for events (major cities and tourist destinations)
  const [locations, setLocations] = useState([
    "Dakar", "Saint-Louis", "Thiès", "Mbour", "Saly", "Casamance", 
    "Ziguinchor", "Cap Skirring", "Sine Saloum", "Gorée", "Touba", "Kaolack"
  ])
  
  // Event categories
  const categories = [
    "Festival", "Concert", "Exposition", "Conférence", "Théâtre", 
    "Danse", "Gastronomie", "Sport", "Atelier", "Tourisme", "Autre"
  ]
  
  const [expanded, setExpanded] = useState(false)
  const [filters, setFilters] = useState<EventFilters>({
    query: searchParams.get("q") || "",
    location: searchParams.get("location") || "",
    category: searchParams.get("category") || "",
    startDate: null,
    endDate: null,
    minPrice: 0,
    maxPrice: 100000
  })
  
  // Load locations from the backend if available
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const destinations = await destinationService.getAllDestinations();
        if (destinations && destinations.length) {
          // Extraire uniquement les noms des destinations pour les utiliser comme lieux
          const locationNames = destinations.map(dest => dest.name);
          // Supprimer les doublons car il y a des entrées dupliquées dans la base de données
          const uniqueLocations = [...new Set(locationNames)];
          setLocations(uniqueLocations);
        }
      } catch (error) {
        console.error("Failed to fetch destinations:", error)
        // Garder les locations codées en dur comme fallback en cas d'erreur
      }
    }
    
    fetchLocations()
  }, [])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
  }
  
  const handlePriceChange = (value: string) => {
    const range = PRICE_RANGES[parseInt(value)]
    if (range) {
      setFilters((prev) => ({ 
        ...prev, 
        minPrice: range.min,
        maxPrice: range.max 
      }))
    }
  }
  
  const handleDateChange = (name: 'startDate' | 'endDate', date: Date | null) => {
    setFilters((prev) => ({ ...prev, [name]: date }))
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate dates if both are provided
    if (filters.startDate && filters.endDate && filters.startDate > filters.endDate) {
      toast({
        title: "Date invalide",
        description: "La date de début doit être antérieure à la date de fin",
        variant: "destructive"
      })
      return
    }
    
    onSearch(filters)
    
    // Update URL with search parameters for bookmarking and sharing
    const params = new URLSearchParams()
    if (filters.query) params.set("q", filters.query)
    if (filters.location) params.set("location", filters.location)
    if (filters.category) params.set("category", filters.category)
    if (filters.startDate) params.set("start", filters.startDate.toISOString().split('T')[0])
    if (filters.endDate) params.set("end", filters.endDate.toISOString().split('T')[0])
    
    router.push(`/events?${params.toString()}`)
  }
  
  const clearFilters = () => {
    setFilters({
      query: "",
      location: "",
      category: "",
      startDate: null,
      endDate: null,
      minPrice: 0,
      maxPrice: 100000
    })
    
    onSearch({})
    router.push("/events")
  }
  
  return (
    <div className={`bg-white rounded-lg shadow-sm border p-4 mb-6 ${className}`}>
      <form onSubmit={handleSearch}>
        <div className="flex flex-col md:flex-row md:items-end gap-3">
          <div className="flex-1">
            <Label htmlFor="query">Recherche</Label>
            <div className="relative">
              <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="query"
                name="query"
                placeholder="Nom d'événement, artiste..."
                className="pl-8"
                value={filters.query}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="w-full md:w-1/4">
            <Label htmlFor="location">Lieu</Label>
            <div className="relative">
              <MapPin className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
              <Select 
                value={filters.location || ""} 
                onValueChange={(value) => handleSelectChange("location", value)}
              >
                <SelectTrigger id="location" className="pl-8">
                  <SelectValue placeholder="Tous les lieux" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les lieux</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
              Rechercher
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setExpanded(!expanded)}
              className="border-amber-600 text-amber-600"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
        </div>
        
        {expanded && (
          <div className="mt-4 pt-4 border-t grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select 
                value={filters.category || ""} 
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <DatePicker
                id="startDate"
                selected={filters.startDate}
                onSelect={(date) => handleDateChange("startDate", date)}
                placeholderText="Sélectionner une date"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <DatePicker
                id="endDate"
                selected={filters.endDate}
                onSelect={(date) => handleDateChange("endDate", date)}
                placeholderText="Sélectionner une date"
                minDate={filters.startDate || undefined}
              />
            </div>
            
            <div className="space-y-2 sm:col-span-2 lg:col-span-3">
              <Label htmlFor="price">Fourchette de prix</Label>
              <Select 
                defaultValue="0" 
                onValueChange={handlePriceChange}
              >
                <SelectTrigger id="price">
                  <SelectValue placeholder="Sélectionner une fourchette de prix" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les prix</SelectItem>
                  {PRICE_RANGES.map((range, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={clearFilters}
                className="text-red-500 border-red-200 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-2" />
                Effacer les filtres
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
