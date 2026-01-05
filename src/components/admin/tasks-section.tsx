'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatDateTime } from '@/lib/utils'
import { CheckCircle2, Circle, XCircle, ListTodo } from 'lucide-react'

interface Task {
  id: string
  title: string
  description: string | null
  due_date: string | null
  status: 'pending' | 'completed' | 'cancelled'
  created_at: string
  completed_at: string | null
  created_by_profile: {
    full_name: string | null
  }
  assigned_to_profile: {
    full_name: string | null
  } | null
}

interface TasksSectionProps {
  tenantId: string
  entityType: 'lead' | 'client'
  entityId: string
}

export function TasksSection({ tenantId, entityType, entityId }: TasksSectionProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
  })

  useEffect(() => {
    fetchTasks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityType, entityId])

  async function fetchTasks() {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/tasks?entity_type=${entityType}&entity_id=${entityId}`
      )
      if (response.ok) {
        const data = await response.json()
        setTasks(data.tasks || [])
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!formData.title.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: tenantId,
          entity_type: entityType,
          entity_id: entityId,
          title: formData.title,
          description: formData.description || null,
          due_date: formData.due_date || null,
        }),
      })

      if (response.ok) {
        setFormData({ title: '', description: '', due_date: '' })
        setShowForm(false)
        fetchTasks()
      }
    } catch (error) {
      console.error('Error creating task:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function updateTaskStatus(taskId: string, newStatus: 'pending' | 'completed' | 'cancelled') {
    try {
      const response = await fetch('/api/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task_id: taskId,
          status: newStatus,
        }),
      })

      if (response.ok) {
        fetchTasks()
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const statusIcons = {
    pending: <Circle className="h-4 w-4 text-yellow-600" />,
    completed: <CheckCircle2 className="h-4 w-4 text-green-600" />,
    cancelled: <XCircle className="h-4 w-4 text-slate-400" />,
  }

  const statusLabels = {
    pending: 'Függőben',
    completed: 'Kész',
    cancelled: 'Törölve',
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="h-5 w-5" />
              Teendők
            </CardTitle>
            <CardDescription>Feladatok és határidők</CardDescription>
          </div>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} variant="outline" size="sm">
              + Új feladat
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add task form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-3 p-4 border rounded-lg bg-slate-50">
            <div>
              <Label htmlFor="title">Feladat neve *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Pl. Visszahívni az ügyfelet"
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Leírás</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="További részletek..."
                rows={2}
              />
            </div>
            <div>
              <Label htmlFor="due_date">Határidő</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Mentés...' : 'Feladat hozzáadása'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false)
                  setFormData({ title: '', description: '', due_date: '' })
                }}
              >
                Mégse
              </Button>
            </div>
          </form>
        )}

        {/* Tasks list */}
        <div className="space-y-2">
          {isLoading ? (
            <p className="text-sm text-slate-500 text-center py-4">Betöltés...</p>
          ) : tasks.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">
              Még nincsenek feladatok
            </p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`p-3 border rounded-lg ${
                  task.status === 'completed' ? 'bg-green-50' : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {statusIcons[task.status]}
                      <h4
                        className={`font-medium ${
                          task.status === 'completed'
                            ? 'line-through text-slate-500'
                            : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </h4>
                    </div>
                    {task.description && (
                      <p className="text-sm text-slate-600 mb-2">{task.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                      {task.due_date && (
                        <span className="bg-slate-100 px-2 py-1 rounded">
                          Határidő: {formatDate(task.due_date)}
                        </span>
                      )}
                      <span>
                        Létrehozta: {task.created_by_profile?.full_name || 'Ismeretlen'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge variant={task.status === 'completed' ? 'secondary' : 'default'}>
                      {statusLabels[task.status]}
                    </Badge>
                    {task.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateTaskStatus(task.id, 'completed')}
                        className="text-xs"
                      >
                        Kész
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
