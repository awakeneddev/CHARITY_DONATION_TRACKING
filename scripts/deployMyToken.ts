// Importing the Hardhat Runtime Environment (hre)

import { parseEther } from "ethers";

// This provides access to Hardhat's functionalities like deployments and testing
const hre = require("hardhat");

async function main() {
  const MyToken = await hre.ethers.getContractFactory("MyToken");

  // set the initial supply 1 milllion tokens
  const initialSupply = parseEther("1000000");

  // deploy the ERC20 Contract
  const myToken = await MyToken.deploy(initialSupply);

  // wait for the contract to be deployed
  await myToken.waitForDeployment();

  console.log("My token deployed to", myToken.target);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
