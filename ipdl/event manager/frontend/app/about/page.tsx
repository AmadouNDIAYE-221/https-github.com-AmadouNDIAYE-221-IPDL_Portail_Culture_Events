import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, Users, Calendar, Award, Mail, Phone, MapPin } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-12">
        {/* Hero Section */}
        <section className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-amber-900 md:text-4xl lg:text-5xl">
            À propos d&apos;AfricaEvents
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-muted-foreground md:text-lg">
            Votre portail de découverte du tourisme culturel et événementiel au Sénégal et en Afrique
          </p>
        </section>

        {/* Mission Section */}
        <section className="grid gap-8 md:grid-cols-2 items-center">
          <div>
            <h2 className="text-2xl font-bold text-amber-900 mb-4">Notre mission</h2>
            <p className="text-muted-foreground mb-4">
              AfricaEvents a été créé avec une vision claire : mettre en valeur la richesse culturelle du Sénégal et de
              l&apos;Afrique à travers ses événements et destinations touristiques.
            </p>
            <p className="text-muted-foreground mb-4">
              Notre plateforme connecte les visiteurs locaux et internationaux avec les organisateurs d&apos;événements
              culturels, facilitant la découverte et la participation à des expériences authentiques qui célèbrent le
              patrimoine africain.
            </p>
            <p className="text-muted-foreground">
              Nous croyons que le tourisme culturel est un puissant vecteur de développement économique et de
              préservation du patrimoine. C&apos;est pourquoi nous nous engageons à promouvoir un tourisme responsable
              qui bénéficie aux communautés locales.
            </p>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src="/placeholder.svg?height=600&width=600"
              alt="Festival culturel au Sénégal"
              fill
              className="object-cover"
            />
          </div>
        </section>

        {/* Values Section */}
        <section>
          <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">Nos valeurs</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Globe className="h-8 w-8 text-amber-600" />,
                title: "Authenticité",
                description:
                  "Nous mettons en avant des expériences culturelles authentiques qui reflètent véritablement les traditions et le patrimoine africains.",
              },
              {
                icon: <Users className="h-8 w-8 text-amber-600" />,
                title: "Communauté",
                description:
                  "Nous soutenons les communautés locales en favorisant un tourisme qui génère des retombées économiques directes pour les habitants.",
              },
              {
                icon: <Calendar className="h-8 w-8 text-amber-600" />,
                title: "Accessibilité",
                description:
                  "Nous rendons la culture accessible à tous en simplifiant la découverte et la réservation d'événements culturels.",
              },
              {
                icon: <Award className="h-8 w-8 text-amber-600" />,
                title: "Excellence",
                description:
                  "Nous nous engageons à offrir une plateforme de qualité et à mettre en avant des événements exceptionnels.",
              },
            ].map((value, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                    {value.icon}
                  </div>
                  <h3 className="mb-2 font-bold text-amber-900">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section>
          <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">Notre équipe</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Fondateur",
                role: "Fondateur & CEO",
                image: "/placeholder.svg?height=300&width=300",
                bio: "Passionné de culture et de tourisme, notre fondateur a créé AfricaEvents pour mettre en valeur la richesse culturelle du Sénégal.",
              },
              {
                name: "Directrice des Partenariats",
                role: "Directrice des Partenariats",
                image: "/placeholder.svg?height=300&width=300",
                bio: "Avec plus de 10 ans d'expérience dans l'événementiel, elle développe notre réseau d'organisateurs et de partenaires culturels.",
              },
              {
                name: "Responsable Technique",
                role: "Responsable Technique",
                image: "/placeholder.svg?height=300&width=300",
                bio: "Expert en développement web, notre responsable technique veille à offrir une expérience utilisateur optimale sur notre plateforme.",
              },
              {
                name: "Responsable Marketing",
                role: "Responsable Marketing",
                image: "/placeholder.svg?height=300&width=300",
                bio: "Spécialiste en marketing digital, notre responsable marketing élabore des stratégies innovantes pour promouvoir les événements culturels.",
              },
              {
                name: "Responsable Logistique",
                role: "Responsable Logistique",
                image: "/placeholder.svg?height=300&width=300",
                bio: "Expert en organisation d'événements, notre responsable logistique assure le bon déroulement de chaque événement promu sur la plateforme.",
              },
            ].map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-amber-900">{member.name}</h3>
                  <p className="text-sm text-amber-600 mb-2">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Partners Section */}
        <section>
          <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">Nos partenaires</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { name: "Ministère du Tourisme du Sénégal", logo: "/placeholder.svg?height=100&width=200" },
              { name: "Office National du Tourisme", logo: "/placeholder.svg?height=100&width=200" },
              { name: "Association des Festivals du Sénégal", logo: "/placeholder.svg?height=100&width=200" },
              { name: "Agence de Promotion Touristique", logo: "/placeholder.svg?height=100&width=200" },
            ].map((partner, index) => (
              <div key={index} className="relative h-20 w-40">
                <Image src={partner.logo || "/placeholder.svg"} alt={partner.name} fill className="object-contain" />
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-amber-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">Contactez-nous</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-amber-600" />
                <span>contact@africaevents.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-amber-600" />
                <span>+221 33 123 45 67</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-amber-600" />
                <span>123 Avenue Cheikh Anta Diop, Dakar, Sénégal</span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-muted-foreground">
                Vous avez des questions ou souhaitez devenir partenaire ? N'hésitez pas à nous contacter.
              </p>
              <Button className="bg-amber-600 hover:bg-amber-700 w-fit">Nous contacter</Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Rejoignez l'aventure</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground mb-6">
            Que vous soyez un visiteur à la recherche d'expériences culturelles authentiques ou un organisateur
            souhaitant promouvoir vos événements, AfricaEvents est là pour vous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-amber-600 hover:bg-amber-700">
              <Link href="/events">Explorer les événements</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/register">Créer un compte</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
