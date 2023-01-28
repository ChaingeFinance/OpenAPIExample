const rs = require('jsrsasign');
const publicKey = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDdooUIJrnbNe+CST4DPrPWWHHU0nMj52ChjJtU9/hdTWjEEnzlppHSM3oemrfKT2nAvUenkQBJSJ/f/YLYFU+NrFZljbhxcRsdIF9S3ZPoqLLCv/2eoh/lXaI2VpUNy6MR9++p5/eW6qEQVIZFqCz8+eZ0ecay5psKnGiJDAPupwIDAQAB-----END PUBLIC KEY-----'

module.exports = (raw, signData) => {
    const sign = new rs.KJUR.crypto.Signature({"alg": "SHA256withRSA"});
    sign.init(publicKey); 
    sign.updateString(raw)
    const isValid = sign.verify(signData)
    return isValid
}