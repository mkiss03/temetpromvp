-- Insert default modules
INSERT INTO modules (code, name, description, icon, default_enabled, display_order) VALUES
  ('leads', 'Megkeresések', 'Lead menedzsment és pipeline kezelés', 'Users', true, 1),
  ('clients', 'Ügyfelek', 'Ügyfélkezelés és adatbázis', 'UserCheck', true, 2),
  ('contracts', 'Szerződések', 'Szerződések és dokumentumok kezelése', 'FileText', false, 3),
  ('invoicing', 'Számlázás', 'Számlák kiállítása és pénzügyek', 'Receipt', false, 4),
  ('calendar', 'Naptár', 'Események és időpontok kezelése', 'Calendar', false, 5),
  ('inventory', 'Raktár', 'Készlet és termékmenedzsment', 'Package', false, 6);
