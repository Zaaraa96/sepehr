
const UserModel = require('./user_model')
const {error_model} = require("../../error/error_model");
const {ERRORS} = require("../../error/errors");
const Messages = require("../../asset/static/messages");
const file_service = require("../file/file_service");
const pbkdf2=require("pbkdf2");
const crypto=require("crypto");

const _check_previous_user =(user)=>{
    return new Promise(async (resolve, reject) => {
        try {
            const previous_user =
                await UserModel.findOne({phoneNumber: user.phoneNumber});

            if (previous_user) {
                reject(error_model(ERRORS.userPhoneNumberIsRegistered, Messages.userPhoneNumberIsRegistered, 'phone number is not registered'));
                return;
            }

            resolve(previous_user);
        } catch (e) {
            reject(error_model(ERRORS.cantGetUser, Messages.cantGetUser, e));
        }
    })
}
const keyLength= 64;
const digest= 'sha256';
const _userProjection={
    phoneNumber: 1,
    fullName: 1,
    profileImageId: 1,
    email:1,
    aboutMe:1,
}

function hashPassword(password) {
    return new Promise(async (resolve, reject) => {
        try{
            const salt = crypto.randomBytes(128).toString('base64');
            const iterations = 10000;
            pbkdf2.pbkdf2(password, salt, iterations, keyLength, digest, (err,hash) => {
                if(err)
                {
                    reject(error_model(ERRORS.cantHashPassword, Messages.cantSaveUser, err));
                    return
                }
                resolve({
                    salt: salt,
                    hash: hash.toString('hex'),
                    iterations: iterations
                });
            });
        }catch (e) {
            reject(error_model(ERRORS.cantHashPassword, Messages.cantSaveUser, e))
        }
    });
}

function isPasswordCorrect(savedHash, savedSalt, savedIterations, passwordAttempt) {
    return new Promise(async (resolve, reject) => {
        try{
            pbkdf2.pbkdf2(passwordAttempt, savedSalt, savedIterations, keyLength, digest, (err, hash) => {
                if (err) {
                    return resolve(false);
                }
                return resolve(savedHash === hash.toString('hex'));
            });
        }catch (e) {
            console.log(e)
            resolve(false);
        }
    });
}

const _hash_password = async (pass) => {
    return await hashPassword(pass);
}

const _save_user = (user) => {
    return new Promise(async (resolve, reject) => {
        try {
           const res= await user.save();
            resolve(res);
        } catch (e) {
            reject(error_model(ERRORS.cantSaveUser, Messages.cantSaveUser, e));
        }
    })
}

const create_if_not_exist_user=(phoneNumber)=>{
    return new Promise(async (resolve, reject) => {
        try {
            const res= await UserModel.findOne({phoneNumber: phoneNumber,});
            if(res)
                resolve(res);
            const new_user = new UserModel({
                phoneNumber:phoneNumber,
            });
            const result =await _save_user(new_user);
            resolve(result);
        } catch (e) {
            reject(error_model(ERRORS.cantGetUser, Messages.cantGetUser, e));
        }
    })
}

const check_user_password = (phoneNumber, password) => {
    return new Promise(async (resolve, reject) => {
        try {
           const res= await UserModel.findOne({phoneNumber: phoneNumber});
           if(!res)
               reject(error_model(ERRORS.noUserFound, Messages.wrongPassword, 'no user found by this phone number and password'));
           //checking password
           const isCorrect=await isPasswordCorrect(res.password.hash,res.password.salt,res.password.iterations,password);
           if(isCorrect)
                resolve(res);
            reject(error_model(ERRORS.wrongPassword, Messages.wrongPassword, 'password incorrect'));
        } catch (e) {
            reject(error_model(ERRORS.cantGetUser, Messages.cantGetUser, e));
        }
    })
}

const get_user_by_phone = (phoneNumber) => {
    return new Promise(async (resolve, reject) => {
        try {
           const res= await UserModel.findOne({phoneNumber: phoneNumber},_userProjection);
           if(!res)
               reject(error_model(ERRORS.noUserFound, Messages.noUserFound, 'no user found by this phone number'));
            resolve(res);
        } catch (e) {
            reject(error_model(ERRORS.cantGetUser, Messages.cantGetUser, e));
        }
    })
}

