"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { useEvent } from "@/hooks/useEvents"
import { reservationService, authService } from "@/lib/api"
import { Calendar, Clock, MapPin, ArrowLeft, Check, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { format } from "date-fns"

export default function BookingPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { event, isLoading, error } = useEvent(params.id)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    tickets: "1"
  })

  useEffect(() => {
    // Redirect to login if user is not authenticated
    if (!authService.isAuthenticated()) {
      router.push(`/login?redirect=/events/${params.id}/booking`)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <Spinner size="lg" />
          <p className="text-muted-foreground">Chargement des informations de l&apos;événement...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold">Événement non trouvé</h1>
          <p className="text-muted-foreground">{error || "L'événement que vous recherchez n'existe pas."}</p>
          <Button asChild className="bg-amber-600 hover:bg-amber-700">
            <Link href="/events">Retour aux événements</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      tickets: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Vérification d'authentification
      if (!authService.isAuthenticated()) {
        toast({
          title: "Connexion requise",
          description: "Veuillez vous connecter pour effectuer une réservation.",
          variant: "destructive"
        });
        setIsSubmitting(false);
        // Rediriger vers la page de connexion avec retour à la page de réservation
        router.push(`/login?redirect=/events/${params.id}/booking`);
        return;
      }

      // Création d'un objet plus complet pour la réservation
      const reservationData = {
        ...formData,
        numberOfTickets: parseInt(formData.tickets),
        eventId: event.id,
        // Données additionnelles qui pourraient être requises par le backend
        status: "pending",
        event: {
          id: event.id,
          title: event.title,
          date: event.date,
          location: event.location,
          // Utiliser startDate/endDate s'ils existent, sinon utiliser time
          time: event.startDate ? format(new Date(event.startDate), "HH:mm") : event.time || "00:00"
        }
      };

      console.log("Envoi de la demande de réservation:", reservationData);

      // Création de la réservation avec attente explicite
      const response = await reservationService.createReservation(event.id, reservationData);
      console.log("Réponse détaillée de la réservation:", response);
      
      // Mise à jour de l'état et notification
      setFormSubmitted(true);
      toast({
        title: "Réservation confirmée",
        description: "Votre réservation a été enregistrée avec succès. Vous allez être redirigé vers vos réservations."
      });

      // Redirect to reservations dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard/reservations");
      }, 3000);
    } catch (error: any) {
      console.error("Erreur lors de la création de la réservation:", error);
      toast({
        title: "Erreur de réservation",
        description: error?.message || "Un problème est survenu lors de la réservation. Veuillez réessayer.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
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
            Nous avons bien reçu votre réservation pour l'événement <strong>{event.title}</strong>.
          </p>
          <p className="text-center text-muted-foreground">
            Un email de confirmation vous sera envoyé dans les prochaines minutes.
          </p>
          <div className="text-center mt-2 text-sm text-amber-600">
            Vous serez redirigé automatiquement vers vos réservations dans quelques secondes...
          </div>
          <Button asChild className="mt-6 px-8">
            <Link href="/dashboard/reservations">
              Voir mes réservations maintenant
            </Link>
          </Button>
          <Button asChild variant="outline" className="mt-2">
            <Link href="/events">
              Parcourir d'autres événements
            </Link>
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
                  <span>
                    {event.startDate && event.endDate 
                      ? `${new Date(event.startDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.endDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` 
                      : event.time || "Horaire non spécifié"}
                  </span>
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
                  <Input 
                    id="name" 
                    placeholder="Votre nom" 
                    required 
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="votre@email.com" 
                    required 
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input 
                    id="phone" 
                    placeholder="Votre numéro de téléphone" 
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tickets">Nombre de places</Label>
                  <Select value={formData.tickets} onValueChange={handleSelectChange}>
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
                <Button 
                  type="submit" 
                  className="bg-amber-600 hover:bg-amber-700" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner className="mr-2" />
                      Traitement en cours...
                    </>
                  ) : (
                    "Confirmer la réservation"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>
    </div>
  )
}
