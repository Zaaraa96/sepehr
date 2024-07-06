
exports.ERRORS ={
    
    OTPValidationError:100, userAlreadyExist: 101,
    cantGetUser: 102,
    cantSaveUser: 103,
    cantHashPassword: 104,
    getSearchUsersInDatabaseError: 105,
    userIsDeactive: 106,
    cantChangeAdmin: 107,
    changeUserFailed: 108,
    roleIsNotNormal: 109,
    roleIsNotAdmin:110,
    userIsNotActive:111,
    userIsTemp: 112,
    wrongPassword: 113,
    getUserInDatabaseError: 114,

    CODEValidationError: 200,
    cantSaveCode: 201,
    noCodeFound: 202,
    cantGetCode: 203,
    cantHashCode: 204,

    cantCreateToken: 300,

    USERValidationError: 400, noUserFound: 401, invalidToken:402,
    userPhoneNumberIsRegistered:403,
    userCantBeDeleted:404,

    fileFormatError: 500,
    fileSavingInDatabaseError: 501,
    noFileFound: 502,
    getFileFromDatabaseFailed: 503,
    fileAlreadyInUse: 504,
    fileNotYoursToUse: 505,
    file_too_large: 506, fileTypeNotImage: 507,

}