const Shopfront = artifacts.require("./Shopfront.sol");
const Ownable = artifacts.require("./Ownable.sol");

contract('Shopfront', accounts => { 

    let contract;

    const owner = accounts[0];
    const merchant1 = accounts[1];
    const merchant2 = accounts[3];
    const buyer = accounts[3];

    beforeEach( () => 
        Shopfront.new({from: owner})
        .then( instance => { contract = instance })
    );

    it("Should be own by the owner and the Adminfees should equal 5", () => 
        contract.owner({from : owner}).then(_owner =>
            assert.equal(_owner, owner, "Contract is not owned by the owner") )
    );

    it("Should be able to change the adminstrative fee", () => {
        return contract.adminFee(6, {from : owner})
        .then( () =>{ 
        return contract.administrativeFee({from : owner}) 
        }).then( fee =>{
            assert.equal(fee, 6, "the owner should be able to change the fee structure") 
        })
    });
    
    /* how to test for require()? */
    /* it("Should not be able to change the adminstrative fee", function() {
        return contract.adminFee(6, {from : merchant})
        .then( function(err){
            assert.isDefined(err, "transaction should have thrown");
        })
    }); */

    it("should be able to add merchants", () => {
        return contract.addMerchant(merchant1, {from : owner})
        .then( () =>{ 
        return contract.addMerchant(merchant2, {from : owner})
        .then( () =>{ 
            return contract.merchants(merchant1, {from : owner}) 
            }).then( merchant =>{
                assert.equal(merchant[0], merchant1, "the owner should be able to add a merchant"); 
            }).then( () =>{ 
                return contract.merchants(merchant2, {from : owner}) 
                }).then( merchant =>{
                    assert.equal(merchant[0], merchant2, "the owner should be able to add more than one merchant"); 
            })
        })
    });
    
    it("should be able to add a product", () => {
        return contract.addMerchants(merchant, {from : owner})
        .then( () =>{ 
        return contract.addProduct(1255423, 1000000000000000000, 5, {from : merchant})
        }).then( () =>{ 
        return contract.products(1255423, {from : merchant}) 
        }).then( product =>{
            assert.equal(product[0], 1255423, "it should equal the id of the product");
            assert.equal(product[1], 1000000000000000000, "it should equal the price of the product");
            assert.equal(product[2], 5, "it should equal the amount of availabe products"); 
            assert.equal(product[3], merchant, "it should equal to the address of the merchant");   
        })
    });
    
    it("should remove a product", () => {
        return contract.addMerchants(merchant, {from : owner})
        .then( () =>{ 
        return contract.addProduct(1255423, 1000000000000000000, 5, {from : merchant})
        }).then( () =>{ 
        return contract.removeProduct(1255423, {from : merchant})
        }).then( () =>{ 
        return contract.products(1255423, {from : merchant}) 
        }).then( product =>{
            assert.equal(product[0], 0, "id should equal 0");
            assert.equal(product[1], 0, "price should equal 0");
            assert.equal(product[2], 0, "amount should equal 0");
            assert.equal(product[3], 0, "merchant address should equal to the address of the merchant");     
        })
    }); 


    it("should be able to buy a product", () => {
        return contract.addMerchants(merchant, {from : owner})
        .then( () =>{ 
        return contract.addProduct(1255423, 1000000000000000000, 5, {from : merchant})
        }).then( () =>{ 
        return contract.products(1255423, {from : merchant}) 
        }).then( data =>{
        return contract.buyProduct(1255423, {from : buyer, value: 1}) 
        }).then( ()=>{

        return contract.products(1255423, {from : buyer}).buyer()
        }).then( data => console.log(data)

        )  

    });
    

});