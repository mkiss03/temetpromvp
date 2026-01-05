import { createClient } from '@/lib/supabase/server'
import { type Database } from '@/types/database.types'

type UserRole = Database['public']['Enums']['user_role']

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

export async function getUserMemberships(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('memberships')
    .select('*, tenants(*)')
    .eq('user_id', userId)
    .eq('is_active', true)

  if (error) {
    console.error('Error fetching memberships:', error)
    return []
  }

  return data
}

export async function getUserTenantIds(userId: string): Promise<string[]> {
  const memberships = await getUserMemberships(userId)
  return memberships.map(m => m.tenant_id)
}

export async function hasRoleInTenant(
  userId: string,
  tenantId: string,
  requiredRole: UserRole
): Promise<boolean> {
  const supabase = await createClient()

  const roleHierarchy: Record<UserRole, number> = {
    staff: 1,
    admin: 2,
    owner: 3,
  }

  const { data, error } = await supabase
    .from('memberships')
    .select('role')
    .eq('user_id', userId)
    .eq('tenant_id', tenantId)
    .eq('is_active', true)
    .single()

  if (error || !data) {
    return false
  }

  return roleHierarchy[data.role] >= roleHierarchy[requiredRole]
}

export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  return user
}

export async function requireTenantAccess(tenantId: string) {
  const user = await requireAuth()
  const tenantIds = await getUserTenantIds(user.id)

  if (!tenantIds.includes(tenantId)) {
    throw new Error('Forbidden: No access to this tenant')
  }

  return user
}

export async function requireRole(tenantId: string, role: UserRole) {
  const user = await requireAuth()
  const hasRole = await hasRoleInTenant(user.id, tenantId, role)

  if (!hasRole) {
    throw new Error(`Forbidden: Requires ${role} role`)
  }

  return user
}

// Helper to get current user's primary tenant (first active membership)
export async function getCurrentTenant() {
  const user = await getCurrentUser()

  if (!user) {
    return null
  }

  const memberships = await getUserMemberships(user.id)

  if (memberships.length === 0) {
    return null
  }

  return memberships[0].tenants
}
