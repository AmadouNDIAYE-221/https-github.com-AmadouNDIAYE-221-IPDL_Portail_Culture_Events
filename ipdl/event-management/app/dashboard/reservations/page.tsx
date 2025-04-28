import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Clock } from "lucide-react"
import { popularEvents } from "@/data/events"

// Simulate user reservations (first 3 events)
const userReservations = popularEvents.slice(0, 3).map((event) => ({
  ...event,
  reservationDate: "10 mai 2025",
  ticketCount: 2,
  status: "confirmed",
}))

export default function ReservationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-amber-900">Mes réservations</h1>
        <p className="text-muted-foreground">Consultez et gérez vos réservations d&apos;événements</p>
      </div>

      {userReservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h2 className="text-lg font-semibold">Aucune réservation</h2>
          <p className="mt-2 text-sm text-muted-foreground">Vous n&apos;avez pas encore réservé d&apos;événement.</p>
          <Button asChild className="mt-4 bg-amber-600 hover:bg-amber-700">
            <Link href="/events">Explorer les événements</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {userReservations.map((reservation) => (
            <Card key={reservation.id} className="overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <Image
                  src={reservation.image || "/placeholder.svg"}
                  alt={reservation.title}
                  width={600}
                  height={400}
                  className="object-cover"
                />
              </div>
              <CardHeader className="p-4">
                <CardTitle className="line-clamp-1">{reservation.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{reservation.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{reservation.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{reservation.time}</span>
                  </div>
                </div>
                <div className="mt-4 rounded-md bg-amber-50 p-2">
                  <div className="flex justify-between text-sm">
                    <span>Réservé le:</span>
                    <span className="font-medium">{reservation.reservationDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Nombre de places:</span>
                    <span className="font-medium">{reservation.ticketCount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Statut:</span>
                    <span className="font-medium text-green-600">Confirmé</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="flex w-full gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link href={`/events/${reservation.id}`}>Détails</Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Annuler
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
