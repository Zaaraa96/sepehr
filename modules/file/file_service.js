
const FileModel = require("./file_model");
const Messages = require("../../asset/static/messages");
const {error_model} = require("../../error/error_model");
const {ERRORS} = require("../../error/errors");

const add_file = async (file)=>{
    return new Promise(async (resolve, reject) => {
        try {
            const res=await new FileModel(file).save();
            resolve(res);
        } catch (e) {
            reject(error_model(ERRORS.fileSavingInDatabaseError, Messages.fileSavingInDatabaseError, e));
        }
    });
};

const get_file= (fileId)=>{
    return new Promise(async (resolve, reject) => {
        try {
            const file= await FileModel.findById(fileId);
            if (!file) {
                reject(error_model(ERRORS.noFileFound, Messages.noFileFound, 'no file found by this id'));
                return;
            }
            resolve(file);

        } catch (e) {
            reject(error_model(ERRORS.getFileFromDatabaseFailed, Messages.getFileFromDatabaseFailed, e));
        }
    })
}

const _save_file = (file)=>{
    return new Promise(async (resolve, reject) => {
        try{
            await file.save();
            resolve(file);
        }catch (e) {
            reject(error_model(ERRORS.fileSavingInDatabaseError, Messages.fileSavingInDatabaseError, e));
        }

    })
}

const set_description_for_file= async(userId,fileId, usedType)=>{
    return new Promise(async (resolve, reject) => {
        try{
            const file = await getFile(fileId);
            if (file.usedType) {
                reject(error_model(ERRORS.fileAlreadyInUse, Messages.fileAlreadyInUse, 'file in use'));
                return;
            }
            if (file.user.toString() !==userId.toString()) {
                reject(error_model(ERRORS.fileNotYoursToUse, Messages.fileNotYoursToUse, 'file is not user\'s'));
                return;
            }
            file.usedType = usedType.toLowerCase();
            const res= await _save_file(file);
            resolve(res);
        }catch (e) {
            reject(e);
        }

    })
}

const set_dDescription_for_image= async(userId,fileId, usedType)=>{
    return new Promise(async (resolve, reject) => {
        try{
            const file = await getFile(fileId);
            if (file.usedType) {
                reject(error_model(ERRORS.fileAlreadyInUse, Messages.fileAlreadyInUse, 'file in use'));
                return;
            }
            if (file.user.toString() !==userId.toString()) {
                reject(error_model(ERRORS.fileNotYoursToUse, Messages.fileNotYoursToUse, 'file is not user\'s'));
                return;
            }
            if (file.mimetype === 'application/pdf') {
                reject(error_model(ERRORS.fileTypeNotImage, Messages.fileTypeNotImage, 'file is application/pdf'));
                return;
            }
            file.usedType = usedType.toLowerCase();
            const res= await _save_file(file);
            resolve(res);
        }catch (e) {
            reject(e);
        }

    })
}

module.exports = {
    add_file,
    set_dDescription_for_image,
    set_description_for_file,
    get_file,
}