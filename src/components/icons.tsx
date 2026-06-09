// Crisp 24x24 line icons (stroke = currentColor) for the landing cards & nav.
import { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>
const base = (p: P) => ({
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...p,
})

export const IconWallet = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H5a2 2 0 0 1-2-2Z" />
    <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7H6" />
    <circle cx="16.5" cy="13.5" r="1.2" fill="currentColor" stroke="none" />
  </svg>
)

export const IconDice = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <circle cx="8" cy="8" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="16" cy="8" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="8" cy="16" r="1.3" fill="currentColor" stroke="none" />
    <circle cx="16" cy="16" r="1.3" fill="currentColor" stroke="none" />
  </svg>
)

export const IconTrophy = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
    <path d="M7 5H4v1a3 3 0 0 0 3 3M17 5h3v1a3 3 0 0 1-3 3" />
    <path d="M9 20h6M12 13v4" />
  </svg>
)

export const IconChart = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 19h16" />
    <path d="M7 19v-6M12 19V8M17 19v-9" />
    <path d="M5 9l4-4 3 2 6-5" />
    <path d="M18 2h2v2" />
  </svg>
)

export const IconScale = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 4v16M7 20h10M12 6l-6 2M12 6l6 2" />
    <path d="M3 13l3-5 3 5a3 3 0 0 1-6 0ZM15 13l3-5 3 5a3 3 0 0 1-6 0Z" />
  </svg>
)

export const IconShield = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
)
