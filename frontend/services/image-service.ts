import { API_BASE_URL } from '@/lib/api';

/**
 * Service pour gérer les opérations liées aux images
 */
export const imageService = {
  /**
   * Télécharge une image sur le serveur
   * @param file - Le fichier image à télécharger
   * @param eventId - ID de l'événement associé (optionnel)
   * @returns URL de l'image téléchargée
   */
  async uploadImage(file: File, eventId?: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      if (eventId) {
        formData.append('eventId', eventId);
      }

      // Récupérer le token JWT stocké
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          // Ne pas ajouter Content-Type pour FormData
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: formData,
      });

      if (!response.ok) {
        // Gestion plus sûre des réponses d'erreur
        let errorMessage = 'Erreur lors du téléchargement de l\'image';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          // En cas d'échec de parsing JSON, utiliser le statut HTTP
          errorMessage = `Erreur ${response.status}: ${response.statusText || errorMessage}`;
        }
        throw new Error(errorMessage);
      }

      // Parsing JSON sécurisé
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Erreur lors du parsing de la réponse JSON:', jsonError);
        throw new Error('Réponse du serveur invalide');
      }
      return data.imageUrl;
    } catch (error: any) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
      throw new Error(error.message || 'Erreur lors du téléchargement de l\'image');
    }
  },

  /**
   * Supprime une image du serveur
   * @param imageUrl - URL de l'image à supprimer
   */
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extraire l'ID de l'image à partir de l'URL
      const imageId = imageUrl.split('/').pop();
      
      const response = await fetch(`${API_BASE_URL}/api/upload/${imageId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : ''
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors de la suppression de l\'image');
      }
    } catch (error: any) {
      console.error('Erreur lors de la suppression de l\'image:', error);
      throw new Error(error.message || 'Erreur lors de la suppression de l\'image');
    }
  },

  /**
   * Convertit un fichier en base64 (utile pour les aperçus)
   * @param file - Le fichier à convertir en base64
   * @returns Chaîne de caractères en base64
   */
  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }
};
