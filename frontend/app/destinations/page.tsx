import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"

// Liste des destinations touristiques au Sénégal
const destinations = [
  {
    name: "Dakar",
    slug: "dakar",
    image: "/placeholder.svg?height=400&width=600",
    description: "Capitale vibrante du Sénégal, mêlant culture, histoire et modernité.",
    eventCount: 42,
    highlights: [
      "Monument de la Renaissance Africaine",
      "Île de Gorée",
      "Marché Sandaga",
      "Musée des Civilisations Noires",
    ],
  },
  {
    name: "Saint-Louis",
    slug: "saint-louis",
    image: "/placeholder.svg?height=400&width=600",
    description: "Ancienne capitale coloniale avec son architecture unique et son festival de jazz renommé.",
    eventCount: 28,
    highlights: ["Pont Faidherbe", "Quartier Nord", "Festival de Jazz", "Parc National des Oiseaux du Djoudj"],
  },
  {
    name: "Île de Gorée",
    slug: "goree",
    image: "/placeholder.svg?height=400&width=600",
    description: "Site historique majeur de la traite négrière, classé au patrimoine mondial de l'UNESCO.",
    eventCount: 15,
    highlights: ["Maison des Esclaves", "Musée Historique", "Plage de Gorée", "Fort d'Estrées"],
  },
  {
    name: "Casamance",
    slug: "casamance",
    image: "/placeholder.svg?height=400&width=600",
    description: "Région verdoyante du sud du Sénégal, connue pour ses paysages luxuriants et sa culture diola.",
    eventCount: 23,
    highlights: ["Cap Skirring", "Parc National de Basse Casamance", "Forêts de Palétuviers", "Villages traditionnels"],
  },
  {
    name: "Lac Rose",
    slug: "lac-rose",
    image: "/placeholder.svg?height=400&width=600",
    description: "Lac aux eaux roses unique, célèbre pour sa couleur distinctive et ses montagnes de sel.",
    eventCount: 12,
    highlights: ["Extraction traditionnelle du sel", "Dunes de sable", "Baignade dans le lac", "Excursions en 4x4"],
  },
  {
    name: "Sine Saloum",
    slug: "sine-saloum",
    image: "/placeholder.svg?height=400&width=600",
    description: "Delta fluvial avec mangroves, îles et villages de pêcheurs, idéal pour l'écotourisme.",
    eventCount: 18,
    highlights: [
      "Parc National du Delta du Saloum",
      "Îles de Sipo et Bakassouk",
      "Observation des oiseaux",
      "Pêche traditionnelle",
    ],
  },
  {
    name: "Réserve de Bandia",
    slug: "bandia",
    image: "/placeholder.svg?height=400&width=600",
    description: "Réserve naturelle abritant une faune africaine diverse dans un cadre préservé.",
    eventCount: 8,
    highlights: ["Safari en 4x4", "Rhinocéros blancs", "Girafes", "Baobabs centenaires"],
  },
  {
    name: "Touba",
    slug: "touba",
    image: "/placeholder.svg?height=400&width=600",
    description: "Ville sainte de la confrérie mouride, centre spirituel majeur avec sa grande mosquée.",
    eventCount: 10,
    highlights: ["Grande Mosquée de Touba", "Magal de Touba", "Bibliothèque Cheikhoul Khadim", "Marché de Touba"],
  },
]

export default function DestinationsPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-amber-900">Destinations</h1>
          <p className="text-muted-foreground">
            Découvrez les plus belles destinations culturelles du Sénégal et leurs événements
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex w-full max-w-sm items-center space-x-2 mx-auto md:mx-0">
          <Input type="text" placeholder="Rechercher une destination..." className="flex-1" />
          <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Destinations Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {destinations.map((destination) => (
            <Link href={`/destinations/${destination.slug}`} key={destination.slug} className="group">
              <Card className="overflow-hidden transition-all hover:shadow-md h-full">
                <div className="aspect-video overflow-hidden relative">
                  <Image
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    width={600}
                    height={400}
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 bg-amber-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {destination.eventCount} événements
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-amber-600" />
                    <h3 className="font-bold text-lg text-amber-900">{destination.name}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{destination.description}</p>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Points d'intérêt :</h4>
                    <ul className="text-xs text-muted-foreground list-disc pl-4">
                      {destination.highlights.slice(0, 2).map((highlight, index) => (
                        <li key={index}>{highlight}</li>
                      ))}
                      {destination.highlights.length > 2 && (
                        <li className="text-amber-600">+ {destination.highlights.length - 2} autres</li>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
