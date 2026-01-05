'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { formatDateTime } from '@/lib/utils'
import { MessageSquare } from 'lucide-react'

interface Note {
  id: string
  content: string
  created_at: string
  user_profiles: {
    full_name: string | null
  }
}

interface NotesSectionProps {
  tenantId: string
  entityType: 'lead' | 'client'
  entityId: string
}

export function NotesSection({ tenantId, entityType, entityId }: NotesSectionProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchNotes()
  }, [entityType, entityId])

  async function fetchNotes() {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/notes?entity_type=${entityType}&entity_id=${entityId}`
      )
      if (response.ok) {
        const data = await response.json()
        setNotes(data.notes || [])
      }
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newNote.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: tenantId,
          entity_type: entityType,
          entity_id: entityId,
          content: newNote,
        }),
      })

      if (response.ok) {
        setNewNote('')
        fetchNotes()
      }
    } catch (error) {
      console.error('Error creating note:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Megjegyzések
        </CardTitle>
        <CardDescription>Belső megjegyzések és jegyzetek</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add note form */}
        <form onSubmit={handleSubmit} className="space-y-2">
          <Textarea
            placeholder="Új megjegyzés hozzáadása..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            rows={3}
          />
          <Button type="submit" disabled={isSubmitting || !newNote.trim()}>
            {isSubmitting ? 'Mentés...' : 'Megjegyzés hozzáadása'}
          </Button>
        </form>

        {/* Notes list */}
        <div className="space-y-3 mt-6">
          {isLoading ? (
            <p className="text-sm text-slate-500 text-center py-4">Betöltés...</p>
          ) : notes.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">
              Még nincsenek megjegyzések
            </p>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="border-l-2 border-slate-200 pl-4 py-2">
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{note.content}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                  <span className="font-medium">
                    {note.user_profiles?.full_name || 'Ismeretlen felhasználó'}
                  </span>
                  <span>•</span>
                  <span>{formatDateTime(note.created_at)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
