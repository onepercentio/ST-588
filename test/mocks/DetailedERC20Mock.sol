pragma solidity ^0.4.23;

import "../../contracts/token/SecurityToken.sol";

contract DetailedERC20Mock is SecurityToken {
  	constructor(string _name, string _symbol, uint8 _decimals) SecurityToken(
    1000,
    _name,
    _symbol,
    _decimals,
    0xB9dcBf8A52Edc0C8DD9983fCc1d97b1F5d975Ed7) public {}

}
