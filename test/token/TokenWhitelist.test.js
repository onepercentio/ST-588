const assertRevert = require('../helpers/assertRevert')
const expect = require('expect.js')

const Whitelist = artifacts.require('TokenWhitelist.sol');

contract('The TokenWhitelist', function([ deployer, holder1, unauthorized ]) {

    let whitelist

    beforeEach(async function() {
        whitelist = await Whitelist.new()
    })

    describe('when whitelisting', function() {

        it('should fail if sender is not authorized', async function() {
            await assertRevert(whitelist.enableWallet(holder1, { from: unauthorized }))
            expect(await whitelist.checkWhitelisted(holder1)).not.to.be.ok()
        })

        it('should add the wallet to whitelist', async function() {
            await whitelist.enableWallet(holder1)
            expect(await whitelist.checkWhitelisted(holder1)).to.be.ok()
        })

    })

    describe('when de-whitelising', function() {

        beforeEach(async function() {
            await whitelist.enableWallet(holder1)
        })

        it('should fail if sender is not authorized', async function() {
            await assertRevert(whitelist.disableWallet(holder1, { from: unauthorized }))
            expect(await whitelist.checkWhitelisted(holder1)).to.be.ok()
        })

        it('should disable the wallet in the whitelist', async function() {
            await whitelist.disableWallet(holder1)
            expect(await whitelist.checkWhitelisted(holder1)).not.to.be.ok()
        })

    })

})
