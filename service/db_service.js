const config = require('config');
const mongoose = require('mongoose');

module.exports = {
    connect : () =>{
        console.log(config.database.main_mongo_url)
        mongoose
        .connect(config.database.main_mongo_url, {
        })
        .then((db, err) => {
            if (err) {
                console.log(err)
                console.log('failed to connect to database')
            }else
            {
                console.log('connected to database')
            }
        }).catch((e)=>{
            console.log(e)
            console.log('failed to connect to database')
        });
    }
}

