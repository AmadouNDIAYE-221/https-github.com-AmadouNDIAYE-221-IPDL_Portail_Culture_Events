import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AfricaEvents - Découvrez la richesse culturelle africaine",
  description: "Portail de promotion du tourisme culturel et événementiel au Sénégal et en Afrique",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6 bg-amber-50">
              <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
                <p className="text-center text-sm text-muted-foreground">
                  © {new Date().getFullYear()} AfricaEvents. Tous droits réservés.
                </p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <a href="#" className="hover:text-foreground">
                    À propos
                  </a>
                  <a href="#" className="hover:text-foreground">
                    Contact
                  </a>
                  <a href="#" className="hover:text-foreground">
                    Confidentialité
                  </a>
                  <a href="#" className="hover:text-foreground">
                    Conditions d'utilisation
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
