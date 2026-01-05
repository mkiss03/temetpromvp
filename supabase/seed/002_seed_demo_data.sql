-- WARNING: This is demo data for development purposes only
-- DO NOT run this in production!

-- Create demo tenant
INSERT INTO tenants (
  id,
  name,
  slug,
  email,
  phone,
  address,
  city,
  postal_code,
  description,
  opening_hours,
  is_active
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Varázskő Kft.',
  'varazsko-kft',
  'info@varazsko.hu',
  '+36 1 234 5678',
  'Fő utca 123',
  'Budapest',
  '1011',
  'Több mint 20 éves tapasztalattal rendelkező temetkezési vállalkozás. Családias légkör, személyre szabott szolgáltatások. Gondoskodunk szerettei méltó búcsúztatásáról.',
  '{
    "Hétfő": "8:00 - 18:00",
    "Kedd": "8:00 - 18:00",
    "Szerda": "8:00 - 18:00",
    "Csütörtök": "8:00 - 18:00",
    "Péntek": "8:00 - 18:00",
    "Szombat": "9:00 - 14:00",
    "Vasárnap": "Zárva"
  }'::jsonb,
  true
);

-- Note: User profiles are created in Supabase Auth
-- After creating users in auth, you need to manually insert into user_profiles
-- and create memberships

-- Example of what needs to be done after user creation:
--
-- INSERT INTO user_profiles (id, full_name, phone) VALUES
--   ('user-uuid-from-auth', 'Demo Tulajdonos', '+36 30 123 4567');
--
-- INSERT INTO memberships (user_id, tenant_id, role, is_active) VALUES
--   ('user-uuid-from-auth', '00000000-0000-0000-0000-000000000001', 'owner', true);

-- Enable default modules for demo tenant
INSERT INTO tenant_modules (tenant_id, module_id, is_enabled)
SELECT
  '00000000-0000-0000-0000-000000000001',
  id,
  default_enabled
FROM modules;

-- Create demo leads
INSERT INTO leads (
  tenant_id,
  full_name,
  email,
  phone,
  city,
  message,
  status,
  gdpr_consent,
  gdpr_consent_at
) VALUES
(
  '00000000-0000-0000-0000-000000000001',
  'Kiss János',
  'kiss.janos@example.com',
  '+36 30 111 2222',
  'Budapest',
  'Szeretnék tájékoztatást kérni a temetési szolgáltatásaikról. Édesapám elhunyt és segítségre van szükségünk.',
  'new',
  true,
  NOW()
),
(
  '00000000-0000-0000-0000-000000000001',
  'Nagy Éva',
  'nagy.eva@example.com',
  '+36 20 333 4444',
  'Budaörs',
  'Előre terveznék, kérnék árajánlatot a szolgáltatásokról.',
  'in_progress',
  true,
  NOW() - INTERVAL '2 days'
);
