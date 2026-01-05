-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's tenant IDs
CREATE OR REPLACE FUNCTION get_user_tenant_ids(user_uuid UUID)
RETURNS SETOF UUID AS $$
  SELECT tenant_id FROM memberships
  WHERE user_id = user_uuid AND is_active = true;
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function to check if user has role in tenant
CREATE OR REPLACE FUNCTION user_has_role_in_tenant(user_uuid UUID, tenant_uuid UUID, required_role user_role)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM memberships
    WHERE user_id = user_uuid
    AND tenant_id = tenant_uuid
    AND is_active = true
    AND (
      (required_role = 'staff' AND role IN ('staff', 'admin', 'owner'))
      OR (required_role = 'admin' AND role IN ('admin', 'owner'))
      OR (required_role = 'owner' AND role = 'owner')
    )
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================
-- TENANTS Policies
-- ============================================
CREATE POLICY "Users can view their own tenants"
  ON tenants FOR SELECT
  USING (id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY "Owners can update their tenants"
  ON tenants FOR UPDATE
  USING (user_has_role_in_tenant(auth.uid(), id, 'owner'));

-- ============================================
-- USER_PROFILES Policies
-- ============================================
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- MEMBERSHIPS Policies
-- ============================================
CREATE POLICY "Users can view memberships in their tenants"
  ON memberships FOR SELECT
  USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY "Admins can manage memberships in their tenants"
  ON memberships FOR ALL
  USING (user_has_role_in_tenant(auth.uid(), tenant_id, 'admin'));

-- ============================================
-- MODULES Policies (public read)
-- ============================================
CREATE POLICY "Anyone can view modules"
  ON modules FOR SELECT
  TO authenticated
  USING (true);

-- ============================================
-- TENANT_MODULES Policies
-- ============================================
CREATE POLICY "Users can view tenant modules for their tenants"
  ON tenant_modules FOR SELECT
  USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY "Owners can manage tenant modules"
  ON tenant_modules FOR ALL
  USING (user_has_role_in_tenant(auth.uid(), tenant_id, 'owner'));

-- ============================================
-- LEADS Policies
-- ============================================
-- Allow public INSERT for lead form submission
CREATE POLICY "Anyone can create leads"
  ON leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view leads in their tenants"
  ON leads FOR SELECT
  USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY "Staff can update leads in their tenants"
  ON leads FOR UPDATE
  USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY "Admins can delete leads in their tenants"
  ON leads FOR DELETE
  USING (user_has_role_in_tenant(auth.uid(), tenant_id, 'admin'));

-- ============================================
-- CLIENTS Policies
-- ============================================
CREATE POLICY "Users can view clients in their tenants"
  ON clients FOR SELECT
  USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY "Staff can create clients in their tenants"
  ON clients FOR INSERT
  WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY "Staff can update clients in their tenants"
  ON clients FOR UPDATE
  USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY "Admins can delete clients in their tenants"
  ON clients FOR DELETE
  USING (user_has_role_in_tenant(auth.uid(), tenant_id, 'admin'));

-- ============================================
-- NOTES Policies
-- ============================================
CREATE POLICY "Users can view notes in their tenants"
  ON notes FOR SELECT
  USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY "Staff can create notes in their tenants"
  ON notes FOR INSERT
  WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY "Users can update their own notes"
  ON notes FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Admins can delete notes in their tenants"
  ON notes FOR DELETE
  USING (user_has_role_in_tenant(auth.uid(), tenant_id, 'admin'));

-- ============================================
-- TASKS Policies
-- ============================================
CREATE POLICY "Users can view tasks in their tenants"
  ON tasks FOR SELECT
  USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY "Staff can create tasks in their tenants"
  ON tasks FOR INSERT
  WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

CREATE POLICY "Assigned users can update their tasks"
  ON tasks FOR UPDATE
  USING (assigned_to = auth.uid() OR created_by = auth.uid());

CREATE POLICY "Admins can delete tasks in their tenants"
  ON tasks FOR DELETE
  USING (user_has_role_in_tenant(auth.uid(), tenant_id, 'admin'));

-- ============================================
-- AUDIT_LOG Policies
-- ============================================
CREATE POLICY "Users can view audit logs in their tenants"
  ON audit_log FOR SELECT
  USING (tenant_id IN (SELECT get_user_tenant_ids(auth.uid())));

-- Audit log is insert-only, managed by triggers/functions
CREATE POLICY "System can insert audit logs"
  ON audit_log FOR INSERT
  WITH CHECK (true);
