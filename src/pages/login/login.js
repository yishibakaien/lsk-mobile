require('common/styles/index.styl');
require('./login.styl');

import Toast from 'plugins/toast/Toast';

var aes = require('plugins/aes/mode-ecb');

import {
    c,
    testTel,
    testPwd,
    testImgCode,
} from 'utils/utils';

import {
    login,
    getVerifyCode,
    checkPhone
}  from 'api/user';



(function () {
    var telIpt = c('#telIpt'),
        pwdIpt = c('#pwdIpt'),
        next = c('#next'),
        imgCodeBox = c('#imgCodeBox'),
        verifyImgIpt = c('#verifyImgIpt')[0],
        verifyImg = c('#verifyImg'),
        imgIsHide = true,
        imgFirstTipRemain = true,
        loginCode,
        Xtoken,
        userData = {
            userMobile: '',
            userPWD: '',
            picCode: ''
        },
        message = {
            testTel: '请输入正确的手机号码',
            telRegistered: '手机号码已被注册',
            getCodeText: '获取验证码',
            countStr: ' 秒后可重新获取',
            testVcode: '验证码格式不正确',
            testImgCode: '图形验证码格式不正确',
            checkVcode: '验证码不正确，请重新输入',
            checkImgCode: '图形验证码不正确，请重新输入',
            registered: '&times;号码已被注册',
            canRegister: '号码可用',
            passwordText: '密码长度需大于等于6位',
            checkError: '验证手机号码失败，请检查您的网络'
        };

    telIpt.oninput = function () {
        userData.userMobile = this.value;
        checkTelAndPwd();
    };

    telIpt.onblur = function () {
        if (!testTel(this.value)) {
            Toast.error(message.testTel, 3000);
        }
    };
    pwdIpt.oninput = function () {
        userData.userPWD = this.value;
        checkTelAndPwd();
    };
    pwdIpt.onblur = function () {
        if (!testPwd(userData.userPWD)) {
            Toast.error(message.passwordText, 3000);
        }
    };
    //图形验证码增加
    testLoginCode();

    function testLoginCode() {
        if (loginCode === 2000004) {
            imgCodeBox.className = imgCodeBox.className.replace('hide', 'show');
            imgIsHide = false;
            getImgCode();
            // checkTelAndPwd();
            verifyImg.onclick = getImgCode;
            verifyImgIpt.oninput = function() {
                userData.picCode = this.value;
                checkTelAndPwd();
            };
            verifyImgIpt.onblur = function() {
                if (!testImgCode(this.value)) {
                    Toast.error(message.testImgCode, 3000);
                }
            };
            function getImgCode() {
                getVerifyCode({}, function (res) {
                    console.log('图形验证码', res);
                    var data = res.data;
                    verifyImg.innerHTML = '<img width="72px" src="data:image/gif;base64,' + data + '">';
                });
            }
        }
    }
    function checkTelAndPwd() {
        if (_check()) {
            next.removeAttribute('disabled');
            next.className = 'button active';
        } else {
            next.setAttribute('disabled', 'disabled');
            next.className = 'button';
        }
        function _check() {
            if (testTel(userData.userMobile) && testPwd(userData.userPWD) && (imgIsHide || testImgCode(userData.picCode))) {
                return true;
            } else {
                return false;
            }
        }
    }

    next.onclick = function() {
        Toast.loading('请稍后..');
        userData.userPWD = aes(userData.userPWD);
        login(userData, function(res) {
            console.log('登录', res);
            loginCode = res.code;
            testLoginCode();
            // 取消第一次出现图片验证码的错误提示
            if (imgFirstTipRemain && (res.message === '图片验证错误')) {
                imgFirstTipRemain = false;
            } else {
                Toast.success('登录成功', 1000, function() {
                    if (res.code === 0) {
                        location.href = 'http://www.baidu.com/';
                    }
                });
            }
        }, function(res) {
            Toast.info('登录失败', 2100);
            console.log(res.message);
        });
    };
})();