"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImagePlus, Map, Save, X, Edit, Trash2, Plus } from "lucide-react"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import { getAuthToken } from "@/lib/api"
import { imageService } from "@/services/image-service"

// API URL de base
const API_BASE_URL = 'http://localhost:8080'

// Schéma de validation pour un point d'intérêt
const highlightSchema = z.object({
  name: z.string().min(2, {
    message: "Le nom doit contenir au moins 2 caractères",
  }),
  description: z.string().min(5, {
    message: "La description doit contenir au moins 5 caractères",
  }),
  image: z.string().optional(),
})

// Schéma de validation pour le formulaire de destination
const destinationFormSchema = z.object({
  name: z.string().min(1, {
    message: "Le nom est requis",
  }),
  description: z.string().min(1, {
    message: "La description est requise",
  }),
  country: z.string().optional(),
  region: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  imageUrl: z.string().optional(),
  highlights: z.array(highlightSchema).optional(),
})

type DestinationFormValues = z.infer<typeof destinationFormSchema>

export default function CreateDestinationPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [destinationId, setDestinationId] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  
  // État pour les points d'intérêt
  const [highlights, setHighlights] = useState<{ name: string; description: string; image?: string }[]>([])
  const [newHighlight, setNewHighlight] = useState<{ name: string; description: string; image?: string }>({ name: '', description: '', image: '' })
  const [editHighlightIndex, setEditHighlightIndex] = useState<number | null>(null)
  const [highlightImageFile, setHighlightImageFile] = useState<File | null>(null)
  const [highlightImagePreview, setHighlightImagePreview] = useState<string | null>(null)
  const [isUploadingHighlightImage, setIsUploadingHighlightImage] = useState(false)

  // Configuration du formulaire avec validation
  const form = useForm<DestinationFormValues>({
    resolver: zodResolver(destinationFormSchema),
    defaultValues: {
      name: "",
      description: "",
      country: "",
      region: "",
      latitude: 0,
      longitude: 0,
      imageUrl: "",
      highlights: [],
    }
  })

  // Vérification de l'authentification et du rôle
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/dashboard/destinations/create')
      return
    }

    if (user?.role !== 'ORGANIZER') {
      router.push('/dashboard')
      toast({
        title: "Accès refusé",
        description: "Seuls les organisateurs peuvent créer des destinations",
        variant: "destructive",
      })
      return
    }
    
    // Vérifier si on est en mode édition (via query parameter)
    // Next.js client-side routing ne met pas à jour window.location immédiatement
    // On utilise donc une approche plus robuste
    const checkForEditMode = () => {
      // Récupérer l'URL complète et analyser les paramètres
      const urlParams = new URLSearchParams(window.location.search)
      const id = urlParams.get('id')
      console.log('Paramètre ID d\'URL:', id)
      
      if (id && !isEditMode) {
        console.log('Mode édition activé pour la destination ID:', id)
        setIsEditMode(true)
        setDestinationId(id)
        fetchDestination(id)
      } else if (!id && isEditMode) {
        // Réinitialiser au mode création si l'URL ne contient plus l'ID
        console.log('Mode création rétabli car aucun ID dans l\'URL')
        setIsEditMode(false)
        setDestinationId(null)
        form.reset({
          name: "",
          description: "",
          country: "",
          region: "",
          latitude: 0,
          longitude: 0,
          imageUrl: "",
          highlights: [],
        })
      }
    }
    
    // Vérifier immédiatement et après un court délai (pour s'assurer que l'URL est mise à jour)
    checkForEditMode()
    const timeoutId = setTimeout(checkForEditMode, 300)
    
    return () => clearTimeout(timeoutId)
  }, [isAuthenticated, user, router])

  // Fonction pour récupérer une destination existante pour l'édition
  const fetchDestination = async (id: string) => {
    try {
      setIsLoading(true)
      // Au lieu d'utiliser l'endpoint GET /api/destinations/{id} qui ne fonctionne pas
      // Récupérer toutes les destinations et filtrer celle qui nous intéresse
      const response = await fetch(`${API_BASE_URL}/api/destinations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        }
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des destinations')
      }

      const destinations = await response.json()
      // Chercher la destination par son ID
      const destinationData = destinations.find((destination: any) => destination.id === parseInt(id))
      
      if (!destinationData) {
        throw new Error('Destination non trouvée')
      }
      
      console.log('Destination chargée:', destinationData)
      
      // Remplir le formulaire avec les données existantes
      form.reset({
        name: destinationData.name,
        description: destinationData.description,
        country: destinationData.country,
        region: destinationData.region || '',
        latitude: destinationData.latitude,
        longitude: destinationData.longitude,
        imageUrl: destinationData.imageUrl || '',
        highlights: destinationData.highlights || []
      })
      
      // Charger les points d'intérêt existants
      if (destinationData.highlights && Array.isArray(destinationData.highlights)) {
        console.log('Points d\'intérêt trouvés:', destinationData.highlights)
        setHighlights(destinationData.highlights.map((highlight: any) => ({
          name: highlight.name || '',
          description: highlight.description || '',
          image: highlight.image || ''  // Conserver le champ image
        })))
        console.log('Points d\'intérêt chargés avec images:', destinationData.highlights)
      }

      // Si l'image existe, afficher l'aperçu
      if (destinationData.imageUrl) {
        // Si l'URL est relative, la transformer en URL absolue
        const imageUrl = destinationData.imageUrl.startsWith('http') 
          ? destinationData.imageUrl 
          : `${API_BASE_URL}${destinationData.imageUrl}`;
        setImagePreview(imageUrl);
      }
    } catch (error) {
      console.error('Erreur:', error)
      // Afficher l'erreur sans redirection automatique
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails de la destination. Vous pouvez créer une nouvelle destination ou retourner à la liste.",
        variant: "destructive",
        duration: 10000 // Augmenter la durée pour que l'utilisateur puisse lire le message
      })
      // Ne pas rediriger automatiquement
      setIsLoading(false)
      setIsEditMode(false) // Revenir au mode création
    } finally {
      setIsLoading(false)
    }
  }

  // Gestion de l'upload d'image pour les points d'intérêt
  const handleHighlightImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    const file = files[0]
    setHighlightImageFile(file)
    
    // Créer un aperçu de l'image
    const objectUrl = URL.createObjectURL(file)
    setHighlightImagePreview(objectUrl)
    
    // Upload de l'image
    try {
      setIsUploadingHighlightImage(true)
      
      // Créer un FormData pour l'upload de l'image
      const formData = new FormData()
      formData.append('image', file)
      
      // Upload de l'image au serveur
      const uploadResponse = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      })
      
      if (!uploadResponse.ok) {
        throw new Error("Erreur lors de l'upload de l'image pour le point d'intérêt")
      }
      
      const imageData = await uploadResponse.json()
      console.log('Résultat upload image point d\'intérêt:', imageData)
      
      // Récupérer l'URL de l'image
      // Le backend peut renvoyer soit url soit imageUrl
      const imageUrl = imageData.url || imageData.imageUrl
      
      // S'assurer que l'URL est bien formatée (juste le chemin relatif)
      const cleanImageUrl = imageUrl.replace(API_BASE_URL, '') // Enlever l'URL de base si présente
      console.log('URL nettoyée:', cleanImageUrl)
      
      // Mettre à jour le highlight avec l'URL de l'image correctement formatée
      setNewHighlight(prev => ({ ...prev, image: cleanImageUrl }))
      
      toast({
        title: "Succès",
        description: "L'image a été uploadée avec succès",
      })
    } catch (error) {
      console.error('Erreur upload image:', error)
      toast({
        title: "Erreur",
        description: "Impossible d'uploader l'image",
        variant: "destructive",
      })
    } finally {
      setIsUploadingHighlightImage(false)
    }
  }
  
  const handleRemoveHighlightImage = () => {
    setHighlightImageFile(null)
    setHighlightImagePreview(null)
    setNewHighlight(prev => ({ ...prev, image: undefined }))
  }

  // Fonctions de gestion des points d'intérêt
  const addHighlight = () => {
    if (newHighlight.name.length < 2 || newHighlight.description.length < 5) {
      toast({
        title: "Erreur",
        description: "Le nom doit contenir au moins 2 caractères et la description au moins 5 caractères.",
        variant: "destructive",
      })
      return
    }
    
    if (editHighlightIndex !== null) {
      // Mode modification
      const updatedHighlights = [...highlights]
      updatedHighlights[editHighlightIndex] = newHighlight
      setHighlights(updatedHighlights)
      setEditHighlightIndex(null)
    } else {
      // Mode ajout
      setHighlights([...highlights, newHighlight])
    }
    
    // Réinitialiser le formulaire et les images
    setNewHighlight({ name: '', description: '', image: '' })
    setHighlightImageFile(null)
    setHighlightImagePreview(null)
  }
  
  const editHighlight = (index: number) => {
    const highlightToEdit = highlights[index]
    console.log('Édition du point d\'intérêt:', highlightToEdit)
    
    // S'assurer de préserver toutes les propriétés, y compris l'image
    setNewHighlight({
      name: highlightToEdit.name,
      description: highlightToEdit.description,
      image: highlightToEdit.image
    })
    setEditHighlightIndex(index)
    
    // Si l'image existe, afficher l'aperçu
    if (highlightToEdit.image) {
      console.log('Image du point d\'intérêt trouvée:', highlightToEdit.image)
      setHighlightImagePreview(highlightToEdit.image)
    } else {
      setHighlightImagePreview(null)
    }
  }
  
  const deleteHighlight = (index: number) => {
    const updatedHighlights = [...highlights]
    updatedHighlights.splice(index, 1)
    setHighlights(updatedHighlights)
    
    // Si on était en train de modifier cet élément, réinitialiser
    if (editHighlightIndex === index) {
      setNewHighlight({ name: '', description: '', image: '' })
      setHighlightImagePreview(null)
      setHighlightImageFile(null)
      setEditHighlightIndex(null)
    }
  }
  
  // Gestionnaire de soumission du formulaire
  const onSubmit = async (data: DestinationFormValues) => {
    try {
      // Ajouter les points d'intérêt au formulaire avant soumission
      data.highlights = highlights
      
      setIsLoading(true)
      
      // Gérer l'upload de l'image si une nouvelle image a été sélectionnée
      if (imageFile) {
        try {
          setIsUploading(true)
          // Créer un FormData pour l'upload de l'image
          const formData = new FormData()
          formData.append('image', imageFile)
          
          // Upload de l'image au serveur
          const uploadResponse = await fetch(`${API_BASE_URL}/api/upload`, {
            method: 'POST',
            body: formData,
          })
          
          if (!uploadResponse.ok) {
            throw new Error("Erreur lors de l'upload de l'image")
          }
          
          const uploadResult = await uploadResponse.json()
          console.log('Résultat upload:', uploadResult)
          
          // Mettre à jour l'URL de l'image dans les données
          // Extraire juste le chemin relatif en enlevant l'URL de base si présent
          const imageUrl = uploadResult.url || uploadResult.imageUrl
          // S'assurer que l'URL est bien formatée (juste le chemin relatif)
          const cleanImageUrl = imageUrl.replace(API_BASE_URL, '') // Enlever l'URL de base si présente
          
          // Attention: dans la base de données, la colonne s'appelle 'image' et non 'imageUrl'
          // On va donc ajouter cette propriété pour le backend
          const dataToSend = { ...data, image: cleanImageUrl }
          
          // Remplacer notre objet data par le nouvel objet avec l'attribut 'image'
          Object.assign(data, dataToSend)
          
          console.log("URL de l'image après upload:", cleanImageUrl)
        } catch (error) {
          console.error("Erreur lors de l'upload de l'image:", error)
          // Ne pas définir d'URL d'image par défaut si l'upload échoue
          // L'image restera null côté serveur
        } finally {
          setIsUploading(false)
        }
      }
      
      // Si aucune image n'est sélectionnée et qu'aucune URL d'image n'est définie
      // On laisse l'imageUrl à undefined ou à sa valeur actuelle
      
      // Débug: afficher les données envoyées
      console.log('Données envoyées au serveur:', data)
      
      let apiResponse;
      
      if (isEditMode && destinationId) {
        // Mode édition: mettre à jour une destination existante
        apiResponse = await fetch(`${API_BASE_URL}/api/destinations/${destinationId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify(data),
        })
        
        if (!apiResponse.ok) {
          throw new Error('Erreur lors de la modification de la destination')
        }
        
        toast({
          title: "Succès",
          description: "La destination a été modifiée avec succès.",
        })
      } else {
        // Mode création: créer une nouvelle destination
        apiResponse = await fetch(`${API_BASE_URL}/api/destinations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
          },
          body: JSON.stringify(data),
        })
        
        if (!apiResponse.ok) {
          throw new Error('Erreur lors de la création de la destination')
        }
        
        toast({
          title: "Succès",
          description: "La destination a été créée avec succès.",
        })
      }

      // Rediriger vers la liste des destinations
      router.push('/dashboard/destinations')
    } catch (error: any) {
      console.error("Erreur lors de la création/modification de la destination:", error)
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Gestion du changement d'image
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) return
      
      // Vérification de la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "L'image ne doit pas dépasser 5 MB.",
          variant: "destructive"
        })
        return
      }
      
      // Vérification du type de fichier
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Format non supporté",
          description: "Veuillez sélectionner une image (JPG, PNG, etc.).",
          variant: "destructive"
        })
        return
      }
      
      // Convertir en base64 pour l'aperçu
      const base64 = await imageService.convertToBase64(file)
      setImageFile(file)
      setImagePreview(base64)
    } catch (error) {
      console.error("Erreur lors du traitement de l'image:", error)
    }
  }
  
  // Suppression de l'image sélectionnée
  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    form.setValue('imageUrl', '')
  }

  if (isLoading && isEditMode && !form.formState.isDirty) {
    return (
      <div className="flex items-center justify-center h-full py-12">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-muted-foreground">Chargement de la destination...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">
          {isEditMode ? "Modifier la destination" : "Créer une nouvelle destination"}
        </h2>
        <p className="text-muted-foreground">
          {isEditMode 
            ? "Modifiez les détails de cette destination ci-dessous" 
            : "Remplissez le formulaire ci-dessous pour ajouter une nouvelle destination"}
        </p>
      </div>
      
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log('Formulaire soumis manuellement');
            console.log('Formulaire valide?', form.formState.isValid);
            console.log('Valeurs actuelles du formulaire:', form.getValues());
            console.log('Erreurs de validation:', form.formState.errors);
            
            // Si le formulaire n'est pas valide, tentons une soumission manuelle de toute façon
            if (!form.formState.isValid) {
              console.log('Tentative de soumission malgré validation incorrecte');
              onSubmit(form.getValues() as DestinationFormValues);
            } else {
              // Forcer la soumission manuelle du formulaire
              form.handleSubmit(onSubmit)(e);
            }
          }}
          className="space-y-8"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Nom */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la destination</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Dakar" {...field} />
                  </FormControl>
                  <FormDescription>
                    Entrez un nom significatif pour cette destination.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Pays */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pays</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Sénégal" {...field} />
                  </FormControl>
                  <FormDescription>
                    Pays où se trouve cette destination.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Région/Province */}
            <FormField
              control={form.control}
              name="region"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Région ou Province</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Dakar" {...field} />
                  </FormControl>
                  <FormDescription>
                    Facultatif: précisez la région ou province.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Décrivez cette destination..." 
                      className="min-h-32" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Fournissez une description détaillée et attrayante de cette destination.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {/* Coordonnées */}
            <div className="md:col-span-2 flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="any" 
                        placeholder="Ex: 14.6937" 
                        {...field} 
                        value={field.value || 0}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Coordonnée géographique (facultatif).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="any" 
                        placeholder="Ex: -17.4440" 
                        {...field} 
                        value={field.value || 0}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)}
                      />
                    </FormControl>
                    <FormDescription>
                      Coordonnée géographique (facultatif).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Image */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <Label htmlFor="image">Image de la destination</Label>
                <div className="mt-2">
                  {imagePreview ? (
                    <div className="relative w-full h-48 border-2 border-gray-300 rounded-md overflow-hidden group">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="object-contain w-full h-full" 
                      />
                      {isUploading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                          <div className="flex flex-col items-center space-y-2">
                            <Spinner className="w-8 h-8" />
                            <span className="text-sm">Upload en cours...</span>
                          </div>
                        </div>
                      ) : (
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="icon" 
                            onClick={handleRemoveImage}
                            className="h-8 w-8 rounded-full bg-white text-red-500 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Label 
                      htmlFor="image-upload" 
                      className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
                    >
                      <span className="flex flex-col items-center space-y-2">
                        <ImagePlus className="w-8 h-8 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          Cliquez pour sélectionner une image (JPG, PNG)
                        </span>
                      </span>
                    </Label>
                  )}
                  <Input 
                    id="image-upload"
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <p className="text-xs text-muted-foreground">
                    Format recommandé : JPG ou PNG, ratio 16:9, max 5 MB
                  </p>
                  {!imagePreview && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => document.getElementById('image-upload')?.click()}
                      className="text-xs h-7 px-2"
                    >
                      Parcourir
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Section des points d'intérêt */}
          <div className="space-y-4 mt-6 p-6 border rounded-lg bg-muted/20">
            <h3 className="text-lg font-medium">Points d'intérêt</h3>
            <p className="text-sm text-muted-foreground">
              Ajoutez les points d'intérêt ou attractions notables de cette destination.
            </p>
            
            {/* Liste des points d'intérêt existants */}
            {highlights.length > 0 && (
              <div className="space-y-2 mb-4">
                <h4 className="text-sm font-medium">Points d'intérêt ajoutés ({highlights.length})</h4>
                <div className="space-y-2">
                  {highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start justify-between p-3 bg-background rounded border">
                      <div className="flex items-start space-x-3 flex-1">
                        {highlight.image && (
                          <div className="relative h-24 w-24 rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={highlight.image}
                              alt={highlight.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <div className="space-y-1 flex-1">
                          <h5 className="font-medium">{highlight.name}</h5>
                          <p className="text-sm text-muted-foreground">{highlight.description}</p>
                          {highlight.image && (
                            <p className="text-xs text-gray-400 mt-1">Image: ✓</p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => editHighlight(index)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteHighlight(index)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Formulaire d'ajout/modification de point d'intérêt */}
            <div className="grid gap-4 p-4 border rounded-md bg-background">
              <h4 className="text-sm font-medium">
                {editHighlightIndex !== null ? "Modifier le point d'intérêt" : "Ajouter un point d'intérêt"}
              </h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="highlight-name">Nom du point d'intérêt</Label>
                  <Input
                    id="highlight-name"
                    value={newHighlight.name || ''}
                    onChange={(e) => setNewHighlight({...newHighlight, name: e.target.value})}
                    placeholder="ex: Musée National"
                  />
                </div>
                <div>
                  <Label htmlFor="highlight-description">Description</Label>
                  <Textarea
                    id="highlight-description"
                    value={newHighlight.description || ''}
                    onChange={(e) => setNewHighlight({...newHighlight, description: e.target.value})}
                    placeholder="Une brève description du point d'intérêt"
                    className="min-h-[80px]"
                  />
                </div>
              </div>
              
              {/* Upload d'image pour le point d'intérêt */}
              <div className="space-y-2">
                <Label htmlFor="highlight-image">Image du point d'intérêt</Label>
                <div className="mt-2">
                  {highlightImagePreview || newHighlight.image ? (
                    <div className="relative w-full h-40 border rounded-md overflow-hidden group">
                      <img 
                        src={highlightImagePreview || newHighlight.image} 
                        alt="Aperçu du point d'intérêt" 
                        className="object-cover w-full h-full" 
                      />
                      {isUploadingHighlightImage ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                          <div className="flex flex-col items-center space-y-2">
                            <Spinner className="w-8 h-8" />
                            <span className="text-sm">Upload en cours...</span>
                          </div>
                        </div>
                      ) : (
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            type="button" 
                            variant="destructive" 
                            size="icon" 
                            onClick={handleRemoveHighlightImage}
                            className="h-8 w-8 rounded-full bg-white text-red-500 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Label 
                      htmlFor="highlight-image-upload" 
                      className="flex items-center justify-center w-full h-24 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
                    >
                      <span className="flex flex-col items-center space-y-2">
                        <ImagePlus className="w-6 h-6 text-gray-400" />
                        <span className="text-sm text-gray-500">
                          Sélectionner une image
                        </span>
                      </span>
                    </Label>
                  )}
                  <Input 
                    id="highlight-image-upload"
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                    onChange={handleHighlightImageChange}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                {editHighlightIndex !== null && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setNewHighlight({ name: '', description: '', image: '' })
                      setHighlightImagePreview(null)
                      setHighlightImageFile(null)
                      setEditHighlightIndex(null)
                    }}
                  >
                    Annuler
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  onClick={addHighlight}
                >
                  {editHighlightIndex !== null ? "Mettre à jour" : "Ajouter"}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Boutons de soumission */}
          <div className="flex justify-end gap-4 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push('/dashboard/destinations')}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading && <Spinner className="mr-2 h-4 w-4" />}
              <Save className="mr-2 h-4 w-4" />
              {isEditMode ? "Mettre à jour" : "Créer la destination"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
