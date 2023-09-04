// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {
    ERC2771Context
} from "@openzeppelin/contracts/metatx/ERC2771Context.sol";

contract Counter1Balance is ERC2771Context {
    mapping(address => uint256) public counter;

    event IncrementCounter(uint256 newCounterValue, address msgSender);

    // solhint-disable-next-line no-empty-blocks
    constructor(address _trustedForwarder) ERC2771Context(_trustedForwarder) {}

    function increment() external {
        address sender = _msgSender();
        counter[sender]++;
        emit IncrementCounter(counter[sender], sender);
    }
}
