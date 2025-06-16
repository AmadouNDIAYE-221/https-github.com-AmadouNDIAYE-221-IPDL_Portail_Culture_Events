import { useState, useEffect } from 'react';
import { API_BASE_URL } from "@/lib/api";
import { reservationService, authService } from '@/lib/api';

export interface Reservation {
  id: string | number;
  eventId: string | number;
  event: {
    id: string | number;
    title: string;
    date: string;
    time: string;
    location: string;
    image: string;
    price: number;
  };
  reservationDate: string;
  numberOfTickets: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  userName: string;
  userEmail: string;
}

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservations = async () => {
      // Vérification de l'authentification avec journalisation
      const isAuth = authService.isAuthenticated();
      console.log('Statut d\'authentification:', isAuth);
      
      if (!isAuth) {
        console.log('Utilisateur non authentifié, aucune réservation à afficher');
        setIsLoading(false);
        setReservations([]);
        return;
      }

      try {
        setIsLoading(true);
        console.log('Démarrage de la récupération des réservations...');
        
        const data = await reservationService.getUserReservations();
        console.log('Réponse du serveur pour les réservations:', data);
        
        // Si les données sont vides ou null, afficher un message plus explicite
        if (!data || data.length === 0) {
          console.log('Aucune réservation trouvée pour cet utilisateur');
          setReservations([]);
        } else {
          console.log(`${data.length} réservation(s) trouvée(s)`);
          
          // Vérifier la structure des données et les propriétés importantes
          console.log('Structure de la première réservation:', JSON.stringify(data[0]));
          
          // Transformer les données pour s'assurer qu'elles ont la structure attendue
          const transformedData = data.map(reservation => {
            // Vérifier et corriger les propriétés manquantes
            const eventData = reservation.event || {};
            
            // S'assurer que les status sont bien normalisés comme attendu par le composant
            let status: 'pending' | 'confirmed' | 'cancelled' = 'pending';
            const originalStatus = String(reservation.status || 'PENDING').toUpperCase();
            
            // Mapping des statuts du backend vers les statuts attendus par le frontend
            if (originalStatus === 'CONFIRMED') status = 'confirmed';
            else if (originalStatus === 'PENDING') status = 'pending';
            else if (originalStatus === 'CANCELLED' || originalStatus === 'CANCELED') status = 'cancelled';
            else status = 'pending'; // Valeur par défaut en cas de statut inconnu
            
            console.log(`Normalisation du statut ${originalStatus} vers ${status}`);
            
            
            // Extraction des données de date appropriées
            let eventDate = eventData.date || '';
            
            // Si nous avons startDate, utilisons-la plutôt que la date simple
            if (eventData.startDate) {
              console.log(`Utilisation de startDate: ${eventData.startDate}`);
              eventDate = eventData.startDate.split('T')[0]; // Prendre juste la partie date
            }
            
            // Générer l'URL de l'image avec le bon port pour le backend
            let imageUrl = '/images/event-placeholder.jpg';
            
            if (eventData.imageUrl) {
              // Si c'est une URL relative qui commence par /api
              if (eventData.imageUrl.startsWith('/api')) {
                // Remplacer par l'URL du backend (port 8080)
                imageUrl = `${API_BASE_URL}${eventData.imageUrl}`;
              } 
              // Sinon, si c'est une autre URL relative
              else if (eventData.imageUrl.startsWith('/')) {
                imageUrl = eventData.imageUrl;
              }
              // Si c'est déjà une URL complète, la garder telle quelle
              else if (eventData.imageUrl.startsWith('http')) {
                imageUrl = eventData.imageUrl;
              }
            }
            
            console.log(`URL d'image: ${imageUrl}`);
            
            // Construction de l'objet réservation normalisé
            const normalizedReservation = {
              id: reservation.id,
              eventId: reservation.eventId || eventData.id,
              // S'assurer que l'objet event a toutes les propriétés attendues
              event: {
                id: eventData.id || reservation.eventId,
                title: eventData.title || 'Titre non disponible',
                date: eventDate,
                time: eventData.time || '00:00',
                startDate: eventData.startDate || null,
                endDate: eventData.endDate || null,
                location: eventData.location || 'Lieu non spécifié',
                image: imageUrl,
                price: eventData.price || 0
              },
              reservationDate: reservation.reservationDate || new Date().toISOString(),
              numberOfTickets: reservation.numberOfTickets || 1,
              status: status,
              userName: reservation.userName || reservation.user?.name || 'Utilisateur',
              userEmail: reservation.userEmail || reservation.user?.email || 'email@example.com'
            };
            
            console.log('Réservation normalisée:', normalizedReservation);
            return normalizedReservation;
          });
          
          console.log('Données transformées:', transformedData);
          setReservations(transformedData);
        }
        
        setError(null);
      } catch (err) {
        // Journalisation détaillée de l'erreur
        console.error('Erreur détaillée lors du chargement des réservations:', err);
        setError('Erreur lors du chargement des réservations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const cancelReservation = async (id: string | number) => {
    try {
      await reservationService.cancelReservation(id);
      // Remove from local state
      setReservations(current => current.filter(reservation => reservation.id !== id));
      return true;
    } catch (err) {
      console.error('Error cancelling reservation:', err);
      return false;
    }
  };

  return {
    reservations,
    isLoading,
    error,
    cancelReservation
  };
}
