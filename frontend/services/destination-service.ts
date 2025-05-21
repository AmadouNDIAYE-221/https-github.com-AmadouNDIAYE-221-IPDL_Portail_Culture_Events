import { API_BASE_URL } from '@/lib/api';
import { Destination } from '../types/destination';

/**
 * Service pour gérer les destinations touristiques
 */
export const destinationService = {
  /**
   * Récupère toutes les destinations
   * @returns Liste de toutes les destinations
   */
  async getAllDestinations(): Promise<Destination[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/destinations`);
      if (!response.ok) {
        throw new Error('Failed to fetch destinations');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching destinations:', error);
      throw error;
    }
  },
  
  /**
   * Récupère une destination par son slug
   * @param slug - Slug de la destination
   * @returns Détails de la destination
   */
  async getDestinationBySlug(slug: string): Promise<Destination> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/destinations/${slug}`);
      if (!response.ok) {
        throw new Error('Failed to fetch destination');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching destination with slug ${slug}:`, error);
      throw error;
    }
  },
  
  /**
   * Récupère les événements associés à une destination
   * @param slug - Slug de la destination
   * @returns Liste des événements dans cette destination
   */
  async getEventsByDestination(slug: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/destinations/${slug}/events`);
      if (!response.ok) {
        throw new Error('Failed to fetch events for destination');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching events for destination ${slug}:`, error);
      throw error;
    }
  },
  
  /**
   * Récupère les destinations populaires
   * @param limit - Nombre de destinations à récupérer
   * @returns Liste des destinations populaires
   */
  async getPopularDestinations(limit: number = 6): Promise<Destination[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/destinations?popular=true&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch popular destinations');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching popular destinations:', error);
      throw error;
    }
  }
};
