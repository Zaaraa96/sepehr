
const CLIENT_UI_VERSION = '/api/v1';

const filePath ='/file';
const urlValidation = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/

module.exports ={
    CLIENT_UI_VERSION,
    filePath,
    urlValidation
}