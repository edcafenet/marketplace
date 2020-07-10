pragma solidity ^0.5.0;

contract Marketplace {
  string public name;

  struct Service{
    uint id;
    string name;
    uint price;
    uint timeInMinutes;
    bytes32[] data;
    bytes32 root;
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
    address payable owner,
    bool purchased
  );

  // Log event for paying a service
  event ServicePurchased(
    uint id,
    string name,
    uint price,
    uint timeInMinutes,
    bytes32[] data,
    bytes32 root,
    address payable owner,
    bool purchased
  );

  // Log event for paying a service
  event ServiceRemoved(
    uint id,
    string name,
    uint price,
    uint timeInMinutes,
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
    services[serviceCount] = Service(serviceCount, _name, _price, _timeInMinutes, new bytes32[](0), '', msg.sender, false);
    // trigger an event
    emit ServiceCreated(serviceCount, _name, _price, _timeInMinutes, msg.sender, false);
  }

  function purchaseService(uint _id, bytes32[] memory _data, bytes32 _root) public payable {
    //fetch the services
    Service memory _service = services[_id];
    //fetch the owner
    address payable _seller = _service.owner;
    //make sure the service has a valid id
    require(_service.id > 0 && _service.id <= serviceCount);
    // require that there is enough Ether in the transaction
    require(msg.value >= _service.price);
    // Require that the service has not been purchased already
    require(!_service.purchased);
    // Require that the buyer is different from the seller
    require(_seller != msg.sender);
    // Require that the input data in not null
    require(_data.length > 0);
    // Require that the root of the MT in not null
    require(_root != 0);
    // assign the received input data inside the service
    _service.data = _data;
    // assign the received MT root inside the service
    _service.root = _root;
    // transfer ownership to the buyer
    _service.owner = msg.sender;
    // mark as purchased
    _service.purchased = true;
    // Update the service
    services[_id] = _service;
    // pay the seller by sending them Ether
    address(_seller).transfer(msg.value);
    // trigger an event
    emit ServicePurchased(_id, _service.name, _service.price, _service.timeInMinutes, _data, _root, msg.sender, true);
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

  function getInputDataOfServiceId(uint _id) public view returns (bytes32[] memory) {
    return services[_id].data;
  }

  function getRootOfServiceId(uint _id) public view returns (bytes32) {
    return services[_id].root;
  }
}
