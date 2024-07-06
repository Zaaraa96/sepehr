const validateJWT = require('../service/jwt_service').validateJWT
const messages = require('../asset/static/messages')
const {error_model} = require("../error/error_model");
const {ERRORS} = require("../error/errors");
const user_service = require("../modules/user/user_service");

module.exports.tokenParser = async function (req, res, next) {
    try{
        if (!req.headers.authorization)
        {
            res.err(401, error_model( ERRORS.invalidToken, messages.USER_TOKEN_IS_INVALID, 'no token sent'));
            return;
        }
        let token = req.headers.authorization.replace('Bearer ', '');
        if (token == undefined || token.length < 10) {
            res.err(401, error_model( ERRORS.invalidToken, messages.USER_TOKEN_IS_INVALID, 'token is invalid'));
            return;
        } else {
            let decodedToken =await validateJWT(token);
            if(decodedToken)
            {const user = await user_service.get_user_by_id(decodedToken.sub);

                if(!user)
                {
                    res.err(401, error_model( ERRORS.invalidToken, messages.USER_TOKEN_IS_INVALID, 'no user found'));
                    return
                }

                req.user = {
                    id: decodedToken.sub
                }
                next()
            }else{
                res.err(401, error_model( ERRORS.invalidToken, messages.USER_TOKEN_IS_INVALID, 'token is invalid'));
            }
            
        }
    }catch(err)
    {
        if(err.exceptionCode)
        {
            res.err(401,err);
            return;
        }
        res.err(400, error_model( 0, messages.GENERAL_ERROR_OCCURRED, err));
    }
   
}