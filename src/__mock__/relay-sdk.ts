import { SponsoredCallRequest } from "@gelatonetwork/relay-sdk";
import { ethers } from "hardhat";

/**
 * Emulates relay behaviour locally
 * https://github.com/gelatodigital/rel-example-unit-tests
 */

export const sponsoredCall = async (request: SponsoredCallRequest) => {
  const [deployer] = await ethers.getSigners();
  return deployer.sendTransaction({ to: request.target, data: request.data });
};
