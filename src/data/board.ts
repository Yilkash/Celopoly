import { CellType, BoardCell } from '@/types'

export const BOARD: BoardCell[] = [
  { cell:0,  name:"GO",              cellType:CellType.Go,             colorGroup:-1, price:0,   houseCost:0,   rent:[0,0,0,0,0,0],          svgX:490, svgY:490, svgW:60, svgH:60, lesson:"Every lap earns your salary. Income is the foundation of wealth." },
  { cell:1,  name:"Street Hustle 1", cellType:CellType.Property,       colorGroup:0,  price:60,  houseCost:50,  rent:[2,10,30,90,160,250],    svgX:430, svgY:490, svgW:50, svgH:60, lesson:"Small cash flows compound into significant wealth over time." },
  { cell:2,  name:"Community Chest", cellType:CellType.CommunityChest, colorGroup:-1, price:0,   houseCost:0,   rent:[0,0,0,0,0,0],          svgX:380, svgY:490, svgW:50, svgH:60, lesson:"Life events — expected and unexpected — shape your finances." },
  { cell:3,  name:"Street Hustle 2", cellType:CellType.Property,       colorGroup:0,  price:60,  houseCost:50,  rent:[4,20,60,180,320,450],   svgX:330, svgY:490, svgW:50, svgH:60, lesson:"A second income stream reduces financial fragility." },
  { cell:4,  name:"Income Tax",      cellType:CellType.Tax,            colorGroup:-1, price:200, houseCost:0,   rent:[0,0,0,0,0,0],          svgX:280, svgY:490, svgW:50, svgH:60, lesson:"Tax is certain. Planning for it quarterly is the professional approach." },
  { cell:5,  name:"Validator A",     cellType:CellType.Railroad,       colorGroup:8,  price:200, houseCost:0,   rent:[25,50,100,200,0,0],     svgX:230, svgY:490, svgW:50, svgH:60, lesson:"Infrastructure generates income regardless of who uses it." },
  { cell:6,  name:"Digital Skills 1",cellType:CellType.Property,       colorGroup:1,  price:100, houseCost:50,  rent:[6,30,90,270,400,550],   svgX:180, svgY:490, svgW:50, svgH:60, lesson:"Skills-based income scales in ways labour income cannot." },
  { cell:7,  name:"Chance",          cellType:CellType.Chance,         colorGroup:-1, price:0,   houseCost:0,   rent:[0,0,0,0,0,0],          svgX:130, svgY:490, svgW:50, svgH:60, lesson:"Markets create unexpected events. Preparation beats prediction." },
  { cell:8,  name:"Digital Skills 2",cellType:CellType.Property,       colorGroup:1,  price:100, houseCost:50,  rent:[6,30,90,270,400,550],   svgX:80,  svgY:490, svgW:50, svgH:60, lesson:"A second skill multiplies your market value exponentially." },
  { cell:9,  name:"Digital Skills 3",cellType:CellType.Property,       colorGroup:1,  price:120, houseCost:50,  rent:[8,40,100,300,450,600],  svgX:30,  svgY:490, svgW:50, svgH:60, lesson:"Mastery creates pricing power. Specialists earn premiums." },
  { cell:10, name:"Jail / Visit",    cellType:CellType.Jail,           colorGroup:-1, price:0,   houseCost:0,   rent:[0,0,0,0,0,0],          svgX:0,   svgY:490, svgW:60, svgH:60, lesson:"Debt is a jail. The exit costs more than the entry." },
  { cell:11, name:"Small Biz 1",     cellType:CellType.Property,       colorGroup:2,  price:140, houseCost:100, rent:[10,50,150,450,625,750], svgX:0,   svgY:430, svgW:60, svgH:50, lesson:"Revenue minus expenses equals profit. Know this always." },
  { cell:12, name:"Bandwidth Co",    cellType:CellType.Utility,        colorGroup:9,  price:150, houseCost:0,   rent:[0,0,0,0,0,0],          svgX:0,   svgY:380, svgW:60, svgH:50, lesson:"Recurring expenses quietly erode savings. Audit them quarterly." },
  { cell:13, name:"Small Biz 2",     cellType:CellType.Property,       colorGroup:2,  price:140, houseCost:100, rent:[10,50,150,450,625,750], svgX:0,   svgY:330, svgW:60, svgH:50, lesson:"A second business unit diversifies revenue risk." },
  { cell:14, name:"Small Biz 3",     cellType:CellType.Property,       colorGroup:2,  price:160, houseCost:100, rent:[12,60,180,500,700,900], svgX:0,   svgY:280, svgW:60, svgH:50, lesson:"Scaling a proven model is lower risk than starting new." },
  { cell:15, name:"Validator B",     cellType:CellType.Railroad,       colorGroup:8,  price:200, houseCost:0,   rent:[25,50,100,200,0,0],     svgX:0,   svgY:230, svgW:60, svgH:50, lesson:"Own the infrastructure others depend on." },
  { cell:16, name:"Real Estate 1",   cellType:CellType.Property,       colorGroup:3,  price:180, houseCost:100, rent:[14,70,200,550,750,950], svgX:0,   svgY:180, svgW:60, svgH:50, lesson:"Real estate generates income 24/7, independent of your effort." },
  { cell:17, name:"Community Chest", cellType:CellType.CommunityChest, colorGroup:-1, price:0,   houseCost:0,   rent:[0,0,0,0,0,0],          svgX:0,   svgY:130, svgW:60, svgH:50, lesson:"Community creates financial safety nets that markets cannot." },
  { cell:18, name:"Real Estate 2",   cellType:CellType.Property,       colorGroup:3,  price:180, houseCost:100, rent:[14,70,200,550,750,950], svgX:0,   svgY:80,  svgW:60, svgH:50, lesson:"Location compounds value over decades. Think long-term." },
  { cell:19, name:"Real Estate 3",   cellType:CellType.Property,       colorGroup:3,  price:200, houseCost:100, rent:[16,80,220,600,800,1000],svgX:0,   svgY:30,  svgW:60, svgH:50, lesson:"Leverage turns one dollar of equity into multiple dollars of assets." },
  { cell:20, name:"Free Parking",    cellType:CellType.FreeParking,    colorGroup:-1, price:0,   houseCost:0,   rent:[0,0,0,0,0,0],          svgX:0,   svgY:0,   svgW:60, svgH:60, lesson:"An emergency fund turns crises into inconveniences." },
  { cell:21, name:"Stock Market 1",  cellType:CellType.Property,       colorGroup:4,  price:220, houseCost:150, rent:[18,90,250,700,875,1050],svgX:60,  svgY:0,   svgW:50, svgH:60, lesson:"Public markets let anyone own great businesses. Start early." },
  { cell:22, name:"Chance",          cellType:CellType.Chance,         colorGroup:-1, price:0,   houseCost:0,   rent:[0,0,0,0,0,0],          svgX:110, svgY:0,   svgW:50, svgH:60, lesson:"Volatility is the price of higher long-term returns." },
  { cell:23, name:"Stock Market 2",  cellType:CellType.Property,       colorGroup:4,  price:220, houseCost:150, rent:[18,90,250,700,875,1050],svgX:160, svgY:0,   svgW:50, svgH:60, lesson:"Diversification is the only free lunch in investing." },
  { cell:24, name:"Stock Market 3",  cellType:CellType.Property,       colorGroup:4,  price:240, houseCost:150, rent:[20,100,300,750,925,1100],svgX:210,svgY:0,   svgW:50, svgH:60, lesson:"Index funds outperform most active managers over 20 years." },
  { cell:25, name:"Validator C",     cellType:CellType.Railroad,       colorGroup:8,  price:200, houseCost:0,   rent:[25,50,100,200,0,0],     svgX:260, svgY:0,   svgW:50, svgH:60, lesson:"Passive staking income is yield without active management." },
  { cell:26, name:"DeFi Yield 1",    cellType:CellType.Property,       colorGroup:5,  price:260, houseCost:150, rent:[22,110,330,800,975,1150],svgX:310,svgY:0,   svgW:50, svgH:60, lesson:"Compound interest on stablecoins beats savings accounts." },
  { cell:27, name:"Community Chest", cellType:CellType.CommunityChest, colorGroup:-1, price:0,   houseCost:0,   rent:[0,0,0,0,0,0],          svgX:360, svgY:0,   svgW:50, svgH:60, lesson:"Opportunity often looks like luck to those who aren't prepared." },
  { cell:28, name:"DeFi Yield 2",    cellType:CellType.Property,       colorGroup:5,  price:260, houseCost:150, rent:[22,110,330,800,975,1150],svgX:410,svgY:0,   svgW:50, svgH:60, lesson:"Liquidity provision earns fees — understand impermanent loss first." },
  { cell:29, name:"DeFi Yield 3",    cellType:CellType.Property,       colorGroup:5,  price:280, houseCost:150, rent:[24,120,360,850,1025,1200],svgX:460,svgY:0,  svgW:50, svgH:60, lesson:"High APY always carries proportional risk. Audit before depositing." },
  { cell:30, name:"Go To Jail",      cellType:CellType.GoToJail,       colorGroup:-1, price:0,   houseCost:0,   rent:[0,0,0,0,0,0],          svgX:490, svgY:0,   svgW:60, svgH:60, lesson:"Financial negligence has compounding consequences. Act before crisis." },
  { cell:31, name:"Web3 Venture 1",  cellType:CellType.Property,       colorGroup:6,  price:300, houseCost:200, rent:[26,130,390,900,1100,1275],svgX:490,svgY:60, svgW:60, svgH:50, lesson:"Equity in early-stage ventures is high risk, high reward. Size appropriately." },
  { cell:32, name:"Web3 Venture 2",  cellType:CellType.Property,       colorGroup:6,  price:300, houseCost:200, rent:[26,130,390,900,1100,1275],svgX:490,svgY:110,svgW:60, svgH:50, lesson:"Token economics align incentives when designed correctly." },
  { cell:33, name:"Chance",          cellType:CellType.Chance,         colorGroup:-1, price:0,   houseCost:0,   rent:[0,0,0,0,0,0],          svgX:490, svgY:160, svgW:60, svgH:50, lesson:"Market timing is impossible. Asset allocation is everything." },
  { cell:34, name:"Web3 Venture 3",  cellType:CellType.Property,       colorGroup:6,  price:320, houseCost:200, rent:[28,150,450,1000,1200,1400],svgX:490,svgY:210,svgW:60, svgH:50, lesson:"A 10x return on 10% of portfolio beats a 2x on 100." },
  { cell:35, name:"Validator D",     cellType:CellType.Railroad,       colorGroup:8,  price:200, houseCost:0,   rent:[25,50,100,200,0,0],     svgX:490, svgY:260, svgW:60, svgH:50, lesson:"Infrastructure monopolies generate durable, defensible income." },
  { cell:36, name:"Mobile Data Co",  cellType:CellType.Utility,        colorGroup:9,  price:150, houseCost:0,   rent:[0,0,0,0,0,0],          svgX:490, svgY:310, svgW:60, svgH:50, lesson:"Own the pipes others pay to use." },
  { cell:37, name:"Blockchain Empire 1",cellType:CellType.Property,    colorGroup:7,  price:350, houseCost:200, rent:[35,175,500,1100,1300,1500],svgX:490,svgY:360,svgW:60, svgH:50, lesson:"Store of value assets preserve purchasing power across generations." },
  { cell:38, name:"Luxury Tax",      cellType:CellType.Tax,            colorGroup:-1, price:100, houseCost:0,   rent:[0,0,0,0,0,0],          svgX:490, svgY:410, svgW:60, svgH:50, lesson:"Lifestyle inflation silently consumes wealth. Every upgrade has an opportunity cost." },
  { cell:39, name:"Blockchain Empire 2",cellType:CellType.Property,    colorGroup:7,  price:400, houseCost:200, rent:[50,200,600,1400,1700,2000],svgX:490,svgY:460,svgW:60, svgH:50, lesson:"The most expensive asset is the one that compounds the fastest." },
]

export function getCell(cell: number): BoardCell {
  return BOARD[cell]
}

export function getColorGroup(colorGroup: number): BoardCell[] {
  return BOARD.filter(c => c.colorGroup === colorGroup && c.cellType === CellType.Property)
}

export const PROPERTY_COLORS: Record<number, string> = {
  0: '#C77B41', // Street Hustle  — bronze
  1: '#38BDF8', // Digital Skills — sky
  2: '#A855F7', // Small Biz      — violet
  3: '#FB923C', // Real Estate    — orange
  4: '#F43F5E', // Stock Market   — rose
  5: '#A3E635', // DeFi Yield     — lime
  6: '#22D3EE', // Web3 Venture   — cyan
  7: '#818CF8', // Blockchain     — indigo
  8: '#94A3B8', // Validators     — slate
  9: '#FBBF24', // Utilities      — amber
}
