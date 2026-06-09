// Shared brand mark + player palette for the Neon Ledger design system.

export const PLAYER_COLORS = ['#FCCE47', '#35D07F', '#5EA3F7', '#FF4D6D']
export const PLAYER_GLOW = [
  'rgba(252,206,71,0.55)',
  'rgba(53,208,127,0.55)',
  'rgba(94,163,247,0.55)',
  'rgba(255,77,109,0.55)',
]

// A die-face logo mark — wealth (gold) meets play (dice).
export function Logo({ size = 36 }: { size?: number }) {
  const pips: [number, number][] = [
    [30, 30], [70, 30],
    [50, 50],
    [30, 70], [70, 70],
  ]
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden
      style={{ filter: 'drop-shadow(0 3px 8px rgba(252,206,71,0.4))' }}
    >
      <defs>
        <linearGradient id="logoFace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFE898" />
          <stop offset="0.5" stopColor="#FCCE47" />
          <stop offset="1" stopColor="#C4961A" />
        </linearGradient>
        <linearGradient id="logoSheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="0.5" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <linearGradient id="logoStroke" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.7)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="84" height="84" rx="24" fill="url(#logoFace)" />
      <rect x="11" y="11" width="78" height="36" rx="18" fill="url(#logoSheen)" opacity="0.7" />
      <rect x="8.5" y="8.5" width="83" height="83" rx="23.5" fill="none" stroke="url(#logoStroke)" strokeWidth="1.5" />
      {pips.map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="8.5" fill="#0A0B0F" opacity="0.9" />
          <circle cx={cx - 1.6} cy={cy - 2} r="2.4" fill="rgba(255,255,255,0.18)" />
        </g>
      ))}
    </svg>
  )
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-display font-extrabold tracking-tight ${className}`}>
      <span className="text-text-primary">Celo</span>
      <span className="text-gradient-gold">PolY</span>
    </span>
  )
}
