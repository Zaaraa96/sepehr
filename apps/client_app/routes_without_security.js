const {CLIENT_UI_VERSION, filePath, } = require("../../asset/static/default_values");
const express = require("express");
const {create_user_validate,
    create_user_handler,
    login_validate,
    login_handler,
    get_user_handler,
    search_user_handler
} = require("../../modules/user/user_controller");
// const DOWNLOAD_handler = require("../../route/download");
const router= express.Router();


module.exports = (app) => {
    router.post('/login',login_validate,login_handler);
    // router.get(filePath+'/:id', DOWNLOAD_handler);
    router.post('/user', create_user_validate,create_user_handler);
    router.get('/user/:id', get_user_handler);
    router.get('/user', search_user_handler);

    app.use(CLIENT_UI_VERSION,router);

}