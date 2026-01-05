import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser, getUserTenantIds } from '@/lib/auth/permissions'

// GET /api/notes?entity_type=lead&entity_id=xxx
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const entityType = searchParams.get('entity_type')
    const entityId = searchParams.get('entity_id')

    if (!entityType || !entityId) {
      return NextResponse.json(
        { error: 'Missing entity_type or entity_id' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: notes, error } = await supabase
      .from('notes')
      .select('*, user_profiles!notes_created_by_fkey(full_name)')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching notes:', error)
      return NextResponse.json(
        { error: 'Failed to fetch notes' },
        { status: 500 }
      )
    }

    return NextResponse.json({ notes })
  } catch (error) {
    console.error('Unexpected error in GET /api/notes:', error)
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    )
  }
}

// POST /api/notes
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { tenant_id, entity_type, entity_id, content } = body

    if (!tenant_id || !entity_type || !entity_id || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check tenant access
    const tenantIds = await getUserTenantIds(user.id)
    if (!tenantIds.includes(tenant_id)) {
      return NextResponse.json(
        { error: 'Forbidden: No access to this tenant' },
        { status: 403 }
      )
    }

    const supabase = await createClient()

    const { data: note, error } = await supabase
      .from('notes')
      .insert({
        tenant_id,
        entity_type,
        entity_id,
        content,
        created_by: user.id,
      })
      .select('*, user_profiles!notes_created_by_fkey(full_name)')
      .single()

    if (error) {
      console.error('Error creating note:', error)
      return NextResponse.json(
        { error: 'Failed to create note' },
        { status: 500 }
      )
    }

    return NextResponse.json({ note }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in POST /api/notes:', error)
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    )
  }
}
