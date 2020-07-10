pragma solidity ^0.5.0;

contract Marketplace {
  string public name;

  struct Service{
    uint id;
    string name;
    uint price;
    uint timeInMinutes;
    bytes32 root;
    bytes32[] tasks;
    bytes32[] results;
    address payable seller;
    address payable owner;
    bool purchased;
  }

  uint public serviceCount = 0;
  mapping(uint => Service) public services;

  // Log event for the creation of the service
  event ServiceCreated(
    uint id,
    string name,
    uint price,
    uint timeInMinutes,
    address payable seller,
    address payable owner,
    bool purchased
  );

  // Log event for purchasing a service
  event ServicePurchased(
    uint id,
    string name,
    uint price,
    uint timeInMinutes,
    bytes32 root,
    bytes32[] tasks,
    address payable seller,
    address payable owner,
    bool purchased
  );

  // Log event for removing a service
  event ServiceRemoved(
    uint id,
    string name,
    uint price,
    uint timeInMinutes,
    address payable owner
  );

  // Log event for availability of results in service
  event ServiceResults(
    uint id,
    string name,
    uint price,
    uint timeInMinutes,
    bytes32 root,
    bytes32[] tasks,
    bytes32[] results,
    address payable seller,
    address payable owner
  );

  constructor() public {
    name = "IRIDIA Swarm Marketplace";
  }

  function createService(string memory _name, uint _price, uint _timeInMinutes) public {
    // Make sure parameters are correct:
    // require a _name
    require(bytes(_name).length > 0);
    // require a valid _price
    require(_price > 0);
    // require a valid time duration
    require(_timeInMinutes > 0);
    // increment service count
    serviceCount++;
    // create a service
    services[serviceCount] = Service(serviceCount, _name, _price, _timeInMinutes, '', new bytes32[](0), new bytes32[](0), msg.sender, msg.sender, false);
    // trigger an event
    emit ServiceCreated(serviceCount, _name, _price, _timeInMinutes, msg.sender, msg.sender, false);
  }

  function purchaseService(uint _id, bytes32[] memory _tasks, bytes32 _root) public payable {
    //fetch the services
    Service memory _service = services[_id];
    //make sure the service has a valid id
    require(_service.id > 0 && _service.id <= serviceCount);
    // require that there is enough Ether in the transaction
    require(msg.value >= _service.price);
    // Require that the service has not been purchased already
    require(!_service.purchased);
    // Require that the buyer is different from the seller
    require(_service.seller != msg.sender);
    // Require that the input tasks are not null
    require(_tasks.length > 0);
    // Require that the root of the MT in not null
    require(_root != 0);
    // assign the received input tasks inside the service
    _service.tasks = _tasks;
    // assign the received MT root inside the service
    _service.root = _root;
    // transfer ownership to the buyer
    _service.owner = msg.sender;
    // mark as purchased
    _service.purchased = true;
    // Update the service
    services[_id] = _service;
    // pay the seller by sending them Ether
    address(_service.seller).transfer(msg.value);
    // trigger an event
    emit ServicePurchased(_id, _service.name, _service.price, _service.timeInMinutes,
                          _root, _tasks,
                          _service.seller, _service.owner,
                          true);
  }

  function removeService(uint _id) public {
    //fetch the services
    Service memory _service = services[_id];
    //fetch the owner
    address _seller = _service.owner;
    //make sure the service has a valid id
    require(_service.id > 0 && _service.id <= serviceCount);
    // Require that the service has not been purchased already
    require(!_service.purchased);
    // Require that the caller is the seller
    require(_seller == msg.sender);
    // Delete the service
    delete services[_id];
    //decrease serviceCount
    serviceCount--;
    // trigger an event
    emit ServiceRemoved(_id, _service.name, _service.price, _service.timeInMinutes, msg.sender);
  }

  function setResultsOfServiceId(uint _id, bytes32[] memory _results) public payable {
    // Fetch the service
    Service memory _service = services[_id];
    // Require that the service has been purchased already
    require(_service.purchased);
    // Require that the caller is equal to the original seller
    require(_service.seller == msg.sender);
    // Require that the results' size is two-fold to the task length array
    require(_results.length == _service.tasks.length * 2);
    // Set results inside the service instance
    _service.results = _results;
    // Update the service
    services[_id] = _service;
    // trigger the results event
    emit ServiceResults(_id, _service.name, _service.price, _service.timeInMinutes,
                        _service.root, _service.tasks, _service.results,
                        _service.seller, _service.owner);
  }

  function getTasksOfServiceId(uint _id) public view returns (bytes32[] memory) {
    return services[_id].tasks;
  }

  function getRootOfServiceId(uint _id) public view returns (bytes32) {
    return services[_id].root;
  }
}
