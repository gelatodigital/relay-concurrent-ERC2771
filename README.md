# Relay Concurrent ERC-2771

This project showcases concurrent `ERC-2771` support which enables parallel transaction submission.  
This is a new addition to Gelato Relay which uses **salts** rather than **sequential nonces** for replay protection.

## Self-Paying (Synchronous Fee Payment)

Existing contracts inheriting from `GelatoRelayContextERC2771` require no changes other than updating `@gelatonetwork/relay-context` and re-deploying.
Since both concurrent and sequential transactions are supported, the caller may decide which to use dynamically during submission.

### Implementation

| Type | Implementation | Description |
| -------- | ------- | -------- |
| Contract | [`Counter.sol`]() | Supports both concurrent and sequential relay requests |
| Script | [`increment.ts`]() | Executes three `increment` transactions concurrently |

### Quick Start
1. Install dependencies
   ```
   yarn install
   ```
2. Edit ``.env``
   ```
   cp .env.example .env
   ```
3. Deploy the `Counter` contract
   ```
   yarn hardhat deploy --tags Counter --network mumbai
   ```
4. Deposit `ETH` into the `Counter` contract
5. Verify contract on etherscan (Optional)
   ```
   yarn hardhat etherscan-verify --network mumbai
   ```
6. Increment the counter
   ```
   yarn hardhat run scripts/increment.ts --network mumbai
   ```

## Sponsored (1Balance)

Contracts inheriting from `ERC2771Context` rather than `GelatoRelayContextERC2771` must specify `GelatoRelayConcurrentERC2771` as a trusted forwarder.
Below are its addresses on all supported networks:

| Contract | Network | Address |
| -------- | ------- | ------- |
| `GelatoRelayConcurrentERC2771` | All networks except zkSync Era | `0x8598806401A63Ddf52473F1B3C55bC9E33e2d73b` |
| `GelatoRelayConcurrentERC2771` | zkSync Era Mainnet/Testnet | `0xBa4082F4961c8Fb76231995C967CD9aa40f321b5` |

### Implementation

| Type | Implementation | Description |
| -------- | ------- | -------- |
| Contract | [`Counter1Balance.sol`]() | Supports concurrent relay requests through a single trusted forwarder |
| Script | [`increment-1balance.ts`]() | Executes three `increment` transactions concurrently |

### Quick Start
1. Install dependencies
   ```
   yarn install
   ```
2. Edit ``.env``
   ```
   cp .env.example .env
   ```
3. Deploy the `Counter1Balance` contract
   ```
   yarn hardhat deploy --tags Counter1Balance --network mumbai
   ```
4. Verify contract on etherscan (Optional)
    ```
    yarn hardhat etherscan-verify --network mumbai
    ```
5. Increment the counter
   ```
   yarn hardhat run scripts/increment-1balance.ts --network mumbai
   ```
