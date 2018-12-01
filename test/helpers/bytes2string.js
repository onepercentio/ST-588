module.exports = (bytes) => {
    return web3.toAscii(bytes).replace(/\0/g, '')
}
