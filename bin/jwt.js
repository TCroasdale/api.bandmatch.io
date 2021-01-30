const jwt = require('jsonwebtoken')
const fs = require('fs')

const options = {
  expiresIn: '31d',
  algorithm: 'RS256'
}

module.exports.issueToken = function (payload) {
  return new Promise((resolve, reject) => {
    const privateKey = fs.readFileSync('auth/jwt.key')
    // WHen using RS256, a private and public key is needed

    jwt.sign({ sub: payload, iat: Date.now() }, privateKey, options, (err, encoded) => {
      if (err) {
        reject(err)
      } else {
        const token = {
          token: encoded,
          expiresIn: options.expiresIn
        }
        resolve(token)
      }
    })
  })
}

module.exports.verifyToken = function (token, done) {
  return new Promise((resolve, reject) => {
    const publicKey = fs.readFileSync('auth/jwt.pem')
    jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
        reject(err)
      } else {
        resolve(decoded)
      }
    })
  })
}

module.exports.verifyTokenSync = function (token) {
  const publicKey = fs.readFileSync('auth/jwt.pem')
  try {
    return jwt.verify(token, publicKey, { algorithms: ['RS256'] })
  } catch (err) {
    return undefined
  }
}
