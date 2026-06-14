import { useEffect } from 'react'
import { useWatchContractEvent } from 'wagmi'
import { GAME_ABI, getGameAddress } from '@/utils/contracts'
import { useGameStore } from '@/store/gameStore'

export function useGameEventStream(gameId: bigint | null) {
  const chainId = useGameStore((s) => s.chainId)
  const applyEvent = useGameStore((s) => s.applyEvent)
  const addLog = useGameStore((s) => s.addLog)

  const gameAddress = getGameAddress(chainId || 44787)

  useWatchContractEvent({
    address: gameAddress,
    abi: GAME_ABI,
    eventName: 'TurnChanged',
    args: gameId ? { gameId } : undefined,
    onLogs: (logs) => {
      logs.forEach(log => {
        applyEvent({
          type: 'TURN_CHANGED',
          nextPlayer: log.args.nextPlayer as `0x${string}`,
          turnIndex: Number(log.args.newTurnIndex),
        })
        addLog(`Turn changed to player ${log.args.newTurnIndex}`)
      })
    },
    enabled: !!gameId,
  })

  useWatchContractEvent({
    address: gameAddress,
    abi: GAME_ABI,
    eventName: 'DiceRolled',
    args: gameId ? { gameId } : undefined,
    onLogs: (logs) => {
      logs.forEach(log => {
        applyEvent({
          type: 'DICE_ROLLED',
          player: log.args.player as `0x${string}`,
          die1: Number(log.args.die1),
          die2: Number(log.args.die2),
          newPosition: Number(log.args.newPosition),
        })
        addLog(`Player rolled ${log.args.die1} + ${log.args.die2}`)
      })
    },
    enabled: !!gameId,
  })

  useWatchContractEvent({
    address: gameAddress,
    abi: GAME_ABI,
    eventName: 'PropertyBought',
    args: gameId ? { gameId } : undefined,
    onLogs: (logs) => {
      logs.forEach(log => {
        applyEvent({
          type: 'PROPERTY_BOUGHT',
          cell: Number(log.args.cell),
          buyer: log.args.buyer as `0x${string}`,
          price: log.args.price as bigint,
        })
        addLog(`Property ${log.args.cell} bought by ${(log.args.buyer as string).slice(0, 6)}`)
      })
    },
    enabled: !!gameId,
  })

  useWatchContractEvent({
    address: gameAddress,
    abi: GAME_ABI,
    eventName: 'RentPaid',
    args: gameId ? { gameId } : undefined,
    onLogs: (logs) => {
      logs.forEach(log => {
        applyEvent({
          type: 'RENT_PAID',
          payer: log.args.payer as `0x${string}`,
          receiver: log.args.receiver as `0x${string}`,
          amount: log.args.amount as bigint,
          cell: Number(log.args.cell),
        })
        addLog(`Rent paid: ${log.args.amount} cUSD`)
      })
    },
    enabled: !!gameId,
  })

  useWatchContractEvent({
    address: gameAddress,
    abi: GAME_ABI,
    eventName: 'PlayerBankrupt',
    args: gameId ? { gameId } : undefined,
    onLogs: (logs) => {
      logs.forEach(log => {
        applyEvent({
          type: 'PLAYER_BANKRUPT',
          player: log.args.player as `0x${string}`,
        })
        addLog(`Player ${(log.args.player as string).slice(0, 6)} bankrupt!`)
      })
    },
    enabled: !!gameId,
  })

  useWatchContractEvent({
    address: gameAddress,
    abi: GAME_ABI,
    eventName: 'GameEnded',
    args: gameId ? { gameId } : undefined,
    onLogs: (logs) => {
      logs.forEach(log => {
        applyEvent({
          type: 'GAME_ENDED',
          winner: log.args.winner as `0x${string}`,
          prize: log.args.prize as bigint,
        })
        addLog(`Game ended! Winner: ${(log.args.winner as string).slice(0, 6)}`)
      })
    },
    enabled: !!gameId,
  })

  useWatchContractEvent({
    address: gameAddress,
    abi: GAME_ABI,
    eventName: 'CardDrawn',
    args: gameId ? { gameId } : undefined,
    onLogs: (logs) => {
      logs.forEach(log => {
        addLog(`Card drawn: type=${log.args.cardType} index=${log.args.cardIndex}`)
      })
    },
    enabled: !!gameId,
  })
}
