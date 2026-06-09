import { motion, AnimatePresence } from 'framer-motion'
import { getCard } from '@/data/cards'
import { useGameStore } from '@/store/gameStore'

export function CardModal() {
  const showCard = useGameStore((s) => s.showCard)
  const setShowCard = useGameStore((s) => s.setShowCard)

  return (
    <AnimatePresence>
      {showCard && (() => {
        const card = getCard(showCard.type, showCard.index)
        const isPositive = card.effect >= 0
        const isChance = showCard.type === 'chance'
        const accent = isChance ? '#5EA3F7' : '#A855F7'

        return (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCard(null)}
          >
            <motion.div
              className="panel-glass relative w-full max-w-sm p-6 overflow-hidden"
              initial={{ scale: 0.85, y: 60, rotateX: 18, opacity: 0 }}
              animate={{ scale: 1, y: 0, rotateX: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 230, damping: 22 }}
              style={{ borderColor: `${accent}55` }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* ambient accent glow */}
              <div
                className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl pointer-events-none"
                style={{ background: `${accent}33` }}
              />

              <div className="relative text-center mb-5">
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-mono font-medium uppercase px-3 py-1 rounded-full"
                  style={{ letterSpacing: '0.16em', color: accent, background: `${accent}1A`, border: `1px solid ${accent}40` }}
                >
                  {isChance ? '◆ Chance' : '✦ Community Chest'}
                </span>
                <h3 className="font-display font-bold text-xl text-text-primary mt-3">{card.title}</h3>
              </div>

              <div className="relative bg-bg-primary/60 border border-border rounded-2xl p-5 mb-4 text-center">
                <p className="text-sm text-text-secondary mb-3 leading-relaxed">{card.body}</p>
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15, type: 'spring', stiffness: 240, damping: 16 }}
                  className="font-display font-extrabold text-3xl tabular"
                  style={{ color: isPositive ? '#35D07F' : '#FF4D6D' }}
                >
                  {isPositive ? '+' : '−'}◈{Math.abs(card.effect)}
                </motion.div>
                <div className="text-[10px] text-text-muted font-mono mt-1">
                  {isPositive ? 'credited to your balance' : 'deducted from your balance'}
                </div>
              </div>

              <div className="relative rounded-2xl p-3.5 mb-5" style={{ background: 'rgba(252,206,71,0.06)', border: '1px solid rgba(252,206,71,0.18)' }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-gold text-xs">💡</span>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-gold">Money Lesson</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{card.lesson}</p>
              </div>

              <button className="btn-primary w-full" onClick={() => setShowCard(null)}>
                Got it
              </button>
            </motion.div>
          </motion.div>
        )
      })()}
    </AnimatePresence>
  )
}
