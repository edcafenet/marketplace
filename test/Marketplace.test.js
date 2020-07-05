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
      result = await marketplace.createService('16 epucks work', web3.utils.toWei('1','Ether'), 30, {from:seller})
      serviceCount = await marketplace.serviceCount()
    })

    it('create services', async () =>{
      // SUCCESS
      assert.equal(serviceCount,1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), serviceCount.toNumber(), 'id is correct')
      assert.equal(event.name, '16 epucks work', 'name is correct')
      assert.equal(event.price, '1000000000000000000', 'price is correct')
      assert.equal(event.timeInMinutes, '30', 'time duration is correct')
      assert.equal(event.owner, seller, 'owner is correct')
      assert.equal(event.purchased, false, 'purchased is correct')

      // FAILURE
      // Service must have a name
      await await marketplace.createService('', web3.utils.toWei('1','Ether'), {from:seller}).should.be.rejected;
      // Service must have a price above 0
      await await marketplace.createService('16 epucks work', 0, {from:seller}).should.be.rejected;
      // Service must have a time duration above 0
      await await marketplace.createService('16 epucks work',  web3.utils.toWei('1','Ether'), 0, {from:seller}).should.be.rejected;

    })

    it('list services', async () =>{
      const service = await marketplace.services(serviceCount)
      assert.equal(service.id.toNumber(), serviceCount.toNumber(), 'id is correct')
      assert.equal(service.name, '16 epucks work', 'name is correct')
      assert.equal(service.price, '1000000000000000000', 'price is correct')
      assert.equal(service.timeInMinutes, '30', 'time duration is correct')
      assert.equal(service.owner, seller, 'owner is correct')
      assert.equal(service.purchased, false, 'purchased is correct')
    })

    it('sells services', async () =>{
      // Track the seller balance before purchase
      let oldSellerBalance
      oldSellerBalance = await web3.eth.getBalance(seller)
      oldSellerBalance = new web3.utils.BN(oldSellerBalance)

      // FAILURE: Buyer tries to buy the service with empty input data
      await marketplace.purchaseService(serviceCount, [], {from: buyer, value:web3.utils.toWei('1','Ether')}).should.be.rejected

      // SUCCESS: Buyer makes purchase
      // Dummy merkle tree to prepare the inputData variable
      let merkleTree = ['0x7465737400000000000000000000000000000000000000000000000000000000',
                        '0x7465737400000000000000000000000000000000000000000000000000000000',
                        '0x7465737400000000000000000000000000000000000000000000000000000000']

      result = await marketplace.purchaseService(serviceCount, merkleTree, {from: buyer, value:web3.utils.toWei('1','Ether')})

      // Check logs
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), serviceCount.toNumber(), 'id is correct')
      assert.equal(event.name, '16 epucks work', 'name is correct')
      assert.equal(event.price, '1000000000000000000', 'price is correct')
      assert.equal(event.timeInMinutes, '30', 'time duration is correct')
      assert.equal(event.owner, buyer, 'owner is correct')
      assert.equal(event.purchased, true, 'purchased is correct')
      // Check that the input data is there
      assert.deepEqual(event.inputData, merkleTree, 'input data is correct')

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
      await marketplace.purchaseService(99, merkleTree, {from: buyer, value:web3.utils.toWei('1','Ether')}).should.be.rejected
      // FAILURE: Tries to buy a service with not enough Ether
      await marketplace.purchaseService(serviceCount, merkleTree, {from: buyer, value:web3.utils.toWei('0.5','Ether')}).should.be.rejected
      // FAILURE: Deployer tries to buy a service i.e., service cannot be purchased twice
      await marketplace.purchaseService(serviceCount, merkleTree, {from: deployer, value:web3.utils.toWei('1','Ether')}).should.be.rejected
      // FAILURE: Buyer tries to buy the service again i.e., buyer cannot not be seller
      await marketplace.purchaseService(serviceCount, merkleTree, {from: buyer, value:web3.utils.toWei('0.5','Ether')}).should.be.rejected
    })

    it('remove services', async () =>{
      // SUCCESS
      // Create a service that was not bought previously
      let resultCreateService = await marketplace.createService('32 epucks work', web3.utils.toWei('1','Ether'), 30,  {from:seller})
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

     it('get merkle tree from purchased services', async () =>{
       // SUCCESS
       let resultCreateService = await marketplace.createService('32 epucks work', web3.utils.toWei('1','Ether'), 30,  {from:seller})
       let serviceCount = await marketplace.serviceCount()

       let merkleTreeInput = ['0x7465737400000000000000000000000000000000000000000000000000000000',
                              '0x7465737400000000000000000000000000000000000000000000000000000000',
                              '0x7465737400000000000000000000000000000000000000000000000000000000']

       let resultPurchaseService = await marketplace.purchaseService(serviceCount, merkleTreeInput, {from: buyer, value:web3.utils.toWei('1','Ether')})
       let merkleTreeReceived = await marketplace.getInputDataOfServiceId(serviceCount)
       // Check that the input data is the one received is the same
       assert.deepEqual(merkleTreeReceived, merkleTreeInput, 'received data is correct')

     })
  })
})
