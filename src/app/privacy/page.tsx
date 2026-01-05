import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost">← Vissza a főoldalra</Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Adatkezelési tájékoztató</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <p className="text-slate-600 mb-6">
              Utolsó frissítés: 2025. január
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Adatkezelő</h2>
            <p>
              A TemetkezésPro platform üzemeltetője és az adatkezelő a partnereink nevében eljárva.
              Az űrlapon megadott adatokat közvetlenül a kiválasztott temetkezési vállalkozó
              (a továbbiakban: Partner) részére továbbítjuk.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Kezelt adatok</h2>
            <p>Az érdeklődési űrlapon az alábbi adatokat kérjük meg:</p>
            <ul>
              <li>Név</li>
              <li>Telefonszám</li>
              <li>E-mail cím (opcionális)</li>
              <li>Település</li>
              <li>Üzenet tartalma</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Adatkezelés célja</h2>
            <p>
              Az adatkezelés célja kizárólag a Partner és az érdeklődő közötti kapcsolatfelvétel
              elősegítése. Az adatokat a kiválasztott Partner kapja meg, aki közvetlenül
              felveszi Önnel a kapcsolatot.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Adatkezelés jogalapja</h2>
            <p>
              Az adatkezelés jogalapja az Ön önkéntes hozzájárulása (GDPR 6. cikk (1) bekezdés a) pont),
              amelyet az űrlap elküldésével ad meg.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Adatok tárolása</h2>
            <p>
              Az adatokat a Partner rendszerében tároljuk. Az adatok törlésére vonatkozó kérelmét
              közvetlenül a Partnernél kezdeményezheti.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">6. Adatbiztonság</h2>
            <p>
              Az adatokat biztonságos szervereken tároljuk, titkosított kapcsolaton keresztül továbbítjuk.
              Az adatokhoz csak jogosult személyek férhetnek hozzá.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">7. Az érintett jogai</h2>
            <p>Ön jogosult:</p>
            <ul>
              <li>Tájékoztatást kérni az adatairól</li>
              <li>Kérni adatai helyesbítését</li>
              <li>Kérni adatai törlését</li>
              <li>Tiltakozni az adatkezelés ellen</li>
              <li>Adathordozhatóságot kérni</li>
              <li>Panaszt tenni a felügyeleti hatóságnál (NAIH)</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-8 mb-4">8. Kapcsolat</h2>
            <p>
              Adatkezeléssel kapcsolatos kérdéseivel forduljon közvetlenül a kiválasztott Partnerhez,
              akinek elérhetőségeit a profil oldalán találja.
            </p>

            <div className="mt-12 pt-6 border-t">
              <Link href="/">
                <Button>Vissza a főoldalra</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
