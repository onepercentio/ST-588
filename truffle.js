const HDWalletProvider = require('truffle-hdwallet-provider')
const mnemonic = 'Insert mnemoic here'

module.exports = {
    solc: {
        optimizer: {
            enabled: true,
            runs: 200
        }
    },
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*", // Match any network id
            gas: 4500000
        },
        ropsten: {
            provider: function() {
                return new HDWalletProvider(process.env.mnemonic || mnemonic, 'insert infura.io', 0)
            },
            network_id: 3,
            gas: 4706206,
            gasPrice: 1000000000000
        }
    }
};
