import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { wagmiConfig } from './utils/wagmiConfig'
import App from './App'
import './index.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
)
/* Activity Surge 2: Thu 11 Jun 2026 12:46:29 WAT */
/* Activity Surge 13: Thu 11 Jun 2026 12:46:29 WAT */
/* Activity Surge 15: Thu 11 Jun 2026 12:46:29 WAT */
/* Activity Surge 16: Thu 11 Jun 2026 12:46:29 WAT */
/* Activity Surge 17: Thu 11 Jun 2026 12:46:29 WAT */
