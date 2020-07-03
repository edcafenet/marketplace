const Marketplace = artifacts.require('./Marketplace.sol')

// chai library
require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Marketplace', ([deployer, seller, buyer]) => {
  let marketplace

  before(async () => {
    marketplace = await Marketplace.deployed()
  })

  describe('deployment', async () =>{
    it('deploys successfully', async() => {
      const address = await marketplace.address
      assert.notEqual(address,0x0)
      assert.notEqual(address,'')
      assert.notEqual(address,null)
      assert.notEqual(address,undefined)
    })

    it('has a name', async () =>{
      const name = await marketplace.name()
      assert.equal(name, 'IRIDIA Swarm Marketplace')
    })
  })

  describe('products', async () =>{
    let result, productCount
    before(async () => {
      result = await marketplace.createProduct('iPhone X', web3.utils.toWei('1','Ether'), {from:seller})
      productCount = await marketplace.productCount()
    })

    it('create products', async () =>{
      // SUCCESS
      assert.equal(productCount,1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
      assert.equal(event.name, 'iPhone X', 'name is correct')
      assert.equal(event.price, '1000000000000000000', 'price is correct')
      assert.equal(event.owner, seller, 'owner is correct')
      assert.equal(event.purchased, false, 'purchased is correct')

      // FAILURE
      // Product must have a name
      await await marketplace.createProduct('', web3.utils.toWei('1','Ether'), {from:seller}).should.be.rejected;
      // Product must have a price above 0
      await await marketplace.createProduct('IPhone X', 0, {from:seller}).should.be.rejected;

    })

    it('list products', async () =>{
      const product = await marketplace.products(productCount)
      assert.equal(product.id.toNumber(), productCount.toNumber(), 'id is correct')
      assert.equal(product.name, 'iPhone X', 'name is correct')
      assert.equal(product.price, '1000000000000000000', 'price is correct')
      assert.equal(product.owner, seller, 'owner is correct')
      assert.equal(product.purchased, false, 'purchased is correct')
    })

    it('sells products', async () =>{
      // Track the seller balance before purchase
      let oldSellerBalance
      oldSellerBalance = await web3.eth.getBalance(seller)
      oldSellerBalance = new web3.utils.BN(oldSellerBalance)

      // SUCCESS: Buyer makes purchase
      result = await marketplace.purchaseProduct(productCount, {from: buyer, value:web3.utils.toWei('1','Ether')})

      // Check logs
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), productCount.toNumber(), 'id is correct')
      assert.equal(event.name, 'iPhone X', 'name is correct')
      assert.equal(event.price, '1000000000000000000', 'price is correct')
      assert.equal(event.owner, buyer, 'owner is correct')
      assert.equal(event.purchased, true, 'purchased is correct')

      // Check that seller received funds
      let newSellerBalance
      newSellerBalance = await web3.eth.getBalance(seller)
      newSellerBalance = new web3.utils.BN(newSellerBalance)

      let price
      price = web3.utils.toWei('1','Ether')
      price = new web3.utils.BN(price)

      const expectedBalance = oldSellerBalance.add(price)
      assert.equal(newSellerBalance.toString(), expectedBalance.toString())

      // FAILURE: Tries to buy a product that does not exist product needs a valid id
      await marketplace.purchaseProduct(99, {from: buyer, value:web3.utils.toWei('1','Ether')}).should.be.rejected
      // FAILURE: Tries to buy a product with not enough Ether
      await marketplace.purchaseProduct(productCount, {from: buyer, value:web3.utils.toWei('0.5','Ether')}).should.be.rejected
      // FAILURE: Deployer tries to buy a product i.e., product cannot be purchased twice
      await marketplace.purchaseProduct(productCount, {from: deployer, value:web3.utils.toWei('1','Ether')}).should.be.rejected
      // FAILURE: Buyer tries to buy the product again i.e., buyer cannot not be seller
      await marketplace.purchaseProduct(productCount, {from: buyer, value:web3.utils.toWei('0.5','Ether')}).should.be.rejected
    })

    it('remove products', async () =>{
      // SUCCESS
      // Create a product that was not bought previously
      let resultCreateProduct = await marketplace.createProduct('iPhone XI', web3.utils.toWei('1','Ether'), {from:seller})
      const event = resultCreateProduct.logs[0].args
      let productCountBefore = await marketplace.productCount()
      result = await marketplace.removeProduct(event.id.toNumber(), {from:seller});
      let productCountAfter = await marketplace.productCount()

      // Check that productCount decreased after removing the product
      assert.equal(productCountBefore.toNumber()-1, productCountAfter.toNumber())

      // FAILURE
      // Product must have a name
      await await marketplace.removeProduct('',{from:seller}).should.be.rejected;

      // Product cannot be erased from buyer
      await await marketplace.removeProduct(0,{from:buyer}).should.be.rejected;
    })
  })
})
