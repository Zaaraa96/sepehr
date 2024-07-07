
const fs = require('fs');
const jwt = require('jsonwebtoken');
const {error_model} = require("../error/error_model");
const {ERRORS} = require("../error/errors");
const Messages = require("../asset/static/messages");

const privateKey = fs.readFileSync('./asset/keys/private.key'); //todo: move to config route

function _generateJWTToken(data) {
    return new Promise((resolve,reject) => {

        try{
            jwt.sign(data, privateKey, {algorithm: 'RS256'}, function (err, token) {
                if (err)
                    reject(error_model(ERRORS.cantCreateToken, Messages.cantCreateToken, err))
                // console.log(token);
                resolve(token)
            });
        }catch (e) {
            reject(error_model(ERRORS.cantCreateToken, Messages.cantCreateToken, e))
        }
    });
}


module.exports.generateJWTToken = async function (id) {
    return new Promise(async (resolve, reject) => {
        try{
            const now =new Date().getTime();
            const token = await _generateJWTToken({
                "iss": "localhost",
                "iat": now,
                "sub": id,
                "exp": now + 24*3600*1000
            })
            resolve(token);
        }catch (e) {
            reject(e);
        }
    });
};

module.exports.validateJWT = async function (data) {
    return new Promise((resolve,reject) => {
        try {
            const decoded = jwt.verify(data, privateKey,{algorithm: 'RS256'});
            if(decoded.exp < new Date().getTime()) //token has expired
            {
                reject(error_model(ERRORS.invalidToken, Messages.INVALID_token, 'token is expired'))
            }
            resolve(decoded);
          } catch(err) {
            // console.log(err);
            reject(error_model(ERRORS.invalidToken, Messages.INVALID_token, err))
          }
    });
};

