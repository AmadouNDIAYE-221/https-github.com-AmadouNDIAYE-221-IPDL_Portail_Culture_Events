import React from "react"
import Link from "next/link"
import Image from "next/image"
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
      
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-[1100px] grid md:grid-cols-2 shadow-xl rounded-2xl overflow-hidden bg-white">
          {/* Panneau visuel à gauche */}
          <div className="hidden md:flex relative overflow-hidden bg-amber-800">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-800/90 to-amber-950/80 z-10"></div>
            <Image 
              src="/placeholder.svg?height=1080&width=800"
              alt="Évènements culturels africains"
              fill
              className="object-cover"
              priority
            />
            <div className="relative z-20 flex flex-col justify-between p-12 h-full">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white">AfricaEvents</span>
              </Link>
              
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-white">Découvrez la richesse culturelle du Sénégal</h2>
                <p className="text-amber-100 text-lg">Rejoignez notre communauté pour vivre des expériences culturelles authentiques.</p>
                <div className="flex space-x-4 pt-4">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-amber-600 bg-amber-200 flex items-center justify-center text-amber-900 font-semibold text-sm">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-amber-100">
                    <p>Rejoignez plus de <span className="font-bold">2,000+</span> utilisateurs</p>
                  </div>
                </div>
              </div>
              
              <div className="text-amber-200 text-sm">
                © {new Date().getFullYear()} AfricaEvents. Tous droits réservés.
              </div>
            </div>
          </div>
          
          {/* Formulaire à droite */}
          <div className="p-6 md:p-10 flex flex-col">
            <div className="flex items-center justify-between mb-6 md:hidden">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-xl font-bold text-amber-900">AfricaEvents</span>
              </Link>
              <Link 
                href={title.includes("Connexion") ? "/register" : "/login"} 
                className="text-sm font-medium"
              >
                <Button variant="ghost" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                  {title.includes("Connexion") ? "S'inscrire" : "Se connecter"}
                </Button>
              </Link>
            </div>
            
            <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{title}</h1>
                <p className="text-gray-600">{description}</p>
              </div>
              
              {children}
              
              <div className="hidden md:flex justify-between items-center mt-10 pt-6 border-t border-gray-100 text-sm text-gray-500">
                <p>© {new Date().getFullYear()} AfricaEvents</p>
                <div className="flex space-x-4">
                  <Link href="#" className="hover:text-amber-600">Conditions</Link>
                  <Link href="#" className="hover:text-amber-600">Vie privée</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
