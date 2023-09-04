// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {
    GelatoRelayContextERC2771
} from "@gelatonetwork/relay-context/contracts/GelatoRelayContextERC2771.sol";

contract Counter is GelatoRelayContextERC2771 {
    mapping(address => uint256) public counter;

    event IncrementCounter(uint256 newCounterValue, address msgSender);

    function increment() external {
        address sender = _getMsgSender();
        counter[sender]++;
        emit IncrementCounter(counter[sender], sender);
    }
}
