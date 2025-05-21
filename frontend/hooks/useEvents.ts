import { useState, useEffect } from 'react';
import { eventService, reservationService } from '../lib/api';

// Type definitions
export type Event = {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  startDate?: string; // Ajout de la date et heure de début
  endDate?: string;   // Ajout de la date et heure de fin
  price: number;
  totalSeats: number;
  availableSeats: number;
  imageUrl: string;
  organizer?: any;
  // Ajout des propriu00e9tu00e9s manquantes pour l'affichage des u00e9vu00e9nements
  category?: string;
  destinationId?: number;
  destinationName?: string;
  capacity?: number;
  availableCapacity?: number;
  totalCapacity?: number;
  gallery?: string[];
};

export type Reservation = {
  id: number;
  event: Event;
  user: any;
  numberOfTickets: number;
  totalPrice: number;
  status: string;
  createdAt: string;
};

// Hook for fetching all events
export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const data = await eventService.getAllEvents();
        setEvents(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch events');
        console.error('Error fetching events:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, isLoading, error };
}

// Hook for fetching a single event by ID
export function useEvent(id: number | string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await eventService.getEventById(id);
        setEvent(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch event');
        console.error(`Error fetching event with ID ${id}:`, err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  return { event, isLoading, error };
}

// Hook for fetching events by location
export function useEventsByLocation(location: string) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEventsByLocation = async () => {
      if (!location) return;
      
      try {
        setIsLoading(true);
        const data = await eventService.getEventsByLocation(location);
        setEvents(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch events');
        console.error(`Error fetching events for location ${location}:`, err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventsByLocation();
  }, [location]);

  return { events, isLoading, error };
}

// Hook for fetching user reservations
export function useUserReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setIsLoading(true);
        const data = await reservationService.getUserReservations();
        setReservations(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch reservations');
        console.error('Error fetching user reservations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // Function to cancel a reservation
  const cancelReservation = async (reservationId: number | string) => {
    try {
      await reservationService.cancelReservation(reservationId);
      // Remove the cancelled reservation from state
      setReservations(prevReservations => 
        prevReservations.filter(reservation => reservation.id !== reservationId)
      );
      return true;
    } catch (err: any) {
      console.error('Error cancelling reservation:', err);
      return false;
    }
  };

  return { reservations, isLoading, error, cancelReservation };
}

// Function to create a new reservation
export async function createReservation(eventId: number | string, numberOfTickets: number) {
  try {
    const reservationData = {
      numberOfTickets
    };
    
    const result = await reservationService.createReservation(eventId, reservationData);
    return { success: true, data: result };
  } catch (err: any) {
    console.error('Error creating reservation:', err);
    return { 
      success: false, 
      error: err.message || 'Failed to create reservation' 
    };
  }
}
