// 正则
/** 电话*/
function testTel(tel) {
    return /^1(3|4|5|7|8)[0-9]\d{8}$/.test(tel || "");
}
/**密码 */
function testPwd(pwd) {
    return /.{6,}/.test(pwd || "");
}
/**用户名 */
function testName(name) {
    return /^[\u4E00-\u9FA5]{2,20}$/.test(name);
}

/**企业名字 */
function testFirmName(str) {
    return /.{3,}/.test(str || "");
}
/**主营业务**/
function testFirmBusiness(str) {
    return /.{2,}/.test(str || "");
}
/**短信验证码 */
function testVcode(str) {
    return /\d{4}/.test(str || "");
}
/**图形验证码 */
function testImgCode(str) {
    return /[A-Za-z0-9]{4}/.test(str || "");
}
/**登录账号/手机号**/
function testAccount(str) {
    return /.{1,}/.test(str || "");
}
/** 检测是否为安卓手机 */
function checkAndroid() {
    return navigator.userAgent.indexOf('Android') > -1;
}
/**采购数量 */
function testPurchaseNum(str) {
    return /\d{1,}/.test(str || '');
}
/**收货地址 */
function testAddress(str) {
    return /.{4,}/.test(str || "");
}
export {
    testTel,
    testPwd,
    testName,
    testFirmName,
    testFirmBusiness,
    testVcode,
    testImgCode,
    testAccount,
    checkAndroid,
    testPurchaseNum,
    testAddress
};

