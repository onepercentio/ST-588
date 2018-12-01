pragma solidity ^0.4.24;

import "../../contracts/token/SecurityToken.sol";

// mock class using StandardToken
contract StandardTokenMock is SecurityToken {
    constructor(address initialAccount, uint256 initialBalance, address _whitelist) public
        SecurityToken(1000, "Security", "Sec", 18, _whitelist) {
        balances[initialAccount] = initialBalance;
        totalSupply_ = initialBalance;
    }

}
