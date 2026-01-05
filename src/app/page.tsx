import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">TemetkezésPro</h1>
          <nav className="flex gap-4">
            <Link href="/admin/login">
              <Button variant="ghost">Bejelentkezés</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-slate-900 mb-6">
          Professzionális temetkezési szolgáltatások
        </h2>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Megbízható temetkezési vállalkozók egy helyen. Találja meg a megfelelő partnert az Ön számára.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="#partners">
            <Button size="lg">Partnerek böngészése</Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Megbízható partnerek</CardTitle>
              <CardDescription>
                Csak ellenőrzött és megbízható temetkezési vállalkozók
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Gyors kapcsolatfelvétel</CardTitle>
              <CardDescription>
                Azonnal felveheti a kapcsolatot a kiválasztott partnerrel
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Áttekinthető információk</CardTitle>
              <CardDescription>
                Minden fontos adat egy helyen: elérhetőség, nyitvatartás, szolgáltatások
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Partnereink</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Demo partner card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Varázskő Kft.</CardTitle>
              <CardDescription>Budapest</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">
                Több mint 20 éves tapasztalattal rendelkező temetkezési vállalkozás.
              </p>
              <Link href="/p/varazsko-kft">
                <Button variant="outline" className="w-full">
                  Részletek megtekintése
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-slate-600">
            <p>&copy; 2025 TemetkezésPro. Minden jog fenntartva.</p>
            <div className="mt-4 flex gap-4 justify-center">
              <Link href="/privacy" className="hover:underline">Adatvédelmi tájékoztató</Link>
              <Link href="/terms" className="hover:underline">Felhasználási feltételek</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
