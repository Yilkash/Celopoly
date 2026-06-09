import { useState, useCallback } from 'react'
import { useWriteContract, useReadContract } from 'wagmi'
import { CUSD_ABI, GAME_ABI, ENTRY_STAKE, getCUSDAddress, getGameAddress } from '@/utils/contracts'
import { useGameStore } from '@/store/gameStore'

export function useJoinGame() {
  const chainId = useGameStore((s) => s.chainId)
  const address = useGameStore((s) => s.address)
  const [step, setStep] = useState<'idle' | 'approving' | 'joining'>('idle')

  const { writeContract: writeApprove, isSuccess: approveSuccess, isPending: approvePending } = useWriteContract()
  const { writeContract: writeJoin, isSuccess: joinSuccess, isPending: joinPending, data: joinTx } = useWriteContract()

  const cUSDAddr = getCUSDAddress(chainId || 44787)
  const gameAddr = getGameAddress(chainId || 44787)

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: cUSDAddr,
    abi: CUSD_ABI,
    functionName: 'allowance',
    args: address ? [address, gameAddr] : undefined,
    query: { enabled: !!address },
  })

  const handleJoin = useCallback((gameId: bigint) => {
    if ((allowance ?? 0n) < ENTRY_STAKE) {
      setStep('approving')
      writeApprove({
        address: cUSDAddr,
        abi: CUSD_ABI,
        functionName: 'approve',
        args: [gameAddr, ENTRY_STAKE],
        feeCurrency: cUSDAddr,
      })
    } else {
      setStep('joining')
      writeJoin({
        address: gameAddr,
        abi: GAME_ABI,
        functionName: 'joinGame',
        args: [gameId],
        feeCurrency: cUSDAddr,
      })
    }
  }, [allowance, cUSDAddr, gameAddr, writeApprove, writeJoin])

  const handleApproveAndJoin = useCallback((gameId: bigint) => {
    handleJoin(gameId)
  }, [handleJoin])

  return {
    handleJoin: handleApproveAndJoin,
    step,
    approveSuccess,
    approvePending,
    joinSuccess,
    joinPending,
    joinTx,
    refetchAllowance,
  }
}
