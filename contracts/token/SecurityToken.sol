pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/PausableToken.sol";
import "openzeppelin-solidity/contracts/token/ERC20/BurnableToken.sol";
import "openzeppelin-solidity/contracts/token/ERC20/CappedToken.sol";
import "./TokenWhitelist.sol";

contract SecurityToken is DetailedERC20, CappedToken, PausableToken {

    TokenWhitelist public whitelist;
    event Burn(address indexed burner, uint256 value);

    constructor(uint256 _cap, string _name, string _symbol, uint8 _decimals, address _whitelist) public
        DetailedERC20(_name, _symbol, _decimals)
        CappedToken(_cap) {
            setupWhitelist(_whitelist);
    }

    /**
    * @dev Sets up the centralized whitelist contract
    * @param _whitelist the address of whitelist contract.
    * @return A boolean that indicates if the operation was successful.
    */
    function setupWhitelist(address _whitelist) public onlyOwner returns (bool) {
        require(_whitelist != address(0), "Invalid whitelist address");
        whitelist = TokenWhitelist(_whitelist);
        return true;
    }

    /**
    * @dev Overrides MintableToken mint() adding the whitelist validation
    * @param _to The address that will receive the minted tokens.
    * @param _amount The amount of tokens to mint.
    * @return A boolean that indicates if the operation was successful.
    */
    function mint(address _to, uint256 _amount) public onlyOwner canMint returns (bool) {
        require(whitelist.checkWhitelisted(_to), "User not authorized");
        return super.mint(_to, _amount);
    }

    /**
    * @dev Overrides BasicToken transfer() adding the whitelist validation
    * @param _to The address to transfer to.
    * @param _value The amount to be transferred.
    * @return A boolean that indicates if the operation was successful.
    */
    function transfer(address _to, uint256 _value) public whenNotPaused returns (bool) {
        require(
            whitelist.checkWhitelisted(msg.sender) &&
            whitelist.checkWhitelisted(_to),
            "User not authorized");
        return super.transfer(_to, _value);
    }

    /**
     * @dev Overrides StandardToken transferFrom() adding the whitelist validation
     * @param _from address The address which you want to send tokens from
     * @param _to address The address which you want to transfer to
     * @param _value uint256 the amount of tokens to be transferred
     */
    function transferFrom(address _from, address _to, uint256 _value) public whenNotPaused returns (bool) {
        require(
            whitelist.checkWhitelisted(msg.sender) &&
            whitelist.checkWhitelisted(_from) &&
            whitelist.checkWhitelisted(_to),
            "User not authorized");
        return super.transferFrom(_from, _to, _value);
    }

    /**
     * @dev Overrides StandardToken approve() adding the whitelist validation
     * @param _spender The address which will spend the funds.
     * @param _value The amount of tokens to be spent.
     * @return A boolean that indicates if the operation was successful.
     */
    function approve(address _spender, uint256 _value) public whenNotPaused returns (bool) {
        require(
            whitelist.checkWhitelisted(msg.sender) &&
            whitelist.checkWhitelisted(_spender),
            "User not authorized");
        return super.approve(_spender, _value);
    }

    /**
     * @dev Overrides StandardToken increaseApproval() adding the whitelist validation
     * @param _spender The address which will spend the funds.
     * @param _addedValue The amount of tokens to increase the allowance by.
     * @return A boolean that indicates if the operation was successful.
     */
    function increaseApproval(address _spender, uint _addedValue) public whenNotPaused returns (bool) {
        require(
            whitelist.checkWhitelisted(msg.sender) &&
            whitelist.checkWhitelisted(_spender),
            "User not authorized");
        return super.increaseApproval(_spender, _addedValue);
    }

    /**
     * @dev Overrides StandardToken decreaseApproval() adding the whitelist validation
     * @param _spender The address which will spend the funds.
     * @param _subtractedValue The amount of tokens to decrease the allowance by.
     * @return A boolean that indicates if the operation was successful.
     */
    function decreaseApproval(address _spender, uint _subtractedValue) public whenNotPaused returns (bool) {
        require(
            whitelist.checkWhitelisted(msg.sender) &&
            whitelist.checkWhitelisted(_spender),
            "User not authorized");
        return super.decreaseApproval(_spender, _subtractedValue);
    }
    
    /**
     * @dev new function to burn tokens from a centralized owner
     * @param _who The address which will be burned.
     * @param _value The amount of tokens to burn.
     * @return A boolean that indicates if the operation was successful.
     */
    function burnFor(address _who, uint _value) public onlyOwner returns (bool) {
        require(_value <= balances[_who], "Insufficient funds");
        balances[_who] = balances[_who].sub(_value);
        totalSupply_ = totalSupply_.sub(_value);
        emit Burn(_who, _value);
        emit Transfer(_who, address(0), _value);
        return true;
    }

}
