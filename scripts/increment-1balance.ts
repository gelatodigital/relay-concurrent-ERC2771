import { deployments, ethers } from "hardhat";
import { Counter1Balance } from "../typechain";
import {
  CallWithConcurrentERC2771Request,
  GelatoRelay,
} from "@gelatonetwork/relay-sdk";

const main = async () => {
  const SPONSOR_KEY = process.env.SPONSOR_KEY;
  if (!SPONSOR_KEY) throw new Error("SPONSOR_KEY missing in .env");

  const [signer] = await ethers.getSigners();
  const { chainId } = await ethers.provider.getNetwork();

  const { address } = await deployments.get("Counter1Balance");
  const counter = (await ethers.getContractAt(
    "Counter1Balance",
    address
  )) as any as Counter1Balance;

  const increment = await counter.increment.populateTransaction();

  const request: CallWithConcurrentERC2771Request = {
    chainId: chainId,
    target: address,
    data: increment.data,
    user: signer.address,
    isConcurrent: true,
  };

  const relay = new GelatoRelay();

  // execute 3 transactions concurrently
  for (let i = 0; i < 3; i++) {
    const { taskId } = await relay.sponsoredCallERC2771(
      request,
      signer as any,
      SPONSOR_KEY
    );
    console.log("https://api.gelato.digital/tasks/status/" + taskId);
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
