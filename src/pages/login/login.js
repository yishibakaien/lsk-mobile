require('common/styles/index.styl');
require('./login.styl');

var aes = require('plugins/aes/mode-ecb');

import Toast from 'plugins/toast/Toast';

import {
    c,
    getQueryString
} from 'utils/utils';

import {
    testAccount,
    testPwd,
    testImgCode,
} from 'utils/reg';

import {
    login,
    getVerifyCode
}  from 'api/user';



(function() {

    var intoView = c('.into-view-wrapper')[0];
    var telIpt = c('#telIpt');
    var pwdIpt = c('#pwdIpt');
    var next = c('#next'),
        imgCodeBox = c('#imgCodeBox'),
        verifyImgIpt = c('#verifyImgIpt'),
        verifyImg = c('#verifyImg'),
        imgIsHide = true,
        // Xtoken,
        userData = {
            userMobile: '',
            userPWD: '',
            picCode: ''
        },
        message = {
            testAccount: '账号/手机号码不能为空',
            testImgCode: '图形验证码格式不正确',
            imgCodeIptTip: '请输入验证码',
            passwordText: '密码长度需大于等于6位',
        };

    window.onresize = function () {
        if (intoView.style.bottom === '15px') {
            intoView.style.bottom = 'initial';
        } else {
            intoView.style.bottom = '15px';
        }
    };
    telIpt.oninput = function() {
        userData.userMobile = this.value;
        checkAccountAndPwd();
    };

    telIpt.onblur = function() {
        if (!testAccount(this.value)) {
            Toast.error(message.testAccount, 1000);
        }
    };
    pwdIpt.oninput = function() {
        userData.userPWD = this.value;
        checkAccountAndPwd();
    };
    pwdIpt.onblur = function() {
        if (!testPwd(userData.userPWD)) {
            Toast.error(message.passwordText, 1000);
        }
    };

    verifyImgIpt.oninput = function() {
        console.log(userData);
        userData.picCode = this.value;
        checkAccountAndPwd();
    };
    verifyImgIpt.onblur = function() {
        if (!testImgCode(this.value)) {
            Toast.error(message.testImgCode, 1000);
        }
    };
    next.onclick = function() {
        Toast.loading('请稍后...');
        userData.userPWD = aes(userData.userPWD);
        login(userData, function(res, status, xhr) {
            console.log('登录', res);
            console.log(status, xhr);
            if (res.code === 0) {
                var Xtoken = xhr.getResponseHeader('x-token');
                localStorage['x-token'] = Xtoken;
                localStorage['userType'] = res.data.userType;
                localStorage['isSettled'] = res.data.isSettled || 0;
                localStorage['companyId'] = res.data.companyId;
                localStorage['userId'] = res.data.id;
                console.log(res.data.id);
                console.log(localStorage['x-token']);
                console.log('companyId', localStorage['companyId']);
                console.log('userId', localStorage['userId']);
                console.log('isSettled', localStorage['isSettled']);
                Toast.success({
                    text: '登录成功',
                    duration: 1000,
                    complete: function() {
                        if (getQueryString('from')) {
                            var url = getQueryString('from');

                            location.replace(url);
                        } else {
                            location.replace('./shouye.html');
                        }
                    }
                });
            } else if (res.code === 2000004) {
                if (imgIsHide) {
                    imgIsHide = false;
                    Toast.error(message.imgCodeIptTip, 1000);
                } else {
                    Toast.error(res.message, 1000);
                }
                imgCodeBox.className = imgCodeBox.className.replace('hide', 'show');
                verifyImg.onclick = getImgCode;
                console.log(imgIsHide);
                getImgCode();
            } else {
                telIpt.value = '';
                pwdIpt.value = '';
                verifyImgIpt.value = '';
                userData = {
                    userMobile: '',
                    userPWD: '',
                    picCode: ''
                };
                Toast.error(res.message, 1000);
            }
        });
    };

    function checkAccountAndPwd() {
        if (_check()) {
            next.removeAttribute('disabled');
            next.className = 'button button-pink';
        } else {
            next.setAttribute('disabled', 'disabled');
            next.className = 'button button-pink';
        }
        function _check() {
            if (testAccount(userData.userMobile) && testPwd(userData.userPWD) && (imgIsHide || testImgCode(userData.picCode))) {
                return true;
            } else {
                return false;
            }
        }
    }

    function getImgCode() {
        getVerifyCode({}, function (res) {
            console.log('图形验证码', res);
            var data = res.data;
            verifyImg.innerHTML = '<img width="72px" src="data:image/gif;base64,' + data + '">';
        });
    }
})();