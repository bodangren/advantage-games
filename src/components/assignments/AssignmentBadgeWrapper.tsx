'use client'

import dynamic from 'next/dynamic'

const AssignmentBadge = dynamic(
  () => import('@/components/assignments/AssignmentBadge').then((mod) => mod.AssignmentBadge),
  { ssr: false }
)

export function AssignmentBadgeWrapper({ gameId }: { gameId: string }) {
  return <AssignmentBadge gameId={gameId} />
}
