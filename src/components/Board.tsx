import { useMemo } from 'react'
import { BOARD, PROPERTY_COLORS, getCell } from '@/data/board'
import { CellType, GameRoom, BoardCell } from '@/types'
import { useGameStore } from '@/store/gameStore'
import { PLAYER_COLORS } from './Logo'

const SIZE = 550
const VBH = 594 // extra height for the board's front edge (thickness)
const BAND = 11

type Side = 'bottom' | 'left' | 'top' | 'right'

function sideOf(c: BoardCell): Side {
  if (c.svgY === 490) return 'bottom'
  if (c.svgX === 0) return 'left'
  if (c.svgY === 0) return 'top'
  return 'right'
}

function splitName(name: string): string[] {
  const w = name.split(' ')
  if (w.length <= 1) return [name]
  const mid = Math.ceil(w.length / 2)
  return [w.slice(0, mid).join(' '), w.slice(mid).join(' ')]
}

const CELL_ICON: Partial<Record<CellType, string>> = {
  [CellType.Go]: '↑',
  [CellType.CommunityChest]: '🎁',
  [CellType.Chance]: '?',
  [CellType.Tax]: '◈',
  [CellType.Jail]: '⛓',
  [CellType.FreeParking]: '✦',
  [CellType.GoToJail]: '🚓',
}

const TOKEN_OFFSETS = [
  { dx: -9, dy: -9 },
  { dx: 9, dy: -9 },
  { dx: -9, dy: 9 },
  { dx: 9, dy: 9 },
]

const LIVE_COINS = [
  { x: 150, delay: '0s' },
  { x: 215, delay: '1.1s' },
  { x: 335, delay: '0.5s' },
  { x: 400, delay: '1.7s' },
  { x: 275, delay: '2.3s' },
]

// A small extruded house glyph drawn at (x, y) top-left of a ~7px footprint.
function House({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y + 2} width="5" height="4" rx="0.6" fill="#1FA862" />
      <rect x={x} y={y + 2} width="5" height="1.4" fill="#3BD98A" />
      <path d={`M${x - 0.6} ${y + 2.2} L${x + 2.5} ${y - 0.6} L${x + 5.6} ${y + 2.2} Z`} fill="#5BE6A3" />
    </g>
  )
}

interface BoardProps {
  game: GameRoom
  live?: boolean
}

