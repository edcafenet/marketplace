import React, { Component } from 'react';
import Web3 from 'web3'

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      inputDataAsString: ''
    };
  }

  updateInputValue(evt) {
    this.setState({
      inputDataAsString: evt.target.value
    });
  }

  parseInputValueToArray(inputString) {
    let jsonObject = JSON.parse(inputString)
    return jsonObject.tasks
  }

  render() {
    return (
      <div id="content">
        <h1>Add Service</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.serviceName.value
          const price = window.web3.utils.toWei(this.servicePrice.value.toString(), 'Ether')
          const time = this.serviceTime.value
          this.props.createService(name, price, time)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="serviceName"
              type="text"
              ref={(input) => { this.serviceName = input }}
              className="form-control"
              placeholder="Service Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="servicePrice"
              type="text"
              ref={(input) => { this.servicePrice = input }}
              className="form-control"
              placeholder="Service Price"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="serviceTime"
              type="text"
              ref={(input) => { this.serviceTime = input }}
              className="form-control"
              placeholder="Service Time (Mins)"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Add Service</button>
        </form>
        <p>&nbsp;</p>
        <h2>Buy Service</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Time (Mins)</th>
              <th scope="col">Owner</th>
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col">Input data</th>
            </tr>
          </thead>
          <tbody id="serviceList">
            { this.props.services.map((service, key) => {
              return(
                <tr key={key}>
                  <th scope="row">{service.id.toString()}</th>
                  <td>{service.name}</td>
                  <td>{window.web3.utils.fromWei(service.price.toString(), 'Ether')} Eth</td>
                  <td>{service.timeInMinutes.toString()}</td>
                  <td>{service.owner}</td>
                  <td>
                    {
                      !service.purchased
                      ? <button
                          name={service.id}
                          value={service.price}
                          onClick={(event) => {
                            this.props.purchaseService(event.target.name,
                                                       event.target.value,
                                                       this.parseInputValueToArray(this.state.inputDataAsString))
                          }}
                        >
                          Buy
                        </button>
                      : null
                    }
                    </td>

                    <td>
                      { !service.purchased && service.owner === this.props.account
                        ? <button
                            name={service.id}
                            onClick={(event) => {
                              this.props.removeService(event.target.name)
                            }}
                          >
                            Remove
                          </button>
                        : null
                      }
                      </td>
                      <td>
                      { !service.purchased && service.owner !== this.props.account
                        ?
                      <input
                        id="input"
                        type="text"
                        style={{width: "350px"}}
                        value={this.state.inputDataAsString}
                        onChange={evt => this.updateInputValue(evt)}
                        className="form-control"
                        placeholder="Input JSON data"
                        required />
                        : service.inputData
                      }
                      </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;
