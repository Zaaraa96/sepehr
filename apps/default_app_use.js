const cors = require('cors');
const general = require('../middleWares/general');
const express = require('express')
const expressWinston = require('express-winston');
const winston = require('winston');

module.exports = (app, allowedOrigins) => {
    app.use(function (req, res, next) {

        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        next();
    });

    app.use(cors({
        origin: function(origin, callback){
            // allow requests with no origin
            // (like mobile apps or curl requests)
            if(!origin) return callback(null, true);
            if(origin=='null') return callback(null, true);
            if(allowedOrigins.indexOf(origin) === -1){
                const msg = 'The CORS policy for this site does not ' +
                    'allow access from the specified Origin.';
                return callback(msg, false);
            }
            return callback(null, true);
        }
    }));
    const uuid = require('node-uuid');
    app.use(function(req, res, next) {
        const id = uuid.v1();
        console.log()
        req.reqId = id ;
        next();
    });
    app.use(express.json());
    app.use(
        express.urlencoded({
            extended: true,
        })
    );

    app.use(general);

    app.use(expressWinston.logger({
        transports: [
            new (winston.transports.File)({
        filename: './info.log',
        // File will only record errors
        level: 'info'
        }),
        ],
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.json()
        ),
        meta: true, // optional: control whether you want to log the meta data about the request (default to true)
        msg: "HTTP reqId:{{req.reqId}} {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
        expressFormat: false, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
        colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
        ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
    }));
}