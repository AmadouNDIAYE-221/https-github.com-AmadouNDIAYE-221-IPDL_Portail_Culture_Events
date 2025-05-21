import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Card, CardContent } from '@/components/ui/card';
import { EventType } from '@/types/event';
import { eventService } from '@/services/event-service';

interface AdvancedSearchProps {
  onSearch: (filters: any) => void;
}

export function AdvancedSearch({ onSearch }: AdvancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [locations, setLocations] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    query: '',
    location: '',
    type: '',
    date: '',
    priceRange: [0, 1000],
  });

  // Charger les locations disponibles pour le select
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const events = await eventService.getAllEvents();
        const uniqueLocations = [...new Set(events.map(event => event.location))];
        setLocations(uniqueLocations);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handlePriceChange = (value: number[]) => {
    setFilters(prev => ({ ...prev, priceRange: value }));
  };

  const handleDateChange = (date: Date | null) => {
    const dateString = date ? date.toISOString().split('T')[0] : '';
    setFilters(prev => ({ ...prev, date: dateString }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      query: '',
      location: '',
      type: '',
      date: '',
      priceRange: [0, 1000],
    });
  };

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-xl">
          <Input
            type="text"
            placeholder="Rechercher un événement..."
            className="pr-10"
            name="query"
            value={filters.query}
            onChange={handleInputChange}
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span className="sr-only">Filtres avancés</span>
          </Button>
        </div>
        <Button onClick={handleSubmit} className="ml-2">Rechercher</Button>
      </div>

      {isOpen && (
        <Card className="mb-4">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">Lieu</Label>
                <Select
                  value={filters.location}
                  onValueChange={(value) => handleSelectChange('location', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les lieux" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les lieux</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type d'événement</Label>
                <Select
                  value={filters.type}
                  onValueChange={(value) => handleSelectChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous les types</SelectItem>
                    {Object.values(EventType).map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <DatePicker
                  selected={filters.date ? new Date(filters.date) : null}
                  onSelect={handleDateChange}
                  placeholderText="Sélectionner une date"
                />
              </div>

              <div className="space-y-2">
                <Label>Prix (0 - {filters.priceRange[1]} FCFA)</Label>
                <Slider
                  value={filters.priceRange}
                  max={5000}
                  step={100}
                  onValueChange={handlePriceChange}
                  className="mt-6"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-4 flex justify-end space-x-2 mt-4">
                <Button type="button" variant="outline" onClick={handleReset}>Réinitialiser</Button>
                <Button type="submit">Appliquer les filtres</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
