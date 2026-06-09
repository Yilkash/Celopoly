import { motion } from 'framer-motion'
import { Player } from '@/types'
import { PLAYER_COLORS } from './Logo'

interface PlayerPanelProps {
  players: Player[]
  currentTurn: number
  address?: string | null
}

export function PlayerPanel({ players, currentTurn, address }: PlayerPanelProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {players.map((player, idx) => {
        if (player.bankrupt && idx !== currentTurn) return null
        const isActive = idx === currentTurn && !player.bankrupt
        const isMe = address === player.addr
        const color = PLAYER_COLORS[idx] || '#8892A4'
        const balance = (Number(player.balance) / 1e15).toLocaleString('en-US', { maximumFractionDigits: 0 })

        return (
          <motion.div
            key={player.addr}
            layout
            className={`relative rounded-2xl border p-3 overflow-hidden transition-colors duration-300 ${
              isActive
                ? 'border-gold/60 bg-bg-elevated'
                : player.bankrupt
                ? 'border-danger/25 bg-bg-surface/60 opacity-55'
                : 'border-border bg-bg-surface'
            }`}
            style={isActive ? { boxShadow: '0 0 0 1px rgba(252,206,71,0.3), 0 0 20px -6px rgba(252,206,71,0.4)' } : undefined}
          >
            {/* accent edge */}
            <span className="absolute left-0 top-0 h-full w-[3px]" style={{ background: color }} />

            <div className="flex items-center gap-2 mb-1.5 pl-1">
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                style={{ background: color, color: '#0A0B0F', boxShadow: `0 0 10px -2px ${color}` }}
              >
                P{idx + 1}
              </span>
              <span className="font-mono text-xs truncate text-text-primary">
                {isMe ? 'You' : `${player.addr.slice(0, 6)}…`}
              </span>
              <span className="ml-auto">
                {player.bankrupt ? (
                  <span className="text-[9px] text-danger font-bold tracking-wide">OUT</span>
                ) : isActive ? (
                  <span className="flex items-center gap-1 text-[9px] text-gold font-bold tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" /> TURN
                  </span>
                ) : null}
              </span>
            </div>

            <div className="flex items-baseline gap-1 pl-1">
              <span className="text-[11px] text-text-muted">◈</span>
              <motion.span
                key={balance}
                initial={{ opacity: 0.4, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display font-extrabold text-base tabular text-text-primary"
              >
                {balance}
              </motion.span>
              <span className="text-[9px] text-text-muted font-mono ml-0.5">cUSD</span>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
