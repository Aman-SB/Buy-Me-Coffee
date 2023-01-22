// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.5.0 <0.9.0;

contract coffee {
    struct Memo {
        string name;
        string message;
        uint256 timestamp;
        address from;
    }

    Memo[] memos;
    address payable owner;

    //constructor function making deployer as a owner
    constructor() {
        owner = payable(msg.sender);
    }

    // function to buy a coffee
    function buyCoffee(string memory _name, string memory _message)
        public
        payable
    {
        require(msg.value > 100, "please pay more than 100 gwei");
        //transfering money to the owner
        owner.transfer(msg.value);
        memos.push(Memo(_name, _message, block.timestamp, msg.sender));
    }

    // function to get array of memo
    function getMemo() public view returns (Memo[] memory) {
        return (memos);
    }
}
