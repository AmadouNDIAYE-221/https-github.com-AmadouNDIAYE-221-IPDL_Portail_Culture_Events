import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"
import { destinationService } from "@/lib/api"

// Définition d'interface pour les destinations
interface Destination {
  id: number;
  name: string;
  slug: string;
  image: string;
  description: string;
  history?: string;
  eventCount: number;
  highlights: string[];
}

// Fonction asynchrone pour récupérer les destinations depuis l'API
async function getDestinations(): Promise<Destination[]> {
  try {
    // Récupérer toutes les destinations
    const destinations = await destinationService.getAllDestinations();
    
    // Récupérer également tous les événements pour calculer les compteurs
    const events = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/events`)
      .then(res => res.json())
      .catch(err => {
        console.error("Erreur lors de la récupération des événements:", err);
        return [];
      });
    
    // Calculer le nombre d'événements par destination
    const eventCountByDestination = events.reduce((acc: Record<number, number>, event: any) => {
      const destinationId = event.destinationId || (event.destination?.id);
      if (destinationId) {
        acc[destinationId] = (acc[destinationId] || 0) + 1;
      }
      return acc;
    }, {});
    
    // Mettre à jour les compteurs d'événements pour chaque destination
    const destinationsWithEventCount = destinations.map(destination => ({
      ...destination,
      eventCount: eventCountByDestination[destination.id] || destination.eventCount || 0
    }));
    
    console.log('Destinations avec compteurs mis à jour:', destinationsWithEventCount);
    return destinationsWithEventCount;
  } catch (error) {
    console.error("Erreur lors de la récupération des destinations:", error);
    return [];
  }
}

// Données de secours au cas où l'API ne répond pas
const fallbackDestinations: Destination[] = [
  {
    id: 1,
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
    id: 2,
    name: "Saint-Louis",
    slug: "saint-louis",
    image: "/placeholder.svg?height=400&width=600",
    description: "Ancienne capitale coloniale avec son architecture unique et son festival de jazz renommé.",
    eventCount: 28,
    highlights: ["Pont Faidherbe", "Quartier Nord", "Festival de Jazz", "Parc National des Oiseaux du Djoudj"],
  },
  {
    id: 3,
    name: "Île de Gorée",
    slug: "goree",
    image: "/placeholder.svg?height=400&width=600",
    description: "Site historique majeur de la traite négrière, classé au patrimoine mondial de l'UNESCO.",
    eventCount: 15,
    highlights: ["Maison des Esclaves", "Musée Historique", "Plage de Gorée", "Fort d'Estrées"],
  },
  {
    id: 4,
    name: "Casamance",
    slug: "casamance",
    image: "/placeholder.svg?height=400&width=600",
    description: "Région verdoyante du sud du Sénégal, connue pour ses paysages luxuriants et sa culture diola.",
    eventCount: 23,
    highlights: ["Cap Skirring", "Parc National de Basse Casamance", "Forêts de Palétuviers", "Villages traditionnels"],
  },
  {
    id: 5,
    name: "Lac Rose",
    slug: "lac-rose",
    image: "/placeholder.svg?height=400&width=600",
    description: "Lac aux eaux roses unique, célèbre pour sa couleur distinctive et ses montagnes de sel.",
    eventCount: 12,
    highlights: ["Extraction traditionnelle du sel", "Dunes de sable", "Baignade dans le lac", "Excursions en 4x4"],
  },
  {
    id: 6,
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
    id: 7,
    name: "Réserve de Bandia",
    slug: "bandia",
    image: "/placeholder.svg?height=400&width=600",
    description: "Réserve naturelle abritant une faune africaine diverse dans un cadre préservé.",
    eventCount: 8,
    highlights: ["Safari en 4x4", "Rhinocéros blancs", "Girafes", "Baobabs centenaires"],
  },
  {
    id: 8,
    name: "Touba",
    slug: "touba",
    image: "/placeholder.svg?height=400&width=600",
    description: "Ville sainte de la confrérie mouride, centre spirituel majeur avec sa grande mosquée.",
    eventCount: 10,
    highlights: ["Grande Mosquée de Touba", "Magal de Touba", "Bibliothèque Cheikhoul Khadim", "Marché de Touba"],
  },
]

export default async function DestinationsPage() {
  // Récupérer les destinations depuis l'API
  let apiDestinations = await getDestinations();
  
  // Traiter et valider les données des destinations
  const processedDestinations: Destination[] = [];
  
  if (apiDestinations && apiDestinations.length > 0) {
    // Une Map pour déduplication par slug
    const slugMap = new Map<string, boolean>();
    
    for (const dest of apiDestinations) {
      // Vérifier si c'est un doublon
      if (dest.slug && slugMap.has(dest.slug)) continue;
      if (dest.slug) slugMap.set(dest.slug, true);
      
      // S'assurer que toutes les propriétés sont valides
      try {
        const validDest: Destination = {
          id: typeof dest.id === 'number' ? dest.id : Math.floor(Math.random() * 10000),
          name: typeof dest.name === 'string' ? dest.name : "Destination",
          slug: typeof dest.slug === 'string' ? dest.slug : `destination-${processedDestinations.length}`,
          description: typeof dest.description === 'string' ? dest.description : "",
          image: typeof dest.image === 'string' 
            ? (dest.image.startsWith('http') 
                ? dest.image 
                : dest.image.startsWith('/api/uploads/') 
                  ? `http://localhost:8080${dest.image}` 
                  : dest.image.startsWith('/') 
                    ? `http://localhost:8080${dest.image}` 
                    : `http://localhost:8080/api/uploads/${dest.image}`)
            : "/placeholder.svg?height=400&width=600",
          eventCount: typeof dest.eventCount === 'number' ? dest.eventCount : 0,
          history: typeof dest.history === 'string' ? dest.history : undefined,
          highlights: []
        };
        
        // Créer des highlights valides
        if (Array.isArray(dest.highlights)) {
          validDest.highlights = dest.highlights.filter(h => typeof h === 'string');
        } else {
          // Créer des highlights à partir de la description et de l'histoire
          const tempHighlights = [];
          if (validDest.description) tempHighlights.push(validDest.description);
          if (validDest.history) tempHighlights.push(validDest.history);
          validDest.highlights = tempHighlights;
        }
        
        processedDestinations.push(validDest);
      } catch (error) {
        console.error("Erreur lors du traitement d'une destination:", error);
      }
    }
  }
  
  // Utiliser les destinations formatées de l'API ou les données de secours si l'API échoue
  const destinations = processedDestinations.length > 0 ? processedDestinations : fallbackDestinations;
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
            <Link href={`/destinations/${destination.slug}`} key={destination.id} className="group">
              <Card className="overflow-hidden transition-all hover:shadow-md h-full">
                <div className="aspect-video overflow-hidden relative">
                  <Image
                    src={destination.image.startsWith('http') 
                      ? destination.image 
                      : destination.image.includes('placeholder') 
                        ? destination.image 
                        : destination.image.startsWith('/api/uploads/') 
                          ? `http://localhost:8080${destination.image}` 
                          : destination.image.startsWith('/') 
                            ? `http://localhost:8080${destination.image}` 
                            : `http://localhost:8080/api/uploads/${destination.image}`}
                    alt={destination.name}
                    width={600}
                    height={400}
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 bg-amber-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {destination.eventCount || 0} événements
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
                      {destination.highlights?.slice(0, 2).map((highlight: string, index: number) => (
                        <li key={index}>{highlight}</li>
                      ))}
                      {destination.highlights && destination.highlights.length > 2 && (
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
