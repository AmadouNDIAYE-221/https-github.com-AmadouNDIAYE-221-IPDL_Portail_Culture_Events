"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, MapPin, X, Filter } from "lucide-react"
import { destinationService } from "@/lib/api"
import { useState, useEffect } from "react"

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
    const destinationsWithEventCount = destinations.map((destination: any) => ({
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
  
// Composant client pour la page des destinations
export default function DestinationsPage() {
  // États pour gérer la recherche et le filtrage
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [allDestinations, setAllDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalEvents, setTotalEvents] = useState(0);
  const [regionCount, setRegionCount] = useState(0);
  
  // Effet pour charger les destinations au chargement de la page
  useEffect(() => {
    async function loadDestinations() {
      setIsLoading(true);
      try {
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
        setAllDestinations(destinations);
        
        // Calculer les statistiques
        const total = destinations.reduce((sum: number, dest: Destination) => sum + (dest.eventCount || 0), 0);
        setTotalEvents(total);
        
        const regions = new Set(destinations.map((d: Destination) => d.name.split(',')[0])).size;
        setRegionCount(regions);
      } catch (error) {
        console.error("Erreur lors du chargement des destinations:", error);
        setAllDestinations(fallbackDestinations);
        
        // Calculer les statistiques à partir des données de secours
        const total = fallbackDestinations.reduce((sum: number, dest: Destination) => sum + (dest.eventCount || 0), 0);
        setTotalEvents(total);
        
        const regions = new Set(fallbackDestinations.map((d: Destination) => d.name.split(',')[0])).size;
        setRegionCount(regions);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadDestinations();
  }, []);
  
  // Fonction pour rechercher des destinations
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // La recherche se fait déjà via le filteredDestinations ci-dessous
  };
  
  // Fonction pour réinitialiser la recherche
  const clearSearch = () => {
    setSearchQuery("");
    setSelectedCategory(null);
  };
  
  // Fonction pour filtrer les destinations selon la catégorie
  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
  };
  
  // Filtrer les destinations selon les critères de recherche
  const filteredDestinations = allDestinations.filter((destination: Destination) => {
    const matchesSearch = searchQuery === "" || 
      destination.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")) ||
      destination.description.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
    
    // Si aucune catégorie sélectionnée OU la destination correspond à la catégorie
    // Pour l'instant c'est simpliste, nous pourrions ajouter des catégories aux destinations
    const matchesCategory = !selectedCategory || 
      (selectedCategory === 'Populaires' && (destination.eventCount || 0) > 10) || 
      (selectedCategory === 'Historiques' && destination.description.toLowerCase().includes('histori')) ||
      (selectedCategory === 'Plages' && destination.description.toLowerCase().includes('plage')) ||
      (selectedCategory === 'Nature' && destination.description.toLowerCase().includes('nature')) ||
      (selectedCategory === 'Urbain' && destination.description.toLowerCase().includes('ville')) ||
      (selectedCategory === 'Culture' && destination.description.toLowerCase().includes('cultur'));
    
    return matchesSearch && matchesCategory;
  });
  
  // Créer la liste des destinations en vedette (top 3 avec le plus d'événements)
  const featuredDestinations = [...filteredDestinations]
    .sort((a, b) => (b.eventCount || 0) - (a.eventCount || 0))
    .slice(0, 3);
  
  // Catégories de destinations pour le filtrage
  const destinationCategories = [
    { name: 'Populaires', icon: '🔥' },
    { name: 'Historiques', icon: '🏛️' },
    { name: 'Plages', icon: '🏖️' },
    { name: 'Nature', icon: '🌳' },
    { name: 'Urbain', icon: '🏙️' },
    { name: 'Culture', icon: '🎭' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-white">
      {/* Section Héro avec statistiques */}
      <section className="bg-gradient-to-br from-amber-800 to-amber-900 text-white relative overflow-hidden">
        {/* Motifs d'arrière-plan */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-amber-700 rounded-bl-full opacity-10"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-600 rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-full h-16 bg-white opacity-10"></div>
        </div>
        
        {/* Overlay pour meilleure lisibilité */}
        <div className="absolute inset-0 bg-amber-950 opacity-10"></div>

        <div className="container relative z-10 px-4 py-16 md:py-24 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <div className="inline-flex items-center justify-center p-1 bg-amber-600/20 backdrop-blur-sm rounded-full px-3 mb-4 border border-amber-500/10">
              <span className="text-amber-50 text-sm font-medium">{allDestinations.length} destinations à explorer</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white drop-shadow-sm">
              Destinations Culturelles du Sénégal
            </h1>
            
            <p className="text-amber-50 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-sm">
              Explorez la richesse et la diversité des régions sénégalaises, chacune avec son histoire, sa culture et ses traditions uniques.
            </p>
          </div>
          
          {/* Statistiques des destinations */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/10">
              <div className="text-3xl font-bold">{allDestinations.length}</div>
              <div className="text-amber-100 text-sm">Destinations</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/10">
              <div className="text-3xl font-bold">{regionCount}</div>
              <div className="text-amber-100 text-sm">Régions</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/10">
              <div className="text-3xl font-bold">{totalEvents}</div>
              <div className="text-amber-100 text-sm">Événements</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/10">
              <div className="text-3xl font-bold">365</div>
              <div className="text-amber-100 text-sm">Jours de soleil</div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Section principale avec recherche et résultats */}
      <section className="container px-4 py-12 md:px-6">
        <div className="flex flex-col gap-8">
          {/* Titre de section et recherche */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-amber-900">Explorez nos destinations</h2>
              <p className="text-muted-foreground">
                Découvrez les plus belles destinations culturelles du Sénégal et leurs événements
              </p>
            </div>
            
            {/* Barre de recherche améliorée */}
            <form className="flex w-full max-w-sm items-center space-x-2" onSubmit={handleSearch}>
              <div className="relative flex-1">
                <Input 
                  type="text" 
                  placeholder="Rechercher une destination..." 
                  className="flex-1 border-amber-200 focus-visible:ring-amber-500 pr-8" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    onClick={clearSearch} 
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
            </form>
          </div>
          
          {/* Filtres par catégorie */}
          <div className="flex flex-wrap gap-2">
            {destinationCategories.map((category) => (
              <button 
                key={category.name}
                onClick={() => handleCategoryFilter(category.name)}
                className={`inline-flex items-center px-3 py-1.5 rounded-full ${selectedCategory === category.name ? 'bg-amber-600 text-white' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'} transition-colors text-sm font-medium`}
              >
                <span className="mr-1.5">{category.icon}</span>
                {category.name}
                {selectedCategory === category.name && (
                  <X className="h-3.5 w-3.5 ml-1.5 stroke-[3]" />
                )}
              </button>
            ))}
          </div>
          
          {/* Destinations en vedette */}
          <div className="mt-4">
            <h3 className="text-lg font-medium text-amber-900 mb-4">Destinations en vedette</h3>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredDestinations.map((destination) => (
                <Link href={`/destinations/${destination.slug}`} key={destination.id} className="group">
                  <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 duration-300 h-full border-amber-100">
                    <div className="aspect-[4/3] overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
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
                        className="object-cover transition-transform duration-500 group-hover:scale-110 h-full w-full"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                        <h3 className="text-white text-xl font-bold drop-shadow-md">{destination.name}</h3>
                        <div className="flex items-center text-amber-100 text-sm mt-1">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          <span>Sénégal</span>
                        </div>
                      </div>
                      <div className="absolute top-3 right-3 bg-amber-600 text-white px-2 py-1 rounded-full text-xs font-medium z-20 shadow-md">
                        {destination.eventCount || 0} événements
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{destination.description}</p>
                      <div>
                        <h4 className="text-sm font-medium mb-1 text-amber-900">Points d'intérêt :</h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {destination.highlights?.slice(0, 2).map((highlight: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <span className="text-amber-500 mr-1.5">•</span>
                              <span className="line-clamp-1">{highlight}</span>
                            </li>
                          ))}
                          {destination.highlights && destination.highlights.length > 2 && (
                            <li className="text-amber-600 text-right italic">+ {destination.highlights.length - 2} autres</li>
                          )}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Toutes les destinations */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-amber-900 mb-4">Toutes les destinations</h3>
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
              </div>
            ) : filteredDestinations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aucune destination ne correspond à votre recherche</p>
                <Button onClick={clearSearch} variant="outline" className="mt-4">
                  <X className="h-4 w-4 mr-2" />
                  Effacer la recherche
                </Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredDestinations.map((destination: Destination) => (
                <Link href={`/destinations/${destination.slug}`} key={destination.id} className="group">
                  <Card className="overflow-hidden transition-all hover:shadow-md h-full border-amber-100">
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
                        className="object-cover transition-transform group-hover:scale-105 duration-500"
                      />
                      <div className="absolute top-2 right-2 bg-amber-600 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                        {destination.eventCount || 0} événements
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-amber-600" />
                        <h3 className="font-bold text-lg text-amber-900">{destination.name}</h3>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{destination.description}</p>
                      <div>
                        <h4 className="text-sm font-medium mb-1 text-amber-900">Points d'intérêt :</h4>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {destination.highlights?.slice(0, 2).map((highlight: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <span className="text-amber-500 mr-1.5">•</span>
                              <span className="line-clamp-1">{highlight}</span>
                            </li>
                          ))}
                          {destination.highlights && destination.highlights.length > 2 && (
                            <li className="text-amber-600 italic text-right">+ {destination.highlights.length - 2} autres</li>
                          )}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            )}
          </div>
          
          {/* Call to Action */}
          <div className="mt-12 text-center">
            <div className="max-w-2xl mx-auto bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-8 border border-amber-100 shadow-sm">
              <h3 className="text-xl font-bold text-amber-900 mb-2">Vous ne trouvez pas votre destination idéale ?</h3>
              <p className="text-muted-foreground mb-6">Contactez-nous pour organiser votre voyage culturel personnalisé au Sénégal.</p>
              <Button className="bg-amber-600 hover:bg-amber-700 shadow-sm">
                Nous contacter
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
