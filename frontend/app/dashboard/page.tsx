"use client"

import { useState, useEffect, FormEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Spinner } from "@/components/ui/spinner"
import { userService } from "@/lib/api"
import { toast } from "sonner"

interface UserProfile {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  createdAt?: string;
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile>({ name: "", email: "" });
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  // Récupérer les informations de l'utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const userData = await userService.getCurrentUser();
        setUser(userData);
        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.phone || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } catch (error) {
        console.error("Erreur lors de la récupération des informations utilisateur:", error);
        toast.error("Impossible de récupérer vos informations. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleProfileUpdate = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      // Exemple de mise à jour du profil - à adapter selon votre API
      await userService.updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });
      toast.success("Profil mis à jour avec succès");
      
      // Mettre à jour l'état local avec les nouvelles données
      setUser({
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      toast.error("Impossible de mettre à jour votre profil. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: FormEvent) => {
    e.preventDefault();
    
    // Vérifier que les mots de passe correspondent
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    
    try {
      setIsLoading(true);
      // Exemple de mise à jour du mot de passe - à adapter selon votre API
      await userService.updatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      
      toast.success("Mot de passe mis à jour avec succès");
      
      // Réinitialiser les champs de mot de passe
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mot de passe:", error);
      toast.error("Impossible de mettre à jour votre mot de passe. Veuillez vérifier votre mot de passe actuel.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !user.name) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center">
        <Spinner className="h-8 w-8" />
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }

  // Obtenir les initiales pour l'avatar
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-amber-900">Mon profil</h1>
        <p className="text-muted-foreground">Gérez vos informations personnelles et vos préférences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>Mettez à jour vos informations personnelles</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleProfileUpdate}>
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl bg-amber-200 text-amber-900">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <Button type="button" variant="outline" size="sm">
                  Changer la photo
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input 
                  id="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input 
                  id="phone" 
                  value={formData.phone} 
                  onChange={handleInputChange} 
                />
              </div>

              <Button 
                type="submit" 
                className="bg-amber-600 hover:bg-amber-700" 
                disabled={isLoading}
              >
                {isLoading ? <Spinner className="h-4 w-4 mr-2" /> : null}
                Enregistrer les modifications
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sécurité</CardTitle>
            <CardDescription>Mettez à jour votre mot de passe</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handlePasswordUpdate}>
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input 
                  id="currentPassword" 
                  type="password" 
                  value={formData.currentPassword} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input 
                  id="newPassword" 
                  type="password" 
                  value={formData.newPassword} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={formData.confirmPassword} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <Button 
                type="submit" 
                className="bg-amber-600 hover:bg-amber-700" 
                disabled={isLoading}
              >
                {isLoading ? <Spinner className="h-4 w-4 mr-2" /> : null}
                Changer le mot de passe
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
