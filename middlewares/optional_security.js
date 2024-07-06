const validateJWT = require('../service/jwt_service').validateJWT
const user_service = require("../modules/user/user_service");

module.exports.optional_security = async function (req, res, next) {
    try{
        if (!req.headers.authorization)
        {
            next();
            return;
        }
        let token = req.headers.authorization.replace('Bearer ', '');
        if (token == undefined || token.length < 10) {
            next();

        } else {
            let decodedToken =await validateJWT(token);
            if(decodedToken)
            {const user = await user_service.get_user_by_id(decodedToken.sub);

                if(!user)
                {
                    next();
                    return;
                }
                req.user = {
                    id: decodedToken.sub
                }
                next()
            }else{
                next();
            }
            
        }
    }catch(err)
    {
        if(err.exceptionCode)
        {
            next();
            return;
        }
        next();
    }
   
}