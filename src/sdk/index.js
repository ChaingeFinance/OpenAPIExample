const Chainge = require("@chainge/sdk");
const { ethers, Wallet}  = require("ethers") ;
const rsaVerify = require('../utils/verify')

const privateKey = ''
const rpcUrl = '' // The rpc that wants to operate the network

// When the first argument is null, only wrapped API methods can be used
const chainge = new Chainge(null, {
  signUrl: "https://openapi.chainge.finance/sign/getSign",
  expireTime: 15000,
  appKey: "32Mh2R1xUdtJWHGXA1cGJNHzDUzbkZoB2dTWt3RdzoiLq7LjxxBUDLi1RBCgKxFh",
});

/**
 * Get all openapi support available chains
 * 
 *   [
        ...
        {
            id: 1,
            name: 'FSN',
            chainId: 32659,
            fullName: 'Fusion',
            url: 'https://chainge.oss-cn-hongkong.aliyuncs.com/icon/2_FSN_color.png',
            tokens: [],
            isActive: true
        }
        ...
    ]
 */
const getSupportChains = async () => {
  try {
    const result = await chainge.getSupportChains();
    if (result.code === 200) {
      console.log("chain list:", result.data.chains);
      return result.data.chains;
    }
  } catch (error) {
    console.log("getSupportChains error:", error);
    throw error;
  }
};
// getSupportChains()

/**
     * With no chain set, it gets all tokens for all chains by default
     * Otherwise get tokens for the specified chain
     * @param {String} chain optional
     * 
        [
            {
                id: 8,
                name: 'MATIC',
                chainId: 137,
                fullName: 'Polygon',
                url: 'https://chainge.oss-cn-hongkong.aliyuncs.com/icon/50_MATIC_color.png',
                tokens: [],
                isActive: true
            },
        ]
     */
const getSupportTokens = async (chain = null) => {
  try {
    const result = await chainge.getSupportTokens(chain);
    if (result.code === 200) {
      console.log("token list:", result.data.tokenVos);
      return result.data.tokenVos;
    }
  } catch (error) {
    console.log("getSupportTokens error:", error);
    throw error;
  }
};
// getSupportTokens()
// getSupportTokens('ETH')

/**
 * Get Order Detail
 * @param {String} sn
 * @returns
 */
const getOrderDetail = async (sn) => {
  try {
    const result = await chainge.getOrderDetail(sn);

    if (result.code === 200) {
      console.log("order detail: ", result.data);
      return result.data;
    }
    console.log(result.msg);
  } catch (error) {
    console.log("getOrderDetail error: ", error);
    throw error;
  }
};
// getOrderDetail('CC1010820220902105416092')

/**
 *
 * @param {String} amount fromAmount
 * @param {String} chain fromChain
 * @param {String} evmAddress user address
 * @param {String} fromAddress user address
 * @param {String} token fromToken
 */
const getTransferToMinterRaw = async (
  amount,
  chain,
  evmAddress,
  fromAddress,
  token
) => {
  try {
    const params = {
      amount: amount,
      chain: chain,
      evmAddress: evmAddress,
      fromAddress: fromAddress,
      token: token,
    };
    const result = await chainge.getTransferToMinterRaw(params);
    if (result.code === 200) {
      console.log(result.data);
      const raw = result.data.raw.split("_")[0];
      return raw;
    }
    console.log(result.msg);
  } catch (error) {
    console.log("getTransferToMinterRaw error:", error);
    throw error;
  }
};
// getTransferToMinterRaw(
//   10,
//   "ETH",
//   "0x42a6685ef29886Cbcb595Aa903f00dea0d1787d8",
//   "0x42a6685ef29886Cbcb595Aa903f00dea0d1787d8",
//   "USDT"
// );

// --------------------- cross chain begin ----------------------------

/**
 * get a quote for a cross chain transaction
 * @param {String} amount
 * @param {String} fromChain
 * @param {String} toChain
 * @param {String} token
 * @param {String} feeLevel
 */
const getCrossChainQuote = async (
  amount,
  fromChain,
  toChain,
  token,
  feeLevel
) => {
  try {
    const params = {
      amount: amount,
      fromChain: fromChain,
      toChain: toChain,
      token: token,
      feeLevel: feeLevel,
    };
    const result = await chainge.getCrossChainQuote(params);

    if (result.code === 200) {
      console.log(result.data.crossChain);
      return result.data.crossChain;
    }
    console.error(result.msg);
  } catch (error) {
    console.log("getCrossChainQuote error:", error);
    throw error;
  }
};
// getCrossChainQuote(10, 'ETH', 'ETHW', 'USDT', 0)

