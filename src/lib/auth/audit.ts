import { createClient } from '@/lib/supabase/server'

interface AuditLogEntry {
  tenantId: string
  entityType: string
  entityId: string
  action: string
  beforeData?: any
  afterData?: any
  actorUserId?: string
  ipAddress?: string
  userAgent?: string
}

export async function createAuditLog({
  tenantId,
  entityType,
  entityId,
  action,
  beforeData,
  afterData,
  actorUserId,
  ipAddress,
  userAgent,
}: AuditLogEntry) {
  const supabase = await createClient()

  const { error } = await supabase.from('audit_log').insert({
    tenant_id: tenantId,
    entity_type: entityType,
    entity_id: entityId,
    action,
    before_data: beforeData,
    after_data: afterData,
    actor_user_id: actorUserId,
    ip_address: ipAddress,
    user_agent: userAgent,
  })

  if (error) {
    console.error('Failed to create audit log:', error)
  }
}

export async function logLeadChange(
  tenantId: string,
  leadId: string,
  action: 'create' | 'update' | 'delete',
  beforeData?: any,
  afterData?: any,
  userId?: string
) {
  await createAuditLog({
    tenantId,
    entityType: 'lead',
    entityId: leadId,
    action,
    beforeData,
    afterData,
    actorUserId: userId,
  })
}

export async function logClientChange(
  tenantId: string,
  clientId: string,
  action: 'create' | 'update' | 'delete',
  beforeData?: any,
  afterData?: any,
  userId?: string
) {
  await createAuditLog({
    tenantId,
    entityType: 'client',
    entityId: clientId,
    action,
    beforeData,
    afterData,
    actorUserId: userId,
  })
}