const get_user_by_id = (id, userProjection) => {
    return new Promise(async (resolve, reject) => {
        try {
           const res= await UserModel.findById(id,userProjection??_userProjection);
           if(!res)
               reject(error_model(ERRORS.noUserFound, Messages.noUserFound, 'no user found by this id'));
            resolve(res);
        } catch (e) {
            reject(error_model(ERRORS.cantGetUser, Messages.cantGetUser, e));
        }
    })
}


const get_user_by_userId = (id, userProjection) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res= await UserModel.findOne({userIntId:id},userProjection??_userProjection);
            if(!res)
                reject(error_model(ERRORS.noUserFound, Messages.noUserFound, 'no user found by this id'));
            resolve(res);
        } catch (e) {
            reject(error_model(ERRORS.cantGetUser, Messages.cantGetUser, e));
        }
    })
}

const register_normal_user=(user)=>{
    return new Promise(async (resolve, reject) => {
        try {
            const previous_user= await _check_previous_user(user);
            const new_user = new UserModel({
                phoneNumber: user.phoneNumber,
                fullName: user.fullName.trim(),
                password: await _hash_password(user.password)
            });

            const res =await _save_user(new_user);
            resolve(res);
        } catch (e) {
            reject(e);
        }
    })
}

const edit_normal_user=(id, user)=>{
    return new Promise(async (resolve, reject) => {
        try {
            const new_user= await get_user_by_id(id,{_id:1, fullName:1, email: 1});
            new_user.fullName= user.fullName.trim();
            if(user.email)
            new_user.email = user.email;
            const res =await _save_user(new_user);
            resolve(res);
        } catch (e) {
            reject(e);
        }
    })
}

const change_password=(id, newPassword)=>{
    return new Promise(async (resolve, reject) => {
        try {
            const user= await UserModel.findById(id);
            if(!user)
                reject(error_model(ERRORS.noUserFound, Messages.noUserFound, 'no user found by this id'));

            user.password= await _hash_password(newPassword);
            const res =await _save_user(user);
            resolve(res);
        } catch (e) {
            reject(error_model(ERRORS.cantGetUser, Messages.cantGetUser, e));
        }
    })
}

const change_profile_picture = (id, imageId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user =await get_user_by_id(id,{_id:1, profileImageId:1,});
            await file_service.set_dDescription_for_image(user._id, imageId, 'profileImage');
            user.profileImageId= imageId;
            const res =await _save_user(user);
            resolve(res);
        } catch (e) {
            reject(e);
        }
    })
}

const search_users = async (query, options) => {
    return new Promise( async(resolve, reject) => {
        try {
            options.select = {..._userProjection,};
            const users = await UserModel.paginate({
                    "$and": [
                        {fullName: {'$regex': query.fullName ?? ''}}, //this makes sure we have fullName so the user has registered
                        query.phoneNumber ? {phoneNumber: query.phoneNumber} : {},
                    ]},
                options);

            resolve(users);
        } catch (e) {
            reject(error_model(ERRORS.getSearchUsersInDatabaseError, Messages.getSearchUsersInDatabaseError, e));
        }
    })
}

const delete_user=(id)=>{
    return new Promise(async (resolve, reject) => {
        try {
            const user= await get_user_by_id(id,{_id:1});
            const res= await UserModel.deleteOne({_id: id},);
            if(!res)
                reject(error_model(ERRORS.userCantBeDeleted,
                    Messages.userCantBeDeleted, 'cant delete user'));
            resolve(res);
        } catch (e) {
            reject(e);
        }
    })
}


module.exports = {
    create_if_not_exist_user,
    register_normal_user,
    check_user_password,
    get_user_by_phone,
    get_user_by_id,
    change_password,
    change_profile_picture,
    edit_normal_user,
    search_users,
    delete_user,
    get_user_by_userId
}