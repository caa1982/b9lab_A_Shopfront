pragma solidity ^0.4.4;

contract Ownable {

    address public owner;

    function Ownable(){
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

}