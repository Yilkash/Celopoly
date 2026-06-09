import { useState } from 'react'
import { motion } from 'framer-motion'
import { Board } from './Board'
import { Dice } from './Dice'
import { PlayerPanel } from './PlayerPanel'
import { CardModal } from './CardModal'
import { Logo } from './Logo'
import { useGameStore } from '@/store/gameStore'
import { useCeloTx } from '@/hooks/useCeloTx'
import { useNonceManager } from '@/hooks/useNonceManager'
import { useMiniPay } from '@/hooks/useMiniPay'
import { BOARD } from '@/data/board'
import { CellType } from '@/types'

export function GameView() {
  const game = useGameStore((s) => s.game)
  const gameId = useGameStore((s) => s.gameId)
  const address = useGameStore((s) => s.address)
  const lastDiceRoll = useGameStore((s) => s.lastDiceRoll)
  const { vibrate } = useMiniPay()

  const [rolling, setRolling] = useState(false)
  const [actionMsg, setActionMsg] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const { rollDice, buyProperty, startGame, isPending, error } = useCeloTx()
  const { nonce, generateNewNonce } = useNonceManager()

  if (!game || !gameId) return null

  const myIndex = game.players.findIndex((p) => p.addr === address)
  const isHost = myIndex === 0
  const isMyTurn = myIndex >= 0 && game.currentTurn === myIndex && !game.players[myIndex]?.bankrupt
  const myPlayer = game.players[myIndex]
  const currentCell = myPlayer ? BOARD[myPlayer.position] : null

  const handleRoll = () => {
    if (!gameId || !isMyTurn) return
    vibrate(200)
    setRolling(true)
    rollDice(gameId, nonce)
    generateNewNonce()
    setTimeout(() => {
      setRolling(false)
      vibrate([100, 50, 100])
    }, 800)
  }

  const handleBuy = () => {
    if (!gameId || !currentCell || !isMyTurn) return
    buyProperty(gameId, currentCell.cell)
    setActionMsg('Buying property…')
    setTimeout(() => setActionMsg(null), 2000)
  }

  const handleStart = () => {
    if (!gameId) return
    vibrate(100)
    startGame(gameId)
  }

  const copyId = () => {
    navigator.clipboard?.writeText(gameId.toString())
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const priceInWei = currentCell ? BigInt(currentCell.price) * 10n ** 15n : 0n
  const canBuy =
    currentCell &&
    game.propertyOwner[currentCell.cell] === 0 &&
    (currentCell.cellType === CellType.Property ||
      currentCell.cellType === CellType.Railroad ||
      currentCell.cellType === CellType.Utility) &&
    myPlayer &&
    myPlayer.balance >= priceInWei

  // ─── Victory screen ──────────────────────────────────────────
  if (game.ended) {
    const winner = game.players.find((p) => !p.bankrupt)
    const iWon = winner?.addr === address
    return (
      <div className="flex flex-col items-center justify-center flex-1 px-6 py-12 relative overflow-hidden">
        {/* celebratory sparks */}
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{ background: ['#FCCE47', '#35D07F', '#5EA3F7'][i % 3], left: `${(i * 37) % 100}%`, top: `${(i * 53) % 90}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.4, 0], opacity: [0, 1, 0], y: [0, -30] }}
            transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.13 }}
          />
        ))}

        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 180, damping: 12 }}
          className="text-7xl mb-4 animate-float"
        >
          🏆
        </motion.div>
        <div className="label-kicker mb-1">{iWon ? 'Champion' : 'Game over'}</div>
        <h2 className="font-display text-3xl font-extrabold text-gradient-gold mb-3">
          {iWon ? 'You won!' : 'Winner declared'}
        </h2>

        <div className="panel px-6 py-5 text-center shadow-glow-gold mb-2">
          <div className="text-[10px] font-mono text-text-muted mb-1">
            {winner ? `${winner.addr.slice(0, 6)}…${winner.addr.slice(-4)}` : 'Unknown'}
          </div>
          <div className="font-display text-3xl font-extrabold text-celo-green tabular">
            +◈{(Number(game.totalPot) / 1e18).toFixed(2)}
          </div>
          <div className="text-[10px] font-mono text-text-muted mt-1">cUSD prize · trophy minted on-chain</div>
        </div>
      </div>
    )
  }

  const joinedCount = game.players.length
  const currentName = game.players[game.currentTurn]?.addr

  // ─── Active game ─────────────────────────────────────────────
  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Players */}
      <div className="px-3 pt-3">
        <PlayerPanel players={game.players} currentTurn={game.currentTurn} address={address} />
      </div>

      {/* Board */}
      <div className="flex-1 flex items-center justify-center px-3 py-3 min-h-0">
        <div className="w-full max-w-[620px]">
          <Board game={game} />
        </div>
      </div>

      {/* Action bar */}
      <div className="sticky bottom-0 z-20 px-3 pb-3 safe-bottom">
        <div className="panel-glass p-3.5">
          {!game.started ? (
            // ── Waiting room ──
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="label-kicker mb-0.5">Table</div>
                  <div className="font-display text-lg font-extrabold text-gradient-gold tabular leading-none">
                    #{gameId.toString()}
                  </div>
                </div>
                <button onClick={copyId} className="btn-ghost px-3 py-2 text-xs">
                  {copied ? '✓ Copied' : 'Copy ID'}
                </button>
                <div className="text-right">
                  <div className="label-kicker mb-0.5">Players</div>
                  <div className="font-display text-lg font-extrabold text-text-primary leading-none">
                    {joinedCount}<span className="text-text-muted">/4</span>
                  </div>
                </div>
              </div>

              {isHost ? (
                <button className="btn-primary w-full" onClick={handleStart} disabled={isPending || joinedCount < 2}>
                  {isPending ? 'Starting…' : joinedCount < 2 ? 'Need 2+ players' : 'Start Game'}
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 text-text-secondary text-xs py-3">
                  <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                  Waiting for host to start…
                </div>
              )}
            </div>
          ) : (
            // ── Play controls ──
            <>
              <Dice die1={lastDiceRoll?.die1 ?? null} die2={lastDiceRoll?.die2 ?? null} rolling={rolling} />

              <div className="flex gap-2 mt-2.5">
                {isMyTurn ? (
                  <>
                    <button className="btn-primary flex-1" onClick={handleRoll} disabled={isPending || rolling}>
                      {rolling ? 'Rolling…' : isPending ? 'Confirming…' : '🎲 Roll Dice'}
                    </button>
                    {canBuy && (
                      <button className="btn-success px-5" onClick={handleBuy} disabled={isPending}>
                        Buy ◈{currentCell!.price}
                      </button>
                    )}
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center gap-2 text-text-secondary text-xs py-3.5">
                    <Logo size={16} />
                    Waiting for <span className="font-mono text-text-primary">{currentName?.slice(0, 6)}…</span>
                  </div>
                )}
              </div>

              {isMyTurn && currentCell && (
                <p className="text-center text-[11px] text-text-muted mt-2 px-2 leading-snug">
                  On <span className="text-text-secondary">{currentCell.name}</span> · {currentCell.lesson}
                </p>
              )}

              {actionMsg && <div className="text-center text-gold text-xs mt-2 font-mono">{actionMsg}</div>}
              {error && (
                <div className="text-center text-danger text-xs mt-2 font-mono">
                  {error.message?.slice(0, 64)}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <CardModal />
    </div>
  )
}
