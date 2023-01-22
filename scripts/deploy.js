// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function getBalance(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function consoleBalances(addressess) {
  let counter = 0;
  for (const address of addressess) {
    console.log(`Account ${counter} balance : `, await getBalance(address));
    counter++;
  }
}

async function consoleMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const name = memo.name;
    const from = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, name ${name}, address ${from}, message ${message}`);
  }
}

async function main() {
  const [owner, from1, from2, from3] = await hre.ethers.getSigners();
  const coffee = await hre.ethers.getContractFactory("coffee");
  const contract = await coffee.deploy(); //instance of contract

  await contract.deployed();
  console.log("Address of contract :", contract.address);

  const addressess = [owner.address, from1.address, from2.address, from3.address];
  console.log("Before buying coffee");
  await consoleBalances(addressess);

  const amount = { value: hre.ethers.utils.parseEther("1") };
  await contract.connect(from1).buyCoffee("from1", "very nice coffee", amount);
  await contract.connect(from2).buyCoffee("from2", "very nice copee", amount);
  await contract.connect(from3).buyCoffee("from3", "very nice cofie", amount);

  console.log("After buying coffee");
  await consoleBalances(addressess);

  const memos = await contract.getMemo();
  consoleMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
