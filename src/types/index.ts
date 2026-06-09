export enum CellType {
  Go = 0,
  Property = 1,
  CommunityChest = 2,
  Tax = 3,
  Railroad = 4,
  Chance = 5,
  Jail = 6,
  Utility = 7,
  GoToJail = 8,
  FreeParking = 9,
}

export interface BoardCell {
  cell: number
  name: string
  cellType: CellType
  colorGroup: number
  price: number
  houseCost: number
  rent: number[]
  svgX: number
  svgY: number
  svgW: number
  svgH: number
  lesson: string
}

export interface Player {
  addr: `0x${string}`
  balance: bigint
  position: number
  jailTurns: number
  bankrupt: boolean
  hasCommitted: boolean
}

export interface GameRoom {
  gameId: bigint
  players: Player[]
  playerCount: number
  currentTurn: number
  activePlayerCount: number
  propertyOwner: number[]
  houseCount: number[]
  started: boolean
  ended: boolean
  totalPot: bigint
}

export interface GameCard {
  id: number
  type: 'chance' | 'community'
  title: string
  body: string
  effect: number
  lesson: string
}

export type GameEvent =
  | { type: 'TURN_CHANGED'; nextPlayer: `0x${string}`; turnIndex: number }
  | { type: 'DICE_ROLLED'; player: `0x${string}`; die1: number; die2: number; newPosition: number }
  | { type: 'PROPERTY_BOUGHT'; cell: number; buyer: `0x${string}`; price: bigint }
  | { type: 'RENT_PAID'; payer: `0x${string}`; receiver: `0x${string}`; amount: bigint; cell: number }
  | { type: 'HOUSE_BUILT'; cell: number; newHouseCount: number }
  | { type: 'PLAYER_JAILED'; player: `0x${string}` }
  | { type: 'PLAYER_RELEASED'; player: `0x${string}` }
  | { type: 'CARD_DRAWN'; player: `0x${string}`; cardType: number; cardIndex: number; effect: bigint }
  | { type: 'PLAYER_BANKRUPT'; player: `0x${string}` }
  | { type: 'GAME_ENDED'; winner: `0x${string}`; prize: bigint }
  | { type: 'GAME_CREATED'; gameId: bigint; host: `0x${string}` }
  | { type: 'PLAYER_JOINED'; gameId: bigint; player: `0x${string}`; playerIndex: number }
