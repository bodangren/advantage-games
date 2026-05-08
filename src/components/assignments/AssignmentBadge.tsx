'use client'

import { useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { useAssignmentStore } from '@/store/assignmentStore'

interface AssignmentBadgeProps {
  gameId: string
}

export function AssignmentBadge({ gameId }: AssignmentBadgeProps) {
  const assignments = useAssignmentStore((state) => state.assignments)

  const gameAssignments = useMemo(() => {
    return assignments.filter(
      (a) =>
        a.status === 'active' &&
        a.gameIds.includes(gameId)
    )
  }, [assignments, gameId])

  if (gameAssignments.length === 0) {
    return null
  }

  const dueCount = gameAssignments.filter((a) => {
    if (!a.dueDate) return true
    return new Date(a.dueDate) > new Date()
  }).length

  if (dueCount === 0) {
    return (
      <Badge variant="secondary" className="absolute top-2 right-2 z-10">
        Assignment
      </Badge>
    )
  }

  return (
    <Badge variant="destructive" className="absolute top-2 right-2 z-10">
      {dueCount === 1 ? 'Due' : `${dueCount} Due`}
    </Badge>
  )
}
