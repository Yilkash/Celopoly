import { createConfig, http } from 'wagmi'
import { celo, celoAlfajores } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

declare global {
  interface Window {
    ethereum?: {
      isMiniPay?: boolean
      isMetaMask?: boolean
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      on?: (event: string, cb: (...args: unknown[]) => void) => void
      removeListener?: (event: string, cb: (...args: unknown[]) => void) => void
    }
  }
}

export const wagmiConfig = createConfig({
  chains: [celo, celoAlfajores],
  connectors: [injected()],
  transports: {
    [celo.id]: http('https://forno.celo.org'),
    [celoAlfajores.id]: http('https://alfajores-forno.celo-testnet.org'),
  },
})
