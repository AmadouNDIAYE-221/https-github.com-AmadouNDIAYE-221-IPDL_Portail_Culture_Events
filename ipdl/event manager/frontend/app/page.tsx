import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Calendar, MapPin, Clock } from "lucide-react"
import { popularEvents } from "@/data/events"

export default function Home() {
  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-amber-100 to-amber-50">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-amber-900">
                  Découvrez la richesse culturelle de l&apos;Afrique
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Explorez les festivals, concerts et visites touristiques au Sénégal et partout en Afrique. Réservez
                  facilement et vivez des expériences inoubliables.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
                  <Link href="/events">Explorer les événements</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/organizer">Créer un événement</Link>
                </Button>
              </div>
            </div>
            <Image
              src="/placeholder.svg?height=550&width=550"
              width={550}
              height={550}
              alt="Festival culturel africain"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
            />
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Input placeholder="Destination (ex: Dakar, Gorée...)" className="flex-1" />
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input type="date" className="flex-1" />
              </div>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input placeholder="Type d'événement" className="flex-1" />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button className="bg-amber-600 hover:bg-amber-700">Rechercher</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Events Section */}
      <section className="container px-4 md:px-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-amber-900">Événements populaires</h2>
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
          <div className="flex justify-center mt-6">
            <Button variant="outline" asChild>
              <Link href="/events">Voir tous les événements</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="container px-4 md:px-6 py-8">
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-amber-900">Destinations populaires</h2>
          <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
            {[
              { name: "Dakar", image: "/placeholder.svg?height=300&width=300", count: "42 événements" },
              { name: "Saint-Louis", image: "/placeholder.svg?height=300&width=300", count: "28 événements" },
              { name: "Gorée", image: "/placeholder.svg?height=300&width=300", count: "15 événements" },
              { name: "Casamance", image: "/placeholder.svg?height=300&width=300", count: "23 événements" },
            ].map((destination) => (
              <Link href={`/destinations/${destination.name.toLowerCase()}`} key={destination.name} className="group">
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-white font-bold">{destination.name}</h3>
                    <p className="text-white/80 text-sm">{destination.count}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12 bg-amber-50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-amber-900">Ce que disent nos visiteurs</h2>
            <p className="text-muted-foreground max-w-[600px]">
              Découvrez les expériences de ceux qui ont participé à nos événements culturels
            </p>
          </div>
          <div className="grid gap-6 mt-8 md:grid-cols-3">
            {[
              {
                name: "Fatou Diop",
                location: "Dakar, Sénégal",
                quote:
                  "J'ai découvert des festivals incroyables grâce à cette plateforme. Une expérience authentique qui m'a permis de mieux connaître ma propre culture.",
              },
              {
                name: "Thomas Müller",
                location: "Berlin, Allemagne",
                quote:
                  "En tant que touriste, ce site a été une mine d'or pour planifier mon séjour au Sénégal. J'ai pu assister à des événements que je n'aurais jamais trouvés autrement.",
              },
              {
                name: "Amadou Sow",
                location: "Saint-Louis, Sénégal",
                quote:
                  "En tant qu'organisateur, j'ai pu toucher un public plus large pour mon festival. La plateforme est simple à utiliser et très efficace.",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="flex items-center space-x-1">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5 text-amber-500"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ))}
                    </div>
                    <p className="text-muted-foreground">"{testimonial.quote}"</p>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
