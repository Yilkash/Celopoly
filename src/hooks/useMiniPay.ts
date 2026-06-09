import { useEffect, useCallback } from 'react'
import { useConnect, useAccount, useSwitchChain } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { useGameStore } from '@/store/gameStore'
import { CHAIN_ID_MAINNET } from '@/utils/contracts'

export function useMiniPay() {
  const { address, isConnected, chainId } = useAccount()
  const { connect } = useConnect()
  const { switchChain } = useSwitchChain()
  const setAddress = useGameStore((s) => s.setAddress)
  const setChainId = useGameStore((s) => s.setChainId)
  const setIsMiniPay = useGameStore((s) => s.setIsMiniPay)

  const isMiniPay = typeof window !== 'undefined' &&
    window.ethereum?.isMiniPay === true

  useEffect(() => {
    setIsMiniPay(isMiniPay)
  }, [isMiniPay, setIsMiniPay])

  useEffect(() => {
    if (isMiniPay && !isConnected) {
      connect({ connector: injected() })
    }
  }, [isMiniPay, isConnected, connect])

  useEffect(() => {
    if (isMiniPay && isConnected && chainId && chainId !== CHAIN_ID_MAINNET) {
      switchChain({ chainId: CHAIN_ID_MAINNET })
    }
  }, [isMiniPay, isConnected, chainId, switchChain])

  useEffect(() => {
    setAddress(address ?? null)
  }, [address, setAddress])

  useEffect(() => {
    setChainId(chainId ?? null)
  }, [chainId, setChainId])

  const vibrate = useCallback((pattern: number | number[]) => {
    if (isMiniPay && navigator.vibrate) {
      navigator.vibrate(pattern)
    }
  }, [isMiniPay])

  return { address, isConnected, chainId, isMiniPay, vibrate }
}
