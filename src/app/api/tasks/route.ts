import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCurrentUser, getUserTenantIds } from '@/lib/auth/permissions'

// GET /api/tasks?entity_type=lead&entity_id=xxx
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

    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*, created_by_profile:user_profiles!tasks_created_by_fkey(full_name), assigned_to_profile:user_profiles!tasks_assigned_to_fkey(full_name)')
      .eq('entity_type', entityType)
      .eq('entity_id', entityId)
      .order('due_date', { ascending: true, nullsFirst: false })

    if (error) {
      console.error('Error fetching tasks:', error)
      return NextResponse.json(
        { error: 'Failed to fetch tasks' },
        { status: 500 }
      )
    }

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error('Unexpected error in GET /api/tasks:', error)
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    )
  }
}

// POST /api/tasks
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { tenant_id, entity_type, entity_id, title, description, due_date, assigned_to } = body

    if (!tenant_id || !entity_type || !entity_id || !title) {
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

    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        tenant_id,
        entity_type,
        entity_id,
        title,
        description,
        due_date,
        assigned_to,
        created_by: user.id,
        status: 'pending',
      })
      .select('*, created_by_profile:user_profiles!tasks_created_by_fkey(full_name), assigned_to_profile:user_profiles!tasks_assigned_to_fkey(full_name)')
      .single()

    if (error) {
      console.error('Error creating task:', error)
      return NextResponse.json(
        { error: 'Failed to create task' },
        { status: 500 }
      )
    }

    return NextResponse.json({ task }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error in POST /api/tasks:', error)
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    )
  }
}

// PATCH /api/tasks (update task status)
export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { task_id, status } = body

    if (!task_id || !status) {
      return NextResponse.json(
        { error: 'Missing task_id or status' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const updateData: any = { status }
    if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }

    const { data: task, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', task_id)
      .select('*, created_by_profile:user_profiles!tasks_created_by_fkey(full_name), assigned_to_profile:user_profiles!tasks_assigned_to_fkey(full_name)')
      .single()

    if (error) {
      console.error('Error updating task:', error)
      return NextResponse.json(
        { error: 'Failed to update task' },
        { status: 500 }
      )
    }

    return NextResponse.json({ task })
  } catch (error) {
    console.error('Unexpected error in PATCH /api/tasks:', error)
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 }
    )
  }
}
