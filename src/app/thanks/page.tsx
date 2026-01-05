import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function ThanksPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 text-green-600">
            <CheckCircle className="h-full w-full" />
          </div>
          <CardTitle className="text-2xl">Köszönjük megkeresését!</CardTitle>
          <CardDescription>
            Üzenetét sikeresen megkaptuk.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600 text-center">
            A kiválasztott partner hamarosan felveszi Önnel a kapcsolatot a megadott elérhetőségeken.
          </p>
          <p className="text-sm text-slate-600 text-center">
            E-mailben is küldtünk egy visszaigazolást.
          </p>
          <div className="pt-4">
            <Link href="/">
              <Button variant="outline" className="w-full">
                Vissza a főoldalra
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
