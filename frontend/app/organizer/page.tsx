"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, Upload } from "lucide-react"

export default function OrganizerPage() {
  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...newImages])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Reset form after success
      setTimeout(() => {
        setIsSuccess(false)
        setImages([])
        const form = e.target as HTMLFormElement
        form.reset()
      }, 3000)
    }, 1500)
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-amber-900">Espace organisateur</h1>
          <p className="text-muted-foreground">Créez et gérez vos événements culturels</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Créer un nouvel événement</CardTitle>
            <CardDescription>Remplissez le formulaire ci-dessous pour publier votre événement</CardDescription>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-amber-100 p-3">
                  <svg
                    className="h-6 w-6 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-amber-900">Événement créé avec succès!</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Votre événement a été publié et est maintenant visible par tous les utilisateurs.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre de l&apos;événement</Label>
                  <Input id="title" placeholder="Ex: Festival de Jazz de Saint-Louis" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez votre événement en détail..."
                    className="min-h-32"
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Input id="date" type="date" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Heure</Label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Input id="time" type="time" required />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Lieu</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <Input id="location" placeholder="Ex: Place Faidherbe, Saint-Louis" required />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Nombre de places disponibles</Label>
                    <Input id="capacity" type="number" min="1" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Prix (FCFA)</Label>
                    <Input id="price" type="number" min="0" step="500" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="festival">Festival</SelectItem>
                      <SelectItem value="concert">Concert</SelectItem>
                      <SelectItem value="exposition">Exposition</SelectItem>
                      <SelectItem value="visite">Visite guidée</SelectItem>
                      <SelectItem value="atelier">Atelier</SelectItem>
                      <SelectItem value="sport">Événement sportif</SelectItem>
                      <SelectItem value="gastronomie">Gastronomie</SelectItem>
                      <SelectItem value="tradition">Tradition</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Images</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((image, index) => (
                      <div key={index} className="relative aspect-video rounded-md border overflow-hidden">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Aperçu ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                    <label className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground hover:bg-amber-50">
                      <Upload className="mb-1 h-4 w-4" />
                      <span>Ajouter</span>
                      <Input type="file" accept="image/*" className="sr-only" onChange={handleImageUpload} multiple />
                    </label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ajoutez jusqu&apos;à 5 images pour votre événement. La première image sera utilisée comme image
                    principale.
                  </p>
                </div>

                <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700" disabled={isSubmitting}>
                  {isSubmitting ? "Publication en cours..." : "Publier l'événement"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
