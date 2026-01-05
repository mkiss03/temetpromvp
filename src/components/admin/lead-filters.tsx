'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, X } from 'lucide-react'

export function LeadFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const currentStatus = searchParams.get('status') || 'all'

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    updateFilters({ search })
  }

  function handleStatusFilter(status: string) {
    updateFilters({ status })
  }

  function clearFilters() {
    setSearch('')
    router.push('/admin/leads')
  }

  function updateFilters(updates: { search?: string; status?: string }) {
    const params = new URLSearchParams(searchParams.toString())

    if (updates.search !== undefined) {
      if (updates.search) {
        params.set('search', updates.search)
      } else {
        params.delete('search')
      }
    }

    if (updates.status !== undefined) {
      if (updates.status === 'all') {
        params.delete('status')
      } else {
        params.set('status', updates.status)
      }
    }

    router.push(`/admin/leads?${params.toString()}`)
  }

  const statuses = [
    { value: 'all', label: 'Összes' },
    { value: 'new', label: 'Új' },
    { value: 'in_progress', label: 'Folyamatban' },
    { value: 'waiting', label: 'Várakozik' },
    { value: 'closed', label: 'Lezárva' },
  ]

  const hasActiveFilters = search || currentStatus !== 'all'

  return (
    <div className="space-y-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Keresés név, email vagy telefonszám alapján..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit">Keresés</Button>
        {hasActiveFilters && (
          <Button type="button" variant="outline" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Törlés
          </Button>
        )}
      </form>

      {/* Status filters */}
      <div className="flex gap-2 flex-wrap">
        {statuses.map((status) => (
          <button
            key={status.value}
            onClick={() => handleStatusFilter(status.value)}
            className="focus:outline-none"
          >
            <Badge
              variant={currentStatus === status.value ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-slate-100"
            >
              {status.label}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  )
}
