const axios = require('axios')
const generateSign = require('../utils/sign')
const { decodeRaw } = require('../utils/utils')
const { ethers, Wallet}  = require("ethers") ;
const rsaVerify = require('../utils/verify')

const appKey = "";
const appSecret = "";

const privateKey = ''
const rpcUrl = '' // The rpc that wants to operate the network


const baseurl = 'https://openapi.chainge.finance'


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
        const result = await axios.get(`${baseurl}/open/v1/base/getSupportChains`)
        if(result.data.code === 200) {
            console.log('chain list:', result.data.data.chains)
            return result.data.data.chains
        }
    } catch(error) {
        console.log('getSupportChains error:', error)
        throw error
    }
}

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
        const result = await axios.get(`${baseurl}/open/v1/base/getSupportTokens`, {
            params: {
                chain: chain
            }
        })
        if(result.data.code === 200) {
            console.log('token list: ', result.data.data.tokenVos)
            return result.data.data.tokenVos
        }
    } catch(error) {
        console.log('getSupportTokens error:', error)
        throw error
    }
}


/**
 * Get Order Detail
 * @param {String} sn 
 * @returns 
 */
 const getOrderDetail = async (sn) => {
    try {
        const headers = {
            appKey: appKey,
            expireTime: 15000,
            timestamp:  new Date().getTime()
        }
        
        const sign = generateSign({}, headers, appKey, appSecret)
        headers['signature'] = sign

        const result = await axios.get(`${baseurl}/open/v1/order/getOrderDetail`, {
            headers: headers,
            params: {
                sn: sn
            }
        })

        if(result.data.code === 200) {
           console.log('order detail: ', result.data.data)
           return result.data.data
        }
        console.log(result.data.msg)
    } catch(error) {
        console.log('getOrderDetail error: ', error)
        throw error
    }
}

/**
 * 
 * @param {String} amount fromAmount
 * @param {String} chain fromChain
 * @param {String} evmAddress user address
 * @param {String} fromAddress user address
 * @param {String} token fromToken
 */
 const getTransferToMinterRaw = async (amount, chain, evmAddress, fromAddress, token) => {
    try {
        const headers = {
            appKey: appKey,
            expireTime: 15000,
            timestamp:  new Date().getTime()
        }
        const params = {
            amount: amount,
            chain: chain,
            evmAddress: evmAddress,
            fromAddress: fromAddress,
            token: token
        }
        const sign = generateSign(params, headers, appKey, appSecret)
        headers['signature'] = sign

        const result = await axios.post(`${baseurl}/open/v1/order/getTransferToMinterRaw`, params, {
            headers: headers
        })

        if(result.data.code === 200) {
            console.log(result.data.data)
            const raw = result.data.data.raw.split('_')[0]
            const signData = result.data.data.raw.split('_')[1]
            
            if(rsaVerify(raw, signData)) {
                return raw
            } else {
                console.log('raw error')
                return ''
            }
        }
        console.log(result.data.msg)
    } catch(error) {
        console.log('getTransferToMinterRaw error:', error)
        throw error
    }
}

// --------------------- cross chain begin ----------------------------

/**
 * get a quote for a cross chain transaction
 * @param {String} amount 
 * @param {String} fromChain 
 * @param {String} toChain 
 * @param {String} token 
 * @param {String} feeLevel 
 */