/**
 * submit transaction hash and start cross-chain
 * @param {String} certHash txhash
 * @param {String} fromChain
 * @param {String} fromAmount
 * @param {String} fromToken
 * @param {String} fromAddress
 * @param {String} evmAddress
 * @param {String} toChain
 * @param {String} feeLevel
 * @returns
 */
const submitCrossChain = async (
  certHash,
  fromChain,
  fromAmount,
  fromToken,
  fromAddress,
  evmAddress,
  toChain,
  feeLevel
) => {
  try {
    const params = {
      certHash: certHash,
      fromChain: fromChain,
      fromAmount: fromAmount,
      fromToken: fromToken,
      fromAddress: fromAddress,
      evmAddress: evmAddress,
      toChain: toChain,
      feeLevel: feeLevel,
    };
    const result = await chainge.submitCrossChain(params);
    if (result.code === 200) {
      console.log("crossChain result: ", result.data);
      return result.data;
    }
    console.log(result.msg);
  } catch (error) {
    console.log("submitCrossChain error:", error);
    throw error;
  }
};

// --------------------- cross chain end ----------------------------

// --------------------- aggregator begin ----------------------------

/**
 * Get a quote for a cross chain liquidity aggregator transaction
 * @param {String} fromAmount
 * @param {String} fromChain
 * @param {String} fromToken
 * @param {String} toChain
 * @param {String} toToken
 * @param {String} feeLevel
 * @returns
 */
const getAggregateQuote = async (
  fromAmount,
  fromChain,
  fromToken,
  toChain,
  toToken,
  feeLevel
) => {
  try {
    const params = {
      fromAmount: fromAmount,
      fromChain: fromChain,
      fromToken: fromToken,
      toChain: toChain,
      toToken: toToken,
      feeLevel: feeLevel,
    };
    const result = await chainge.getAggregateQuote(params);

    if (result.code === 200) {
      console.log(result.data.aggregate);
      return result.data.aggregate;
    }
    console.error(result.msg);
  } catch (error) {
    console.log("getAggregateQuote error:", error);
    throw error;
  }
};

/**
 *
 * @param {String} certHash
 * @param {String} fromChain
 * @param {String} fromAmount
 * @param {String} fromToken
 * @param {String} fromAddress
 * @param {String} evmAddress
 * @param {String} toChain
 * @param {String} toToken
 * @param {String} feeLevel
 * @returns
 */
const submitAggregate = async (
  certHash,
  fromChain,
  fromAmount,
  fromToken,
  fromAddress,
  evmAddress,
  toChain,
  toToken,
  feeLevel
) => {
  try {
    const params = {
      certHash: certHash,
      fromChain: fromChain,
      fromAmount: fromAmount,
      fromToken: fromToken,
      fromAddress: fromAddress,
      evmAddress: evmAddress,
      toChain: toChain,
      toToken: toToken,
      feeLevel: feeLevel,
    };

    const result = await chainge.submitAggregate(params);

    if (result.code === 200) {
      console.log("crossChain result: ", result.data);
      return result.data;
    }
    console.log(result.msg);
  } catch (error) {
    console.log("submitAggregate error:", error);
    throw error;
  }
};
// --------------------- aggregator end ----------------------------


