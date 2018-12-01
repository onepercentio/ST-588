const SecurityToken = artifacts.require("SecurityToken.sol")
const TokenWhitelist = artifacts.require("TokenWhitelist.sol")

module.exports = function(deployer) {

    const cap = 1000000000000000000000000000
    const name = 'STO TOKEN'
    const symbol = 'STO'
    const decimals = 18
       
    deployer.deploy(TokenWhitelist).then(function(){
        deployer.deploy(SecurityToken, cap, name, symbol, decimals, TokenWhitelist.address)
    })
    
    
};