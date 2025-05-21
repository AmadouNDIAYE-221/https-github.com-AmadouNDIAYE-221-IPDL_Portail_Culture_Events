"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PlusCircle, Edit, Trash2, MapPin } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "@/components/ui/use-toast"
import { authService, getAuthToken } from "@/lib/api"

// URL de l'API backend
const API_BASE_URL = 'http://localhost:8080'

// Type pour une destination
interface Destination {
  id: number
  name: string
  description: string
  country: string
  region?: string
  image?: string   // Propriété venant de la base de données
  imageUrl?: string // Propriété utilisée côté frontend
  latitude?: number
  longitude?: number
}

export default function DestinationsPage() {
  const router = useRouter()
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [destinationToDelete, setDestinationToDelete] = useState<Destination | null>(null)
  
  useEffect(() => {
    // Vérifier l'authentification
    if (!authService.isAuthenticated()) {
      router.push('/login?redirect=/dashboard/destinations')
      return
    }
    
    fetchDestinations()
  }, [])
  
  const fetchDestinations = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/destinations`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
          'Content-Type': 'application/json'
        },
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des destinations')
      }
      
      const data = await response.json()
      setDestinations(data)
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les destinations.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleDelete = async () => {
    if (!destinationToDelete) return
    
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/destinations/${destinationToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      })
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la destination')
      }
      
      // Mettre à jour la liste des destinations
      setDestinations(destinations.filter(d => d.id !== destinationToDelete.id))
      toast({
        title: "Succès",
        description: "La destination a été supprimée avec succès.",
      })
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la destination.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
      setDeleteDialogOpen(false)
      setDestinationToDelete(null)
    }
  }
  
  const confirmDelete = (destination: Destination) => {
    setDestinationToDelete(destination)
    setDeleteDialogOpen(true)
  }
  
  if (isLoading && destinations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full py-12">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Chargement des destinations...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Mes destinations</h2>
        <Button asChild>
          <Link href="/dashboard/destinations/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle destination
          </Link>
        </Button>
      </div>
      
      {destinations.length === 0 ? (
        <div className="bg-muted/30 p-8 rounded-lg text-center">
          <h3 className="font-medium text-lg mb-2">Aucune destination créée</h3>
          <p className="text-muted-foreground mb-4">
            Vous n'avez pas encore créé de destinations. Commencez par en créer une nouvelle.
          </p>
          <Button asChild>
            <Link href="/dashboard/destinations/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Créer une destination
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <Card key={destination.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={
                    destination.image ? 
                      (destination.image.startsWith('http') ? destination.image : `${API_BASE_URL}${destination.image}`) 
                    : destination.imageUrl ? 
                      (destination.imageUrl.startsWith('http') ? destination.imageUrl : `${API_BASE_URL}${destination.imageUrl}`)
                    : "https://placehold.co/600x400/e2e8f0/475569?text=Destination"
                  } 
                  alt={destination.name}
                  fill
                  style={{ objectFit: "cover" }}
                  unoptimized // Permet de charger les images depuis le serveur backend
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg line-clamp-1">{destination.name}</h3>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                    {destination.country}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {destination.description}
                </p>
              </CardHeader>
              <CardFooter className="p-4 pt-0 flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/destinations/create?id=${destination.id}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => confirmDelete(destination)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer la destination "{destinationToDelete?.name}" ? 
              Cette action est irréversible et supprimera également tous les événements associés à cette destination.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading && <Spinner className="mr-2 h-4 w-4" />}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
