const { Transaction } = require("@ethereumjs/tx");
const { bufferToHex, bigIntToHex, toBuffer } = require("@ethereumjs/util");

/**
 * @param {String} raw
 * @returns 
 */
 const decodeRaw = (raw) => {
    if(!raw) {
      return ''
    }
    if(!raw.includes('0x')) {
      raw = `0x${raw}`
    }
    let tx = Transaction.fromSerializedTx(toBuffer(raw.toString(16)));
    return {
      nonce: bigIntToHex(tx.nonce),
      gasPrice: bigIntToHex(tx.gasPrice),
      gasLimit: bigIntToHex(tx.gasLimit),
      to: tx.to.toString(),
      value: bigIntToHex(tx.value),
      data: bufferToHex(tx.data),
    }
  }
  

  module.exports = {
    decodeRaw
  }