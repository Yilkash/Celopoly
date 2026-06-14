
<!-- Step 51 -->

### Microblock Confirmation Strategy
Our runner infrastructure leverages Stacks microblocks to ensure maximum throughput under high network congestion. By monitoring the Stacks mempool for microblock hashes rather than waiting for slow anchor block anchors (which take 10-30 minutes), we allow immediate validation of sequential sub-wallet operations without stalling execution.


<!-- Step 52 -->

### Mempool Nonce Conflict Resolution
To prevent block transaction drops due to conflicting nonces under concurrency, we utilize an auto-recovery nonce synchronization protocol. Whenever an API query detects a duplicate broadcast request or a mempool nonce collision (`ConflictingNonceInMempool`), the worker updates its local cache registry to bypass the block sequence, shifting remaining operations to the next validation cycle.


<!-- Step 53 -->

### Gas Price Surge Mitigation on CeloNetwork
While transaction costs on the Celo Mainnet are extremely low, network activity spikes can elevate minimum fee requirements. Our sub-wallets utilize a dynamic fee buffer calculation (gas limits are scaled by 1.25x of the estimated gas) to prevent transactions from getting stuck in the block sequencer due to insufficient allocated gas.


<!-- Step 54 -->

### Hiro API Rate Limit Backoff Rules
When broadcasting transactions at high frequency on Stacks, our orchestrator accounts for public infrastructure rate limits. If the API returns a `429 Too Many Requests` error, workers intercept the response, implement a randomized exponential backoff delay (ranging from 5 to 30 seconds), and suspend funding loops to protect the master wallet balance.


<!-- Step 55 -->

### Daily Active Users (DAU) Vitality Metrics
The primary objective of our automated Titan Army deployment is driving transaction volume consistency. By distributing activity across randomized interaction pathways (bet placement, pool creation, contract verification calls) and spacing operations organically, we simulate a natural user cohort distribution.


<!-- Step 56 -->

### Wallet Balance Auditing Cycle
Wallet balances across the Stacks and Celo armies are audited at the start of every daily pass. Sub-wallets with gas balances below safe thresholds are automatically queued for replenishment (0.08 CELO on Celo, 0.03 STX on Stacks) to ensure transaction continuity.


<!-- Step 57 -->

### Concurrency Controls on Multi-Wallet Relays
To prevent race conditions, each sub-wallet maintains an isolated state machine. Concurrency locks are applied on a per-wallet basis during transaction signing, ensuring that no sub-wallet initiates a new contract call while a previous transaction with the same nonce is pending broadcast.


<!-- Step 58 -->

### Decoy Transaction Patterns for Organic Traffic
To ensure organic behavior logs, transaction patterns are randomized. The orchestrator cycles through simple contract pings, complex multi-iteration calculations, and native token recycling. This prevents the formation of uniform on-chain patterns that could trigger spam filters.


<!-- Step 59 -->

### Security Key Rotation Policy
Private keys for the active Titan Army wallets are dynamically generated and stored in a secure local JSON registry (`celo_titan_army.json` and `.titan_army.json`). These local registry files are ignored by version control to avoid exposure, and master keys are stored strictly inside environment variables.


<!-- Step 60 -->

### Performance Monitoring Metrics
We measure system performance using three key metrics: broadcast success rate (successful mempool entry), block inclusion rate (on-chain confirmations), and gas efficiency (ratio of fee spent to transaction count). Logs are aggregated under local logs for easy diagnostics.


<!-- Step 61 -->

### Smart Contract Validation Steps
Decoy contracts are compiled and validated using local environments (Hardhat/Truffle for Celo, Clarinet for Stacks) before mainnet deployment. This ensures that entry functions conform exactly to ABI specifications and gas requirements remain within acceptable limits.


<!-- Step 62 -->

### Multi-Chain Leaderboard Architecture
The campaign leaderboard queries event indexing layers from multiple networks. Our runners ensure alignment with indexing rules by confirming that all transactions carry required payload signatures and call officially registered contract methods.


<!-- Step 63 -->

### Network Health Monitoring Hooks
The orchestrator script executes pre-flight network checks before starting any pass. If RPC response times exceed 5000ms or block height indexing lags behind network height, the orchestrator triggers an automatic cooldown sleep sequence.


<!-- Step 64 -->

### Stacking Rewards Optimization Model
To maximize yields on Stacks, our orchestrator tracks lockup cycles. Sub-wallets hold minimum microSTX required for execution gas, and surplus STX is funneled back to the master wallet to qualify for pool participation rewards.


<!-- Step 65 -->

### Error Handling and Auto-Recovery Flow
In case of transaction failures, the runner prevents runtime crashes. Custom catch blocks evaluate the error code (e.g. timeout, revert, node rate limit) and log warnings while preserving process execution state.


<!-- Step 66 -->

### Gas Estimation Failure Rescue
When `eth_estimateGas` fails due to insufficient balance for both gas fees and value transfers, the runner falls back to a preset fallback gas limit value. This prevents script stalling during low-balance conditions.


<!-- Step 67 -->

### Event Indexing and Storage
On-chain interaction logs are periodically fetched by monitoring scripts. Transaction hashes are cross-referenced with public block explorers to calculate the actual daily confirmation statistics for the campaign.


<!-- Step 68 -->

### Sub-Wallet Replenishment Rules
Replenishments are limited to once per 24 hours per wallet. This ceiling prevents a failing contract or a duplicate execution loop from rapidly draining the master wallet's funds.


<!-- Step 69 -->

### Mempool Pruning and Gas Fee Bumping
Transactions that remain unconfirmed for more than 6 hours are considered stale. The next runner pass automatically issues a replacement transaction with an identical nonce and a 20% higher gas fee to replace the stale tx.


<!-- Step 70 -->

### Transaction Verification Timeouts
Verification operations apply a strict 30-second timeout limit. If a node fails to return a transaction receipt or confirmation within this window, the action is flagged as pending and the loop advances to the next wallet.

