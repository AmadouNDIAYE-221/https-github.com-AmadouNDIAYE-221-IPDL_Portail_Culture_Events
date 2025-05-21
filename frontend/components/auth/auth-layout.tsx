import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

/**
 * Composant layout pour les pages d'authentification
 * À utiliser à l'intérieur des pages de connexion et d'inscription
 */
export function AuthLayout({
  children,
  title,
  description
}: {
  children: React.ReactNode
  title: string
  description: string
}) {
  return (
    <>
      {/* Ce script cache la navbar principale sur les pages d'auth */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            const navbar = document.querySelector('nav');
            if (navbar) {
              navbar.style.display = 'none';
            }
          });
        `
      }} />
      
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center px-4 py-8 md:px-6 md:py-12">
        <div className="mx-auto w-full max-w-lg">
          {/* En-tête simplifié */}
          <header className="mb-8 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-amber-900">AfricaEvents</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link 
                href={title.includes("Connexion") ? "/register" : "/login"} 
                className="text-sm font-medium"
              >
                <Button variant="ghost">
                  {title.includes("Connexion") ? "S'inscrire" : "Se connecter"}
                </Button>
              </Link>
            </div>
          </header>
          
          {/* Contenu du formulaire */}
          <div className="rounded-lg border bg-card p-8 shadow-sm">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-amber-900">{title}</h1>
              <p className="text-muted-foreground">{description}</p>
            </div>
            {children}
          </div>
          
          {/* Footer simplifié */}
          <footer className="mt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} AfricaEvents. Tous droits réservés.
          </footer>
        </div>
      </div>
    </>
  )
}
