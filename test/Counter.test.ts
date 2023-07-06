import { SponsoredCallRequest } from "@gelatonetwork/relay-sdk";
import { sponsoredCall } from "../src/__mock__/relay-sdk";
import { deployments, ethers } from "hardhat";
import { Counter } from "../typechain";
import { signIncrease } from "../src/signature";
import { expect } from "chai";

describe("Counter", () => {
  let counter: Counter;

  before(async () => {
    await deployments.fixture();

    const { address: counterAddress } = await deployments.get("Counter");

    counter = (await ethers.getContractAt(
      "Counter",
      counterAddress
    )) as Counter;
  });

  it("increase", async () => {
    const [deployer] = await ethers.getSigners();

    const chainId = await deployer.getChainId();

    const value = 5n;
    const salt =
      "0xbf0b2dBA3B9b3d1a145413E0B3BAEcaF9fEfC5A92c3c90CE47da370FD3BFC6Fc";

    const sig = await signIncrease(
      deployer,
      counter,
      "Counter",
      value,
      salt,
      chainId
    );

    if (!sig) throw new Error("Invalid signature");

    const { v, r, s } = sig;

    const { data } = await counter.populateTransaction.increase(
      deployer.address,
      value,
      salt,
      v,
      r,
      s
    );

    if (!data) throw new Error("Invalid transaction");

    const request: SponsoredCallRequest = {
      target: counter.address,
      data: data,
      chainId: chainId,
    };

    await expect(sponsoredCall(request)).to.emit(counter, "IncrementCounter");
  });

  it("increase (same salt)", async () => {
    const [deployer] = await ethers.getSigners();

    const chainId = await deployer.getChainId();

    const value = 5n;
    const salt =
      "0xbf0b2dBA3B9b3d1a145413E0B3BAEcaF9fEfC5A92c3c90CE47da370FD3BFC6Fc";

    const sig = await signIncrease(
      deployer,
      counter,
      "Counter",
      value,
      salt,
      chainId
    );

    if (!sig) throw new Error("Invalid signature");

    const { v, r, s } = sig;

    const { data } = await counter.populateTransaction.increase(
      deployer.address,
      value,
      salt,
      v,
      r,
      s
    );

    if (!data) throw new Error("Invalid transaction");

    const request: SponsoredCallRequest = {
      target: counter.address,
      data: data,
      chainId: chainId,
    };

    await expect(sponsoredCall(request)).to.be.revertedWith(
      "Counter.increase: nonce already used"
    );
  });
});
