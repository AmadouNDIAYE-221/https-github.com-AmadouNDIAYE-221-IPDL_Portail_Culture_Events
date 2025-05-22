"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/useAuth"
import { AuthLayout } from "@/components/auth/auth-layout"
import { Spinner } from "@/components/ui/spinner"
import { AtSign, Lock, AlertCircle, CheckCircle2 } from "lucide-react"

export default function LoginPage() {
  const { login, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get("registered")
  const redirectTo = searchParams.get('redirect') || '/dashboard'
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(
    registered ? "Inscription réussie! Veuillez vous connecter." : null
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError("Veuillez remplir tous les champs")
      return
    }

    try {
      await login(email, password)
      // Redirect is handled in the login function of useAuth hook
    } catch (err: any) {
      setError(err.message || "Échec de la connexion. Veuillez réessayer.")
    }
  }

  return (
    <AuthLayout
      title="Bienvenue"
      description="Connectez-vous pour accéder à votre compte et découvrir des événements exceptionnels"
    >
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            {success && (
              <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600 flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p>{success}</p>
              </div>
            )}
            
            <div className="space-y-3">
              <Label htmlFor="email" className="text-base font-medium">Email</Label>
              <div className="relative">
                <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="votre@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 py-6 rounded-lg"
                  autoComplete="email"
                  required 
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-base font-medium">Mot de passe</Label>
                <Link href="#" className="text-sm text-amber-600 hover:text-amber-700 hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 py-6 rounded-lg"
                  autoComplete="current-password"
                  required 
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 my-1">
              <Checkbox 
                id="remember" 
                checked={rememberMe}
                onCheckedChange={(checked) => {
                  if (typeof checked === 'boolean') setRememberMe(checked)
                }}
              />
              <label
                htmlFor="remember"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Se souvenir de moi
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full py-6 text-base font-medium bg-amber-600 hover:bg-amber-700 rounded-lg transition-all duration-300" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-5 w-5 text-white" /> 
                  Connexion en cours...
                </>
              ) : "Se connecter"}
            </Button>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Ou</span>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full py-6 border-gray-300 hover:bg-gray-50 rounded-lg"
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Continuer avec Google
              </Button>
            </div>
            
            <div className="mt-6 text-center">
              <span className="text-gray-600">Pas encore de compte ? </span>
              <Link href="/register" className="text-amber-600 hover:text-amber-700 font-medium hover:underline">
                S'inscrire maintenant
              </Link>
            </div>
        </form>
    </AuthLayout>
  )
}