const getCrossChainQuote = async (amount, fromChain, toChain, token, feeLevel) => {
    try {
        const headers = {
            appKey: appKey,
            expireTime: 15000,
            timestamp:  new Date().getTime()
        }
        const params = {
            amount: amount,
            fromChain: fromChain,
            toChain: toChain,
            token: token,
            feeLevel: feeLevel
        }
        const sign = generateSign(params, headers, appKey, appSecret)
        headers['signature'] = sign

        const result = await axios.post(`${baseurl}/open/v1/order/getCrossChainQuote`, params, {
            headers: headers
        })

        if(result.data.code === 200) {
            console.log(result.data.data.crossChain)
            return result.data.data.crossChain
        }
        console.error(result.data.msg)
    } catch(error) {
        console.log('getCrossChainQuote error:', error)
        throw error
    }
}

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
const submitCrossChain = async (certHash, fromChain, fromAmount, fromToken, fromAddress, evmAddress, toChain, feeLevel) => {
    try {
        const headers = {
            appKey: appKey,
            expireTime: 15000,
            timestamp:  new Date().getTime()
        }
        const params = {
            certHash: certHash,
            fromChain: fromChain,
            fromAmount: fromAmount,
            fromToken: fromToken,
            fromAddress: fromAddress,
            evmAddress: evmAddress,
            toChain: toChain,
            feeLevel: feeLevel
        }
        const sign = generateSign(params, headers, appKey, appSecret)
        headers['signature'] = sign

        const result = await axios.post(`${baseurl}/open/v1/order/submitCrossChain`, params, {
            headers: headers
        })

        if(result.data.code === 200) {
           console.log('crossChain result: ', result.data.data)
           return result.data.data
        }
        console.log(result.data.msg)
    } catch(error) {
        console.log('submitCrossChain error:', error)
        throw error
    }
}

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
const getAggregateQuote = async (fromAmount, fromChain, fromToken, toChain, toToken, feeLevel) => {
    try {
        const headers = {
            appKey: appKey,
            expireTime: 15000,
            timestamp:  new Date().getTime()
        }
        const params = {
            fromAmount: fromAmount,
            fromChain: fromChain,
            fromToken: fromToken,
            toChain: toChain,
            toToken: toToken,
            feeLevel: feeLevel
        }
        const sign = generateSign(params, headers, appKey, appSecret)
        headers['signature'] = sign

        const result = await axios.post(`${baseurl}/open/v1/order/getAggregateQuote`, params, {
            headers: headers
        })

        if(result.data.code === 200) {
            console.log(result.data.data.aggregate)
            return result.data.data.aggregate
        }
        console.error(result.data.msg)
    } catch(error) {
        console.log('getAggregateQuote error:', error)
        throw error
    }
}

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
const submitAggregate = async (certHash, fromChain, fromAmount, fromToken, fromAddress, evmAddress, toChain, toToken, feeLevel) => {
    try {
        const headers = {
            appKey: appKey,
            expireTime: 15000,
            timestamp:  new Date().getTime()
        }
        const params = {
            certHash: certHash,
            fromChain: fromChain,
            fromAmount: fromAmount,
            fromToken: fromToken,
            fromAddress: fromAddress,
            evmAddress: evmAddress,
            toChain: toChain,
            toToken, toToken,
            feeLevel: feeLevel
        }
        const sign = generateSign(params, headers, appKey, appSecret)
        headers['signature'] = sign

        const result = await axios.post(`${baseurl}/open/v1/order/submitAggregate`, params, {
            headers: headers
        })

        if(result.data.code === 200) {
           console.log('crossChain result: ', result.data.data)
           return result.data.data
        }
        console.log(result.data.msg)
    } catch(error) {
        console.log('submitAggregate error:', error)
        throw error
    }
}
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

        const quoteResult = await getCrossChainQuote(fromAmount, fromChain, toChain, fromToken, feeLevel)
        if(!quoteResult) {
            return
        }
        const transactionRaw = await getTransferToMinterRaw(fromAmount, fromChain, userAddress, userAddress, fromToken)
        if(!transactionRaw) {
            return
        }
        // Parsing Raw
        const transaction = decodeRaw(transactionRaw)


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

        const createOrderInfo = await submitCrossChain(certHash, fromChain, fromAmount, fromToken, userAddress, userAddress, toChain, feeLevel)
        if(!createOrderInfo) {
            return
        }

        // Periodic polling to get the cross-chain status, knowing that status is equal to 2
        const orderDetail = await getOrderDetail(createOrderInfo.sn)
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

        const quoteResult = await getAggregateQuote(fromAmount, fromChain, fromToken, toChain, toToken, feeLevel)
        if(!quoteResult) {
            return
        }

        const transactionRaw = await getTransferToMinterRaw(fromAmount, fromChain, userAddress, userAddress, fromToken)
        if(!transactionRaw) {
            return
        }
        // Parsing Raw
        const transaction = decodeRaw(transactionRaw)


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

        const createOrderInfo = await submitAggregate(certHash, fromChain, fromAmount, fromToken, userAddress, userAddress, toChain, toToken, feeLevel)
        if(!createOrderInfo) {
            return
        }

        // Periodic polling to get the aggregator status, knowing that status is equal to 2
        const orderDetail = await getOrderDetail(createOrderInfo.sn)
        console.log('aggregator progress:', orderDetail)
        
    } catch(error) {
        console.log('main error:', error)
        throw error
    }
}

mainByAggregator()