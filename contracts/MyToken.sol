// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("MyToken", "MTK") {
        return
            // Mint initial supply to deployer's address
            _mint(msg.sender, initialSupply * 10 ** decimals());
    }
}
