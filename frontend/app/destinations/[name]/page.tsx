"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Info, Landmark, Ticket } from "lucide-react"
import { popularEvents } from "@/data/events"

// Liste des destinations touristiques au Sénégal
const destinations = [
  {
    name: "Dakar",
    slug: "dakar",
    image: "/placeholder.svg?height=400&width=600",
    description:
      "Capitale vibrante du Sénégal, Dakar est une métropole dynamique située sur la presqu'île du Cap-Vert. Elle offre un mélange fascinant de culture traditionnelle et de modernité urbaine. Avec ses marchés animés, ses musées de classe mondiale, ses plages et sa vie nocturne, Dakar est le cœur battant du Sénégal. La ville est également connue pour sa scène musicale vibrante, berceau du mbalax, et pour ses festivals internationaux qui attirent des visiteurs du monde entier.",
    gallery: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    highlights: [
      {
        name: "Monument de la Renaissance Africaine",
        description: "Statue de bronze de 49 mètres de haut symbolisant la renaissance du continent africain.",
      },
      {
        name: "Île de Gorée",
        description: "Site historique majeur de la traite négrière, classé au patrimoine mondial de l'UNESCO.",
      },
      {
        name: "Marché Sandaga",
        description: "Grand marché traditionnel où l'on trouve artisanat, tissus, épices et produits locaux.",
      },
      {
        name: "Musée des Civilisations Noires",
        description: "Musée moderne dédié à l'histoire et aux cultures africaines.",
      },
      {
        name: "Village des Arts",
        description: "Communauté d'artistes avec ateliers et galeries présentant l'art contemporain sénégalais.",
      },
    ],
    history:
      "Fondée au XVe siècle par les Lébous, Dakar est devenue la capitale de l'Afrique-Occidentale française en 1902. Après l'indépendance du Sénégal en 1960, la ville s'est développée comme un centre politique, économique et culturel majeur en Afrique de l'Ouest. Aujourd'hui, Dakar est une métropole cosmopolite qui conserve son riche patrimoine tout en embrassant la modernité.",
    eventCount: 42,
  },
  {
    name: "Saint-Louis",
    slug: "saint-louis",
    image: "/placeholder.svg?height=400&width=600",
    description:
      "Ancienne capitale du Sénégal colonial, Saint-Louis est une ville insulaire située à l'embouchure du fleuve Sénégal. Classée au patrimoine mondial de l'UNESCO, elle est célèbre pour son architecture coloniale, ses rues étroites et ses balcons en fer forgé. La ville est divisée en trois parties : l'île, la Langue de Barbarie et le continent. Saint-Louis est également connue pour son Festival International de Jazz, l'un des plus importants d'Afrique, qui attire des musiciens et des amateurs du monde entier chaque année.",
    gallery: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    highlights: [
      {
        name: "Pont Faidherbe",
        description: "Pont métallique emblématique reliant l'île au continent, construit en 1897.",
      },
      {
        name: "Quartier Nord",
        description: "Centre historique avec ses maisons coloniales aux façades colorées et balcons en fer forgé.",
      },
      {
        name: "Festival de Jazz",
        description:
          "Événement culturel majeur qui se tient chaque année en mai, attirant des artistes internationaux.",
      },
      {
        name: "Parc National des Oiseaux du Djoudj",
        description: "Troisième réserve ornithologique au monde, abritant des millions d'oiseaux migrateurs.",
      },
      {
        name: "Musée Jean Mermoz",
        description: "Dédié à l'histoire de l'Aéropostale et aux aviateurs qui ont marqué cette époque.",
      },
    ],
    history:
      "Fondée en 1659 par des commerçants français, Saint-Louis est la plus ancienne ville coloniale française en Afrique de l'Ouest. Elle fut la capitale du Sénégal de 1872 à 1957 et joua un rôle crucial dans l'histoire coloniale de la région. Son importance historique et son architecture unique lui ont valu d'être inscrite au patrimoine mondial de l'UNESCO en 2000.",
    eventCount: 28,
  },
  {
    name: "Île de Gorée",
    slug: "goree",
    image: "/placeholder.svg?height=400&width=600",
    description:
      "Petite île située à 3 km au large de Dakar, Gorée est un lieu de mémoire important lié à la traite négrière. Classée au patrimoine mondial de l'UNESCO, l'île abrite la célèbre Maison des Esclaves avec sa « Porte du Voyage sans retour ». Aujourd'hui, Gorée est un lieu paisible avec ses ruelles sans voitures, ses maisons colorées et sa communauté d'artistes. L'île attire des visiteurs du monde entier venus se recueillir et découvrir cette page sombre de l'histoire.",
    gallery: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    highlights: [
      {
        name: "Maison des Esclaves",
        description:
          "Musée historique témoignant de la traite négrière, avec sa célèbre 'Porte du Voyage sans retour'.",
      },
      {
        name: "Musée Historique",
        description:
          "Présente l'histoire de Gorée et du Sénégal à travers des expositions d'objets et documents d'époque.",
      },
      {
        name: "Plage de Gorée",
        description: "Petite plage tranquille offrant une vue sur Dakar et propice à la baignade.",
      },
      {
        name: "Fort d'Estrées",
        description: "Ancien fort militaire abritant aujourd'hui le Musée de la Mer.",
      },
      {
        name: "Église Saint-Charles Borromée",
        description: "Église historique datant du XIXe siècle, témoignage de l'architecture religieuse coloniale.",
      },
    ],
    history:
      "Découverte par les Portugais au XVe siècle, Gorée fut successivement occupée par les Hollandais, les Anglais et les Français. Du XVIe au XIXe siècle, l'île servit de comptoir pour la traite des esclaves. Des milliers d'Africains y furent emprisonnés avant d'être déportés vers les Amériques. Aujourd'hui, Gorée est un lieu de pèlerinage et de recueillement pour les descendants des victimes de l'esclavage et un symbole de réconciliation.",
    eventCount: 15,
  },
  // Les autres destinations peuvent être ajoutées de la même manière
  {
    name: "Casamance",
    slug: "casamance",
    image: "/placeholder.svg?height=400&width=600",
    description: "Région verdoyante du sud du Sénégal, connue pour ses paysages luxuriants et sa culture diola.",
    gallery: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    highlights: [
      {
        name: "Cap Skirring",
        description: "Station balnéaire avec de magnifiques plages de sable blanc bordées de cocotiers.",
      },
      {
        name: "Parc National de Basse Casamance",
        description: "Réserve naturelle préservant la biodiversité unique de la région.",
      },
      {
        name: "Forêts de Palétuviers",
        description: "Écosystème de mangrove riche en faune et flore, idéal pour les excursions en pirogue.",
      },
      {
        name: "Villages traditionnels",
        description: "Communautés diola avec leurs maisons à impluvium et leurs traditions ancestrales.",
      },
    ],
    history:
      "La Casamance, séparée du reste du Sénégal par la Gambie, a une histoire et une culture distinctes. Habitée principalement par l'ethnie Diola, la région a longtemps préservé ses traditions animistes. La Casamance a connu un conflit séparatiste de basse intensité depuis les années 1980, mais la situation s'est considérablement améliorée ces dernières années, permettant le développement du tourisme dans cette région aux paysages exceptionnels.",
    eventCount: 23,
  },
]

