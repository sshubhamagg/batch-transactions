
# **Batch Transactions SDK**

The SDK facilitates transactions on evm blockchains in batches, handling both native ETH and ERC-20 tokens


## **Installation and Usage**

> Installation

Clone the github repo 

`git clone https://github.com/sshubhamagg/batch-transactions.git`

Install dependencies via npm or yarn

`npm install or yarn add`

Create a .env file with the following data


```
BATCH_CONTRACT_ADDRESS=
PRIVATE_KEY=
SENDER_ADDRESS=
RPC_URL=
POLYGON_GAS_STATION_URL=
```

* `BATCH_CONTRACT_ADDRESS` - Batching contract address. Use 0x5b32c0e6c7e3eadd08b18d7ec7f444459d31f716 for polygon testnet
* `PRIVATE_KEY` - Senders private key to sign transactions.
* `SENDER_ADDRESS` - Senders public address
* `RPC_URL`  - RPC URL to connect to blockchain
* `POLYGON_GAS_STATION_URL`  - Gas station URL to fetch gas params

> Methods
#### Send Coins 
The `bactchSendCoin` function is an asynchronous function that sends coins to multiple recipients. It takes an object as a parameter with the following properties:

-   `from`: The address of the sender.
-   `recepients`: An array of recipient addresses.
-   `amounts`: An array of amounts to be sent to each recipient.

```
const result = await bactchSendCoin({ 
	from: '0x1234567890abcdef', 
	recepients: ['0xrecipient1', '0xrecipient2'], 
	amounts: ['1', '2'] 
}); 
console.log(result);
```

#### Send Tokens
	The bactchSendToken function is an asynchronous function that sends tokens to multiple recipients in batches. 
	It takes the following parameters:

- sender: The address of the sender.
-	tokenContractAddress: The address of the token contract.
-	recepients: An array of recipient addresses.
-	amounts: An array of token amounts corresponding to each recipient.
```
const result = await bactchSendToken({ 
	from: '0x1234567890abcdef', 
	tokenContractAddress: '0xabcbefg123456'
	recepients: ['0xrecipient1', '0xrecipient2'], 
	amounts: ['1', '2'] 
}); 
console.log(result);
```

#### Approve Tokens
The approveTokens function is an asynchronous function that approves a specified amount of tokens to be spent by a contract. It takes the following parameters:

- from: The address of the sender.
- tokenContractAddress: The address of the token contract.
- amounts: An array of token amounts to be approved.
```
const result = await approveTokens({ 
	from: '0x1234567890abcdef', 
	tokenContractAddress: '0xabcbefg123456'
	amounts: ['1', '2'] 
}); 
console.log(result);
```