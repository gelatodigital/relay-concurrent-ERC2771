import { deployments, ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";

const GELATO_RELAY_CONCURRENT_ERC2771 =
  "0x8598806401A63Ddf52473F1B3C55bC9E33e2d73b";
const GELATO_RELAY_CONCURRENT_ERC2771_ZKSYNC =
  "0xBa4082F4961c8Fb76231995C967CD9aa40f321b5";

const func: DeployFunction = async () => {
  const [deployer] = await ethers.getSigners();
  const { chainId } = await ethers.provider.getNetwork();

  const forwarder =
    chainId == 324n || chainId == 280n
      ? GELATO_RELAY_CONCURRENT_ERC2771_ZKSYNC
      : GELATO_RELAY_CONCURRENT_ERC2771;

  await deployments.deploy("Counter1Balance", {
    from: deployer.address,
    args: [forwarder],
    log: true,
  });
};

func.tags = ["Counter1Balance"];

export default func;
