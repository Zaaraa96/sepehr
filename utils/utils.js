
const xss = require("xss");

function isMobileNumber(text) {
    const patt0 = new RegExp(/^(0)?9\d{9}$/g);
    const result=patt0.test(text);
    return result ;
}

function isEmail(v) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v)
}

function isUsername(v) {
    return /^(?=.{8,30}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/.test(v)
}

function isOnlyNumber(v) {
    return /^[0-9]*$/.test(v);
}

const urlValidation = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/

function checkXss(value) {
    return  xss(value);
}

module.exports={
    isMobileNumber,
    isEmail,
    isOnlyNumber,
    isUsername,
    urlValidation,
}