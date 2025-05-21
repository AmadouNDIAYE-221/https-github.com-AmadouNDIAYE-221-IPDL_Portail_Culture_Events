import { API_BASE_URL } from '@/lib/api';
import { Reservation, ReservationFormData } from '../types/reservation';

/**
 * Service pour gérer les opérations liées aux réservations
 */
export const reservationService = {
  /**
   * Crée une nouvelle réservation
   * @param eventId - ID de l'événement
   * @param formData - Données du formulaire de réservation
   * @returns La réservation créée
   */
  async createReservation(eventId: string, formData: ReservationFormData): Promise<Reservation> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reservations/event/${eventId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to create reservation');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  },
  
  /**
   * Récupère les réservations de l'utilisateur connecté
   * @returns Liste des réservations de l'utilisateur
   */
  async getUserReservations(): Promise<Reservation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reservations/user`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user reservations');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user reservations:', error);
      throw error;
    }
  },
  
  /**
   * Récupère les réservations pour un événement (organisateur seulement)
   * @param eventId - ID de l'événement
   * @returns Liste des réservations pour cet événement
   */
  async getEventReservations(eventId: string): Promise<Reservation[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reservations/event/${eventId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch event reservations');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching reservations for event ${eventId}:`, error);
      throw error;
    }
  },
  
  /**
   * Annule une réservation
   * @param reservationId - ID de la réservation à annuler
   */
  async cancelReservation(reservationId: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reservations/${reservationId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel reservation');
      }
    } catch (error) {
      console.error(`Error canceling reservation ${reservationId}:`, error);
      throw error;
    }
  },
  
  /**
   * Exporte les réservations d'un événement en CSV ou PDF (organisateur seulement)
   * @param eventId - ID de l'événement
   * @param format - Format d'export (csv ou pdf)
   * @returns URL du fichier exporté
   */
  async exportReservations(eventId: string, format: 'csv' | 'pdf'): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reservations/event/${eventId}/export?format=${format}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to export reservations as ${format}`);
      }
      
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error(`Error exporting reservations for event ${eventId}:`, error);
      throw error;
    }
  },
  
  /**
   * Obtient des statistiques sur les réservations d'un événement (organisateur seulement)
   * @param eventId - ID de l'événement
   * @returns Statistiques de réservation
   */
  async getReservationStats(eventId: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/reservations/event/${eventId}/stats`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch reservation statistics');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching reservation statistics for event ${eventId}:`, error);
      throw error;
    }
  }
};
