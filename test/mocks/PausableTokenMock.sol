pragma solidity ^0.4.24;

import "../../contracts/token/SecurityToken.sol";

// mock class using PausableToken
contract PausableTokenMock is SecurityToken {
    constructor(address initialAccount, uint256 initialBalance, address _whitelist) public
    SecurityToken(1000, "Security", "Sec", 18, _whitelist) {
        balances[initialAccount] = initialBalance;
    }

}
