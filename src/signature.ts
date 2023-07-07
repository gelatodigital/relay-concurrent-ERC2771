import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "ethers";

export const signIncrement = async (
  signer: SignerWithAddress,
  contract: ethers.Contract,
  name: string,
  value: bigint,
  salt: string,
  chainId: number
): Promise<string | null> => {
  const domain: ethers.TypedDataDomain = {
    name: name,
    version: "1",
    chainId: chainId,
    verifyingContract: contract.address,
  };

  const types = {
    Increment: [
      { name: "user", type: "address" },
      { name: "value", type: "uint256" },
      { name: "salt", type: "bytes32" },
    ],
  };

  const data = {
    user: signer.address,
    value: value,
    salt: salt,
  };

  try {
    return await signer._signTypedData(domain, types, data);
  } catch (e) {
    return null;
  }
};
