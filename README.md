# TemetkezésPro - Multi-Tenant SaaS Platform

Production-ready, moduláris multi-tenant SaaS alaprendszer temetkezési vállalkozók számára.

## Főbb jellemzők

- **Multi-tenant architektúra**: Több temetkezési vállalkozó használhatja ugyanazt a rendszert teljes adatszeparációval
- **Két felület**:
  - **Public**: Lakossági portál partner profil oldalakkal és lead űrlappal
  - **Admin**: Védett adminisztrációs felület lead/ügyfél kezeléssel
- **Moduláris rendszer**: Feature flag alapú modulkezelés (SAP-szerű)
- **GDPR compliant**: Audit log, soft delete, adatkezelési hozzájárulás
- **Role-based access**: owner/admin/staff szerepkörök
- **Email értesítések**: Partner és ügyfél értesítések lead beérkezéskor

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Email**: Resend (fallback: console log dev módban)
- **Deploy**: Vercel + Supabase

## Gyors kezdés

### Előfeltételek

- Node.js 18+
- Supabase projekt
- (Opcionális) Resend API kulcs email küldéshez

### Telepítés

1. **Klónozás és függőségek telepítése**

```bash
git clone <repository-url>
cd temetpromvp
npm install
```

2. **Environment változók beállítása**

Másolja le a `.env.example` fájlt `.env.local` néven és töltse ki:

```bash
cp .env.example .env.local
```

Szükséges változók:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_api_key (opcionális)
```

3. **Adatbázis migráció**

Futtassa a migration fájlokat a Supabase SQL editorban ebben a sorrendben:
- `supabase/migrations/001_initial_schema.sql`
- `supabase/migrations/002_rls_policies.sql`
- `supabase/seed/001_seed_modules.sql`
- `supabase/seed/002_seed_demo_data.sql` (csak dev környezetben)

4. **Fejlesztői szerver indítása**

```bash
npm run dev
```

Nyissa meg a böngészőben: `http://localhost:3000`

## Projekt struktúra

```
temetpromvp/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx             # Public landing page
│   │   ├── p/[slug]/            # Partner profil oldalak
│   │   ├── thanks/              # Lead form sikeres beküldés
│   │   ├── admin/               # Admin felület
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   ├── leads/
│   │   │   ├── clients/
│   │   │   └── settings/
│   │   └── api/
│   │       └── leads/           # Lead creation API
│   ├── components/
│   │   ├── ui/                  # shadcn/ui komponensek
│   │   ├── admin/               # Admin komponensek
│   │   └── public/              # Public komponensek
│   ├── lib/
│   │   ├── supabase/            # Supabase client/server
│   │   ├── auth/                # Auth helpers, permissions
│   │   └── email/               # Email notifications
│   └── types/
│       └── database.types.ts    # Supabase típusok
├── supabase/
│   ├── migrations/              # SQL migration fájlok
│   └── seed/                    # Seed adatok
└── public/
```

## Adatmodell

### Főbb táblák

- **tenants**: Temetkezési vállalkozók (multi-tenant)
- **user_profiles**: Felhasználói profilok (extends Supabase Auth)
- **memberships**: User-tenant kapcsolat + szerepkörök
- **modules**: Modul katalógus
- **tenant_modules**: Tenant-specifikus modul beállítások (feature flags)
- **leads**: Megkeresések (public lead form)
- **clients**: Ügyfelek (lead konverzió)
- **notes**: Megjegyzések (lead/client)
- **tasks**: Teendők (lead/client)
- **audit_log**: Audit log minden változásról

### RLS (Row Level Security)

Minden tábla védett RLS policy-kkal:
- Felhasználók csak a saját tenant_id rekordjait látják
- Public lead create engedélyezve (űrlap beküldéshez)
- Role-based hozzáférés (owner/admin/staff)

## Moduláris rendszer

A rendszer moduláris, SAP-szerű architektúrát követ:

- Modulok: `leads`, `clients`, `contracts`, `invoicing`, `calendar`, `inventory`
- Tenant-szinten kapcsolhatók be/ki
- Admin menü dinamikusan épül a `tenant_modules` alapján
- MVP modulok: `leads`, `clients`

## Lead Flow

1. **Public form beküldés** (`/p/[slug]`)
2. **Lead rekord létrehozása** (status: `new`)
3. **Email értesítések**:
   - Partner: "Új érdeklődés érkezett"
   - Ügyfél: "Köszönjük, hamarosan keresni fogják"
4. **Admin feldolgozás**:
   - Státusz pipeline: `new` → `in_progress` → `waiting` → `closed`
   - Lead konvertálás ügyféllé
5. **Audit log**: Minden változás naplózva

## Email értesítések

- **Resend API** (ha konfigurálva)
- **Fallback**: Console log dev módban
- Partner és ügyfél értesítések lead beküldéskor
- Hibatűrő: email küldési hiba nem blokkol

## Szerepkörök és jogosultságok

- **owner**: Teljes hozzáférés, tenant beállítások módosítása
- **admin**: Lead/client kezelés, user menedzsment
- **staff**: Lead/client kezelés (csak nézés/módosítás)

Helper függvények:
- `requireAuth()`: Bejelentkezett user szükséges
- `requireTenantAccess(tenantId)`: Tenant hozzáférés ellenőrzés
- `requireRole(tenantId, role)`: Szerepkör ellenőrzés

## Következő lépések (Roadmap)

Lásd: `ROADMAP.md`

### Sprint 1: Alapok (Kész)
- ✅ Auth + tenant + public lead flow
- ✅ Admin dashboard
- ✅ Lead management

### Sprint 2: Bővítés
- Notes modul implementálása
- Tasks modul implementálása
- Tenant modules admin UI
- Email értesítések finomhangolása

### Sprint 3: Production-ready
- Audit log UI
- Data export funkciók
- Multi-tenant onboarding flow
- Performance optimalizáció

## Development

```bash
# Fejlesztői szerver
npm run dev

# Build production
npm run build

# Production szerver
npm run start

# Lint
npm run lint

# Supabase típusok generálása
npm run db:types
```

## Deployment

### Vercel

1. Csatlakoztassa a GitHub repository-t Vercel-hez
2. Adja hozzá az environment változókat
3. Deploy

### Supabase

1. Hozzon létre Supabase projektet
2. Futtassa a migration fájlokat
3. Másolja ki a kapcsolódási adatokat

## License

Proprietary - Minden jog fenntartva

## Support

Kérdések és hibák: [GitHub Issues](https://github.com/...)
