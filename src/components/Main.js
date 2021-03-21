import React, { Component } from 'react';
import FileUploader from './FileUploader.js'
import Modal from './Modal.js'
import CenteredTree from './MerkleViz.js'

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      InputTasks: [],
      InputRoot: '',
      InputFileLoaded: false,
      ShowModalArray: [ { name: "first", isActive: false },
                        { name: "second", isActive: false },
                        { name: "third", isActive: false },
                        { name: "fourth", isActive: false }],

      EtherScanUrlArray: ['https://rinkeby.etherscan.io/tx/0x4f2f4b0b40ebfc5677d6967244cabe79388d2ffbb20811e1025a66bca3314ed4',
                          'https://rinkeby.etherscan.io/tx/0xe554770fe2635f94b0e88dee11959e9734ffd3e9646366745c47ab7b00d46940',
                          'https://rinkeby.etherscan.io/tx/0x0f8cc94b341b4114cb01627b2b2c96d6529278999c60854153219329b10efe72']
    };
      this.handleInputFile = this.handleInputFile.bind(this)
      this.onClick = this.onClick.bind(this)
  }

  onReaderLoad(event){
    var jsonObject = JSON.parse(event.target.result)
    this.setState({InputTasks : jsonObject.tasks})
    this.setState({InputRoot : jsonObject.root})
    this.setState({InputFileLoaded : true})
  }

handleInputFile(inputFile) {
    var reader = new FileReader();
    reader.readAsText(inputFile);
    reader.onload = this.onReaderLoad.bind(this);
  }

  onClick(index) {
    let tmp = this.state.ShowModalArray;
    tmp[index].isActive = !tmp[index].isActive;
    this.setState({ ShowModalArray: tmp });
}

  render() {
    return (
      <div id="content">
      { this.props.account == '0x531E40a3e0327f6c5760b2896A20dcA6cCBf7844'
        ?
        <>
        <h1>Add service</h1>
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
              placeholder="Number of Robots"
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
        </>
        : null
       }

        <p>&nbsp;</p>
        <h2>Buy service</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Number of Robots</th>
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
                  <td><a target="_blank"  href={this.state.EtherScanUrlArray[key]}>{service.owner}</a></td>

                  <td>
                    {
                      !service.purchased && service.owner !== this.props.account && this.state.InputFileLoaded
                      ? <button className="btn btn-primary"
                          name={service.id}
                          value={service.price}
                          onClick={(event) => {
                            this.props.purchaseService(event.target.name,
                                                       event.target.value,
                                                       this.state.InputTasks,
                                                       this.state.InputRoot)
                          }}
                        >
                          Buy
                        </button>
                      : null
                    }
                    </td>

                    <td>
                      { !service.purchased && service.owner === this.props.account
                        ? <button className="btn btn-primary"
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
                        <FileUploader {...this.props}
                        handleInputFile = {this.handleInputFile} />
                        : service.purchased ?
                        <>
                        <button className="btn btn-primary" onClick={() => this.onClick(key)}>
                         Results
                        </button>

                            <Modal show={this.state.ShowModalArray[key].isActive} handleClose={() => this.onClick(key)}>
                              <CenteredTree service_id={key}/>
                            </Modal>
                        </>
                          : null
                      }
                      </td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;
