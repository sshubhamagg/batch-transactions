const Web3 = require('web3');
const axios = require('axios');
const { FeeMarketEIP1559Transaction } = require('@ethereumjs/tx');
const { bufferToHex } = require('ethereumjs-util');
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const POLYGON_GAS_STATION_URL = process.env.POLYGON_GAS_STATION_URL

module.exports = {
    async sendTransaction({web3, from, to,  value, gas,  maxPriorityFeePerGas, maxFeePerGas, data}) {
        
        const count = await web3.eth.getTransactionCount(from);
        const nonce = await web3.utils.toHex(count);
        const chainId = await web3.eth.getChainId();

        const rawTx = {
            from,
            nonce,
            to,
            value,
            gasLimit: web3.utils.numberToHex(gas),
            maxPriorityFeePerGas,
            maxFeePerGas,
            data,
            chainId,
            type: '0x2',
        };

        const pkey = Buffer.from(PRIVATE_KEY, 'hex');

        const tx = FeeMarketEIP1559Transaction.fromTxData(rawTx);

        const signedTransaction = tx.sign(pkey);

        const signedTx = bufferToHex(signedTransaction.serialize());

        const res = web3.eth.sendSignedTransaction(signedTx);
        res.on('transactionHash', function(hash){
            console.log("------------------------------------------");
        console.log("Recieved txHash: ", hash);
        console.log("------------------------------------------");
        })
        res.once('receipt', function(receipt){
            console.log("------------------------------------------");
            console.log("Recieved recipt: ", receipt);
            console.log("------------------------------------------");
            tx.off("confirmation");
        })
        res.on('confirmation', function(confirmationNumber, receipt){ 
            console.log("------------------------------------------");
            console.log("Awaiting confirmation: ", confirmationNumber, receipt);
            console.log("------------------------------------------");
         })
        res.once('error', console.error); 
    },

      async getGasParams() {    
        const { response, error } = await this.getRequest({ url: POLYGON_GAS_STATION_URL });
    
        if (error) {
            return {error}
        }
         const result = {
                maxFeePerGas: response.standard.maxFee,
                maxPriorityFeePerGas: response.standard.maxPriorityFee,
            }
        return {result};
    },

       async getRequest({ url }) {
        try {
            const response = await axios({
                url,
                method: 'GET',
            });
            return { response: response.data };
        } catch (error) {
            return{ error}
        }
    }
};
