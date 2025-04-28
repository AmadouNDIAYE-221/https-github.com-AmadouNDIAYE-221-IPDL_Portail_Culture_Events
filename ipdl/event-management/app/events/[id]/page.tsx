"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, ChevronLeft, ChevronRight, Share2, Heart } from "lucide-react"
import { popularEvents } from "@/data/events"

export default function EventPage({ params }: { params: { id: string } }) {
  const event = popularEvents.find((e) => e.id === params.id)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!event) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Événement non trouvé</h1>
          <p className="text-muted-foreground">L&apos;événement que vous recherchez n&apos;existe pas.</p>
          <Button asChild className="bg-amber-600 hover:bg-amber-700">
            <Link href="/events">Retour aux événements</Link>
          </Button>
        </div>
      </div>
    )
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % event.gallery.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + event.gallery.length) % event.gallery.length)
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
                src={event.gallery[currentImageIndex] || "/placeholder.svg"}
                alt={`${event.title} - image ${currentImageIndex + 1}`}
                fill
                className="object-cover"
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
                {event.gallery.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full ${
                      index === currentImageIndex ? "bg-amber-600" : "bg-background/80"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 flex gap-2 overflow-auto pb-2">
              {event.gallery.map((image, index) => (
                <button
                  key={index}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border ${
                    index === currentImageIndex ? "ring-2 ring-amber-600" : ""
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
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
                <Badge className="bg-amber-600 hover:bg-amber-700">{event.category}</Badge>
              </div>
              <h1 className="text-3xl font-bold text-amber-900">{event.title}</h1>
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-5 w-5" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-5 w-5" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">{event.price}</span>
                    <span className="text-sm text-muted-foreground">{event.availableSeats} places disponibles</span>
                  </div>
                  <Button size="lg" className="bg-amber-600 hover:bg-amber-700" asChild>
                    <Link href={`/events/${event.id}/booking`}>Réserver ma place</Link>
                  </Button>
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

        {/* Related Events */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Événements similaires</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {popularEvents
              .filter((e) => e.id !== event.id && e.category === event.category)
              .slice(0, 3)
              .map((relatedEvent) => (
                <Link href={`/events/${relatedEvent.id}`} key={relatedEvent.id} className="group">
                  <Card className="overflow-hidden transition-all hover:shadow-md">
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={relatedEvent.image || "/placeholder.svg"}
                        alt={relatedEvent.title}
                        width={600}
                        height={400}
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold truncate">{relatedEvent.title}</h3>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{relatedEvent.date}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
