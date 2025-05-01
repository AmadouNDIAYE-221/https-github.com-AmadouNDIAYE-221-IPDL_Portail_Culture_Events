import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function DashboardPage() {
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
            <form className="space-y-4">
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl bg-amber-200 text-amber-900">UN</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  Changer la photo
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input id="name" defaultValue="Utilisateur Test" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="utilisateur@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" defaultValue="+221 77 123 45 67" />
              </div>

              <Button className="bg-amber-600 hover:bg-amber-700">Enregistrer les modifications</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sécurité</CardTitle>
            <CardDescription>Mettez à jour votre mot de passe</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input id="current-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input id="new-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input id="confirm-password" type="password" />
              </div>

              <Button className="bg-amber-600 hover:bg-amber-700">Changer le mot de passe</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
