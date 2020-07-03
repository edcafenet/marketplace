pragma solidity ^0.5.0;

contract Marketplace {
  string public name;

  struct Service{
    uint id;
    string name;
    uint price;
    uint timeInMinutes;
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
    services[serviceCount] = Service(serviceCount, _name, _price, _timeInMinutes, msg.sender, false);
    // trigger an event
    emit ServiceCreated(serviceCount, _name, _price, _timeInMinutes, msg.sender, false);
  }

  function purchaseService(uint _id) public payable {
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
    // transfer ownership to the buyer
    _service.owner = msg.sender;
    // mark as purchased
    _service.purchased = true;
    // Update the service
    services[_id] = _service;
    // pay the seller by sending them Ether
    address(_seller).transfer(msg.value);
    // trigger an event
    emit ServicePurchased(_id, _service.name, _service.price, _service.timeInMinutes, msg.sender, true);
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
}
