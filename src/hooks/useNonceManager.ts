import { useState, useCallback } from 'react'
import { keccak256, toBytes } from 'viem'

export function useNonceManager() {
  const [nonce, setNonce] = useState<bigint>(() =>
    BigInt(Math.floor(Math.random() * 1000000000))
  )

  const commitment = keccak256(toBytes(nonce))

  const generateNewNonce = useCallback(() => {
    const newNonce = BigInt(Math.floor(Math.random() * 1000000000000))
    setNonce(newNonce)
    return newNonce
  }, [])

  return { nonce, commitment, generateNewNonce }
}
