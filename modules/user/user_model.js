const mongoose =require('mongoose');
const timestamps = require('../../plugins/mongo_timestamp_plugin')
const mongoosePaginate = require('mongoose-paginate-v2');
const autoIncrement = require('mongoose-sequence')(mongoose);
const {createURLBasedOnFileId} = require('../../utils/url_manager');
const Messages = require("../../asset/static/messages");
const {isUsername,isEmail} = require("../../utils/utils");

const schema = new mongoose.Schema({
    id: mongoose.Types.ObjectId,
    phoneNumber: {type:String, required:true, unique:true,minlength:11, maxlength:11, index:1},
    fullName: {type:String,index:1},
    password: {
        salt: {type: String},
        hash: {type: String},
        iterations:{type: Number}
    },
      email: {type:String,
        trim: true,
        validate: {
            validator: isEmail,
            message: Messages.enterValidEmail
        },
    },
    profileImageId: { type: mongoose.Schema.Types.ObjectId, ref: 'File' , index:-1},
    aboutMe:{type:String,}
}, {
    toObject: {virtuals: true},
    toJSON: {virtuals: true}
});


schema.virtual('profileImageUrl').get(function() {
    if (this.profileImageId) { //make url based on id
        return createURLBasedOnFileId(this.profileImageId);
    }
});


schema.plugin(mongoosePaginate);
schema.plugin(timestamps);
schema.plugin(autoIncrement, {inc_field: 'userIntId'});

module.exports = mongoose.model('User',schema);