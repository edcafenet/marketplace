pragma solidity ^0.5.0;

contract Marketplace {
  string public name;

  struct Product{
    uint id;
    string name;
    uint price;
    address payable owner;
    bool purchased;
  }

  uint public productCount = 0;
  mapping(uint => Product) public products;

  // Log event for the creation of the product
  event ProductCreated(
    uint id,
    string name,
    uint price,
    address payable owner,
    bool purchased
  );

  // Log event for paying a product
  event ProductPurchased(
    uint id,
    string name,
    uint price,
    address payable owner,
    bool purchased
  );

  // Log event for paying a product
  event ProductRemoved(
    uint id,
    string name,
    uint price,
    address payable owner
  );

  constructor() public {
    name = "IRIDIA Swarm Marketplace";
  }

  function createProduct(string memory _name, uint _price) public {
    // Make sure parameters are correct:
    // require a _name
    require(bytes(_name).length > 0);
    // require a valid _price
    require(_price > 0);
    // increment product count
    productCount++;
    // create a product
    products[productCount] = Product(productCount, _name, _price, msg.sender, false);
    // trigger an event
    emit ProductCreated(productCount, _name, _price, msg.sender, false);
  }

  function purchaseProduct(uint _id) public payable {
    //fetch the products
    Product memory _product = products[_id];
    //fetch the owner
    address payable _seller = _product.owner;

    //make sure the product has a valid id
    require(_product.id > 0 && _product.id <= productCount);

    // require that there is enough Ether in the transaction
    require(msg.value >= _product.price);
    // Require that the product has not been purchased already
    require(!_product.purchased);
    // Require that the buyer is different from the seller
    require(_seller != msg.sender);
    // transfer ownership to the buyer
    _product.owner = msg.sender;
    // mark as purchased
    _product.purchased = true;
    // Update the product
    products[_id] = _product;
    // pay the seller by sending them Ether
    address(_seller).transfer(msg.value);

    // trigger an event
    emit ProductPurchased(_id, _product.name, _product.price, msg.sender, true);
  }

  function removeProduct(uint _id) public {
    //fetch the products
    Product memory _product = products[_id];
    //fetch the owner
    address _seller = _product.owner;
    //make sure the product has a valid id
    require(_product.id > 0 && _product.id <= productCount);
    // Require that the product has not been purchased already
    require(!_product.purchased);
    // Require that the caller is the seller
    require(_seller == msg.sender);
    // Delete the product
    delete products[_id];
    //decrease productCount
    productCount--;

    // trigger an event
    emit ProductRemoved(_id, _product.name, _product.price, msg.sender);
  }
}
