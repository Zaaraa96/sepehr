const mongoose =require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const timestamps = require('../../plugins/mongo_timestamp_plugin');

const schema = new mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: true,},
        mimetype:{type:String, required:true},
        usedType: {type:String,}
    }, { _id : false }
);

schema.plugin(timestamps);
schema.plugin(mongoosePaginate);

module.exports = mongoose.model('File',schema);