// SPDX-License-Identifier: MIT
pragma solidity 0.8.21;

import {
    GelatoRelayContextERC2771
} from "@gelatonetwork/relay-context/contracts/GelatoRelayContextERC2771.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract Counter is GelatoRelayContextERC2771, Ownable {
    mapping(address => uint256) public counter;

    event IncrementCounter(uint256 newCounterValue, address msgSender);

    // solhint-disable-next-line no-empty-blocks
    receive() external payable {}

    function withdraw(address payable to, uint256 amount) external onlyOwner {
        (bool sent, ) = to.call{value: amount}("");
        require(sent, "Counter.withdraw: failed to withdraw");
    }

    function increment() external onlyGelatoRelayERC2771 {
        _transferRelayFee();
        address sender = _getMsgSender();
        counter[sender]++;
        emit IncrementCounter(counter[sender], sender);
    }
}
