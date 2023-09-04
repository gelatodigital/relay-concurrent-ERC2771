import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-deploy";

import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

const RPC_PROVIDER = process.env.RPC_PROVIDER;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_KEY = process.env.ETHERSCAN_KEY;

import assert from "assert";
assert.ok(RPC_PROVIDER, "Missing RPC_PROVIDER in .env");

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.21",
        settings: {
          optimizer: { enabled: true, runs: 999999 },
          evmVersion: "paris",
        },
      },
    ],
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v6",
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  networks: {
    mumbai: {
      chainId: 80001,
      url: RPC_PROVIDER,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  verify: {
    etherscan: {
      apiKey: ETHERSCAN_KEY,
    },
  },
};

export default config;
