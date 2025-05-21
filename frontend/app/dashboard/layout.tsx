import type { Metadata } from "next"
import type { ReactNode } from "react"
import DashboardLayoutClient from "./layout-client"

export const metadata: Metadata = {
  title: "Dashboard - AfricaEvents",
  description: "Gérez vos réservations et votre profil",
}

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <DashboardLayoutClient>
      {children}
    </DashboardLayoutClient>
  )
}