export function Board({ game, live = false }: BoardProps) {
  const lastDiceRoll = useGameStore((s) => s.lastDiceRoll)
  const address = useGameStore((s) => s.address)

  const potCusd = useMemo(() => {
    const n = Number(game.totalPot) / 1e18
    return Number.isInteger(n) ? n.toString() : n.toFixed(2)
  }, [game.totalPot])

  const currentAddr = game.players[game.currentTurn]?.addr
  const isMyTurn = address && currentAddr === address

  return (
    <div className="relative w-full mx-auto board-stage">
      <div className={`board-3d ${live ? 'board-float' : ''}`}>
        <svg
          viewBox={`0 0 ${SIZE} ${VBH}`}
          className="w-full h-auto"
          style={{ filter: 'drop-shadow(0 26px 40px rgba(0,0,0,0.55))' }}
        >
          <defs>
            <linearGradient id="boardBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#141823" />
              <stop offset="1" stopColor="#0A0B0F" />
            </linearGradient>
            <linearGradient id="boardEdge" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#20242F" />
              <stop offset="1" stopColor="#070809" />
            </linearGradient>
            <radialGradient id="centerGlow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="rgba(252,206,71,0.12)" />
              <stop offset="1" stopColor="rgba(252,206,71,0)" />
            </radialGradient>
            <linearGradient id="cellFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1F2433" />
              <stop offset="0.5" stopColor="#171B27" />
              <stop offset="1" stopColor="#10131B" />
            </linearGradient>
            <linearGradient id="cellSpecial" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#13161F" />
              <stop offset="1" stopColor="#0C0E15" />
            </linearGradient>
            <linearGradient id="bandSheen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="rgba(255,255,255,0.45)" />
              <stop offset="0.5" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <linearGradient id="medallion" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#1B2030" />
              <stop offset="1" stopColor="#0C0F18" />
            </linearGradient>
            <radialGradient id="tokenSphere" cx="0.35" cy="0.3" r="0.8">
              <stop offset="0" stopColor="rgba(255,255,255,0.85)" />
              <stop offset="0.35" stopColor="rgba(255,255,255,0.12)" />
              <stop offset="1" stopColor="rgba(0,0,0,0.35)" />
            </radialGradient>
            <filter id="tokenGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="2.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* ── Board slab with thickness ── */}
          <rect x="10" y="562" width="530" height="30" rx="15" fill="#040506" />
          <rect x="2" y="546" width="546" height="44" rx="16" fill="url(#boardEdge)" />
          <rect x="0" y="0" width={SIZE} height="554" rx="20" fill="url(#boardBg)" />
          <line x1="18" y1="553.5" x2="532" y2="553.5" stroke="rgba(252,206,71,0.3)" strokeWidth="1.2" />

          {/* glows + frame */}
          <rect x="58" y="58" width="434" height="434" rx="10" fill="url(#centerGlow)">
            {live && <animate attributeName="opacity" values="0.6;1;0.6" dur="4s" repeatCount="indefinite" />}
          </rect>
          <rect x="6" y="6" width={SIZE - 12} height="542" rx="16" fill="none" stroke="rgba(252,206,71,0.12)" strokeWidth="1.5" />
          <rect x="9" y="9" width={SIZE - 18} height="536" rx="14" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <rect x="56" y="56" width="438" height="438" rx="12" fill="none" stroke="#1E2434" strokeWidth="1" />

          {/* ── Cells ── */}
          {BOARD.map((c) => {
            const side = sideOf(c)
            const isCorner = c.svgW === 60 && c.svgH === 60
            const horiz = side === 'bottom' || side === 'top'
            const L = isCorner ? 60 : horiz ? c.svgW : c.svgH
            const D = isCorner ? 60 : horiz ? c.svgH : c.svgW

            const transform = isCorner
              ? `translate(${c.svgX} ${c.svgY})`
              : side === 'bottom'
              ? `translate(${c.svgX} ${c.svgY})`
              : side === 'top'
              ? `translate(${c.svgX + c.svgW} ${c.svgY + c.svgH}) rotate(180)`
              : side === 'left'
              ? `translate(${c.svgX + c.svgW} ${c.svgY}) rotate(90)`
              : `translate(${c.svgX} ${c.svgY + c.svgH}) rotate(-90)`

            const isBuyable =
              c.cellType === CellType.Property ||
              c.cellType === CellType.Railroad ||
              c.cellType === CellType.Utility
            const groupColor = c.colorGroup >= 0 ? PROPERTY_COLORS[c.colorGroup] : undefined
            const owner = game.propertyOwner[c.cell]
            const ownerIdx = owner > 0 ? owner - 1 : -1
            const ownerColor = ownerIdx >= 0 ? PLAYER_COLORS[ownerIdx] : undefined
            const houses = game.houseCount[c.cell]
            const occupied = game.players.some((p) => p.position === c.cell && !p.bankrupt)
            const justLanded = !!lastDiceRoll && occupied
            const icon = CELL_ICON[c.cellType]
            const nameLines = splitName(c.name)

            return (
              <g key={c.cell} transform={transform}>
                {/* base + bevel */}
                <rect
                  x="0.7"
                  y="0.7"
                  width={L - 1.4}
                  height={D - 1.4}
                  rx="3.5"
                  fill={isBuyable ? 'url(#cellFill)' : 'url(#cellSpecial)'}
                  stroke={justLanded ? '#FCCE47' : '#262D3E'}
                  strokeWidth={justLanded ? 1.6 : 0.8}
                />
                <line x1="2.5" y1="2" x2={L - 2.5} y2="2" stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" />
                <line x1="2.5" y1={D - 1.6} x2={L - 2.5} y2={D - 1.6} stroke="rgba(0,0,0,0.5)" strokeWidth="0.8" />

                {ownerColor && (
                  <rect x="1.4" y="1.4" width={L - 2.8} height={D - 2.8} rx="3" fill={ownerColor} opacity="0.13" />
                )}

                {/* color header */}
                {isBuyable && groupColor && (
                  <>
                    <rect x="2" y="2" width={L - 4} height={BAND} rx="2" fill={groupColor} />
                    <rect x="2" y="2" width={L - 4} height={BAND / 2} rx="2" fill="url(#bandSheen)" opacity="0.6" />
                    <line x1="2" y1={BAND + 2.5} x2={L - 2} y2={BAND + 2.5} stroke="rgba(0,0,0,0.45)" strokeWidth="0.7" />
                    {ownerColor && <circle cx={L - 6.5} cy={BAND / 2 + 2} r="3" fill={ownerColor} stroke="#0A0B0F" strokeWidth="0.8" />}
                  </>
                )}

                {/* houses / hotel */}
                {isBuyable && houses > 0 && houses < 5 && (
                  <g>
                    {Array.from({ length: houses }).map((_, i) => (
                      <House key={i} x={L / 2 - houses * 3.6 + i * 7.2} y={BAND + 5} />
                    ))}
                  </g>
                )}
                {isBuyable && houses >= 5 && (
                  <g>
                    <rect x={L / 2 - 9} y={BAND + 4} width="18" height="6" rx="1.5" fill="#C0344B" />
                    <rect x={L / 2 - 9} y={BAND + 4} width="18" height="2" rx="1" fill="#FF6B85" />
                  </g>
                )}

                {/* special / corner icon */}
                {icon && (
                  <text
                    x={L / 2}
                    y={isCorner ? D / 2 - 4 : D / 2 - 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={isCorner ? 17 : 13}
                    fill={c.cellType === CellType.Go || c.cellType === CellType.GoToJail ? '#FCCE47' : '#9AA5B8'}
                    fontFamily="Inter, sans-serif"
                    fontWeight="bold"
                  >
                    {icon}
                  </text>
                )}

                {/* name */}
                {nameLines.map((ln, i) => (
                  <text
                    key={i}
                    x={L / 2}
                    y={isBuyable ? BAND + 9 + i * 6 : (isCorner ? D / 2 + 13 : D - 6) + i * 5.6}
                    textAnchor="middle"
                    fill={isBuyable ? (ownerColor ? '#E8EDF5' : '#C9D1DF') : '#909AAD'}
                    fontSize={isBuyable ? 5.4 : 5.2}
                    fontWeight={isBuyable ? 600 : 500}
                    fontFamily="Inter, sans-serif"
                  >
                    {ln}
                  </text>
                ))}

                {/* price */}
                {isBuyable && (
                  <text x={L / 2} y={D - 4.5} textAnchor="middle" fill="#828BA0" fontSize="5.4" fontFamily="DM Mono, monospace" fontWeight="500">
                    ◈{c.price}
                  </text>
                )}
              </g>
            )
          })}

          {/* ── Center medallion (raised) ── */}
          <g filter="url(#softShadow)">
            <rect x="92" y="170" width="366" height="210" rx="22" fill="url(#medallion)" stroke="#2C3346" strokeWidth="1" />
            <rect x="93" y="171" width="364" height="60" rx="20" fill="rgba(255,255,255,0.025)" />
            <rect x="92.5" y="170.5" width="365" height="209" rx="21.5" fill="none" stroke="rgba(252,206,71,0.14)" strokeWidth="1" />

            <text x="275" y="212" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="800" fontSize="34" fill="#F0F2F8">
              Celo<tspan fill="#FCCE47">PolY</tspan>
            </text>
            <text x="275" y="234" textAnchor="middle" fontFamily="DM Mono, monospace" fontSize="9" fill="#5A6273" letterSpacing="2">
              OWN THE BLOCK
            </text>
            <line x1="150" y1="252" x2="400" y2="252" stroke="#272D3F" strokeWidth="1" />
            <text x="275" y="276" textAnchor="middle" fontFamily="DM Mono, monospace" fontSize="9" fill="#5A6273" letterSpacing="3">
              PRIZE POOL
            </text>
            <text x="275" y="320" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="800" fontSize="46" fill="#FCCE47">
              ◈{potCusd}
            </text>
            <text x="275" y="340" textAnchor="middle" fontFamily="DM Mono, monospace" fontSize="9" fill="#8892A4">
              cUSD · winner takes all
            </text>
            {game.started && !game.ended && currentAddr && (
              <text x="275" y="364" textAnchor="middle" fontFamily="Inter, sans-serif" fontSize="10" fill={isMyTurn ? '#FCCE47' : '#8892A4'} fontWeight="bold">
                {isMyTurn ? '● YOUR TURN' : `● ${currentAddr.slice(0, 6)}…'s turn`}
              </text>
            )}
          </g>

          {/* ── Rising coins (live) ── */}
          {live &&
            LIVE_COINS.map((c, i) => (
              <g key={`coin-${i}`}>
                <circle cx={c.x} cy="478" r="4.2" fill="#FCCE47" opacity="0" stroke="#C4961A" strokeWidth="0.7">
                  <animate attributeName="cy" values="478;398" dur="3.4s" begin={c.delay} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0;0.95;0.95;0" dur="3.4s" begin={c.delay} repeatCount="indefinite" />
                </circle>
                <text x={c.x} y="478" textAnchor="middle" dominantBaseline="middle" fontSize="4.6" fill="#1a1505" fontWeight="bold" opacity="0">
                  $
                  <animate attributeName="y" values="478;398" dur="3.4s" begin={c.delay} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0;0.95;0.95;0" dur="3.4s" begin={c.delay} repeatCount="indefinite" />
                </text>
              </g>
            ))}

          {/* ── Player tokens (glossy domes) ── */}
          {game.players.map((player, idx) => {
            if (player.bankrupt) return null
            const cell = getCell(player.position)
            const samecell = game.players.filter((p, i) => !p.bankrupt && p.position === player.position && i <= idx).length - 1
            const { dx, dy } = TOKEN_OFFSETS[samecell] || TOKEN_OFFSETS[0]
            const tx = cell.svgX + cell.svgW / 2 + dx
            const ty = cell.svgY + cell.svgH / 2 + dy
            const isCurrent = idx === game.currentTurn
            const isMe = address === player.addr
            const color = PLAYER_COLORS[idx] || '#8892A4'
            const r = isCurrent ? 7.5 : 6

            return (
              <g key={player.addr}>
                {/* contact shadow on the board */}
                <ellipse cx={tx} cy={ty + r - 0.5} rx={r * 0.9} ry={r * 0.4} fill="#000" opacity="0.35" />
                <g filter="url(#tokenGlow)">
                  {live && (
                    <animateTransform attributeName="transform" type="translate" values="0 0; 0 -3.5; 0 0" dur="2.4s" begin={`${idx * 0.4}s`} repeatCount="indefinite" />
                  )}
                  {(isCurrent || live) && (
                    <circle cx={tx} cy={ty} r="9" fill="none" stroke={color} strokeWidth="1">
                      <animate attributeName="r" values="8;13;8" dur="1.8s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.7;0;0.7" dur="1.8s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle cx={tx} cy={ty} r={r} fill={color} stroke="#0A0B0F" strokeWidth="1.4" />
                  <circle cx={tx} cy={ty} r={r} fill="url(#tokenSphere)" />
                  {isMe && <circle cx={tx} cy={ty} r={r + 1.4} fill="none" stroke="#F0F2F8" strokeWidth="1" />}
                </g>
              </g>
            )
          })}
        </svg>
      </div>
      <div className="board-contact-shadow" />
    </div>
  )
}
