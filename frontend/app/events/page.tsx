import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Clock } from "lucide-react"
import { popularEvents } from "@/data/events"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function EventsPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-amber-900">Tous les événements</h1>
          <p className="text-muted-foreground">
            Découvrez la richesse culturelle de l'Afrique à travers nos événements
          </p>
        </div>

        {/* Search Filters */}
        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <div className="grid gap-4 md:grid-cols-5">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Destination" className="flex-1" />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input type="date" className="flex-1" />
            </div>
            <div className="md:col-span-2">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Type d'événement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="festival">Festival</SelectItem>
                  <SelectItem value="concert">Concert</SelectItem>
                  <SelectItem value="exposition">Exposition</SelectItem>
                  <SelectItem value="visite">Visite guidée</SelectItem>
                  <SelectItem value="atelier">Atelier</SelectItem>
                  <SelectItem value="sport">Événement sportif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full bg-amber-600 hover:bg-amber-700">Rechercher</Button>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popularEvents.map((event) => (
            <Link href={`/events/${event.id}`} key={event.id} className="group">
              <Card className="overflow-hidden transition-all hover:shadow-md">
                <div className="aspect-video overflow-hidden">
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    width={600}
                    height={400}
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold">{event.price}</span>
                    <Button size="sm" variant="outline">
                      Voir détails
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
