// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Faucet {
    address public owner;
    uint256 public withdrawalLimit = 0.1 ether;
    bool public isActive = true;

    event Withdrawal(address indexed to, uint256 amount);
    event Deposit(address indexed from, uint256 amount);
    event FaucetDisabled();

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier whenActive() {
        require(isActive, "Faucet is disabled");
        _;
    }

    function withdraw(uint256 amount) public whenActive {
        require(amount <= withdrawalLimit, "Exceeds withdrawal limit");
        require(address(this).balance >= amount, "Insufficient balance");
        payable(msg.sender).transfer(amount);
        emit Withdrawal(msg.sender, amount);
    }

    function setWithdrawalLimit(uint256 newLimit) public onlyOwner {
        withdrawalLimit = newLimit;
    }

    function disableFaucet() public onlyOwner {
        isActive = false;
        emit FaucetDisabled();
    }

    function withdrawAll() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }
}