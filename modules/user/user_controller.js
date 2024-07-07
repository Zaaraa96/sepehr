
const projectLogger = require("../../service/project_logger");
const {error_model} = require("../../error/error_model");
const {ERRORS} = require("../../error/errors");
const messages = require("../../asset/static/messages");
const {isMobileNumber, isEmail, isOnlyNumber} = require("../../utils/utils");
const user_service = require("./user_service");
const {generateJWTToken} = require("../../service/jwt_service");

async function create_user_validate(req, res, next) {
    if (!req.body) {
        res.err(400, error_model(ERRORS.USERValidationError, messages.BODY_NOT_PROVIDED, 'validation error'));
        return;
    }
    if (!req.body.phoneNumber) {
        res.err(400, error_model(ERRORS.USERValidationError, messages.phone_number_not_sent, 'validation error'));
        return;
    }
    const checkMobile= isMobileNumber(req.body.phoneNumber);
    if (!checkMobile) {
        res.err(400, error_model(ERRORS.USERValidationError, messages.INVALID_phone_number, 'validation error'));
        return;
    }
    if (!req.body.fullName) {
        res.err(400, error_model(ERRORS.USERValidationError, messages.INVALID_name, 'validation error'));
        return;
    }
    if (!req.body.password) {
        res.err(400, error_model(ERRORS.USERValidationError, messages.INVALID_password, 'validation error'));
        return;
    }

    next()
}
const create_user_handler = (async (req, res) => {
    projectLogger('create user is called');

    try{

        await user_service.register_normal_user(req.body);
        const user = await user_service.get_user_by_phone(req.body.phoneNumber);
        res.suc(user,201);

    }catch (e) {
        res.err(400, e);
    }

})

async function login_validate(req, res, next) {
    if (!req.body) {
        res.err(400, error_model(ERRORS.CODEValidationError, messages.BODY_NOT_PROVIDED, 'validation error'));
        return;
    }
    if (!req.body.phoneNumber) {
        res.err(400, error_model(ERRORS.CODEValidationError, messages.phone_number_not_sent, 'validation error'));
        return;
    }
    const checkMobile= isMobileNumber(req.body.phoneNumber);
    if (!checkMobile) {
        res.err(400, error_model(ERRORS.CODEValidationError, messages.INVALID_phone_number, 'validation error'));
        return;
    }
    if (!req.body.password) {
        res.err(400, error_model(ERRORS.CODEValidationError, messages.INVALID_password, 'validation error'));
        return;
    }
    next()
}
const login_handler = (async (req, res) => {
    projectLogger('login is called');

    try{
        //check code for this number
        const user= await user_service.check_user_password(req.body.phoneNumber, req.body.password);
        const token=await generateJWTToken(user._id);
        res.suc(token,200);

    }catch (e) {
        res.err(401, e);
    }

})

async function edit_user_validate(req, res, next) {
    if (!req.body) {
        res.err(400, error_model(ERRORS.USERValidationError, messages.BODY_NOT_PROVIDED, 'validation error'));
        return;
    }
    if (!req.body.fullName) {
        res.err(400, error_model(ERRORS.USERValidationError, messages.INVALID_name, 'validation error'));
        return;
    }
    if (req.body.email && !isEmail(req.body.email)) {
        res.err(400, error_model(ERRORS.USERValidationError, messages.enterValidEmail, 'validation error'));
        return;
    }
    next()
}
const edit_user_handler = (async (req, res) => {
    projectLogger('edit user is called');

    try{
        const user = await user_service.get_user_by_id(req.user.id);
        await user_service.edit_normal_user(req.user.id,req.body);
        const updated_user = await user_service.get_user_by_id(req.user.id);
        res.suc(updated_user,202);

    }catch (e) {
        res.err(400, e);
    }

})


const search_user_handler = (async (req, res) => {
    projectLogger('search users is called');

    try{
        const result = await user_service.search_users(req.query, req.paging);
        res.suc(result, 200);
    }catch (e) {
        res.err(400, e)
    }
})

const get_user_handler = (async (req, res) => {
    projectLogger('get user is called');

    try{
        const result = await user_service.get_user_by_userId(req.params.id,);
        res.suc(result, 200);
    }catch (e) {
        res.err(400, e)
    }
})

const delete_user_handler = (async (req, res) => {
    projectLogger('delete user is called');

    try{
        const result = await user_service.delete_user(req.user.id);
        res.suc(result, 204);
    }catch (e) {
        res.err(400, e)
    }
})

module.exports = {create_user_validate,
    create_user_handler,
    login_validate,
    login_handler,
    edit_user_validate,
    edit_user_handler,
    search_user_handler,
    delete_user_handler,
    get_user_handler
        };