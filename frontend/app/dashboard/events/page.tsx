"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Plus, Pencil, Trash2, Eye, BarChart } from "lucide-react"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { userService, authService, eventService } from "@/lib/api"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default function OrganizerEventsPage() {
  const router = useRouter()
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<any>(null)
  
  useEffect(() => {
    // Verify authentication and organizer role
    if (!authService.isAuthenticated()) {
      router.push('/login?redirect=/dashboard/events')
      return
    }
    
    async function checkUserRole() {
      try {
        const userData = await userService.getCurrentUser()
        if (userData.role !== 'ORGANIZER') {
          toast({
            title: "Accès refusé",
            description: "Vous n'avez pas les droits d'organisateur nécessaires pour accéder à cette page.",
            variant: "destructive"
          })
          router.push('/dashboard')
          return
        }
        
        fetchOrganizerEvents()
      } catch (error) {
        console.error('Error checking user role:', error)
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la vérification de vos droits d'accès.",
          variant: "destructive"
        })
      }
    }
    
    checkUserRole()
  }, [router])
  
  const fetchOrganizerEvents = async () => {
    try {
      setIsLoading(true)
      const userEvents = await eventService.getOrganizerEvents()
      setEvents(userEvents)
    } catch (error) {
      console.error('Error fetching organizer events:', error)
      toast({
        title: "Erreur",
        description: "Impossible de récupérer vos événements. Veuillez réessayer plus tard.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleDeleteClick = (event: any) => {
    setEventToDelete(event)
    setDeleteDialogOpen(true)
  }
  
  const confirmDelete = async () => {
    if (!eventToDelete) return
    
    try {
      await eventService.deleteEvent(eventToDelete.id)
      setEvents(events.filter(e => e.id !== eventToDelete.id))
      toast({
        title: "Événement supprimé",
        description: "L'événement a été supprimé avec succès."
      })
    } catch (error) {
      console.error('Error deleting event:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'événement. Veuillez réessayer plus tard.",
        variant: "destructive"
      })
    } finally {
      setDeleteDialogOpen(false)
      setEventToDelete(null)
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full py-12">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Chargement de vos événements...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mes Événements</h2>
          <p className="text-muted-foreground">
            Gérez les événements que vous avez créés
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/dashboard/events/statistics')}>
            <BarChart className="mr-2 h-4 w-4" /> Statistiques
          </Button>
          <Button onClick={() => router.push('/dashboard/events/create')}>
            <Plus className="mr-2 h-4 w-4" /> Créer un événement
          </Button>
        </div>
      </div>
      
      {events.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12">
            <div className="text-center">
              <h3 className="text-lg font-medium">Aucun événement trouvé</h3>
              <p className="mt-2 text-muted-foreground">
                Vous n'avez pas encore créé d'événements.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => router.push('/dashboard/events/create')}
              >
                <Plus className="mr-2 h-4 w-4" /> Créer votre premier événement
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={event.imageUrl ? 
                        (event.imageUrl.startsWith('http') ? event.imageUrl : `http://localhost:8080${event.imageUrl}`) 
                        : "/images/event-placeholder.jpg"}
                  alt={event.title}
                  fill
                  style={{ objectFit: "cover" }}
                  unoptimized // Ajouter cette propriu00e9tu00e9 pour u00e9viter que Next.js n'essaie d'optimiser les images externes
                />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg line-clamp-1">{event.title}</h3>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-800">
                    {event.category}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {/* Afficher la date */}
                  {format(new Date(event.date), "d MMMM yyyy", { locale: fr })}
                  {/* Afficher l'heure de début et de fin si disponible, sinon afficher "00h00" */}
                  {event.startDate && event.endDate 
                    ? ` de ${format(new Date(event.startDate), "HH'h'mm", { locale: fr })} à ${format(new Date(event.endDate), "HH'h'mm", { locale: fr })}` 
                    : ` à ${event.time ? format(new Date(`2000-01-01T${event.time}`), "HH'h'mm", { locale: fr }) : "00h00"}`
                  }
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm line-clamp-2">{event.description}</p>
                <div className="mt-2 flex items-center text-xs text-muted-foreground">
                  <span>{event.location}</span>
                  <span className="mx-2">•</span>
                  <span>{event.price === 0 ? "Gratuit" : `${event.price} FCFA`}</span>
                </div>
              </CardContent>
              <CardFooter className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline"
                  size="sm" 
                  className="w-full"
                  asChild
                >
                  <Link href={`/events/${event.id}`}>
                    <Eye className="mr-2 h-4 w-4" /> Voir
                  </Link>
                </Button>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/dashboard/events/create?id=${event.id}`)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="flex-1 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteClick(event)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet événement ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Toutes les réservations liées à cet événement seront également supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirmDelete}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
