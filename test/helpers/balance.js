module.exports = async function balance(address) {
    return web3.eth.getBalance(address)
}