const mainByCrossChain = async () => {
    try {
        // example fromChain, fromToken, toChain, toToken should be those supported by openapi
        let fromChain = 'ETH'
        let fromToken = 'USDT'
        let fromAmount = '10'
        let toChain = 'BSC'
        let feeLevel = 0

        const walletInfo = new Wallet(privateKey)
        let userAddress = walletInfo.address

        const quoteParams = {
            amount: fromAmount,
            fromChain: fromChain,
            toChain: toChain,
            token: fromToken,
            feeLevel: feeLevel,
        }
        const quoteResult = await chainge.getCrossChainQuote(quoteParams)
        if(quoteResult.code !== 200) {
            console.log('chainge.getCrossChainQuote error: ', quoteResult.msg)
            return
        }

        const rawParams = {
            amount: fromAmount,
            chain: fromChain,
            evmAddress: userAddress,
            fromAddress: userAddress,
            token: fromToken,
        };
        const transactionRaw = await chainge.getTransferToMinterRaw(rawParams)
        if(transactionRaw.code !== 200) {
            console.log('chainge.getTransferToMinterRaw error: ', transactionRaw.msg)
            return
        }
        const raw = transactionRaw.data.raw.split('_')[0]
        const signData = transactionRaw.data.raw.split('_')[1]
        if(!rsaVerify(raw, signData)) {
          console.log('raw error')
          return
        }

        // Parsing Raw
        const transaction = Chainge.decodeRaw(raw)

        // get a wallInstance
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
        const wallInstance = walletInfo.connect(provider)

        // Method 1: Signature and broadcast are separate
        // const signRaw = await wallInstance.signTransaction(transaction)
        // const tx = await provider.sendTransaction(signRaw)
        // const receipt = await tx.wait();
        
        // Method 2: Signature and broadcast go together
        // Sign and broadcast
        const tx = await wallInstance.sendTransaction(transaction);
        // Initiates transaction on user's frontend which user has to sign
        const receipt = await tx.wait();

        // get txHash
        const certHash = receipt.transactionHash

        const submitParams = {
            certHash: certHash,
            fromChain: fromChain,
            fromAmount: fromAmount,
            fromToken: fromToken,
            fromAddress: userAddress,
            evmAddress: userAddress,
            toChain: toChain,
            feeLevel: feeLevel,
          };
        const createOrderInfo = await chainge.submitCrossChain(submitParams)
        if(createOrderInfo.code !== 200) {
            console.log('chainge.submitCrossChain error: ', createOrderInfo.msg)
            return
        }

        // Periodic polling to get the cross-chain status, knowing that status is equal to 2
        const orderDetail = await chainge.getOrderDetail(createOrderInfo.data.sn)
        console.log('cross chain progress:', orderDetail)
        
    } catch(error) {
        console.log('main error:', error)
        throw error
    }
}


const mainByAggregator = async () => {
    try {
        // example fromChain, fromToken, toChain, toToken should be those supported by openapi
        let fromChain = 'ETH'
        let fromToken = 'USDT'
        let fromAmount = '10'
        let toChain = 'BSC'
        let toToken = 'BNB'
        let feeLevel = 0

        const walletInfo = new Wallet(privateKey)
        let userAddress = walletInfo.address

        const quoteParams = {
            fromAmount: fromAmount,
            fromChain: fromChain,
            fromToken: fromToken,
            toChain: toChain,
            toToken: toToken,
            feeLevel: feeLevel,
        }
        const quoteResult = await chainge.getAggregateQuote(quoteParams)
        if(quoteResult.code !== 200) {
            console.log('chainge.getCrossChainQuote error: ', quoteResult.msg)
            return
        }

        const rawParams = {
            amount: fromAmount,
            chain: fromChain,
            evmAddress: userAddress,
            fromAddress: userAddress,
            token: fromToken,
        };
        const transactionRaw = await chainge.getTransferToMinterRaw(rawParams)
        if(transactionRaw.code !== 200) {
            console.log('chainge.getTransferToMinterRaw error: ', transactionRaw.msg)
            return
        }
        const raw = transactionRaw.data.raw.split('_')[0]
        const signData = transactionRaw.data.raw.split('_')[1]
        if(!rsaVerify(raw, signData)) {
          console.log('raw error')
          return
        }
        // Parsing Raw
        const transaction = Chainge.decodeRaw(raw)

        // get a wallInstance
        const provider = new ethers.providers.JsonRpcProvider(rpcUrl)
        const wallInstance = walletInfo.connect(provider)

        // Method 1: Signature and broadcast are separate
        // const signRaw = await wallInstance.signTransaction(transaction)
        // const tx = await provider.sendTransaction(signRaw)
        // const receipt = await tx.wait();
        
        // Method 2: Signature and broadcast go together
        // Sign and broadcast
        const tx = await wallInstance.sendTransaction(transaction);
        // Initiates transaction on user's frontend which user has to sign
        const receipt = await tx.wait();

        // get txHash
        const certHash = receipt.transactionHash

        const submitParams = {
            certHash: certHash,
            fromChain: fromChain,
            fromAmount: fromAmount,
            fromToken: fromToken,
            fromAddress: fromAddress,
            evmAddress: evmAddress,
            toChain: toChain,
            toToken: toToken,
            feeLevel: feeLevel,
          };
        const createOrderInfo = await chainge.submitAggregate(submitParams)
        if(createOrderInfo.code !== 200) {
            console.log('chainge.submitAggregate error: ', createOrderInfo.msg)
            return
        }

        // Periodic polling to get the cross-chain status, knowing that status is equal to 2
        const orderDetail = await chainge.getOrderDetail(createOrderInfo.data.sn)
        console.log('aggregate progress:', orderDetail)
        
    } catch(error) {
        console.log('main error:', error)
        throw error
    }
}

mainByCrossChain()