"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { UserNav } from "@/components/user-nav"

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-amber-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-bold text-xl text-amber-900">
            AfricaEvents
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${pathname === "/" ? "text-amber-900" : "text-muted-foreground hover:text-amber-900"}`}
            >
              Accueil
            </Link>
            <Link
              href="/events"
              className={`text-sm font-medium transition-colors ${pathname.startsWith("/events") ? "text-amber-900" : "text-muted-foreground hover:text-amber-900"}`}
            >
              Événements
            </Link>
            <Link
              href="/destinations"
              className={`text-sm font-medium transition-colors ${pathname.startsWith("/destinations") ? "text-amber-900" : "text-muted-foreground hover:text-amber-900"}`}
            >
              Destinations
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors ${pathname.startsWith("/about") ? "text-amber-900" : "text-muted-foreground hover:text-amber-900"}`}
            >
              À propos
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" className="hidden md:flex">
            <Search className="h-4 w-4" />
            <span className="sr-only">Rechercher</span>
          </Button>
          <UserNav />
        </div>
      </div>
    </header>
  )
}
