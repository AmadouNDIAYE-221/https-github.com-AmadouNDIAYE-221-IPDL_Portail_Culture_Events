import { Event } from './event';
import { User } from '../hooks/useAuth';

/**
 * Interface représentant une réservation
 */
export interface Reservation {
  id: string;
  userId: number;
  eventId: string;
  numberOfTickets: number;
  totalPrice: number;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
  event?: Event;
  user?: User;
}

/**
 * Énumération des statuts possibles d'une réservation
 */
export enum ReservationStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

/**
 * Interface pour les données de formulaire lors de la création d'une réservation
 */
export interface ReservationFormData {
  numberOfTickets: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  specialRequirements?: string;
}

/**
 * Interface pour les statistiques de réservation
 */
export interface ReservationStats {
  totalReservations: number;
  totalTickets: number;
  totalRevenue: number;
  revenueByDay: {
    date: string;
    revenue: number;
  }[];
  ticketsByDay: {
    date: string;
    count: number;
  }[];
  reservationsByStatus: {
    status: ReservationStatus;
    count: number;
  }[];
}
