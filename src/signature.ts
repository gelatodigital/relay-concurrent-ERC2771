import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "ethers";

export const signIncrease = async (
  signer: SignerWithAddress,
  contract: ethers.Contract,
  name: string,
  value: bigint,
  salt: string,
  chainId: number
): Promise<ethers.Signature | null> => {
  const domain: ethers.TypedDataDomain = {
    name: name,
    version: "1",
    chainId: chainId,
    verifyingContract: contract.address,
  };

  const types = {
    Increase: [
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
    const sig = await signer._signTypedData(domain, types, data);
    return ethers.utils.splitSignature(sig);
  } catch (e) {
    return null;
  }
};
