
exports.error_model =( (exceptionCode,exceptionMessage,stackTrace) => {
    return {
        "exceptionCode": exceptionCode,
        "exceptionMessage" : exceptionMessage,
        "stackTrace": stackTrace??''
    }
})