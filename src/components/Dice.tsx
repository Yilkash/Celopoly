import { motion, AnimatePresence } from 'framer-motion'

interface DiceProps {
  die1: number | null
  die2: number | null
  rolling: boolean
}

const DOT_POSITIONS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[28, 28], [72, 72]],
  3: [[28, 28], [50, 50], [72, 72]],
  4: [[28, 28], [28, 72], [72, 28], [72, 72]],
  5: [[28, 28], [28, 72], [50, 50], [72, 28], [72, 72]],
  6: [[28, 26], [28, 50], [28, 74], [72, 26], [72, 50], [72, 74]],
}

function DieFace({ value }: { value: number }) {
  const dots = DOT_POSITIONS[value] || []
  return (
    <svg width="50" height="50" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="dieBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#252B3D" />
          <stop offset="1" stopColor="#14171F" />
        </linearGradient>
        <radialGradient id="diePip" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#FFE898" />
          <stop offset="1" stopColor="#E0A91C" />
        </radialGradient>
      </defs>
      <rect x="4" y="4" width="92" height="92" rx="18" fill="url(#dieBody)" />
      <rect x="4" y="4" width="92" height="92" rx="18" fill="none" stroke="rgba(252,206,71,0.45)" strokeWidth="2" />
      <rect x="9" y="9" width="82" height="38" rx="12" fill="rgba(255,255,255,0.05)" />
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="9" fill="url(#diePip)" />
      ))}
    </svg>
  )
}

function RollingDie({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="w-[50px] h-[50px] rounded-2xl flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg,#252B3D,#14171F)',
        boxShadow: '0 0 0 2px rgba(252,206,71,0.4), 0 6px 16px -6px rgba(0,0,0,0.8)',
      }}
      animate={{ rotateX: [0, 360], rotateY: [0, 360], scale: [1, 0.92, 1] }}
      transition={{ duration: 0.5, repeat: Infinity, ease: 'linear', delay }}
    >
      <span className="text-gold font-display font-bold text-xl">?</span>
    </motion.div>
  )
}

export function Dice({ die1, die2, rolling }: DiceProps) {
  const total = die1 !== null && die2 !== null ? die1 + die2 : null
  const isDouble = die1 !== null && die1 === die2

  return (
    <div className="flex flex-col items-center justify-center gap-1.5 py-1">
      <div className="flex gap-3 items-center justify-center" style={{ perspective: 600 }}>
        <AnimatePresence mode="wait">
          {rolling ? (
            <motion.div key="rolling" className="flex gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <RollingDie />
              <RollingDie delay={0.12} />
            </motion.div>
          ) : die1 !== null && die2 !== null ? (
            <motion.div
              key={`${die1}-${die2}`}
              className="flex gap-3"
              initial={{ scale: 0.3, rotate: -160, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 14 }}
            >
              <DieFace value={die1} />
              <DieFace value={die2} />
            </motion.div>
          ) : (
            <span className="text-text-muted text-xs font-mono py-3">Tap to roll</span>
          )}
        </AnimatePresence>
      </div>

      {!rolling && total !== null && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-[11px] font-mono"
        >
          <span className="text-text-secondary">moved <span className="text-text-primary font-bold">{total}</span></span>
          {isDouble && <span className="chip text-gold border-gold/30 py-0.5">DOUBLES · roll again</span>}
        </motion.div>
      )}
    </div>
  )
}
