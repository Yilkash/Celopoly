import { useEffect, useState } from 'react'
import { useAccount, useDisconnect, useConnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { useMiniPay } from './hooks/useMiniPay'
import { useGameEventStream } from './hooks/useGameEventStream'
import { useGameStore } from './store/gameStore'
import { Lobby } from './components/Lobby'
import { GameView } from './components/GameView'
import { Logo, Wordmark } from './components/Logo'

function App() {
  const { isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { connect, isPending: connectPending } = useConnect()
  useMiniPay()

  const gameId = useGameStore((s) => s.gameId)
  const reset = useGameStore((s) => s.reset)
  const address_ = useGameStore((s) => s.address)

  const [menuOpen, setMenuOpen] = useState(false)

  const handleDisconnect = () => {
    reset()
    disconnect()
    setMenuOpen(false)
  }

  useGameEventStream(gameId)

  useEffect(() => {
    if (!isConnected) {
      reset()
    }
  }, [isConnected, reset])

  const game = useGameStore((s) => s.game)
  const inGame = gameId !== null && game !== null && (game.started || game.playerCount > 0)

  return (
    <div className="min-h-dvh flex flex-col relative">
      {/* Ambient ledger grid backdrop */}
      <div className="pointer-events-none fixed inset-0 bg-ledger -z-10" aria-hidden />

      <header className="sticky top-0 z-30 safe-top">
        <div className="panel-glass mx-3 mt-2 px-3.5 py-2.5 flex items-center justify-between rounded-2xl">
          <div className="flex items-center gap-2.5">
            <Logo size={30} />
            <div className="flex flex-col leading-none">
              <Wordmark className="text-[15px]" />
              <span className="text-[9px] text-text-muted font-mono mt-0.5">Own the block.</span>
            </div>
          </div>

          {!isConnected && (
            <nav className="hidden lg:flex items-center gap-1">
              <a href="#how" className="nav-link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                  <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.6M12 16.5h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                How to Play
              </a>
              <a href="#lessons" className="nav-link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H18a2 2 0 0 1 2 2v13a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2V5.5ZM8 4v13" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg>
                Lessons
              </a>
              <a href="#prize" className="nav-link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M6 4h12v3a6 6 0 0 1-12 0V4ZM4 5h2M18 5h2M9 20h6M12 13v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Prize
              </a>
              <a href="https://docs.celo.org" target="_blank" rel="noopener noreferrer" className="nav-link">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M7 3h7l5 5v13H7V3Z M14 3v5h5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg>
                Docs
              </a>
            </nav>
          )}

          <div className="flex items-center gap-2 relative">
            {gameId !== null && (
              <button
                className="text-[11px] font-mono text-text-secondary hover:text-danger transition-colors px-2 py-1.5 rounded-lg active:scale-95"
                onClick={reset}
              >
                Exit
              </button>
            )}

            {!isConnected && (
              <button
                className="btn-primary !min-h-0 px-4 py-2 text-xs rounded-xl whitespace-nowrap"
                onClick={() => connect({ connector: injected() })}
                disabled={connectPending}
              >
                {connectPending ? 'Connecting…' : (
                  <>
                    Connect<span className="hidden sm:inline">&nbsp;Wallet</span>
                  </>
                )}
              </button>
            )}

            {address_ && (
              <button
                className="chip active:scale-95 transition-transform"
                onClick={() => setMenuOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-celo-green shadow-glow-green" />
                {address_.slice(0, 5)}…{address_.slice(-4)}
                <svg width="9" height="9" viewBox="0 0 10 10" className="opacity-60" aria-hidden>
                  <path d="M2 3.5 L5 6.5 L8 3.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}

            {menuOpen && address_ && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} aria-hidden />
                <div className="panel-glass absolute right-0 top-[calc(100%+8px)] z-50 w-44 p-1.5 rounded-2xl">
                  <button
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-[13px] font-medium text-danger hover:bg-danger/10 transition-colors active:scale-[0.98]"
                    onClick={handleDisconnect}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Disconnect
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {inGame ? <GameView /> : <Lobby />}
      </main>

      <footer className="px-4 py-3 text-center">
        <p className="text-[10px] text-text-muted font-mono">
          CeloPolY · Proof of Ship · <span className="text-text-secondary">Learn the rules of money</span>
        </p>
      </footer>
    </div>
  )
}

export default App
/* Activity Surge 1: Thu 11 Jun 2026 12:46:29 WAT */
/* Activity Surge 4: Thu 11 Jun 2026 12:46:29 WAT */
/* Activity Surge 5: Thu 11 Jun 2026 12:46:29 WAT */
/* Activity Surge 7: Thu 11 Jun 2026 12:46:29 WAT */
