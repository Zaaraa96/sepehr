const {CLIENT_UI_VERSION, } = require("../../asset/static/default_values");
const express = require("express");
const {optional_security} = require("../../middleWares/optional_security");

const router= express.Router();

module.exports = (app) => {


    app.use(CLIENT_UI_VERSION,router);

}