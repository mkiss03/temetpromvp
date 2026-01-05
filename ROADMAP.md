# TemetkezésPro - Sprint Roadmap

## Sprint 1: Alapok és Public Lead Flow ✅ KÉSZ

**Cél**: Működő multi-tenant alap, public lead form, admin autentikáció

### Feladatok

- [x] Projekt setup (Next.js, TypeScript, Tailwind, shadcn/ui)
- [x] Supabase setup és adatmodell
  - [x] Tenants, users, memberships táblák
  - [x] Modules, tenant_modules
  - [x] Leads tábla
  - [x] RLS policies
- [x] Auth rendszer
  - [x] Supabase Auth integráció
  - [x] Login oldal
  - [x] Permission helpers (requireAuth, requireTenantAccess, hasRole)
- [x] Public felület
  - [x] Landing page (/)
  - [x] Partner profil oldal (/p/[slug])
  - [x] Lead form komponens
  - [x] Thank you page
- [x] Lead API
  - [x] POST /api/leads endpoint
  - [x] Lead validation
  - [x] Email értesítések (Resend + fallback)
- [x] Admin alapok
  - [x] Admin layout + navigáció
  - [x] Dashboard
  - [x] Lead lista
  - [x] Lead részletek

**Definition of Done**:
- Publikus látogató ki tudja tölteni a lead formot
- Partner email értesítést kap új leadről
- Admin be tud jelentkezni és látja a leadeket
- RLS működik, tenant szeparáció érvényes

---

## Sprint 2: Leads & Clients Menedzsment

**Cél**: Teljes lead pipeline + client konverzió + notes/tasks

### Feladatok

- [ ] Lead pipeline fejlesztés
  - [ ] Státusz váltás UI javítása
  - [ ] Lead hozzárendelés felhasználóhoz (assigned_to)
  - [ ] Lead szűrés és keresés
  - [ ] Bulk műveletek (tömeges státusz váltás)
- [ ] Client modul
  - [x] Client lista oldal (kész)
  - [x] Client részletek oldal (kész)
  - [x] Lead → Client konverzió (kész)
  - [ ] Client szerkesztés
  - [ ] Client törlés (soft delete)
- [ ] Notes modul
  - [ ] Note létrehozás (lead/client)
  - [ ] Note lista megjelenítés
  - [ ] Note szerkesztés/törlés
  - [ ] Real-time frissítés (opcionális)
- [ ] Tasks modul
  - [ ] Task létrehozás (lead/client)
  - [ ] Task lista (esedékesség szerint)
  - [ ] Task státusz váltás (pending/completed/cancelled)
  - [ ] Task értesítések
- [ ] Tenant modules admin
  - [ ] Module lista UI
  - [ ] Module ki/bekapcsolás (owner role)
  - [ ] Dinamikus menü építés tenant_modules alapján

**Definition of Done**:
- Lead pipeline teljesen működik (új → folyamatban → várakozik → lezárva)
- Client konverzió működik, kapcsolódó lead linkelt
- Notes és tasks hozzáadhatók lead/client-hez
- Modulok ki/bekapcsolhatók és menü dinamikusan változik

**Becsült időigény**: 2-3 hét

---

## Sprint 3: Production-Ready & Polish

**Cél**: Audit log UI, export, onboarding, production optimalizáció

### Feladatok

- [ ] Audit log UI
  - [ ] Audit log lista oldal
  - [ ] Szűrés (entity type, user, dátum)
  - [ ] Audit részletek (before/after diff)
  - [ ] Export audit log (CSV)
- [ ] Data export
  - [ ] Lead export (CSV/Excel)
  - [ ] Client export (CSV/Excel)
  - [ ] GDPR adatkérés flow
- [ ] Multi-tenant onboarding
  - [ ] Tenant regisztráció flow
  - [ ] Email verifikáció
  - [ ] Onboarding wizard (cégprofil, modulok, első user)
  - [ ] Tenant slug ellenőrzés és foglalás
- [ ] Email értesítések finomhangolása
  - [ ] Email template-ek (HTML, stílusok)
  - [ ] Email preferences (user-level, tenant-level)
  - [ ] Lead assignment email
  - [ ] Task reminder emailek
- [ ] Performance optimalizáció
  - [ ] Server component optimalizáció
  - [ ] Lazy loading
  - [ ] Image optimalizáció
  - [ ] Caching stratégia (Redis opcionális)
- [ ] Security audit
  - [ ] RLS policy review
  - [ ] Input validáció review (XSS, SQL injection)
  - [ ] Rate limiting (API routes)
  - [ ] CSRF protection
- [ ] Dokumentáció
  - [ ] API dokumentáció
  - [ ] Deployment guide
  - [ ] User manual (admin)
  - [ ] Tenant onboarding dokumentáció

**Definition of Done**:
- Audit log teljes és használható
- Adatok exportálhatók
- Új tenant önállóan tud regisztrálni
- Emailek szépen formázottak
- Rendszer gyors és biztonságos
- Dokumentáció teljes

**Becsült időigény**: 3-4 hét

---

## Backlog: Jövőbeli funkciók

### Contracts modul
- Szerződés sablon kezelés
- Szerződés generálás (PDF)
- Digitális aláírás (DocuSign integráció)
- Szerződés státusz követés

### Invoicing modul
- Számla kiállítás
- NAV Online Számla integráció
- Fizetés státusz követés
- Pénzügyi riportok

### Calendar modul
- Esemény/időpont naptár
- Temetési időpontok ütemezése
- Reminder értesítések
- Google Calendar sync

### Inventory modul
- Termék/készlet kezelés (koporsó, urna, koszorú, stb.)
- Készlet riasztások
- Beszállító kezelés
- Rendelés kezelés

### Advanced features
- Multi-user real-time collaboration
- Mobile app (React Native)
- API for third-party integrations
- Advanced analytics & reporting
- AI-powered lead scoring
- WhatsApp/SMS értesítések

---

## Technical Debt és Refactoring

- [ ] Type safety javítása (strict TypeScript)
- [ ] Error boundary komponensek
- [ ] Loading states konzisztencia
- [ ] Form validáció Zod-dal mindenhol
- [ ] Test coverage (unit, integration, E2E)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Internationalization (i18n setup)
- [ ] Monitoring és logging (Sentry, LogRocket)

---

## Release Strategy

### v0.1.0 - MVP (Sprint 1) ✅
- Public lead flow
- Basic admin
- Multi-tenant alap

### v0.2.0 - Lead & Client Management (Sprint 2)
- Teljes lead pipeline
- Client konverzió
- Notes & tasks

### v0.3.0 - Production-Ready (Sprint 3)
- Audit log UI
- Export funkciók
- Onboarding
- Security & performance

### v1.0.0 - First Production Release
- Összes alapmodul (leads, clients, notes, tasks)
- Teljes dokumentáció
- Production deploy
- Monitoring

### v1.1.0+ - Extended Features
- Contracts
- Invoicing
- Calendar
- Inventory