export default function DestinationPage({ params }: { params: { name: string } }) {
  const destination = destinations.find((d) => d.slug === params.name)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!destination) {
    return (
      <div className="container px-4 py-8 md:px-6 md:py-12">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">Destination non trouvée</h1>
          <p className="text-muted-foreground">La destination que vous recherchez n&apos;existe pas.</p>
          <Button asChild className="bg-amber-600 hover:bg-amber-700">
            <Link href="/destinations">Retour aux destinations</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Filtrer les événements liés à cette destination
  const destinationEvents = popularEvents.filter((event) =>
    event.location.toLowerCase().includes(destination.name.toLowerCase()),
  )

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % destination.gallery.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + destination.gallery.length) % destination.gallery.length)
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
          <Link href="/destinations" className="hover:text-foreground">
            Destinations
          </Link>
          <span>/</span>
          <span className="text-foreground">{destination.name}</span>
        </div>

        {/* Hero Section */}
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-lg">
          <Image src={destination.image || "/placeholder.svg"} alt={destination.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{destination.name}</h1>
            <p className="text-white/90 max-w-2xl">{destination.description.split(".")[0]}.</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Tabs defaultValue="about">
              <TabsList className="mb-4">
                <TabsTrigger value="about" className="flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  <span>À propos</span>
                </TabsTrigger>
                <TabsTrigger value="attractions" className="flex items-center gap-1">
                  <Landmark className="h-4 w-4" />
                  <span>Attractions</span>
                </TabsTrigger>
                <TabsTrigger value="events" className="flex items-center gap-1">
                  <Ticket className="h-4 w-4" />
                  <span>Événements</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-amber-900 mb-2">À propos de {destination.name}</h2>
                  <p className="text-muted-foreground">{destination.description}</p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-amber-900 mb-2">Histoire</h3>
                  <p className="text-muted-foreground">{destination.history}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  {destination.gallery.map((image, index) => (
                    <div key={index} className="relative aspect-video overflow-hidden rounded-md">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${destination.name} - image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="attractions" className="space-y-4">
                <h2 className="text-2xl font-bold text-amber-900 mb-4">Points d&apos;intérêt à {destination.name}</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {destination.highlights.map((highlight, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{highlight.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{highlight.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="events" className="space-y-4">
                <h2 className="text-2xl font-bold text-amber-900 mb-4">Événements à {destination.name}</h2>
                {destinationEvents.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {destinationEvents.map((event) => (
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
                          <CardContent className="p-4">
                            <h3 className="font-bold mb-2">{event.title}</h3>
                            <div className="flex flex-col gap-2 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{event.date}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      Aucun événement n&apos;est actuellement programmé à {destination.name}.
                    </p>
                    <Button asChild className="mt-4 bg-amber-600 hover:bg-amber-700">
                      <Link href="/events">Voir tous les événements</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations pratiques</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Meilleure période pour visiter</h3>
                  <p className="text-sm text-muted-foreground">De novembre à mai (saison sèche)</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Comment s&apos;y rendre</h3>
                  <p className="text-sm text-muted-foreground">
                    {destination.name === "Dakar"
                      ? "Aéroport International Blaise Diagne (AIBD) avec des vols directs depuis l'Europe et d'autres pays africains."
                      : `Depuis Dakar, vous pouvez rejoindre ${destination.name} par route, bateau ou vol intérieur selon la destination.`}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Langue</h3>
                  <p className="text-sm text-muted-foreground">Français (officiel), Wolof, Sérère, Diola</p>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Monnaie</h3>
                  <p className="text-sm text-muted-foreground">Franc CFA (XOF)</p>
                </div>
                <div className="pt-2">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700" asChild>
                    <Link href={`/events?destination=${destination.slug}`}>
                      Voir les événements à {destination.name}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
