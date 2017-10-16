pragma solidity ^0.4.4;

import "./Ownable.sol";
import "./SafeMath.sol";

contract Shopfront is Ownable {
    using SafeMath for uint256;

    
    struct buyer {
        address addr;
        uint amount;
    }
    
    struct merchant {
        address addr;
        uint productId;
        uint amountOwed;
    }

    struct productData {
        uint price;
        uint stock;
        mapping (uint => merchant) merchants;
        mapping (address => buyer) buyers;
    }

    uint nextId;
    mapping (address => merchant) public merchants;
    mapping (uint => productData) public products;

    uint public administrativeFee = 5;

    modifier onlyMerchants() {
        require(msg.sender == merchants[msg.sender].addr);
        _;
    }

    function adminFee(uint _fee) onlyOwner public returns (bool success){
        administrativeFee = _fee;
        return true;
    }

    function addMerchant(address _address) onlyOwner public returns (bool success){
        require(_address > 0x0);

        merchants[_address].addr = _address;
        
        return true;
    }

    function addProduct(uint _price, uint _stock) onlyMerchants public returns (uint id){
        require(_price > 0 && _stock > 0);
        
        var product = products[nextId];

        product.price = _price;
        product.stock = _stock;
        product.merchants[nextId].productId = nextId;
        product.merchants[nextId].addr = msg.sender;

        nextId ++;
        id = nextId;

    }

    function removeProduct(uint _id) onlyMerchants public returns (bool success){
        require(_id < 0);

        delete(products[_id]);
        
        return true;
    }

    function buyProduct(uint _id, uint _quantity) payable public returns (bool success){
        require(products[_id].stock > _quantity);

        var product = products[_id];

        product.buyers[msg.sender].addr = msg.sender;
    
        merchants[product.merchants[_id].addr].amountOwed.add(_quantity.mul(msg.value));

        product.stock.sub(_quantity);

        return true;
    }

    function withdraw() onlyOwner onlyMerchants public returns (bool success) {
        uint amount = merchants[msg.sender].amountOwed;

        merchants[msg.sender].amountOwed = 0;

        owner.transfer(administrativeFee.div(100).mul(amount));
        msg.sender.transfer(amount);

        return true;
    }

}
