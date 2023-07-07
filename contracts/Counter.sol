// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract Counter is EIP712 {
    //solhint-disable-next-line const-name-snakecase
    string public constant name = "Counter";
    //solhint-disable-next-line const-name-snakecase
    string public constant version = "1";

    bytes32 public constant INCREASE_TYPEHASH =
        keccak256("Increment(address user,uint256 value,bytes32 salt)");

    mapping(address => uint256) public counter;
    mapping(bytes32 => bool) public usedNonces;

    event IncrementCounter(uint256 newCounterValue, address msgSender);

    // solhint-disable-next-line no-empty-blocks
    constructor() EIP712(name, version) {}

    function increment(
        address user,
        uint256 value,
        bytes32 salt,
        bytes memory sig
    ) external {
        address signer = _requireSignature(
            INCREASE_TYPEHASH,
            abi.encode(user, value),
            salt,
            sig
        );

        require(signer == user, "Counter.increment: invalid signer");

        counter[user] += value;
        emit IncrementCounter(counter[user], user);
    }

    function _requireSignature(
        bytes32 typeHash,
        bytes memory data,
        bytes32 salt,
        bytes memory sig
    ) internal returns (address) {
        bytes32 structHash = keccak256(abi.encodePacked(typeHash, data, salt));

        require(
            !usedNonces[structHash],
            "Counter._requireSignature: nonce already used"
        );
        usedNonces[structHash] = true;

        bytes32 eip712Hash = _hashTypedDataV4(structHash);
        address signer = ECDSA.recover(eip712Hash, sig);

        return signer;
    }
}
