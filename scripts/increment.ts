import { deployments, ethers } from "hardhat";
import { Counter } from "../typechain";
import {
  CallWithSyncFeeConcurrentERC2771Request,
  GelatoRelay,
} from "@gelatonetwork/relay-sdk";

const NATIVE_TOKEN = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";

const main = async () => {
  const [signer] = await ethers.getSigners();
  const { chainId } = await ethers.provider.getNetwork();

  const { address } = await deployments.get("Counter");
  const counter = (await ethers.getContractAt(
    "Counter",
    address
  )) as unknown as Counter;

  const increment = await counter.increment.populateTransaction();

  const request: CallWithSyncFeeConcurrentERC2771Request = {
    chainId: chainId,
    target: address,
    data: increment.data,
    user: signer.address,
    feeToken: NATIVE_TOKEN,
    isConcurrent: true,
  };

  const relay = new GelatoRelay();

  // execute 3 transactions concurrently
  for (let i = 0; i < 3; i++) {
    const { taskId } = await relay.callWithSyncFeeERC2771(
      request,
      signer as any
    );
    console.log("https://api.gelato.digital/tasks/status/" + taskId);
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
