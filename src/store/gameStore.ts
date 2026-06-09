import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { GameRoom, GameEvent, Player } from '@/types'

interface GameState {
  address: `0x${string}` | null
  chainId: number | null
  gameId: bigint | null
  game: GameRoom | null
  currentPlayerIndex: number | null
  isMiniPay: boolean
  logs: string[]
  lastDiceRoll: { die1: number; die2: number } | null
  showCard: { type: 'chance' | 'community'; index: number } | null

  setAddress: (address: `0x${string}` | null) => void
  setChainId: (chainId: number | null) => void
  setGameId: (gameId: bigint | null) => void
  setGame: (game: GameRoom | null) => void
  setCurrentPlayerIndex: (idx: number | null) => void
  setIsMiniPay: (v: boolean) => void
  addLog: (msg: string) => void
  setLastDiceRoll: (roll: { die1: number; die2: number } | null) => void
  setShowCard: (card: { type: 'chance' | 'community'; index: number } | null) => void
  applyEvent: (event: GameEvent) => void
  reset: () => void
}

const initialGame: GameRoom = {
  gameId: 0n,
  players: [],
  playerCount: 0,
  currentTurn: 0,
  activePlayerCount: 0,
  propertyOwner: new Array(40).fill(0),
  houseCount: new Array(40).fill(0),
  started: false,
  ended: false,
  totalPot: 0n,
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      address: null,
      chainId: null,
      gameId: null,
      game: null,
      currentPlayerIndex: null,
      isMiniPay: false,
      logs: [],
      lastDiceRoll: null,
      showCard: null,

      setAddress: (address) => set({ address }),
      setChainId: (chainId) => set({ chainId }),
      setGameId: (gameId) => set({ gameId }),
      setGame: (game) => set({ game }),
      setCurrentPlayerIndex: (idx) => set({ currentPlayerIndex: idx }),
      setIsMiniPay: (v) => set({ isMiniPay: v }),
      addLog: (msg) => set((s) => ({ logs: [...s.logs.slice(-99), msg] })),
      setLastDiceRoll: (roll) => set({ lastDiceRoll: roll }),
      setShowCard: (card) => set({ showCard: card }),

      applyEvent: (event) => {
        const s = get()
        if (!s.game) return
        const game = { ...s.game }

        switch (event.type) {
          case 'DICE_ROLLED':
            set({ lastDiceRoll: { die1: event.die1, die2: event.die2 } })
            break
          case 'TURN_CHANGED':
            game.currentTurn = event.turnIndex
            break
          case 'PROPERTY_BOUGHT': {
            const owners = [...game.propertyOwner]
            owners[event.cell] = game.players.findIndex(p => p.addr === event.buyer) + 1
            game.propertyOwner = owners
            break
          }
          case 'PLAYER_BANKRUPT': {
            const players = game.players.map(p =>
              p.addr === event.player ? { ...p, bankrupt: true } : p
            )
            game.players = players
            game.activePlayerCount--
            break
          }
          case 'GAME_ENDED':
            game.ended = true
            break
        }

        set({ game })
      },

      reset: () => set({
        gameId: null,
        game: null,
        currentPlayerIndex: null,
        logs: [],
        lastDiceRoll: null,
        showCard: null,
      }),
    }),
    {
      name: 'celopoly-game',
      partialize: (state) => ({
        gameId: state.gameId,
        game: state.game,
        currentPlayerIndex: state.currentPlayerIndex,
        logs: state.logs,
      }),
    }
  )
)
