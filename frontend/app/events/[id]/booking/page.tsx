"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { popularEvents } from "@/data/events"
import { Calendar, Clock, MapPin, ArrowLeft, Check } from "lucide-react"

export default function BookingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const event = popularEvents.find((e) => e.id === params.id)
  const [formSubmitted, setFormSubmitted] = useState(false)

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)

    // Simulate form submission delay
    setTimeout(() => {
      router.push("/dashboard/reservations")
    }, 3000)
  }

  if (formSubmitted) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100">
            <Check className="h-10 w-10 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-amber-900">Réservation confirmée !</h1>
          <p className="text-center text-muted-foreground">
            Votre réservation pour {event.title} a été enregistrée avec succès.
            <br />
            Un email de confirmation vous a été envoyé.
          </p>
          <Button asChild className="mt-4 bg-amber-600 hover:bg-amber-700">
            <Link href="/dashboard/reservations">Voir mes réservations</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-2xl">
        <Button variant="ghost" asChild className="mb-6">
          <Link href={`/events/${event.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l&apos;événement
          </Link>
        </Button>

        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-2xl font-bold text-amber-900">Réserver pour {event.title}</h1>
            <p className="text-muted-foreground">Complétez le formulaire ci-dessous pour réserver votre place</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Détails de l&apos;événement</CardTitle>
              <CardDescription>Informations sur l&apos;événement que vous réservez</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
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
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>Entrez vos informations pour la réservation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input id="name" placeholder="Votre nom" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="votre@email.com" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input id="phone" placeholder="Votre numéro de téléphone" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tickets">Nombre de places</Label>
                  <Select defaultValue="1">
                    <SelectTrigger id="tickets">
                      <SelectValue placeholder="Sélectionnez le nombre de places" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 place</SelectItem>
                      <SelectItem value="2">2 places</SelectItem>
                      <SelectItem value="3">3 places</SelectItem>
                      <SelectItem value="4">4 places</SelectItem>
                      <SelectItem value="5">5 places</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" type="button" asChild>
                  <Link href={`/events/${event.id}`}>Annuler</Link>
                </Button>
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                  Confirmer la réservation
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}
