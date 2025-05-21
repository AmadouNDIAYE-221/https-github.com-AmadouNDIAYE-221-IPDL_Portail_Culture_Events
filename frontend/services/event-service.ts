import { API_BASE_URL } from '@/lib/api';
import { Event, EventFormData } from '../types/event';

/**
 * Service pour gérer les opérations liées aux événements
 */
export const eventService = {
  /**
   * Récupère tous les événements
   * @param filters - Filtres optionnels (lieu, type, date)
   * @returns Liste des événements
   */
  async getAllEvents(filters?: { location?: string; type?: string; date?: string }): Promise<Event[]> {
    try {
      let url = `${API_BASE_URL}/api/events`;
      
      // Ajout des filtres à l'URL si présents
      if (filters) {
        const queryParams = new URLSearchParams();
        if (filters.location) queryParams.append('location', filters.location);
        if (filters.type) queryParams.append('type', filters.type);
        if (filters.date) queryParams.append('date', filters.date);
        
        const queryString = queryParams.toString();
        if (queryString) {
          url += `?${queryString}`;
        }
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },
  
  /**
   * Récupère un événement par son ID
   * @param id - ID de l'événement
   * @returns Détails de l'événement
   */
  async getEventById(id: string): Promise<Event> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch event');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching event with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Récupère des événements par lieu
   * @param location - Nom du lieu
   * @returns Liste des événements à ce lieu
   */
  async getEventsByLocation(location: string): Promise<Event[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events?location=${encodeURIComponent(location)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events by location');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching events for location ${location}:`, error);
      throw error;
    }
  },
  
  /**
   * Crée un nouvel événement
   * @param eventData - Données de l'événement à créer
   * @returns Événement créé
   */
  async createEvent(eventData: EventFormData): Promise<Event> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to create event');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },
  
  /**
   * Met à jour un événement existant
   * @param id - ID de l'événement
   * @param eventData - Nouvelles données pour l'événement
   * @returns Événement mis à jour
   */
  async updateEvent(id: string, eventData: Partial<EventFormData>): Promise<Event> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to update event');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating event with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Supprime un événement
   * @param id - ID de l'événement à supprimer
   */
  async deleteEvent(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete event');
      }
    } catch (error) {
      console.error(`Error deleting event with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Récupère les événements populaires pour la page d'accueil
   * @param limit - Nombre d'événements à récupérer
   * @returns Liste des événements populaires
   */
  async getPopularEvents(limit: number = 6): Promise<Event[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events?popular=true&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch popular events');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching popular events:', error);
      throw error;
    }
  },
  
  /**
   * Récupère les événements à venir
   * @param limit - Nombre d'événements à récupérer
   * @returns Liste des événements à venir
   */
  async getUpcomingEvents(limit: number = 6): Promise<Event[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events?upcoming=true&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch upcoming events');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      throw error;
    }
  },
  
  /**
   * Recherche d'événements par mot-clé
   * @param query - Terme de recherche
   * @returns Liste des événements correspondants
   */
  async searchEvents(query: string): Promise<Event[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/events/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to search events');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error searching events with query "${query}":`, error);
      throw error;
    }
  }
};
