# Relay Hash-based ERC2771

The Relay `ERC2771` implementation uses nonces which enforce sequential inclusion and lack the ability to handle parallel transactions.
This project demonstrates signature verification and **hash-based replay protection** on an example [`Counter`](https://github.com/gelatodigital/relay-hash-based-ERC2771/blob/main/contracts/Counter.sol) contract using [`EIP-712`](https://eips.ethereum.org/EIPS/eip-712).
This acts as an alternative and enables the execution of multiple transactions in parallel.

The [Unit Tests](https://github.com/gelatodigital/relay-hash-based-ERC2771/blob/main/test/Counter.test.ts) demonstrate [signing](https://github.com/gelatodigital/relay-hash-based-ERC2771/blob/main/src/signature.ts)
an `increment` transaction and relaying it using [`sponsoredCall`](https://docs.gelato.network/developer-services/relay/non-erc-2771/sponsoredcall).

> **Warning**  
> The example hardcodes the salt to demonstrate collisions.  
> Ensure that your implementation generates a random salt for each transaction.

## Quick Start
1. Install dependencies
   ```
   yarn install
   ```
2. Run unit tests
   ```
   yarn hardhat test
   ```
