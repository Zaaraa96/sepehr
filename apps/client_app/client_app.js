const express = require('express')
const config = require('config')
const cors = require('cors')
const db = require('../../service/db_service')
const general = require('../../middleWares/general');
/* -------------------------------------------------------------------------- */
/*                                 initialize                                 */
/* -------------------------------------------------------------------------- */
const app = express()

// app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

const port = config.get('app.service_port');


app.use(cors())
app.use(express.json());
app.use(
    express.urlencoded({
      extended: true,
    })
);

app.use(general);

const allowedOrigins = [
    "http://localhost:8080",
];

require('../default_app_use')(app,allowedOrigins);

//no authorization routes
require("./routes_without_security")(app);
require("./routes_with_optional_security")(app);

require("./routes_with_security")(app);

require("../app_error")(app);
/* -------------------------------------------------------------------------- */
/*                                   routes                                   */
/* -------------------------------------------------------------------------- */




/* ------------------------------ start server ------------------------------ */
app.listen(port, () => {
  console.log(config.get('app.app_title')  + ` listening at ${port}`)
  db.connect();
})