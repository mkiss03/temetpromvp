# TemetkezésPro - File Tree

```
temetpromvp/
├── .env.example                         # Environment változók minta
├── .eslintrc.json                       # ESLint konfiguráció
├── .gitignore                           # Git ignore fájl
├── components.json                      # shadcn/ui konfiguráció
├── next.config.js                       # Next.js konfiguráció
├── package.json                         # NPM dependencies
├── postcss.config.js                    # PostCSS konfiguráció
├── tsconfig.json                        # TypeScript konfiguráció
├── tailwind.config.ts                   # Tailwind CSS konfiguráció
│
├── README.md                            # Projekt dokumentáció
├── SETUP.md                             # Setup útmutató
├── ROADMAP.md                           # Sprint roadmap
├── FILE_TREE.md                         # Ez a fájl
│
├── src/
│   ├── app/                             # Next.js App Router
│   │   ├── layout.tsx                   # Root layout
│   │   ├── page.tsx                     # Public landing page
│   │   ├── globals.css                  # Global CSS
│   │   │
│   │   ├── p/                           # Partner profil oldalak
│   │   │   └── [slug]/
│   │   │       └── page.tsx             # Partner profil dinamikus oldal
│   │   │
│   │   ├── thanks/                      # Thank you page
│   │   │   └── page.tsx
│   │   │
│   │   ├── privacy/                     # Adatvédelmi tájékoztató
│   │   │   └── page.tsx
│   │   │
│   │   ├── admin/                       # Admin felület (védett)
│   │   │   ├── layout.tsx               # Admin layout + auth check
│   │   │   │
│   │   │   ├── login/
│   │   │   │   └── page.tsx             # Login oldal
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx             # Dashboard (statisztikák, recent leads)
│   │   │   │
│   │   │   ├── leads/
│   │   │   │   ├── page.tsx             # Lead lista
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx         # Lead részletek + státusz + konverzió
│   │   │   │
│   │   │   ├── clients/
│   │   │   │   ├── page.tsx             # Client lista
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx         # Client részletek
│   │   │   │
│   │   │   └── settings/
│   │   │       └── page.tsx             # Tenant settings (cégprofil)
│   │   │
│   │   └── api/                         # API Routes
│   │       └── leads/
│   │           └── route.ts             # POST /api/leads (public lead form)
│   │
│   ├── components/
│   │   ├── ui/                          # shadcn/ui komponensek
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── checkbox.tsx
│   │   │   └── badge.tsx
│   │   │
│   │   ├── admin/                       # Admin komponensek
│   │   │   ├── admin-nav.tsx            # Admin navigációs menü
│   │   │   ├── lead-status-update.tsx   # Lead státusz váltó
│   │   │   ├── convert-to-client-button.tsx  # Lead → Client konverzió
│   │   │   └── tenant-settings-form.tsx # Tenant beállítások form
│   │   │
│   │   └── public/                      # Public komponensek
│   │       └── lead-form.tsx            # Public lead érdeklődési form
│   │
│   ├── lib/
│   │   ├── supabase/                    # Supabase client/server
│   │   │   ├── client.ts                # Browser client
│   │   │   ├── server.ts                # Server client
│   │   │   └── middleware.ts            # Auth middleware
│   │   │
│   │   ├── auth/                        # Auth helpers
│   │   │   ├── permissions.ts           # Permission helpers (requireAuth, hasRole)
│   │   │   └── audit.ts                 # Audit log helpers
│   │   │
│   │   ├── email/                       # Email értesítések
│   │   │   └── notifications.ts         # Lead notification emailek
│   │   │
│   │   └── utils.ts                     # Utility functions (cn, formatDate)
│   │
│   ├── types/
│   │   └── database.types.ts            # Supabase generated types
│   │
│   └── middleware.ts                    # Next.js middleware (Supabase auth)
│
├── supabase/
│   ├── migrations/                      # SQL migration fájlok
│   │   ├── 001_initial_schema.sql       # Adatbázis schema (tables, enums, triggers)
│   │   └── 002_rls_policies.sql         # Row Level Security policies
│   │
│   └── seed/                            # Seed adatok
│       ├── 001_seed_modules.sql         # Modul katalógus
│       └── 002_seed_demo_data.sql       # Demo tenant + leads (csak dev!)
│
└── public/                              # Static files (képek, favicon, stb.)
```

## Főbb mappák magyarázata

### `/src/app`
Next.js 14 App Router alapú routing. Minden mappa egy route.

- **Public routes**: `/`, `/p/[slug]`, `/thanks`, `/privacy`
- **Admin routes**: `/admin/*` (védett, auth szükséges)
- **API routes**: `/api/leads` (public lead form submission)

### `/src/components`
React komponensek három kategóriában:
- **ui/**: shadcn/ui komponensek (button, card, input, stb.)
- **admin/**: Admin-specifikus komponensek
- **public/**: Public-specifikus komponensek

### `/src/lib`
Utility-k és library kód:
- **supabase/**: Supabase client setup (browser/server/middleware)
- **auth/**: Autentikációs és permission helpers
- **email/**: Email notification logika

### `/supabase`
Adatbázis migrations és seed adatok:
- **migrations/**: SQL migration fájlok (schema + RLS)
- **seed/**: Seed adatok (modulok + demo tenant)

## Routing struktúra

### Public routes
```
/                          → Landing page
/p/[slug]                  → Partner profil + lead form
/thanks                    → Thank you page (lead form után)
/privacy                   → Adatvédelmi tájékoztató
```

### Admin routes (auth required)
```
/admin/login               → Login page
/admin/dashboard           → Dashboard (statisztikák)
/admin/leads               → Lead lista
/admin/leads/[id]          → Lead részletek
/admin/clients             → Client lista
/admin/clients/[id]        → Client részletek
/admin/settings            → Tenant settings
```

### API routes
```
POST /api/leads            → Public lead form submission
```

## Adatbázis táblák

```
tenants              → Temetkezési vállalkozók
user_profiles        → User profilok (extends Supabase Auth)
memberships          → User-tenant kapcsolat + role
modules              → Modul katalógus
tenant_modules       → Tenant-specifikus modul config
leads                → Megkeresések
clients              → Ügyfelek
notes                → Megjegyzések (lead/client)
tasks                → Teendők (lead/client)
audit_log            → Audit log (minden változás)
```

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Email**: Resend
- **Deployment**: Vercel (frontend) + Supabase (backend)

## Moduláris architektúra

A rendszer moduláris, SAP-szerű architektúrát követ:
- Modulok: `leads`, `clients`, `contracts`, `invoicing`, `calendar`, `inventory`
- Tenant-szinten kapcsolhatók be/ki (`tenant_modules` tábla)
- Admin menü dinamikusan épül a modul konfigurációból
- MVP: `leads` és `clients` modulok

## Multi-tenant

- Teljes tenant szeparáció RLS-sel
- Minden tábla tartalmaz `tenant_id` mezőt
- User több tenanthoz tartozhat (memberships)
- Permission helpers automatikusan ellenőrzik a tenant hozzáférést
