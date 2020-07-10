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
      assert.equal(event.seller, seller, 'seller is correct')
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
      assert.equal(service.seller, seller, 'seller is correct')
      assert.equal(service.purchased, false, 'purchased is correct')
    })

    it('sells services', async () =>{
      // Track the seller balance before purchase
      let oldSellerBalance
      oldSellerBalance = await web3.eth.getBalance(seller)
      oldSellerBalance = new web3.utils.BN(oldSellerBalance)

      // Dummy merkle tree to prepare the tasks and root variables
      let merkleTree = { "root" : "0xda47c4a60b4f4cc5ed8a482d5c4f4d25fff237f1b1d8ba5750f63eae1d829557",
                          "tasks" : [ "0x15ba8cb4aa8cd69723915b65bb6600c8364938300327e1f597c26bfcae42159e",
                                      "0x6df1daa79c98ca5cbdacff22040d2eee465b0bf2773e5aa72f57344b77eb8df4",
                                      "0xae6747e093e32e995ce264c47eeb9259308444b2ab2ed8cfe43b8fa43aee0f25"] }

      // SUCCESS: Buyer makes purchase
      result = await marketplace.purchaseService(serviceCount, merkleTree['tasks'], merkleTree['root'], {from: buyer, value:web3.utils.toWei('1','Ether')})

      // Check logs
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), serviceCount.toNumber(), 'id is correct')
      assert.equal(event.name, '16 epucks work', 'name is correct')
      assert.equal(event.price, '1000000000000000000', 'price is correct')
      assert.equal(event.timeInMinutes, '30', 'time duration is correct')
      assert.equal(event.owner, buyer, 'owner is correct')
      assert.equal(event.seller, seller, 'seller is correct')
      assert.equal(event.purchased, true, 'purchased is correct')

      // Check that the root is there
      assert.deepEqual(event.root, merkleTree['root'], 'root is correct')

      // Check that the input tasks are there
      assert.deepEqual(event.tasks, merkleTree['tasks'], 'tasks are correct')

      // Check that seller received funds
      let newSellerBalance
      newSellerBalance = await web3.eth.getBalance(seller)
      newSellerBalance = new web3.utils.BN(newSellerBalance)

      let price
      price = web3.utils.toWei('1','Ether')
      price = new web3.utils.BN(price)

      const expectedBalance = oldSellerBalance.add(price)
      assert.equal(newSellerBalance.toString(), expectedBalance.toString())

      // FAILURE: Buyer tries to buy the service with empty input tasks
      await marketplace.purchaseService(serviceCount, [], merkleTree['root'], {from: buyer, value:web3.utils.toWei('1','Ether')}).should.be.rejected

      // FAILURE: Buyer tries to buy the service with empty root data
      await marketplace.purchaseService(serviceCount, merkleTree['tasks'], [], {from: buyer, value:web3.utils.toWei('1','Ether')}).should.be.rejected

      // FAILURE: Tries to buy a service that does not exist (service needs a valid id)
      await marketplace.purchaseService(99, merkleTree['tasks'], merkleTree['root'], {from: buyer, value:web3.utils.toWei('1','Ether')}).should.be.rejected

      // FAILURE: Tries to buy a service with not enough Ether
      await marketplace.purchaseService(serviceCount, merkleTree['tasks'], merkleTree['root'], {from: buyer, value:web3.utils.toWei('0.5','Ether')}).should.be.rejected

      // FAILURE: Deployer tries to buy a service i.e., service cannot be purchased twice
      await marketplace.purchaseService(serviceCount, merkleTree['tasks'], merkleTree['root'], {from: deployer, value:web3.utils.toWei('1','Ether')}).should.be.rejected

      // FAILURE: Buyer tries to buy the service again i.e., buyer cannot not be seller
      await marketplace.purchaseService(serviceCount, merkleTree['tasks'], merkleTree['root'], {from: buyer, value:web3.utils.toWei('0.5','Ether')}).should.be.rejected

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

     it('get data from purchased services', async () =>{

       // Dummy merkle tree to prepare the tasks and root variables
       let merkleTree = { "root" : "0xda47c4a60b4f4cc5ed8a482d5c4f4d25fff237f1b1d8ba5750f63eae1d829557",
                           "tasks" : [ "0x15ba8cb4aa8cd69723915b65bb6600c8364938300327e1f597c26bfcae42159e",
                                       "0x6df1daa79c98ca5cbdacff22040d2eee465b0bf2773e5aa72f57344b77eb8df4",
                                       "0xae6747e093e32e995ce264c47eeb9259308444b2ab2ed8cfe43b8fa43aee0f25"] }

       // SUCCESS
       let resultCreateService = await marketplace.createService('32 epucks work', web3.utils.toWei('1','Ether'), 30,  {from:seller})
       let serviceCount = await marketplace.serviceCount()
       let resultPurchaseService = await marketplace.purchaseService(serviceCount, merkleTree['tasks'], merkleTree['root'], {from: buyer, value:web3.utils.toWei('1','Ether')})
       let merkleTreeDataReceived = await marketplace.getTasksOfServiceId(serviceCount)
       let merkleTreeRootReceived = await marketplace.getRootOfServiceId(serviceCount)

       // Check that the input tasks are the ones received
       assert.deepEqual(merkleTreeDataReceived, merkleTree['tasks'], 'received tasks are correct')
       assert.equal(merkleTreeRootReceived, merkleTree['root'], 'received root is correct')

       // FAILURE
       resultCreateService = await marketplace.createService('32 epucks work', web3.utils.toWei('1','Ether'), 30,  {from:seller})
       serviceCount = await marketplace.serviceCount()
       merkleTreeDataReceived = await marketplace.getTasksOfServiceId(serviceCount)
       merkleTreeRootReceived = await marketplace.getRootOfServiceId(serviceCount)
       const event = resultCreateService.logs[0].args
       assert.equal(event.purchased, false, 'purchased is correct')
       assert.deepEqual(merkleTreeDataReceived, [], 'there are no merkle tree input tasks')
       assert.equal(merkleTreeRootReceived, 0, 'there is no merkle tree root data')
     })

     it('set results for purchased services', async () =>{

       // Dummy merkle tree to prepare the tasks and root variables
       let merkleTree = { "root" : "0xda47c4a60b4f4cc5ed8a482d5c4f4d25fff237f1b1d8ba5750f63eae1d829557",
                           "tasks" : [ "0x15ba8cb4aa8cd69723915b65bb6600c8364938300327e1f597c26bfcae42159e",
                                       "0x6df1daa79c98ca5cbdacff22040d2eee465b0bf2773e5aa72f57344b77eb8df4",
                                       "0xae6747e093e32e995ce264c47eeb9259308444b2ab2ed8cfe43b8fa43aee0f25"] }

       // Dummy results json data structure
       let results = [ "0x15ba8cb4aa8cd69723915b65bb6600c8364938300327e1f597c26bfcae42159e",
                       "0x6df1daa79c98ca5cbdacff22040d2eee465b0bf2773e5aa72f57344b77eb8df4",
                       "0xae6747e093e32e995ce264c47eeb9259308444b2ab2ed8cfe43b8fa43aee0f25",
                       "0x15ba8cb4aa8cd69723915b65bb6600c8364938300327e1f597c26bfcae42159e",
                       "0x6df1daa79c98ca5cbdacff22040d2eee465b0bf2773e5aa72f57344b77eb8df4",
                       "0xae6747e093e32e995ce264c47eeb9259308444b2ab2ed8cfe43b8fa43aee0f25"]

      let resultCreateService = await marketplace.createService('32 epucks work', web3.utils.toWei('1','Ether'), 30,  {from:seller})
      let serviceCount = await marketplace.serviceCount()

      // FAILURE : Service is not purchased  i.e., only purchased services can income have results
      await marketplace.setResultsOfServiceId(serviceCount, results, {from:seller}).should.be.rejected

      let resultPurchaseService = await marketplace.purchaseService(serviceCount, merkleTree['tasks'], merkleTree['root'], {from: buyer, value:web3.utils.toWei('1','Ether')})
      let merkleTreeDataReceived = await marketplace.getTasksOfServiceId(serviceCount)
      let merkleTreeRootReceived = await marketplace.getRootOfServiceId(serviceCount)

      // FAILURE : Buyer tries to input the results i.e., only seller can send the results of a service
      await marketplace.setResultsOfServiceId(serviceCount, results, {from:buyer}).should.be.rejected

      // FAILURE : Results is not the right size i.e., results' size is two-fold to the task length array
      await marketplace.setResultsOfServiceId(serviceCount, results.slice(0,3), {from:seller}).should.be.rejected

      // SUCCESS
      let response = await marketplace.setResultsOfServiceId(serviceCount, results, {from:seller})
    })
  })
})
