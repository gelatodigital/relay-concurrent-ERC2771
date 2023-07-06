// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract Counter is EIP712 {
    bytes32 private constant _INCREASE_TYPEHASH =
        keccak256("Increase(address user,uint256 value,bytes32 salt)");

    mapping(address => uint256) public counter;
    mapping(bytes32 => bool) public usedNonces;

    event IncrementCounter(uint256 newCounterValue, address msgSender);

    // solhint-disable-next-line no-empty-blocks
    constructor() EIP712("Counter", "1") {}

    function increase(
        address user,
        uint256 value,
        bytes32 salt,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        bytes32 structHash = keccak256(
            abi.encode(_INCREASE_TYPEHASH, user, value, salt)
        );
        bytes32 eip712Hash = _hashTypedDataV4(structHash);

        address signer = ECDSA.recover(eip712Hash, v, r, s);
        require(signer == user, "Counter.increase: invalid signer");

        require(
            !usedNonces[structHash],
            "Counter.increase: nonce already used"
        );
        usedNonces[structHash] = true;

        counter[user] += value;
    }
}
