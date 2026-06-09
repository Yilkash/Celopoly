import { useState, useEffect, type ComponentType, type SVGProps } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAccount, useReadContract, useConnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { useMiniPay } from '@/hooks/useMiniPay'
import { useCeloTx } from '@/hooks/useCeloTx'
import { useJoinGame } from '@/hooks/useJoinGame'
import { useGameStore } from '@/store/gameStore'
import { GAME_ABI, getGameAddress } from '@/utils/contracts'
import { Board } from './Board'
import { PREVIEW_GAME } from '@/data/previewGame'
import { IconWallet, IconDice, IconTrophy, IconChart, IconScale, IconShield } from './icons'

// Floating "+◈N" earning popups that drift up over the preview board to make it feel live.
interface Pop {
  id: number
  x: number
  y: number
  amount: number
  positive: boolean
}
const EARNINGS = [
  { amount: 12, positive: true },
  { amount: 30, positive: true },
  { amount: 6, positive: true },
  { amount: 22, positive: false },
  { amount: 50, positive: true },
  { amount: 10, positive: false },
  { amount: 90, positive: true },
  { amount: 2, positive: true },
]

function LiveEarnings() {
  const [pops, setPops] = useState<Pop[]>([])

  useEffect(() => {
    let n = 0
    const tick = () => {
      const e = EARNINGS[n % EARNINGS.length]
      const seed = n * 97
      n += 1
      const id = n
      setPops((p) => [
        ...p,
        { id, x: 18 + (seed % 64), y: 28 + ((seed * 7) % 50), amount: e.amount, positive: e.positive },
      ])
      setPops((p) => p.slice(-5))
      window.setTimeout(() => setPops((p) => p.filter((x) => x.id !== id)), 1900)
    }
    const interval = window.setInterval(tick, 1300)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      <AnimatePresence>
        {pops.map((p) => (
          <motion.span
            key={p.id}
            className="absolute font-display font-extrabold text-sm tabular"
            style={{ left: `${p.x}%`, top: `${p.y}%`, color: p.positive ? '#35D07F' : '#FF4D6D' }}
            initial={{ opacity: 0, y: 8, scale: 0.6 }}
            animate={{ opacity: 1, y: -22, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
          >
            {p.positive ? '+' : '−'}◈{p.amount}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Premium feature/step card with duotone icon badge, accent glow and hover lift.
function StepCard({
  index,
  Icon,
  accent,
  t,
  d,
  n,
  step = false,
}: {
  index: number
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  accent: string
  t: string
  d: string
  n?: string
  step?: boolean
}) {
  return (
    <motion.div
      initial={{ y: 22, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-3xl p-6 overflow-hidden border border-border bg-bg-surface transition-transform duration-300 hover:-translate-y-1"
    >
      {/* top accent hairline */}
      <span
        className="absolute inset-x-0 top-0 h-px opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
      {/* corner glow */}
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-25 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none"
        style={{ background: accent }}
      />
      {/* step number watermark */}
      {step && n && (
        <span className="absolute top-5 right-6 font-display font-extrabold text-4xl" style={{ color: accent, opacity: 0.18 }}>
          {n}
        </span>
      )}
      {/* icon badge */}
      <div
        className="relative w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
        style={{
          color: accent,
          background: `${accent}1A`,
          boxShadow: `inset 0 0 0 1px ${accent}40, 0 10px 22px -10px ${accent}99`,
        }}
      >
        <Icon />
      </div>
      <h3 className="font-display font-bold text-lg text-text-primary mb-2">{t}</h3>
      <p className="text-text-secondary text-sm leading-relaxed">{d}</p>
      {/* hover ring */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ boxShadow: `inset 0 0 0 1px ${accent}55` }}
      />
    </motion.div>
  )
}

export function Lobby() {
  const { isConnected } = useAccount()
  const { vibrate } = useMiniPay()
  const { connect, isPending: connectPending } = useConnect()
  const { createGame, isPending: createPending } = useCeloTx()
  const { handleJoin, step, joinPending, joinSuccess } = useJoinGame()
  const gameId = useGameStore((s) => s.gameId)

  const [joinGameId, setJoinGameId] = useState('')

  useReadContract({
    address: getGameAddress(44787),
    abi: GAME_ABI,
    functionName: 'nextGameId',
    query: { enabled: isConnected },
  })

  const connectWallet = () => connect({ connector: injected() })

  const handleCreate = () => {
    if (!isConnected) return connectWallet()
    vibrate(100)
    createGame()
  }

  const handleJoinGame = () => {
    if (!isConnected) return connectWallet()
    if (!joinGameId) return
    vibrate(100)
    handleJoin(BigInt(joinGameId))
  }

  useEffect(() => {
    if (joinSuccess) vibrate([100, 50, 100])
  }, [joinSuccess, vibrate])

  const features = [
    { icon: '💰', label: '1 cUSD entry' },
    { icon: '👥', label: '2–4 players' },
    { icon: '🏆', label: 'Winner takes all' },
  ]

  // Reusable board block (live preview + floating earnings).
  const boardPanel = (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-1 px-1">
        <span className="label-kicker">The board</span>
        <span className="chip text-celo-green border-celo-green/30">
          <span className="w-1.5 h-1.5 rounded-full bg-celo-green animate-pulse" /> live demo
        </span>
      </div>
      <div className="relative">
        <Board game={PREVIEW_GAME} live />
        <LiveEarnings />
      </div>
      <p className="text-center text-[11px] text-text-muted mt-3 px-2">
        40 tiles of real money lessons — buy property, collect rent, dodge the rug-pulls.
      </p>
    </div>
  )

  // ─── Landing for visitors (not connected): two-column hero + sections ──
  if (!isConnected) {
    return (
      <div className="flex flex-col flex-1 w-full max-w-6xl mx-auto px-4 pt-6 pb-10 safe-bottom">
        {/* Hero */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[78vh] lg:min-h-0 lg:py-10">
          {/* Pitch */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 lg:order-1 text-center lg:text-left max-w-xl mx-auto lg:mx-0"
          >
            <span className="inline-flex items-center gap-2 chip text-celo-green border-celo-green/30 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-celo-green animate-pulse" />
              MINIPAY OPTIMIZED · CELO
            </span>
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl leading-[1.05] mb-4">
              The <span className="text-gradient-gold">money game</span> you play on-chain
            </h1>
            <p className="text-text-secondary text-base leading-relaxed mb-6">
              Roll, buy property, collect rent and learn how money really works — 2–4 players,
              1 cUSD entry, winner takes the whole pot.
            </p>

            <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-7">
              {features.map((f) => (
                <span key={f.label} className="chip text-text-secondary py-2 px-3">
                  <span className="text-sm">{f.icon}</span>
                  {f.label}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button className="btn-primary w-full sm:w-auto px-8" onClick={connectWallet} disabled={connectPending}>
                {connectPending ? 'Connecting…' : 'Connect Wallet to Play'}
              </button>
              <a href="#how" className="btn-secondary w-full sm:w-auto px-6">How it works</a>
            </div>
          </motion.div>

          {/* Board */}
          <motion.div
            id="prize"
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2 w-full scroll-mt-24"
          >
            {boardPanel}
          </motion.div>
        </div>

        {/* How it works */}
        <section id="how" className="scroll-mt-24 mt-20">
          <div className="text-center mb-10">
            <span className="label-kicker">How it works</span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl mt-1.5 text-text-primary">
              Three steps to <span className="text-gradient-gold">own the block</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { n: '01', Icon: IconWallet, accent: '#5EA3F7', t: 'Connect & stake', d: 'Link your Celo wallet and stake 1 cUSD to join a table. Funds lock safely in escrow.' },
              { n: '02', Icon: IconDice, accent: '#FCCE47', t: 'Roll & build', d: 'Take turns rolling, buy property, collect rent and stack houses on your colour sets.' },
              { n: '03', Icon: IconTrophy, accent: '#35D07F', t: 'Win the pot', d: 'Bankrupt your rivals. The last player standing takes the entire prize pool on-chain.' },
            ].map((s, i) => (
              <StepCard key={s.n} index={i} {...s} step />
            ))}
          </div>
        </section>

        {/* Lessons */}
        <section id="lessons" className="scroll-mt-24 mt-20">
          <div className="text-center mb-10">
            <span className="label-kicker">Play to learn</span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl mt-1.5 text-text-primary">
              Every tile teaches a <span className="text-gradient-gold">money lesson</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { Icon: IconChart, accent: '#35D07F', t: 'Assets pay you', d: 'Own property and infrastructure — they earn rent whether you roll or not.' },
              { Icon: IconScale, accent: '#FCCE47', t: 'Compound & risk', d: 'High-yield DeFi tiles pay more, but rug-pulls hurt. Weigh return against risk.' },
              { Icon: IconShield, accent: '#5EA3F7', t: 'Cash is a cushion', d: 'Keep a buffer. Land on rent or tax with no cash and you go bankrupt.' },
            ].map((l, i) => (
              <StepCard key={l.t} index={i} {...l} />
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-16">
          <div className="panel p-8 text-center relative overflow-hidden">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl mb-2">Ready to play?</h2>
            <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">
              Connect your wallet, stake 1 cUSD and take a seat at the table.
            </p>
            <button className="btn-primary px-10 mx-auto" onClick={connectWallet} disabled={connectPending}>
              {connectPending ? 'Connecting…' : 'Connect Wallet to Play'}
            </button>
          </div>
        </section>
      </div>
    )
  }

  // ─── Connected: board + Create/Join controls ──
  return (
    <div className="flex flex-col flex-1 w-full max-w-6xl mx-auto px-4 pt-3 pb-6 safe-bottom">
      <div className="grid lg:grid-cols-[1fr_minmax(300px,340px)] gap-5 items-start">
        {/* Board */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="order-1"
        >
          {boardPanel}
        </motion.div>

        {/* Controls */}
        <div className="order-2 flex flex-col gap-3 lg:sticky lg:top-20">
          {/* Active game banner */}
          {gameId !== null && gameId > 0n && (
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="panel p-4 flex items-center justify-between shadow-glow-gold"
            >
              <div>
                <div className="label-kicker mb-0.5">Your active table</div>
                <div className="font-display text-xl font-extrabold text-gradient-gold tabular">
                  #{gameId.toString()}
                </div>
              </div>
              <span className="text-2xl animate-pulse-gold rounded-full">🎲</span>
            </motion.div>
          )}

          {/* Create */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="panel panel-interactive p-4 relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gold/10 blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-display text-base font-bold text-text-primary">Create a table</h2>
              <span className="chip text-gold border-gold/30">Host</span>
            </div>
            <p className="text-text-secondary text-xs mb-4 leading-relaxed">
              Stake <span className="text-gold font-mono">1 cUSD</span> to open a room. Share the ID and start when 2–4 are in.
            </p>
            <button className="btn-primary w-full" onClick={handleCreate} disabled={createPending}>
              {createPending ? 'Creating…' : 'Create Game · 1 cUSD'}
            </button>
          </motion.div>

          {/* Join */}
          <motion.div
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.08 }}
            className="panel p-4"
          >
            <h2 className="font-display text-base font-bold text-text-primary mb-1">Join a table</h2>
            <p className="text-text-secondary text-xs mb-3">Got an ID from a friend? Hop in.</p>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                placeholder="Game ID"
                value={joinGameId}
                onChange={(e) => setJoinGameId(e.target.value.replace(/\D/g, ''))}
                className="input-field flex-1"
              />
              <button
                className="btn-secondary px-5"
                onClick={handleJoinGame}
                disabled={joinPending || !joinGameId}
              >
                {joinPending ? (step === 'approving' ? 'Approve…' : 'Joining…') : 'Join'}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
