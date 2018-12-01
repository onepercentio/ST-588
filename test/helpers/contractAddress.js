const _ = require('lodash')
module.exports = function contractAddress(response) {
    _.get(response, 'response.receipt.logs[0].address')
}
