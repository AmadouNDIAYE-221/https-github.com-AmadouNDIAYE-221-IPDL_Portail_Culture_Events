"use client"

import React, { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight, Share2, Heart } from "lucide-react"
import { useEvent } from "@/hooks/useEvents"
import { useAuth } from "@/hooks/useAuth"

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
}

import { use } from 'react'

export default function EventPage({ params }: { params: { id: string } }) {
  // Utiliser React.use pour accéder aux paramètres de route (recommandé pour Next.js 14+)
  const parameters = use(params as unknown as Promise<{ id: string }>)
  const id = parameters.id
  const { event: eventData, isLoading, error } = useEvent(id)
  
  // Utiliser une conversion sécurisée pour éviter les erreurs TypeScript
  const event = eventData as any
  const { isAuthenticated } = useAuth()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
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
      <div className="container px-4 py-8 md:px-6 md:py-12 flex justify-center items-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  // Si erreur ou événement non trouvé
  if (error || !event) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Événement non trouvé</h1>
          <p className="text-muted-foreground">
            {error || "L'événement que vous recherchez n'existe pas."}
          </p>
          <Button asChild className="bg-amber-600 hover:bg-amber-700">
            <Link href="/events">Retour aux événements</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Pru00e9parer les images pour l'affichage
  // Si l'image principale existe, l'ajouter en premier dans la galerie
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
  const gallery = galleryImages.length > 0 ? galleryImages : defaultGallery;
  
  // Afficher la configuration des images dans la console pour du00e9bogage
  console.log('ImageUrl:', event?.imageUrl);
  console.log('Gallery:', event?.gallery);
  console.log('GalleryImages:', galleryImages);
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % gallery.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length)
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Accueil
          </Link>
          <span>/</span>
          <Link href="/events" className="hover:text-foreground">
            Événements
          </Link>
          <span>/</span>
          <span className="text-foreground">{event.title}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Event Gallery */}
          <div className="lg:col-span-2">
            <div className="relative aspect-video overflow-hidden rounded-lg border">
              <Image
                src={gallery[currentImageIndex] || defaultImage}
                alt={`${event.title} - image ${currentImageIndex + 1}`}
                fill
                className="object-cover"
                unoptimized // Ajout pour les images externes
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {gallery.map((_: string, index: number) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === currentImageIndex ? "bg-amber-600" : "bg-background/80"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 flex gap-2 overflow-auto pb-2">
              {gallery.map((image: string, index: number) => (
                <button
                  key={index}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border ${
                    index === currentImageIndex ? "ring-2 ring-amber-600" : ""
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={image || defaultImage}
                    alt={`${event.title} - thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Event Details */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-amber-600 hover:bg-amber-700">{event.category || "Événement"}</Badge>
              </div>
              <h1 className="text-3xl font-bold text-amber-900">{event.title}</h1>
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-5 w-5" />
                  <span>{new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                  <span>
                    {event.startDate && event.endDate 
                      ? `${new Date(event.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.endDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` 
                      : event.time || "Heure à confirmer"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span>{event.destinationName || event.location || 'Emplacement à confirmer'}</span>
                </div>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">{event.price === 0 ? 'Gratuit' : `${event.price} FCFA`}</span>
                    <span className="text-sm text-muted-foreground">{event.availableCapacity || event.capacity} places disponibles</span>
                  </div>
                  {isAuthenticated ? (
                    <Button size="lg" className="bg-amber-600 hover:bg-amber-700" asChild>
                      <Link href={`/events/${event.id}/booking`}>Réserver ma place</Link>
                    </Button>
                  ) : (
                    <Button size="lg" className="bg-amber-600 hover:bg-amber-700" asChild>
                      <Link href={`/login?redirect=/events/${event.id}/booking`}>Connectez-vous pour réserver</Link>
                    </Button>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="flex-1">
                      <Heart className="h-5 w-5 mr-2" />
                      Favoris
                    </Button>
                    <Button variant="outline" size="icon" className="flex-1">
                      <Share2 className="h-5 w-5 mr-2" />
                      Partager
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Event Description */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-amber-900">À propos de cet événement</h2>
          <p className="mt-4 text-muted-foreground">{event.description}</p>
        </div>

        {/* Commentaires - Sera ajouté ultérieurement */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Avis et commentaires</h2>
          <div className="p-4 bg-amber-50 rounded-lg text-center">
            <p className="text-muted-foreground">Les avis et commentaires seront bientôt disponibles.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
