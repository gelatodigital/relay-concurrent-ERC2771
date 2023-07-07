import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { SponsoredCallRequest } from "@gelatonetwork/relay-sdk";
import { sponsoredCall } from "../src/__mock__/relay-sdk";
import { deployments, ethers } from "hardhat";
import { Counter } from "../typechain";
import { signIncrement } from "../src/signature";
import { expect } from "chai";

// implementation should generate/use a random salt
const SALT_1 =
  "0xCe5eA68BbAaCBe0C1ff6F68B5bdb6CeDF513bd2c64acead5CCD2Bfcf7A3ABf8e";
const SALT_2 =
  "0xbf0b2dBA3B9b3d1a145413E0B3BAEcaF9fEfC5A92c3c90CE47da370FD3BFC6Fc";

describe("Counter", () => {
  let counter: Counter;
  let chainId: number;
  let deployer: SignerWithAddress;

  before(async () => {
    await deployments.fixture();

    [deployer] = await ethers.getSigners();
    chainId = await deployer.getChainId();

    const { address: counterAddress } = await deployments.get("Counter");

    counter = (await ethers.getContractAt(
      "Counter",
      counterAddress
    )) as Counter;
  });

  it("increment (valid signature)", async () => {
    const value = 5n;

    const sig = await signIncrement(
      deployer,
      counter,
      "Counter",
      value,
      SALT_1,
      chainId
    );

    if (!sig) throw new Error("Invalid signature");

    const { data } = await counter.populateTransaction.increment(
      deployer.address,
      value,
      SALT_1,
      sig
    );

    if (!data) throw new Error("Invalid transaction");

    const request: SponsoredCallRequest = {
      target: counter.address,
      data: data,
      chainId: chainId,
    };

    await expect(sponsoredCall(request)).to.emit(counter, "IncrementCounter");
  });

  it("increment (invalid signature length)", async () => {
    const value = 5n;

    // invalid signature and invalid length
    const sig = "0xdead";

    const { data } = await counter.populateTransaction.increment(
      deployer.address,
      value,
      SALT_2,
      sig
    );

    if (!data) throw new Error("Invalid transaction");

    const request: SponsoredCallRequest = {
      target: counter.address,
      data: data,
      chainId: chainId,
    };

    await expect(sponsoredCall(request)).to.be.revertedWith(
      "ECDSA: invalid signature length"
    );
  });

  it("increment (invalid signature)", async () => {
    const value = 5n;

    // invalid signature (invalid domain name)
    const sig = await signIncrement(
      deployer,
      counter,
      "CounterWrongDomainName",
      value,
      SALT_1,
      chainId
    );

    if (!sig) throw new Error("Invalid signature");

    const { data } = await counter.populateTransaction.increment(
      deployer.address,
      value,
      SALT_2,
      sig
    );

    if (!data) throw new Error("Invalid transaction");

    const request: SponsoredCallRequest = {
      target: counter.address,
      data: data,
      chainId: chainId,
    };

    await expect(sponsoredCall(request)).to.be.revertedWith(
      "Counter.increment: invalid signer"
    );
  });

  it("increment (same salt)", async () => {
    const value = 5n;

    const sig = await signIncrement(
      deployer,
      counter,
      "Counter",
      value,
      SALT_1,
      chainId
    );

    if (!sig) throw new Error("Invalid signature");

    const { data } = await counter.populateTransaction.increment(
      deployer.address,
      value,
      SALT_1,
      sig
    );

    if (!data) throw new Error("Invalid transaction");

    const request: SponsoredCallRequest = {
      target: counter.address,
      data: data,
      chainId: chainId,
    };

    await expect(sponsoredCall(request)).to.be.revertedWith(
      "Counter._requireSignature: nonce already used"
    );
  });
});
