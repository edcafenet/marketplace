require('babel-register');
require('babel-polyfill');
var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "normal legend face convince hen object brick address off thumb right second";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function() {
       return new HDWalletProvider(mnemonic, 'https://rinkeby.infura.io/v3/a54b19e79a1b412bab06b4605a1143ef');
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000,
  }
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
