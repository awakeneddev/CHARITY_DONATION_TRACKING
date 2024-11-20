// Importing the Hardhat Runtime Environment (hre)
// This provides access to Hardhat's functionalities like deployments and testing
const hre = require("hardhat");

async function main() {
  // 1. Retrieve the contract factory for "Donations"
  // This is the abstraction to deploy and interact with the "Donations" contract
  const Donations = await hre.ethers.getContractFactory("Donation");
  const tokenAddress = "0xD058Fa321cadB80f2aA855e7ba42728bf8244cD8";

  // 2. Deploy the "Donations" contract
  // The deploy method sends a deployment donation to the blockchain
  const donations = await Donations.deploy(tokenAddress);

  // 3. Wait for the deployment to be mined
  // This ensures the deployment donation is fully completed
  await donations.waitForDeployment();

  console.log("donation address : ", donations.target);
}

// 5. Handle errors during the deployment process
// Logs the error and exits the process with a failure code
main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
