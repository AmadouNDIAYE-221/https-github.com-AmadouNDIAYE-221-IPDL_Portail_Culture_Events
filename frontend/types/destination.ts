/**
 * Interface représentant une destination touristique
 */
export interface Destination {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  country: string;
  region?: string;
  tags: string[];
  highlights?: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface pour les données de formulaire lors de la création/modification d'une destination
 */
export interface DestinationFormData {
  name: string;
  description: string;
  imageUrl?: string;
  country: string;
  region?: string;
  tags: string[];
  highlights?: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Interface pour les filtres de recherche de destinations
 */
export interface DestinationFilters {
  country?: string;
  region?: string;
  tags?: string[];
  query?: string;
}
