'use client'

import { useLeaderboard } from '@/hooks/useLeaderboard'
import Link from 'next/link'
import { ChevronLeft, Trash2, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function LeaderboardPage() {
  const { getLeaderboard, clearHistory } = useLeaderboard()
  const [showConfirm, setShowConfirm] = useState(false)
  const leaderboard = getLeaderboard()

  const highScoreList = Object.values(leaderboard.highScores).sort(
    (a, b) => b.bestScore - a.bestScore
  )

  const handleClear = () => {
    clearHistory()
    setShowConfirm(false)
  }

  return (
    <main className="min-h-screen px-3 py-4 md:px-6 md:py-8 text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <Link
            href="/student/games"
            className="inline-flex items-center text-sm uppercase tracking-[0.2em] text-white/60 transition hover:text-white"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to Games
          </Link>
          {showConfirm ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/60">Clear all history?</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleClear}
              >
                Yes, clear
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConfirm(true)}
              className="text-white/60 hover:text-white"
            >
              <Trash2 className="mr-1 h-4 w-4" />
              Clear History
            </Button>
          )}
        </div>

        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-8 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-amber-400/70 font-bold mb-2">
            Total XP Earned
          </div>
          <div className="text-5xl font-black text-amber-400">
            {leaderboard.totalXp.toLocaleString()}
          </div>
        </div>

        {highScoreList.length > 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="border-b border-white/10 px-6 py-4">
              <h2 className="text-lg font-bold uppercase tracking-wider text-white/70">
                High Scores
              </h2>
            </div>
            <div className="divide-y divide-white/5">
              {highScoreList.map((game, index) => (
                <div
                  key={game.gameId}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        index === 0
                          ? 'bg-amber-500/20 text-amber-400'
                          : index === 1
                            ? 'bg-slate-400/20 text-slate-300'
                            : index === 2
                              ? 'bg-orange-600/20 text-orange-400'
                              : 'bg-white/5 text-white/40'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-white">
                        {game.gameName}
                      </div>
                      <div className="text-xs text-white/50">
                        Best: {game.bestScore.toLocaleString()} pts ·{' '}
                        {game.bestXp.toLocaleString()} XP
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white/40">
                      {formatDate(game.lastPlayed)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {leaderboard.sessions.length > 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            <div className="border-b border-white/10 px-6 py-4">
              <h2 className="text-lg font-bold uppercase tracking-wider text-white/70">
                Recent Sessions
              </h2>
            </div>
            <div className="divide-y divide-white/5">
              {leaderboard.sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="flex items-center gap-4">
                    <Trophy className="h-5 w-5 text-amber-500/50" />
                    <div>
                      <div className="font-semibold text-white">
                        {session.gameName}
                      </div>
                      <div className="text-xs text-white/50">
                        Score: {session.score.toLocaleString()} ·{' '}
                        {session.accuracy}% accuracy
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-emerald-400">
                      +{session.xp} XP
                    </div>
                    <div className="text-xs text-white/40">
                      {formatDate(session.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
            <Trophy className="mx-auto mb-4 h-12 w-12 text-white/20" />
            <h3 className="text-xl font-bold text-white/60 mb-2">
              No sessions yet
            </h3>
            <p className="text-white/40">
              Play some games to see your history here!
            </p>
            <Link href="/student/games">
              <Button className="mt-6">Browse Games</Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}