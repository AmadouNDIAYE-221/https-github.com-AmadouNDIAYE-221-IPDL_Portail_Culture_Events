"use client"

import { useState, useEffect } from "react"
import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuLabel } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, CreditCard, LogOut, Settings, User, PlusCircle, ListChecks, Users, Flag, BarChart } from "lucide-react"
import { userService, authService } from "@/lib/api"
import { Spinner } from "@/components/ui/spinner"

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [username, setUsername] = useState("");
  
  useEffect(() => {
    // Verify authentication
    if (!authService.isAuthenticated()) {
      router.push('/login?redirect=/dashboard');
      return;
    }
    
    // Get user profile
    userService.getCurrentUser()
      .then((data: { role?: string; name?: string }) => {
        // Check if user is an organizer
        setIsOrganizer(data.role === 'ORGANIZER');
        setUsername(data.name || 'Utilisateur');
        setIsLoading(false);
      })
      .catch((err: { statusCode?: number; message?: string }) => {
        console.error("Erreur lors de la récupération du profil:", err);
        if (err?.statusCode === 401) {
          // Déconnexion si non autorisé
          authService.logout();
          router.push('/login?redirect=/dashboard');
        }
        setIsLoading(false);
      });
  }, [router]);

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner className="h-8 w-8" />
        <span className="ml-2">Chargement...</span>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[280px_1fr] lg:grid-cols-[280px_1fr]">
        <Sidebar className="hidden border-r md:block">
          <SidebarHeader className="border-b p-6">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-amber-600">AfricaEvents</span>
            </Link>
          </SidebarHeader>
          <SidebarContent className="p-4">
            <SidebarMenu>
              <SidebarMenuLabel>Profile</SidebarMenuLabel>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard">
                    <User className="h-4 w-4 mr-2" />
                    <span>Mon Profil</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/reservations">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Mes Réservations</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="h-4 w-4 mr-2" />
                    <span>Paramètres</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            {isOrganizer && (
              <SidebarMenu>
                <SidebarMenuLabel>Organisateur</SidebarMenuLabel>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/events/create">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      <span>Créer un événement</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/events">
                      <ListChecks className="h-4 w-4 mr-2" />
                      <span>Mes événements</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/tickets">
                      <CreditCard className="h-4 w-4 mr-2" />
                      <span>Ventes de billets</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/events/attendees">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Participants</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/destinations">
                      <Flag className="h-4 w-4 mr-2" />
                      <span>Mes destinations</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/events/statistics">
                      <BarChart className="h-4 w-4 mr-2" />
                      <span>Statistiques</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/destinations/create">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      <span>Créer destination</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            )}
          </SidebarContent>
          <SidebarFooter className="border-t p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <div className="font-medium">{username}</div>
              </div>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 w-full" 
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-6 md:hidden">
            <SidebarTrigger className="mr-4" />
            <Link href="/" className="flex items-center">
              <span className="font-bold text-amber-600">AfricaEvents</span>
            </Link>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
