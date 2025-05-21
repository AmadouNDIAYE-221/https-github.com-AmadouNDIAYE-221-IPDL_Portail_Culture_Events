"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Spinner } from "@/components/ui/spinner"
import { authService } from "@/lib/api"
import { AlertCircle } from "lucide-react"
import { AuthLayout } from "@/components/auth/auth-layout"

export default function RegisterPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/dashboard'
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',  // Ajout du champ phone
    role: 'VISITOR' // valeur par défaut
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    // Gestion spéciale pour le nom complet qui est divisé en prénom et nom
    if (id === 'name') {
      const nameParts = value.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      setFormData(prev => ({
        ...prev,
        firstName,
        lastName
      }));
    } else if (id === 'password' || id === 'confirm-password') {
      setFormData(prev => ({
        ...prev,
        [id === 'confirm-password' ? 'confirmPassword' : 'password']: value
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [id]: value
      }));
    }
  };

  const handleRoleChange = (value: string) => {
    // Convertir le type d'utilisateur à un rôle approprié pour l'API
    const role = value === 'organizer' ? 'ORGANIZER' : 'VISITOR';
    setFormData(prev => ({
      ...prev,
      role
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validations
    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    
    if (formData.password.length < 6) {
      setError("Le mot de passe doit comporter au moins 6 caractères");
      return;
    }
    
    if (!formData.firstName || !formData.lastName) {
      setError("Veuillez saisir votre nom complet");
      return;
    }

    try {
      setIsLoading(true);
      
      // Préparer les données pour l'API en adaptant au format attendu par le backend
      const registrationData = {
        name: `${formData.firstName} ${formData.lastName}`, // Combine firstName et lastName
        email: formData.email,
        password: formData.password,
        phone: formData.phone || "", // Ajoute le champ phone (vide par défaut)
        role: formData.role
      };
      
      // Appeler l'API d'inscription
      await authService.register(registrationData);
      
      // Afficher un toast de succès
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter."
      });
      
      // Rediriger vers la page de connexion
      router.push(`/login?redirect=${redirectTo}`);
    } catch (err: any) {
      console.error("Erreur d'inscription:", err);
      setError(err.message || "Une erreur s'est produite lors de l'inscription. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Créer un compte"
      description="Inscrivez-vous pour accéder à toutes les fonctionnalités"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input 
              id="firstName" 
              placeholder="Prénom" 
              required 
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input 
              id="lastName" 
              placeholder="Nom" 
              required 
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="votre@email.com" 
            required 
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="userType">Type d'utilisateur</Label>
          <Select 
            defaultValue="visitor" 
            onValueChange={handleRoleChange}
          >
            <SelectTrigger id="userType">
              <SelectValue placeholder="Sélectionnez votre profil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="visitor">Visiteur / Touriste</SelectItem>
              <SelectItem value="organizer">Organisateur d'événements</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input 
            id="password" 
            type="password" 
            required 
            value={formData.password}
            onChange={handleInputChange}
            minLength={6}
          />
          <p className="text-xs text-muted-foreground">Le mot de passe doit contenir au moins 6 caractères</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
          <Input 
            id="confirm-password" 
            type="password" 
            required 
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
        </div>
        <Button 
          type="submit" 
          className="w-full bg-amber-600 hover:bg-amber-700 mt-6" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Inscription en cours...
            </>
          ) : (
            "S'inscrire"
          )}
        </Button>
        <div className="text-sm text-muted-foreground text-center mt-4">
          Vous avez déjà un compte ?{" "}
          <Link href="/login" className="font-medium text-primary underline">
            Se connecter
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}
