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

  describe('services', async () =>{
    let result, serviceCount
    before(async () => {
      result = await marketplace.createService('iPhone X', web3.utils.toWei('1','Ether'), {from:seller})
      serviceCount = await marketplace.serviceCount()
    })

    it('create services', async () =>{
      // SUCCESS
      assert.equal(serviceCount,1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), serviceCount.toNumber(), 'id is correct')
      assert.equal(event.name, 'iPhone X', 'name is correct')
      assert.equal(event.price, '1000000000000000000', 'price is correct')
      assert.equal(event.owner, seller, 'owner is correct')
      assert.equal(event.purchased, false, 'purchased is correct')

      // FAILURE
      // Service must have a name
      await await marketplace.createService('', web3.utils.toWei('1','Ether'), {from:seller}).should.be.rejected;
      // Service must have a price above 0
      await await marketplace.createService('IPhone X', 0, {from:seller}).should.be.rejected;

    })

    it('list services', async () =>{
      const service = await marketplace.services(serviceCount)
      assert.equal(service.id.toNumber(), serviceCount.toNumber(), 'id is correct')
      assert.equal(service.name, 'iPhone X', 'name is correct')
      assert.equal(service.price, '1000000000000000000', 'price is correct')
      assert.equal(service.owner, seller, 'owner is correct')
      assert.equal(service.purchased, false, 'purchased is correct')
    })

    it('sells services', async () =>{
      // Track the seller balance before purchase
      let oldSellerBalance
      oldSellerBalance = await web3.eth.getBalance(seller)
      oldSellerBalance = new web3.utils.BN(oldSellerBalance)

      // SUCCESS: Buyer makes purchase
      result = await marketplace.purchaseService(serviceCount, {from: buyer, value:web3.utils.toWei('1','Ether')})

      // Check logs
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), serviceCount.toNumber(), 'id is correct')
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

      // FAILURE: Tries to buy a service that does not exist service needs a valid id
      await marketplace.purchaseService(99, {from: buyer, value:web3.utils.toWei('1','Ether')}).should.be.rejected
      // FAILURE: Tries to buy a service with not enough Ether
      await marketplace.purchaseService(serviceCount, {from: buyer, value:web3.utils.toWei('0.5','Ether')}).should.be.rejected
      // FAILURE: Deployer tries to buy a service i.e., service cannot be purchased twice
      await marketplace.purchaseService(serviceCount, {from: deployer, value:web3.utils.toWei('1','Ether')}).should.be.rejected
      // FAILURE: Buyer tries to buy the service again i.e., buyer cannot not be seller
      await marketplace.purchaseService(serviceCount, {from: buyer, value:web3.utils.toWei('0.5','Ether')}).should.be.rejected
    })

    it('remove services', async () =>{
      // SUCCESS
      // Create a service that was not bought previously
      let resultCreateService = await marketplace.createService('iPhone XI', web3.utils.toWei('1','Ether'), {from:seller})
      const event = resultCreateService.logs[0].args
      let serviceCountBefore = await marketplace.serviceCount()
      result = await marketplace.removeService(event.id.toNumber(), {from:seller});
      let serviceCountAfter = await marketplace.serviceCount()

      // Check that serviceCount decreased after removing the service
      assert.equal(serviceCountBefore.toNumber()-1, serviceCountAfter.toNumber())

      // FAILURE
      // Service must have a name
      await await marketplace.removeService('',{from:seller}).should.be.rejected;

      // Service cannot be erased from buyer
      await await marketplace.removeService(0,{from:buyer}).should.be.rejected;
    })
  })
})
