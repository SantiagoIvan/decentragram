pragma solidity ^0.8.0;

contract Ownable {
    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }
}
