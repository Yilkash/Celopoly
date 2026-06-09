import { GameCard } from '@/types'

export const CHANCE_CARDS: GameCard[] = [
  { id:0,  type:'chance', title:"Yield Farm Rewards",    body:"Compound interest rewards your stable savings!",           effect: 50,   lesson:"Consistent yield beats chasing high APY. Stability compounds." },
  { id:1,  type:'chance', title:"Flash Loan Exploit",    body:"A flash loan exploit drains your yield pool. Pay 100 cUSD.",effect:-100, lesson:"High APY DeFi pools carry smart contract risk. Diversify." },
  { id:2,  type:'chance', title:"NFT Flip",              body:"Your NFT collection sold at 10x. Collect 150 cUSD.",       effect: 150,  lesson:"Speculative wins exist — size these positions correctly." },
  { id:3,  type:'chance', title:"Rug Pull",              body:"New DeFi protocol rugged. Lose 80 cUSD.",                  effect:-80,   lesson:"'Too good to be true' APY almost always is. DYOR." },
  { id:4,  type:'chance', title:"Airdrop Received",      body:"You qualified for a token airdrop. Collect 75 cUSD.",      effect: 75,   lesson:"Active participation in ecosystems rewards early believers." },
  { id:5,  type:'chance', title:"Missed Tax Deadline",   body:"Missed crypto tax filing. Pay 60 cUSD penalty.",           effect:-60,   lesson:"Tax compliance is non-negotiable. Track every transaction." },
  { id:6,  type:'chance', title:"Early Investor Exit",   body:"Your seed round vested. Collect 200 cUSD.",               effect: 200,  lesson:"Long-term conviction in high-risk assets is rewarded asymmetrically." },
  { id:7,  type:'chance', title:"Smart Contract Bug",    body:"Audit missed a critical bug. Pay 150 cUSD.",              effect:-150,  lesson:"Never invest more than you can afford to lose in unaudited protocols." },
  { id:8,  type:'chance', title:"Staking Rewards",       body:"Your ETH validator paid out. Collect 40 cUSD.",           effect: 40,   lesson:"Proof-of-stake rewards create passive income for network participants." },
  { id:9,  type:'chance', title:"USDC Depeg Loss",       body:"USDC temporarily depegged. Pay 50 cUSD.",                 effect:-50,   lesson:"Stablecoins are only as stable as their underlying reserves." },
  { id:10, type:'chance', title:"Liquidity Fee Income",  body:"Your LP position earned trading fees. Collect 90 cUSD.",  effect: 90,   lesson:"Market making is a business. Understand impermanent loss first." },
  { id:11, type:'chance', title:"Market Crash",          body:"60% market correction. Pay 200 cUSD of portfolio value.",  effect:-200,  lesson:"Time in the market beats timing the market. Stay invested." },
  { id:12, type:'chance', title:"Grants Programme",      body:"Your DAO proposal was funded. Collect 120 cUSD.",         effect: 120,  lesson:"Contributing to open source creates both reputation and revenue." },
  { id:13, type:'chance', title:"Hardware Wallet Lost",  body:"Lost your Ledger. Recovery costs 40 cUSD.",               effect:-40,   lesson:"Self-custody is powerful. Backup your seed phrase in 3 physical locations." },
  { id:14, type:'chance', title:"Arbitrage Opportunity", body:"You spotted a DEX price gap. Collect 55 cUSD.",           effect: 55,   lesson:"Market inefficiencies exist. Speed and capital capture them." },
  { id:15, type:'chance', title:"Bear Survival Bonus",   body:"You held through the bear market. Collect 30 cUSD.",      effect: 30,   lesson:"Surviving drawdowns is the single most important investment skill." },
]

export const COMMUNITY_CHEST_CARDS: GameCard[] = [
  { id:0,  type:'community', title:"Web3 Course Bonus",   body:"Completed an online Web3 course. Collect 50 cUSD.",      effect: 50,   lesson:"Human capital is your highest-yielding, most durable investment." },
  { id:1,  type:'community', title:"Medical Emergency",   body:"Unexpected medical bill. Pay 150 cUSD.",                  effect:-150, lesson:"Emergency funds absorb shocks without forcing high-interest debt." },
  { id:2,  type:'community', title:"Compound Interest",   body:"Automated savings compounded. Collect 30 cUSD.",          effect: 30,   lesson:"Pay yourself first. Automate savings before lifestyle expenses." },
  { id:3,  type:'community', title:"Salary Negotiation",  body:"You negotiated a raise. Collect 75 cUSD.",                effect: 75,   lesson:"Your biggest wealth-building tool is your income. Negotiate it." },
  { id:4,  type:'community', title:"Referral Income",     body:"Your referral network paid off. Collect 40 cUSD.",        effect: 40,   lesson:"Your network is your net worth. Nurture relationships." },
  { id:5,  type:'community', title:"Subscription Creep",  body:"Forgot about 5 subscriptions. Pay 50 cUSD.",              effect:-50,   lesson:"Audit recurring payments monthly. Small leaks sink big ships." },
  { id:6,  type:'community', title:"Inheritance",         body:"A relative remembered you. Collect 200 cUSD.",            effect: 200,  lesson:"Estate planning preserves generational wealth. Start early." },
  { id:7,  type:'community', title:"Unexpected Repair",   body:"Your laptop died. Pay 85 cUSD for a replacement.",        effect:-85,   lesson:"Maintain a repair fund equal to 5% of your assets' value." },
  { id:8,  type:'community', title:"Early Invoice Payment",body:"Client paid early. Collect 80 cUSD with discount.",       effect: 80,   lesson:"Cash flow discipline creates negotiation leverage." },
  { id:9,  type:'community', title:"Content Tips",        body:"Your educational content earned tips. Collect 45 cUSD.",  effect: 45,   lesson:"Teaching others is both a mission and a monetizable skill." },
  { id:10, type:'community', title:"BNPL Fees",           body:"Buy-now-pay-later interest hit. Pay 60 cUSD.",            effect:-60,   lesson:"BNPL is debt. If you can't pay cash, you can't afford it." },
  { id:11, type:'community', title:"Budget Savings",      body:"Stuck to your monthly budget. Collect 60 cUSD.",          effect: 60,   lesson:"A budget tells your money where to go instead of wondering where it went." },
  { id:12, type:'community', title:"Open Source Fund",    body:"Community crowdfunded your project. Collect 110 cUSD.",   effect: 110,  lesson:"Building in public attracts both support and accountability." },
  { id:13, type:'community', title:"Annual Subscription", body:"Renewed professional tools. Pay 35 cUSD.",               effect:-35,   lesson:"Invest in tools that multiply your productivity." },
  { id:14, type:'community', title:"Portfolio Bonus",     body:"Diversified portfolio weathered volatility. Collect 95 cUSD.",effect: 95, lesson:"Asset allocation explains over 90% of portfolio return variability." },
  { id:15, type:'community', title:"Mentoring Gift",      body:"A mentor shared a career opportunity. Collect 25 cUSD.",  effect: 25,   lesson:"Mentorship compounds. One conversation can change your financial trajectory." },
]

export function getCard(type: 'chance' | 'community', index: number): GameCard {
  const cards = type === 'chance' ? CHANCE_CARDS : COMMUNITY_CHEST_CARDS
  return cards[index % cards.length]
}
