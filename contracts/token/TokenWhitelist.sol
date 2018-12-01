pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract TokenWhitelist is Ownable {

    mapping(address => bool) private whitelist;

    event Whitelisted(address indexed wallet);
    event Dewhitelisted(address indexed wallet);

    function enableWallet(address _wallet) public onlyOwner {
        require(_wallet != address(0), "Invalid wallet");
        whitelist[_wallet] = true;
        emit Whitelisted(_wallet);
    }

    function disableWallet(address _wallet) public onlyOwner {
        whitelist[_wallet] = false;
        emit Dewhitelisted (_wallet);
    }
    
    function checkWhitelisted(address _wallet) public view returns (bool){
        return whitelist[_wallet];
    }
    
}

