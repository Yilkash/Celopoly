import { useWriteContract } from 'wagmi'
import { GAME_ABI, CUSD_ABI, getCUSDAddress, getGameAddress } from '@/utils/contracts'
import { useGameStore } from '@/store/gameStore'

export function useCeloTx() {
  const chainId = useGameStore((s) => s.chainId)
  const { writeContract, isPending, isSuccess, error, data } = useWriteContract()

  const getCUSD = () => getCUSDAddress(chainId || 44787)
  const getGame = () => getGameAddress(chainId || 44787)

  const rollDice = (gameId: bigint, revealedNonce: bigint) => {
    writeContract({
      address: getGame(),
      abi: GAME_ABI,
      functionName: 'rollDice',
      args: [gameId, revealedNonce],
      feeCurrency: getCUSD(),
    })
  }

  const buyProperty = (gameId: bigint, cell: number) => {
    writeContract({
      address: getGame(),
      abi: GAME_ABI,
      functionName: 'buyProperty',
      args: [gameId, cell],
      feeCurrency: getCUSD(),
    })
  }

  const buildHouse = (gameId: bigint, cell: number) => {
    writeContract({
      address: getGame(),
      abi: GAME_ABI,
      functionName: 'buildHouse',
      args: [gameId, cell],
      feeCurrency: getCUSD(),
    })
  }

  const createGame = () => {
    writeContract({
      address: getGame(),
      abi: GAME_ABI,
      functionName: 'createGame',
      args: [],
      feeCurrency: getCUSD(),
    })
  }

  const startGame = (gameId: bigint) => {
    writeContract({
      address: getGame(),
      abi: GAME_ABI,
      functionName: 'startGame',
      args: [gameId],
      feeCurrency: getCUSD(),
    })
  }

  const commitNonce = (gameId: bigint, commitment: `0x${string}`) => {
    writeContract({
      address: getGame(),
      abi: GAME_ABI,
      functionName: 'commitNonce',
      args: [gameId, commitment],
      feeCurrency: getCUSD(),
    })
  }

  const claimTimeout = (gameId: bigint) => {
    writeContract({
      address: getGame(),
      abi: GAME_ABI,
      functionName: 'claimTimeout',
      args: [gameId],
      feeCurrency: getCUSD(),
    })
  }

  const approveCUSD = (amount: bigint) => {
    writeContract({
      address: getCUSD(),
      abi: CUSD_ABI,
      functionName: 'approve',
      args: [getGame(), amount],
      feeCurrency: getCUSD(),
    })
  }

  return {
    rollDice, buyProperty, buildHouse, createGame, startGame, commitNonce, claimTimeout, approveCUSD,
    isPending, isSuccess, error, txHash: data,
  }
}
