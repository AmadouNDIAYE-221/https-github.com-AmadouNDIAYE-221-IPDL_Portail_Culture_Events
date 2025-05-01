import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Calendar, CreditCard, LogOut, Settings, User } from "lucide-react"

export const metadata: Metadata = {
  title: "Dashboard - AfricaEvents",
  description: "Gérez vos réservations et votre profil",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4 py-2">
              <Link href="/" className="font-bold text-xl text-amber-900">
                AfricaEvents
              </Link>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard">
                    <User className="h-4 w-4" />
                    <span>Mon profil</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/reservations">
                    <Calendar className="h-4 w-4" />
                    <span>Mes réservations</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/payments">
                    <CreditCard className="h-4 w-4" />
                    <span>Paiements</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/settings">
                    <Settings className="h-4 w-4" />
                    <span>Paramètres</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/">
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Link>
            </Button>
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1">
          <div className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-amber-50 px-4 md:px-6">
            <SidebarTrigger />
            <div className="font-semibold text-amber-900">Tableau de bord</div>
          </div>
          <div className="p-4 md:p-6">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  )
}
