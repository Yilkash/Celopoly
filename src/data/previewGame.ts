import { GameRoom, Player } from '@/types'

// A static, good-looking game state used purely as a showcase on the lobby.
const addrs: `0x${string}`[] = [
  '0xA17bC3f9e2D45a1b7C8e90F23dD4519aB6cE7F01',
  '0x5Ea3F7b21c9D4e8A6f0B13C7d2E54aF98b1C0d23',
  '0x35D07f1aB94c2E6d8F70a51B3c9D24eF6a7B0c45',
  '0xFf4D6e0c8A23b9D71e5F46aC1d80B92eF3a6C7d8',
]

function mkPlayer(addr: `0x${string}`, position: number, balance: number): Player {
  return {
    addr,
    balance: BigInt(balance) * 10n ** 15n,
    position,
    jailTurns: 0,
    bankrupt: false,
    hasCommitted: true,
  }
}

const propertyOwner = new Array(40).fill(0)
const houseCount = new Array(40).fill(0)

// Spread ownership across players to light up the board's color stripes.
;[1, 3, 6].forEach((c) => (propertyOwner[c] = 1))
;[11, 13, 14].forEach((c) => (propertyOwner[c] = 2))
;[21, 23, 24, 25].forEach((c) => (propertyOwner[c] = 3))
;[31, 32, 34, 5].forEach((c) => (propertyOwner[c] = 4))
houseCount[6] = 2
houseCount[13] = 3
houseCount[24] = 5 // hotel

export const PREVIEW_GAME: GameRoom = {
  gameId: 0n,
  players: [
    mkPlayer(addrs[0], 6, 1840),
    mkPlayer(addrs[1], 13, 1320),
    mkPlayer(addrs[2], 24, 2110),
    mkPlayer(addrs[3], 31, 760),
  ],
  playerCount: 4,
  currentTurn: 0,
  activePlayerCount: 4,
  propertyOwner,
  houseCount,
  started: true,
  ended: false,
  totalPot: 4n * 10n ** 18n,
}
