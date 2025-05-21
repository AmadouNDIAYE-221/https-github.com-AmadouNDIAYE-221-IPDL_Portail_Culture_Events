/**
 * Interface représentant un événement complet
 */
export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  startDate?: string; // Date et heure de début de l'événement
  endDate?: string;   // Date et heure de fin de l'événement
  price: number;
  capacity: number;
  availableSeats: number;
  imageUrl?: string;
  images?: string[];
  type: string;
  organizer: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  slug: string;
  featured?: boolean;
  destinationId?: number;
  destinationName?: string;
}

/**
 * Interface pour les données de formulaire lors de la création/modification d'un événement
 */
export interface EventFormData {
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  price: number;
  capacity: number;
  imageUrl?: string;
  images?: File[];
  type: string;
}

/**
 * Interface pour les filtres de recherche d'événements
 */
export interface EventFilters {
  location?: string;
  type?: string;
  date?: string;
  priceMin?: number;
  priceMax?: number;
  query?: string;
}

/**
 * Type pour les statistiques d'un événement
 */
export interface EventStats {
  totalReservations: number;
  totalRevenue: number;
  reservationsByDay: {
    date: string;
    count: number;
  }[];
}

/**
 * Enumération des types d'événements
 */
export enum EventType {
  CONCERT = 'Concert',
  FESTIVAL = 'Festival',
  EXHIBITION = 'Exposition',
  WORKSHOP = 'Atelier',
  TOUR = 'Visite guidée',
  PERFORMANCE = 'Spectacle',
  CONFERENCE = 'Conférence',
  OTHER = 'Autre'
}
