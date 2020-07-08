import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import Marketplace from '../abis/Marketplace.json'
import Navbar from './Navbar.js'
import Main from './Main.js'
import Gallery from './Gallery.js'

class App extends Component {

  async componentWillMount(){
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3(){
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        }
        else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }
  }

  async loadBlockchainData(){
    // Get object
    const web3 = window.web3

    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})
    const networkid = await web3.eth.net.getId()
    const networkData = Marketplace.networks[networkid]
    if (networkData){
      const marketplace = web3.eth.Contract(Marketplace.abi, networkData.address)
      this.setState({marketplace})
      const serviceCount = await marketplace.methods.serviceCount().call()
      this.setState({serviceCount})
      // Load services
      for (var i =1; i<=serviceCount; i++){
        const service = await marketplace.methods.services(i).call()
        this.setState({
          services: [...this.state.services, service]
        })
      }
      this.setState({loading:false})
    }
    else {
        window.alert('Marketplace contract not deployed to detected network');
    }
  }

  constructor (props)
  {
    super(props)
    this.state = {
      account: '',
      serviceCount: 0,
      services: [],
      loading: true
    }
    this.createService = this.createService.bind(this)
    this.purchaseService = this.purchaseService.bind(this)
    this.removeService = this.removeService.bind(this)
  }

  createService(name,price, time){
    this.setState({loading: true})
    this.state.marketplace.methods.createService(name,price, time).send({from: this.state.account}).on('confirmation', (receipt) => {
      this.setState({loading: false})
      window.location.reload()
    })
  }

  purchaseService(id , price, data){
    this.setState({loading: true})
    this.state.marketplace.methods.purchaseService(id, data).send({from: this.state.account, value: price}).on('confirmation', (receipt) => {
      this.setState({loading: false})
      window.location.reload()
    })
  }

  removeService(id){
    this.setState({loading: true})
    this.state.marketplace.methods.removeService(id).send({from: this.state.account}).on('confirmation', (receipt) => {
      this.setState({loading: false})
      window.location.reload()
    })
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="left">
            <main role="main" className="col-lg-12 d-flex">
               {this.state.loading
                 ? <div id="loader" className="text-center"><p className="text-center">Loading ...</p></div>
                 : <Main
                  account = {this.state.account}
                  services = {this.state.services}
                  purchaseService = {this.purchaseService}
                  createService ={this.createService}
                  removeService = {this.removeService}/>}
            </main>
           </div>
           <div className="right">
            <gallery role="gallery">
             {<Gallery/>}
           </gallery>
           </div>
        </div>
      </div>
    );
  }
}

export default App;
