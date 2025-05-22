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
import { AlertCircle, User, Mail, Lock, Phone, Users } from "lucide-react"
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
      title="Rejoignez notre communauté"
      description="Créez votre compte pour vivre des expériences culturelles uniques"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-3">
            <Label htmlFor="firstName" className="text-base font-medium">Prénom</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input 
                id="firstName" 
                placeholder="Prénom" 
                required 
                className="pl-10 py-6 rounded-lg"
                value={formData.firstName}
                onChange={handleInputChange}
                autoComplete="given-name"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="lastName" className="text-base font-medium">Nom</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <Input 
                id="lastName" 
                placeholder="Nom" 
                required 
                className="pl-10 py-6 rounded-lg"
                value={formData.lastName}
                onChange={handleInputChange}
                autoComplete="family-name"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="email" className="text-base font-medium">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <Input 
              id="email" 
              type="email" 
              placeholder="votre@email.com" 
              required 
              className="pl-10 py-6 rounded-lg"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="email"
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="phone" className="text-base font-medium">Téléphone <span className="text-sm text-gray-500 font-normal">(optionnel)</span></Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <Input 
              id="phone" 
              type="tel" 
              placeholder="+221 XX XXX XX XX" 
              className="pl-10 py-6 rounded-lg"
              value={formData.phone}
              onChange={handleInputChange}
              autoComplete="tel"
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="userType" className="text-base font-medium">Type d'utilisateur</Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5 z-10" />
            <Select 
              defaultValue="visitor" 
              onValueChange={handleRoleChange}
            >
              <SelectTrigger id="userType" className="pl-10 py-6 rounded-lg">
                <SelectValue placeholder="Sélectionnez votre profil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visitor">Visiteur / Touriste</SelectItem>
                <SelectItem value="organizer">Organisateur d'événements</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="password" className="text-base font-medium">Mot de passe</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <Input 
              id="password" 
              type="password" 
              required 
              className="pl-10 py-6 rounded-lg"
              value={formData.password}
              onChange={handleInputChange}
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <p className="text-xs text-gray-500">Le mot de passe doit contenir au moins 6 caractères</p>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="confirm-password" className="text-base font-medium">Confirmer le mot de passe</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <Input 
              id="confirm-password" 
              type="password" 
              required 
              className="pl-10 py-6 rounded-lg"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              autoComplete="new-password"
            />
          </div>
        </div>
        
        <div className="mt-8">
          <Button 
            type="submit" 
            className="w-full py-6 text-base font-medium bg-amber-600 hover:bg-amber-700 rounded-lg transition-all duration-300" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner className="mr-2 h-5 w-5 text-white" />
                Inscription en cours...
              </>
            ) : (
              "Créer mon compte"
            )}
          </Button>
        </div>
        
        <div className="text-center mt-6">
          <span className="text-gray-600">Vous avez déjà un compte ? </span>
          <Link href="/login" className="text-amber-600 hover:text-amber-700 font-medium hover:underline">
            Se connecter ici
          </Link>
        </div>
        
        <p className="text-xs text-gray-500 text-center mt-6">
          En vous inscrivant, vous acceptez nos{" "}
          <Link href="#" className="text-amber-600 hover:underline">
            Conditions d'utilisation
          </Link>{" "}
          et notre{" "}
          <Link href="#" className="text-amber-600 hover:underline">
            Politique de confidentialité
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
