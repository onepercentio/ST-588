const assertRevert = require('../helpers/assertRevert')
const expect = require('expect.js')
const { BigNumber } = web3

const Token = artifacts.require('SecurityToken.sol');
const Whitelist = artifacts.require('TokenWhitelist.sol');

contract('The SecurityToken', function([ deployer, holder1, holder2, holder3, unauhorized ]) {

    let token, whitelist
    const cap = new BigNumber(100)
    const name = 'SecurityToken'
    const symbol = '588'
    const decimals = new BigNumber(18)

    beforeEach(async function() {
        whitelist = await Whitelist.new()
        token = await Token.new(cap, name, symbol, decimals, whitelist.address)
    })

    describe('on deploy', function() {

        it('should set all parameters', async function() {
            expect(await token.cap()).to.eql(cap)
            expect(await token.name()).to.eql(name)
            expect(await token.symbol()).to.eql(symbol)
            expect(await token.decimals()).to.eql(decimals)
        })

        it('should fail if whitelist address is invalid', async function() {
            await assertRevert(Token.new(cap, name, symbol, decimals, 0x0))
        })

    })

    describe('when minting', function() {

        it('should fail if beneficiary is not whitelisted', async function() {
            await assertRevert(token.mint(holder2, 1))
            expect(await token.balanceOf(holder2)).to.eql(new BigNumber(0))
        })

        it('should mint if the wallet is whitelisted', async function() {
            await whitelist.enableWallet(holder1)
            await token.mint(holder1, 1)
            expect(await token.balanceOf(holder1)).to.eql(new BigNumber(1))
        })

    })

    describe('when transferring', function() {

        beforeEach(async function() {
            await whitelist.enableWallet(holder1)
            await token.mint(holder1, 10)
        })

        it('should fail if destination wallet is not whitelisted', async function() {
            await assertRevert(token.transfer(holder2, 5, { from: holder1 }))
            expect(await token.balanceOf(holder1)).to.eql(new BigNumber(10))
            expect(await token.balanceOf(holder2)).to.eql(new BigNumber(0))
        })

        it('should transfer if destination wallet is whitelisted', async function() {
            await whitelist.enableWallet(holder2)
            await token.transfer(holder2, 7, { from: holder1 })
            expect(await token.balanceOf(holder1)).to.eql(new BigNumber(3))
            expect(await token.balanceOf(holder2)).to.eql(new BigNumber(7))
        })

    })

    describe('when approving', function() {

        beforeEach(async function() {
            await whitelist.enableWallet(holder1)
            await token.mint(holder1, 10)
        })

        it('should fail if spender wallet is not whitelisted', async function() {
            await assertRevert(token.approve(holder2, 5, { from: holder1 }))
            expect(await token.allowance(holder1, holder2)).to.eql(new BigNumber(0))
        })

        it('should aprove if spender wallet is whitelisted', async function() {
            await whitelist.enableWallet(holder2)
            await token.approve(holder2, 7, { from: holder1 })
            expect(await token.allowance(holder1, holder2)).to.eql(new BigNumber(7))
        })

    })

    describe('when transferring from', function() {

        beforeEach(async function() {
            await whitelist.enableWallet(holder1)
            await token.mint(holder1, 10)
            await whitelist.enableWallet(holder2)
            await token.approve(holder2, 10, { from: holder1 })
        })

        it('should fail if destination wallet is not whitelisted', async function() {
            await assertRevert(token.transferFrom(holder1, holder3, 5, { from: holder2 }))
            expect(await token.balanceOf(holder1)).to.eql(new BigNumber(10))
            expect(await token.balanceOf(holder3)).to.eql(new BigNumber(0))
        })
        
        it('should mint if destination wallet is whitelisted', async function() {
            await whitelist.enableWallet(holder3)
            await token.transferFrom(holder1, holder3, 7, { from: holder2 })
            expect(await token.balanceOf(holder1)).to.eql(new BigNumber(3))
            expect(await token.balanceOf(holder3)).to.eql(new BigNumber(7))
        })

    })


    describe('when increasing approval', function() {

        beforeEach(async function() {
            await whitelist.enableWallet(holder1)
            await token.mint(holder1, 10)
        })

        it('should fail if destination wallet is not whitelisted', async function() {
            await assertRevert(token.increaseApproval(holder2, 5, { from: holder1 }))
            expect(await token.allowance(holder1, holder2)).to.eql(new BigNumber(0))
        })
        
        it('should mint if destination wallet is whitelisted', async function() {
            await whitelist.enableWallet(holder2)
            await token.increaseApproval(holder2, 7, { from: holder1 })
            expect(await token.allowance(holder1, holder2)).to.eql(new BigNumber(7))
        })

    })

    describe('when burning for', function() {

        beforeEach(async function() {
            await whitelist.enableWallet(holder1)
            await token.mint(holder1, 10)
        })

        it('should fail if sender is not authorized', async function() {
            await assertRevert(token.burnFor(holder1, 5, { from: unauhorized }))
            expect(await token.balanceOf(holder1)).to.eql(new BigNumber(10))
        })

        it('should fail if target wallet has insufficient funds', async function() {
            await assertRevert(token.burnFor(holder1, 11, { from: deployer }))
            expect(await token.balanceOf(holder1)).to.eql(new BigNumber(10))
        })

        it('should subtract burnt value from target wallet and total supply', async function() {
            const totalSupply = await token.totalSupply()
            await token.burnFor(holder1, 7, { from: deployer })
            expect(await token.balanceOf(holder1)).to.eql(new BigNumber(3))
            expect(await token.totalSupply()).to.eql(totalSupply.sub(7))
        })

        it('should emit burn and transfer events', async function() {
            const amount = new BigNumber(7)
            const { logs: [ BurnEvent, TransferEvent ] } = await token.burnFor(holder1, amount, { from: deployer })
            expect(BurnEvent.args).to.eql({ burner: holder1, value: amount })
            expect(TransferEvent.args).to.eql({
                from: holder1,
                to: '0x0000000000000000000000000000000000000000',
                value: amount
            })
            
        })

    })

})
