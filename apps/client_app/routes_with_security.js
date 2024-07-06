const {CLIENT_UI_VERSION, filePath} = require("../../asset/static/default_values");
const express = require("express");
const router= express.Router();
// const Multer = require("multer");
const {tokenParser} = require("../../middleWares/security");
// const {checkFileType,maxSize,UPLOAD_FILE_handler} = require("../../route/upload");
const {
    edit_user_validate,
    edit_user_handler,
    delete_user_handler
} = require("../../modules/user/user_controller");

module.exports = (app) => {
    app.use(tokenParser);

    // router.post(filePath,Multer({
    //     dest: "./uploads/",
    //     limits: {
    //         fileSize: maxSize,
    //     },
    //     fileFilter: function(_req, file, cb){
    //         checkFileType(file, cb);
    //     }
    // }).single("file"),UPLOAD_FILE_handler);

    // router.put('/profile-image',CHANGE_PROFILE_IMAGE_validate,CHANGE_PROFILE_IMAGE_handler);
    router.put('/edit-user',edit_user_validate,edit_user_handler);
    router.delete('/user', delete_user_handler);

    app.use(CLIENT_UI_VERSION, router);
};
