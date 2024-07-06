const winston = require('winston');
const expressWinston = require('express-winston');
const multer = require("multer");
const {ERRORS} = require("../error/errors");
const Messages = require("../asset/static/messages");

module.exports = (app) => {
    app.use(expressWinston.errorLogger({
        transports: [
            new winston.transports.Console(),
            new (winston.transports.File)({
                filename: './error.log',
                // File will only record errors
                level: 'error'
            }),
        ],
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.json()
        )
    }));
    app.use(function (err, req, res, next) {
        if (err instanceof multer.MulterError) {
            if(err.code==='LIMIT_FILE_SIZE')
                return res.status(413).json({
                    status: "err",
                    errorCode: ERRORS.file_too_large,
                    msg: Messages.file_too_large,
                });
            return res.status(418).send(err.code);
        }
        else
            next();
    })
}