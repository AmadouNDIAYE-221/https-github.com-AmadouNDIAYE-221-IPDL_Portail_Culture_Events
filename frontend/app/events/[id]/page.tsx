"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  Heart, 
  Users, 
  ArrowLeft,
  Ticket,
  Info,
  CalendarCheck,
  Star,
  MessageCircle,
  ExternalLink
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useEvent } from "@/hooks/useEvents"
import { useAuth } from "@/hooks/useAuth"
import { format, formatDistanceToNow, isPast, isToday, isTomorrow, addDays } from 'date-fns'
import { fr } from 'date-fns/locale'

// Définition du type d'événement pour éviter les erreurs TypeScript
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  location?: string;
  destinationId?: number;
  destinationName?: string;
  category?: string;
  capacity: number;
  availableCapacity?: number;
  totalCapacity?: number;
  price: number;
  imageUrl?: string;
  gallery?: string[];
  organizer?: {
    id: number;
    name: string;
    email?: string;
    avatar?: string;
  };
}

import { use } from 'react'

export default function EventPage({ params }: { params: { id: string } }) {
  // Utiliser React.use pour accéder aux paramètres de route (recommandé pour Next.js 14+)
  const parameters = use(params as unknown as Promise<{ id: string }>)
  const id = parameters.id
  const { event: eventData, isLoading, error } = useEvent(id)
  
  // États pour la page
  const [event, setEvent] = useState<any>(null)
  const { isAuthenticated } = useAuth()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isImageLoading, setIsImageLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('details')
  
  // Méttre à jour l'événement quand les données sont chargées
  useEffect(() => {
    if (eventData) {
      setEvent(eventData);
    }
  }, [eventData]);
  
  // Les images par défaut si l'événement n'en a pas
  const defaultGallery = [
    "/images/event-placeholder.jpg",
    "/images/event-placeholder2.jpg", 
    "/images/event-placeholder3.jpg"
  ]
  
  // Image par défaut pour la miniature de l'événement
  const defaultImage = "/images/event-placeholder.jpg"

  // Si en cours de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white py-12">
        <div className="container px-4 md:px-6">
          <div className="flex items-center gap-2 mb-8">
            <Button variant="outline" size="sm" asChild className="gap-1">
              <Link href="/events">
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <span className="text-muted-foreground text-sm">Chargement de l'événement...</span>
          </div>
          
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-3 space-y-6">
              <Skeleton className="w-full aspect-[16/9] rounded-xl" />
              <div className="flex gap-2 overflow-x-auto pb-2">
                {[1, 2, 3].map((_, index) => (
                  <Skeleton key={index} className="w-24 h-24 rounded-lg flex-shrink-0" />
                ))}
              </div>
            </div>
            
            <div className="md:col-span-2 space-y-6">
              <div>
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-10 w-full mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-5 w-40" />
                </div>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <Skeleton className="h-10 w-full mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 flex-1" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Si erreur ou événement non trouvé
  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white py-12">
        <div className="container px-4 md:px-6">
          <div className="flex items-center gap-2 mb-8">
            <Button variant="outline" size="sm" asChild className="gap-1">
              <Link href="/events">
                <ArrowLeft className="h-4 w-4" />
                Retour aux événements
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <div className="p-6 bg-amber-50 rounded-full">
              <Info className="h-12 w-12 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-amber-900">Événement non trouvé</h1>
            <p className="text-muted-foreground max-w-md">
              {error || "L'événement que vous recherchez n'existe pas ou a été supprimé."}
            </p>
            <Button asChild className="bg-amber-600 hover:bg-amber-700 mt-4">
              <Link href="/events">Parcourir tous les événements</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Pru00e9parer les images pour l'affichage et la galerie
  const prepareGallery = () => {
    let galleryImages = [];

    // D'abord ajouter l'image principale si elle existe
    if (event?.imageUrl) {
      // Ajouter le pru00e9fixe du serveur backend si l'URL est relative
      const imageUrl = event.imageUrl.startsWith('http') 
        ? event.imageUrl 
        : `http://localhost:8080${event.imageUrl}`;
      galleryImages.push(imageUrl);
    }

    // Ensuite ajouter le reste de la galerie si elle existe
    if (event?.gallery && event.gallery.length > 0) {
      const processedGallery = event.gallery
        .filter((img: string) => img !== event.imageUrl)
        .map((img: string) => {
          // Ajouter le pru00e9fixe du serveur backend si l'URL est relative
          return img.startsWith('http') ? img : `http://localhost:8080${img}`;
        });
      galleryImages = [...galleryImages, ...processedGallery];
    }

    // Si aucune image n'est disponible, utiliser les images par du00e9faut
    return galleryImages.length > 0 ? galleryImages : defaultGallery;
  };
  
  const gallery = prepareGallery();
  
  // Formater la date de l'u00e9vu00e9nement avec indication de proximité
  const formatEventDate = () => {
    const eventDate = new Date(event.startDate || event.date);
    
    if (isPast(eventDate)) {
      return `Événement passé (${format(eventDate, 'dd MMMM yyyy', { locale: fr })})`;
    } else if (isToday(eventDate)) {
      return `Aujourd'hui à ${format(eventDate, 'HH:mm', { locale: fr })}`;
    } else if (isTomorrow(eventDate)) {
      return `Demain à ${format(eventDate, 'HH:mm', { locale: fr })}`;
    } else if (eventDate < addDays(new Date(), 7)) {
      return `${formatDistanceToNow(eventDate, { addSuffix: true, locale: fr })}`;
    } else {
      return format(eventDate, 'EEEE dd MMMM yyyy', { locale: fr });
    }
  };
  
  // Navigation dans la galerie d'images
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === gallery.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? gallery.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white py-12">
      <div className="container px-4 md:px-6">
        {/* Breadcrumb et navigation */}
        <div className="flex items-center gap-2 mb-8">
          <Button variant="outline" size="sm" asChild className="gap-1">
            <Link href="/events">
              <ArrowLeft className="h-4 w-4" />
              Retour
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-6" />
          <div className="text-sm text-muted-foreground flex items-center">
            <Link href="/events" className="hover:text-amber-600">Événements</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-amber-700 font-medium truncate max-w-[200px] sm:max-w-md">{event.title}</span>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid md:grid-cols-5 gap-8">
          {/* Galerie d'images - 3/5 de la largeur sur desktop */}
          <div className="md:col-span-3 space-y-6">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl shadow-md group">
              {/* Indicateur de chargement */}
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/20 z-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-600 border-t-transparent"></div>
                </div>
              )}
              
              {/* Image principale */}
              <Image
                src={gallery[currentImageIndex] || defaultImage}
                alt={`${event.title} - image ${currentImageIndex + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized // Pour les images externes
                onLoadStart={() => setIsImageLoading(true)}
                onLoadingComplete={() => setIsImageLoading(false)}
                priority
              />
              
              {/* Badge de catégorie */}
              <div className="absolute top-4 left-4 z-10">
                <Badge className="bg-amber-600 text-white px-3 py-1 text-sm shadow-md hover:bg-amber-700">
                  {event.category || "Événement culturel"}
                </Badge>
              </div>
              
              {/* Badge de date */}
              <div className="absolute top-4 right-4 z-10">
                <Badge className="bg-white/90 text-amber-800 px-3 py-1 text-sm shadow-md flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatEventDate()}
                </Badge>
              </div>
              
              {/* Boutons de navigation */}
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-10 w-10 shadow-md"
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6 text-amber-900" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-10 w-10 shadow-md"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6 text-amber-900" />
              </Button>
            </div>
            
            {/* Thumbnails de la galerie */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent">
              {gallery.map((image, index) => (
                <button
                  key={index}
                  className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 flex-shrink-0 shadow-sm transition-all duration-200 hover:opacity-95 ${
                    currentImageIndex === index ? 'border-amber-600 shadow-md' : 'border-transparent hover:border-amber-200'
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={image || defaultImage}
                    alt={`${event.title} - vignette ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
            
            {/* Onglets d'information */}
            <Tabs defaultValue="details" className="mt-8" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="details" className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900">
                  <Info className="h-4 w-4 mr-2" />
                  Détails
                </TabsTrigger>
                <TabsTrigger value="programme" className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900">
                  <CalendarCheck className="h-4 w-4 mr-2" />
                  Programme
                </TabsTrigger>
                <TabsTrigger value="reviews" className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-900">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Avis
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-amber-900 mb-4">À propos de cet événement</h2>
                  <div className="text-muted-foreground space-y-4 leading-relaxed">
                    <p>{event.description || "Aucune description n'est disponible pour cet événement."}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="programme" className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-amber-900 mb-4">Programme détaillé</h2>
                  {event.programme ? (
                    <div className="space-y-4">
                      {event.programme}
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-50 rounded-lg text-center">
                      <p className="text-muted-foreground">Le programme détaillé sera bientôt disponible.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-amber-900 mb-4">Avis et commentaires</h2>
                  <div className="p-4 bg-amber-50 rounded-lg text-center">
                    <Star className="h-8 w-8 text-amber-500 mx-auto mb-2" />
                    <p className="text-muted-foreground">Les avis et commentaires seront bientôt disponibles.</p>
                    <Button variant="outline" className="mt-3" disabled>
                      Laisser un avis
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Informations et réservation - 2/5 de la largeur sur desktop */}
          <div className="md:col-span-2 space-y-6">
            {/* Titre et informations principales */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-amber-900">{event.title}</h1>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-amber-700">
                  <Calendar className="h-5 w-5" />
                  <span>{format(new Date(event.date), 'EEEE dd MMMM yyyy', { locale: fr })}</span>
                </div>
                
                <div className="flex items-center gap-2 text-amber-700">
                  <Clock className="h-5 w-5" />
                  <span>
                    {event.startDate && event.endDate 
                      ? `${format(new Date(event.startDate), 'HH:mm', { locale: fr })} - ${format(new Date(event.endDate), 'HH:mm', { locale: fr })}` 
                      : event.time || "Heure à confirmer"}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-amber-700">
                  <MapPin className="h-5 w-5" />
                  <span className="font-medium">{event.destinationName || event.location || 'Emplacement à confirmer'}</span>
                </div>
              </div>
            </div>
            
            {/* Carte de réservation */}
            <Card className="overflow-hidden border-amber-100 shadow-md">
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-amber-900">{event.price === 0 ? 'Gratuit' : `${event.price.toLocaleString('fr-FR')} FCFA`}</span>
                    {event.price > 0 && <span className="text-xs text-muted-foreground">Taxes incluses</span>}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-700">{event.availableCapacity || event.capacity} places disponibles</span>
                  </div>
                </div>
                
                <Separator className="bg-amber-100" />
                
                {/* Bouton de réservation */}
                <div className="space-y-3">
                  {isAuthenticated ? (
                    <Button size="lg" className="w-full bg-amber-600 hover:bg-amber-700 gap-2" asChild>
                      <Link href={`/events/${event.id}/booking`}>
                        <Ticket className="h-5 w-5" />
                        Réserver ma place
                      </Link>
                    </Button>
                  ) : (
                    <Button size="lg" className="w-full bg-amber-600 hover:bg-amber-700 gap-2" asChild>
                      <Link href={`/login?redirect=/events/${event.id}/booking`}>
                        Connectez-vous pour réserver
                      </Link>
                    </Button>
                  )}
                
                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" className="flex-1 gap-2 border-amber-200 hover:bg-amber-50">
                            <Heart className="h-5 w-5 text-amber-600" />
                            <span>Favoris</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Ajouter aux favoris</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" className="flex-1 gap-2 border-amber-200 hover:bg-amber-50">
                            <Share2 className="h-5 w-5 text-amber-600" />
                            <span>Partager</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Partager cet événement</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-amber-50 px-6 py-3">
                <div className="text-xs text-muted-foreground w-full text-center">
                  L'organisateur accepte les réservations jusqu'à {event.bookingDeadline || '24 heures'} avant l'événement
                </div>
              </CardFooter>
            </Card>
            
            {/* Informations sur l'organisateur */}
            <Card className="overflow-hidden border-amber-100">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-amber-900 mb-4">Organisé par</h3>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-amber-100">
                    <AvatarImage src={event.organizer?.avatar || '/images/placeholder-user.jpg'} />
                    <AvatarFallback className="bg-amber-100 text-amber-800">
                      {event.organizer?.name?.substring(0, 2) || 'OR'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-amber-900">{event.organizer?.name || 'IPDL Events'}</p>
                    <p className="text-sm text-muted-foreground">Organisateur d'événements culturels</p>
                    <Button variant="link" className="p-0 h-auto text-amber-600 text-sm mt-1">
                      <ExternalLink className="h-3.5 w-3.5 mr-1" />
                      Voir tous les événements
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Conditions et politique de remboursement */}
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Annulation possible jusqu'à 48h avant l'événement</p>
              <p>• Les billets ne sont pas transférables</p>
              <Button variant="link" className="p-0 h-auto text-amber-600 text-sm">
                Voir les conditions complètes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
