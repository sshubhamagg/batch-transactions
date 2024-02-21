require('dotenv').config();
const Web3 = require("web3");

const { batchContractABI } = require("./utils/batch-contract-abi");
const { TOKEN_CONTRACT_ABI } = require("./utils/tokenABI");
const helper = require("./utils/helper");

const BATCH_CONTRACT_ADDRESS = process.env.BATCH_CONTRACT_ADDRESS;
const RPC_URL = process.env.RPC_URL;

const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));

const batchContract = new web3.eth.Contract(
  batchContractABI,
  BATCH_CONTRACT_ADDRESS
);

async function bactchSendCoin({ from, recepients, amounts }) {
  const sender = web3.utils.toChecksumAddress(from);

  const amountsInWei = amounts.map(value => web3.utils.toWei(value, 'ether'));
  const value = amountsInWei.reduce((accumulator, currentValue) => accumulator + Number(currentValue), 0);

  const data = await batchContract.methods
    .disperseEther(recepients, amountsInWei)
    .encodeABI();

  let gas = await batchContract.methods
    .disperseEther(recepients, amountsInWei)
    .estimateGas({ from, value });

  const {result:gasData} = await helper.getGasParams();

  const response = await helper.sendTransaction({
    web3,
    from: sender,
    to: BATCH_CONTRACT_ADDRESS,
    value,
    gas,
    maxFeePerGas: Web3.utils.numberToHex(Web3.utils.toWei(Number(gasData.maxFeePerGas).toFixed(4), 'gwei')),
    maxPriorityFeePerGas: Web3.utils.numberToHex(Web3.utils.toWei(Number(gasData.maxPriorityFeePerGas).toFixed(4), 'gwei')),
    data,
  });

  return {response};
}

async function bactchSendToken({
  sender,
  tokenContractAddress,
  recepients,
  amounts,
}) {

  const amountsInWei = amounts.map(value => value * Math.pow(10, 6));

  const approval = await checkAllowance({
    from: sender,
    tokenContractAddress,
    amounts,
  });

  if (!approval) {
   return {error: "Please approve the tokens berfore sending"}
  }
  const data = await batchContract.methods
    .disperseToken(tokenContractAddress, recepients, amountsInWei)
    .encodeABI();
  let gas = await batchContract.methods
    .disperseToken(tokenContractAddress, recepients, amountsInWei)
    .estimateGas({ from: sender });

    const {result:gasData} = await helper.getGasParams();

  const response = await helper.sendTransaction({
    web3,
    from: sender,
    to: BATCH_CONTRACT_ADDRESS,
    gas,
    maxFeePerGas: Web3.utils.numberToHex(Web3.utils.toWei(Number(gasData.maxFeePerGas).toFixed(4), 'gwei')),
    maxPriorityFeePerGas: Web3.utils.numberToHex(Web3.utils.toWei(Number(gasData.maxPriorityFeePerGas).toFixed(4), 'gwei')),
    data,
  });

  return {response};
}

async function approveTokens({ from, tokenContractAddress, amounts }) 
  {
    const tokenContract = new web3.eth.Contract(
      TOKEN_CONTRACT_ABI,
      tokenContractAddress
    );

    const amountsInWei = amounts.map(value => value * Math.pow(10, 6));
    const value = amountsInWei.reduce((accumulator, currentValue) => accumulator + Number(currentValue), 0);

    const sender = web3.utils.toChecksumAddress(from);

    const allowance = await tokenContract.methods.allowance(from, BATCH_CONTRACT_ADDRESS).call();

    if (Number(allowance) < value) {

      const {result:gasData} = await helper.getGasParams();

      const data = await tokenContract.methods
      .approve(BATCH_CONTRACT_ADDRESS, value)
      .encodeABI();

      let gas = await tokenContract.methods
      .approve(BATCH_CONTRACT_ADDRESS, value)
      .estimateGas({ from: sender });

      const response = await helper.sendTransaction({
        web3,
        from: sender,
        to: tokenContractAddress,
        maxFeePerGas: Web3.utils.numberToHex(Web3.utils.toWei(Number(gasData.maxFeePerGas).toFixed(4), 'gwei')),
        maxPriorityFeePerGas: Web3.utils.numberToHex(Web3.utils.toWei(Number(gasData.maxPriorityFeePerGas).toFixed(4), 'gwei')),    
        data: data,
        gas,
      });
      
      return {response};
    } else return true;
  
}

async function checkAllowance({ from, tokenContractAddress, amounts }) 
  {
    const tokenContract = new web3.eth.Contract(
      TOKEN_CONTRACT_ABI,
      tokenContractAddress
    );

    const amountsInWei = amounts.map(value => value * Math.pow(10, 6));
    const value = amountsInWei.reduce((accumulator, currentValue) => accumulator + Number(currentValue), 0);

    const sender = web3.utils.toChecksumAddress(from);

    const allowance = await tokenContract.methods.allowance(sender, BATCH_CONTRACT_ADDRESS).call();

    if (Number(allowance) < value) {
      return false
          } else return true; 
}


module.exports = {
  bactchSendCoin,
  bactchSendToken,
  approveTokens
}