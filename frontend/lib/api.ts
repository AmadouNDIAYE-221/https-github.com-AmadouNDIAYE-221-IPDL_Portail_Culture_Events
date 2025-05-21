import { getCookie, setCookie, deleteCookie } from 'cookies-next';

// Base API URL - change this to match your backend server URL
export const API_BASE_URL = 'http://localhost:8080';

// Authentication token management
const getAuthToken = () => getCookie('auth_token') as string | undefined;
const setAuthToken = (token: string) => setCookie('auth_token', token);
const removeAuthToken = () => deleteCookie('auth_token');

// Generic API request function with authentication
async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any,
  requiresAuth = true
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    
    // Check if the response is successful
    if (!response.ok) {
      // Handle different error status codes
      if (response.status === 401) {
        // Unauthorized - clear token and redirect to login
        removeAuthToken();
        window.location.href = '/login';
        throw new Error('Authentication required. Please log in again.');
      }
      
      // Try to parse error message from response
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `API error: ${response.status} ${response.statusText}`
      );
    }

    // For 204 No Content responses, return an empty object
    if (response.status === 204) {
      return {} as T;
    }

    // Parse JSON response
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Authentication services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiRequest<{ token: string }>(
      '/api/auth/login',
      'POST',
      { email, password },
      false
    );
    setAuthToken(response.token);
    return response;
  },
  
  register: async (userData: {
    name: string;  // Nom complet (firstName + lastName)
    email: string;
    password: string;
    phone?: string; // Champ optionnel
    role?: string;
  }) => {
    return apiRequest<any>('/api/auth/register', 'POST', userData, false);
  },
  
  logout: () => {
    removeAuthToken();
  },
  
  isAuthenticated: () => {
    return !!getAuthToken();
  },

  // Méthode pour récupérer les informations de l'utilisateur connecté
  getCurrentUser: async () => {
    if (!getAuthToken()) {
      throw new Error('User is not authenticated');
    }
    return apiRequest<{ id: number; name: string; email: string; role: string }>('/api/auth/me', 'GET');
  }
};

// Event services
export const eventService = {
  getAllEvents: () => {
    return apiRequest<any[]>('/api/events');
  },
  
  getEventById: (id: number | string) => {
    return apiRequest<any>(`/api/events/${id}`);
  },
  
  getEventsByLocation: (location: string) => {
    return apiRequest<any[]>(`/api/events/location/${location}`);
  },
  
  createEvent: (eventData: any) => {
    return apiRequest<any>('/api/events', 'POST', eventData);
  },
  
  updateEvent: (id: number | string, eventData: any) => {
    return apiRequest<any>(`/api/events/${id}`, 'PUT', eventData);
  },
  
  deleteEvent: (id: number | string) => {
    return apiRequest<void>(`/api/events/${id}`, 'DELETE');
  },
  
  getOrganizerEvents: () => {
    return apiRequest<any[]>('/api/events/organizer');
  }
};

// Reservation services
export const reservationService = {
  createReservation: (eventId: number | string, reservationData: any) => {
    return apiRequest<any>(`/api/reservations/event/${eventId}`, 'POST', reservationData);
  },
  
  getUserReservations: () => {
    return apiRequest<any[]>('/api/reservations/user');
  },
  
  getEventReservations: (eventId: number | string) => {
    return apiRequest<any[]>(`/api/reservations/event/${eventId}`);
  },
  
  cancelReservation: (id: number | string) => {
    return apiRequest<void>(`/api/reservations/${id}`, 'DELETE');
  },
  
  // Récupérer tous les participants d'un événement (pour la page de gestion des participants)
  getEventAttendees: (eventId: number | string) => {
    return apiRequest<any[]>(`/api/reservations/event/${eventId}/attendees`);
  },
  
  // Mettre à jour le statut d'un participant (confirmer ou annuler)
  updateAttendeeStatus: (reservationId: number | string, status: 'CONFIRMED' | 'PENDING' | 'CANCELLED') => {
    return apiRequest<void>(`/api/reservations/${reservationId}/status`, 'PUT', { status });
  }
};

// Destination services
export const destinationService = {
  getAllDestinations: () => {
    return apiRequest<any[]>('/api/destinations');
  },
  
  getDestinationBySlug: (slug: string) => {
    return apiRequest<any>(`/api/destinations/${slug}`);
  }
};

// User services
export const userService = {
  // Récupérer les informations de l'utilisateur connecté
  getCurrentUser: () => {
    return apiRequest<any>('/api/users/me');
  },
  
  // Mettre à jour le profil de l'utilisateur
  updateProfile: (profileData: { name: string; email: string; phone?: string }) => {
    return apiRequest<any>('/api/users/profile', 'PUT', profileData);
  },
  
  // Mettre à jour le mot de passe de l'utilisateur
  updatePassword: (passwordData: { currentPassword: string; newPassword: string }) => {
    return apiRequest<any>('/api/users/password', 'PUT', passwordData);
  }
};

export { apiRequest, getAuthToken, setAuthToken, removeAuthToken };
