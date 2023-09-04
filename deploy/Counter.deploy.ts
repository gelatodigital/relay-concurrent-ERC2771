import { deployments, ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async () => {
  const [deployer] = await ethers.getSigners();

  await deployments.deploy("Counter", {
    from: deployer.address,
    log: true,
  });
};

func.tags = ["Counter"];

export default func;
