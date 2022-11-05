import { ethers } from "hardhat";

async function main() {
  const Vote = await ethers.getContractFactory("vote");
  const vote = await Vote.deploy();
  await vote.deployed();
  console.log(`vote contract has been deployed successfully in ${vote.address}`)

  const erc20 = await vote.myERC20()
  console.log(`erc20 contract has been deployed successfully in ${erc20}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
