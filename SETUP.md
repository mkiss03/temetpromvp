# TemetkezésPro - Setup Guide

Ez a dokumentum lépésről lépésre végigvezet a projekt első indításán.

## 1. Előfeltételek ellenőrzése

```bash
node --version  # v18 vagy újabb
npm --version   # v9 vagy újabb
```

## 2. Függőségek telepítése

```bash
npm install
```

## 3. Supabase projekt létrehozása

1. Menj a https://supabase.com oldalra
2. Jelentkezz be vagy regisztrálj
3. Hozz létre egy új projektet
4. Várd meg, amíg a projekt inicializálódik (~2 perc)

## 4. Environment változók

1. Másolás:
```bash
cp .env.example .env.local
```

2. Supabase adatok kitöltése:
   - Menj a Supabase projekt Settings > API oldalára
   - Másold ki a `Project URL`-t → `NEXT_PUBLIC_SUPABASE_URL`
   - Másold ki a `anon/public` kulcsot → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Másold ki a `service_role` kulcsot → `SUPABASE_SERVICE_ROLE_KEY`

3. (Opcionális) Resend API kulcs:
   - Menj a https://resend.com oldalra
   - Regisztrálj és szerezz API kulcsot
   - Másold be a `RESEND_API_KEY` változóba
   - Ha nincs Resend, az emailek konzolra kerülnek (dev mód)

## 5. Adatbázis migráció

1. Menj a Supabase projekt SQL Editor oldalára
2. Futtasd sorrendben az alábbi SQL fájlokat:

### 5.1. Schema létrehozása
Másold be és futtasd: `supabase/migrations/001_initial_schema.sql`

### 5.2. RLS policies
Másold be és futtasd: `supabase/migrations/002_rls_policies.sql`

### 5.3. Modulok feltöltése
Másold be és futtasd: `supabase/seed/001_seed_modules.sql`

### 5.4. (Opcionális) Demo adatok
**FIGYELEM**: Csak development környezetben!
Másold be és futtasd: `supabase/seed/002_seed_demo_data.sql`

## 6. Első felhasználó létrehozása

### 6.1. Supabase Dashboard Authentication
1. Menj a Supabase projekt Authentication > Users oldalára
2. Kattints az "Add user" gombra
3. Add meg:
   - Email: `demo@varazsko.hu`
   - Password: `demo123456`
   - Auto Confirm User: **IGEN**

### 6.2. User profile létrehozása
Menj a SQL Editor-ba és futtasd:

```sql
-- Cseréld ki a 'USER_UUID_FROM_AUTH'-t a valódi UUID-re az Authentication > Users oldalról

-- User profile létrehozása
INSERT INTO user_profiles (id, full_name, phone) VALUES
  ('USER_UUID_FROM_AUTH', 'Demo Tulajdonos', '+36 30 123 4567');

-- Membership létrehozása (hozzárendelés a demo tenanthoz)
INSERT INTO memberships (user_id, tenant_id, role, is_active) VALUES
  ('USER_UUID_FROM_AUTH', '00000000-0000-0000-0000-000000000001', 'owner', true);
```

## 7. Fejlesztői szerver indítása

```bash
npm run dev
```

Nyisd meg a böngészőben: http://localhost:3000

## 8. Bejelentkezés tesztelése

1. Menj a http://localhost:3000/admin/login oldalra
2. Jelentkezz be:
   - Email: `demo@varazsko.hu`
   - Password: `demo123456`
3. Ha minden jól ment, átirányít a dashboard-ra

## 9. Public oldal tesztelése

1. Menj a http://localhost:3000/p/varazsko-kft oldalra
2. Töltsd ki a lead formot
3. Ellenőrizd:
   - Admin dashboard-on megjelenik az új lead
   - Konzolban látható az email log (ha nincs Resend)

## 10. Hibakeresés

### "Invalid JWT" hiba
- Ellenőrizd, hogy a `NEXT_PUBLIC_SUPABASE_ANON_KEY` helyes-e
- Töröld a böngésző sütiket és próbáld újra

### "Row Level Security" hiba
- Ellenőrizd, hogy a RLS policies fájl lefutott-e
- Ellenőrizd, hogy a membership rekord létrejött-e

### Lead form nem működik
- Ellenőrizd, hogy a `tenants` táblában van-e a demo tenant
- Ellenőrizd a böngésző konzolt hibákért

### Email nem érkezik
- Normális, ha nincs Resend API kulcs beállítva
- Dev módban az emailek a szerveroldali konzolra kerülnek
- Nézd meg a `npm run dev` kimenetet

## 11. Következő lépések

- Olvasd el a `README.md`-t a funkciók megismeréséhez
- Nézd meg a `ROADMAP.md`-t a tervezett fejlesztésekhez
- Kezdj el fejleszteni a Sprint 2 ticketek alapján

## Gyakori kérdések

**Q: Hogyan hozhatok létre új tenantet?**
A: Jelenleg manuálisan SQL-lel. A Sprint 3-ban lesz onboarding UI.

**Q: Hogyan adhatok hozzá új felhasználót?**
A:
1. Supabase Auth > Add user
2. SQL-lel user_profile és membership rekord

**Q: Működik production-ben?**
A: Igen, de előtte töröld a demo adatokat és állítsd be a production környezetet.

**Q: Mi a tenant slug?**
A: A partner egyedi azonosítója az URL-ben (pl. `/p/varazsko-kft`)

---

**Support**: Ha elakadtál, nézd meg a GitHub Issues-t vagy keresd a dokumentációt.
