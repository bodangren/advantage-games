import { motion } from 'framer-motion'
import { usePotionRushStore } from '@/store/usePotionRushStore'
import { VocabularyItem } from '@/store/useGameStore'

interface PotionRushSummaryProps {
  onRestart: () => void
  onExit: () => void
}

export default function PotionRushSummary({ onRestart, onExit }: PotionRushSummaryProps) {
  const score = usePotionRushStore(state => state.score)
  const completedSentences = usePotionRushStore(state => state.completedSentences)
  const totalXpEarned = usePotionRushStore(state => state.totalXpEarned)

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 flex items-center justify-center bg-black/80 z-50 text-white backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full border border-slate-700"
      >
        <h1 className="text-4xl font-bold mb-2 text-center text-purple-400">Shop Closed!</h1>
        <p className="text-slate-400 text-center mb-8">The reputation of your potion shop hit rock bottom.</p>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between items-center bg-slate-700/50 p-4 rounded-lg">
            <span className="text-slate-300">Total Score</span>
            <span className="text-2xl font-bold text-yellow-400">{score}</span>
          </div>
          
          <div className="flex justify-between items-center bg-slate-700/50 p-4 rounded-lg">
            <span className="text-slate-300">Customers Served</span>
            <span className="text-2xl font-bold text-blue-400">{completedSentences}</span>
          </div>

          <div className="flex justify-between items-center bg-slate-700/50 p-4 rounded-lg border border-purple-500/30">
            <span className="text-purple-300">XP Earned</span>
            <span className="text-2xl font-bold text-purple-400">+{totalXpEarned} XP</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={onExit}
            className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold text-slate-200 transition-colors"
          >
            Exit
          </button>
          <button 
            onClick={onRestart}
            className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg font-bold text-white shadow-lg shadow-purple-900/20 transition-all hover:scale-105"
          >
            Open Again
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
