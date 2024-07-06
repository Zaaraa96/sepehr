const config = require("config");
const {filePath,CLIENT_UI_VERSION} = require("../asset/static/default_values");


createURLBasedOnFileId = (fileId)=>{
    return config.host+CLIENT_UI_VERSION+filePath+'/'+fileId;
}

module.exports={
    createURLBasedOnFileId
}