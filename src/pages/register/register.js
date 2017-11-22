require('common/styles/index.styl');
require('./register.styl');

// var aes = require('plugins/aes/mode-ecb');

import Toast from 'plugins/toast/Toast';

import {
    c,
    getQueryString
} from 'utils/utils';

import {
    testPwd,
    testName,
    testFirmName,
    testFirmBusiness
    // testVcode
    // testTel,
    // testImgCode,
} from 'utils/reg';

import {
    reg
    // getVerifyCode,
    // checkPhone,
    // getRegSMSCode,
}  from 'api/user';


(function() {
    var usernameIpt = c('.username')[0],
        firmnameIpt = c('.firmname')[0],
        firmBusinessIpt = c('.firmbusiness')[0],
        pwdIpt = c('.password')[0],
        next = c('#next'),
        data = {
            userName: '',
            companyName: '',
            companyBusiness:'',
            userMobile: getQueryString('userMobile'),
            smsCode: getQueryString('smsCode'),
            userPWD: '',
            userType: getQueryString('userType')
        },
        message = {
            usernameText: '请输入正确的姓名',
            firmnameText: '企业名称长度需大于等于2位',
            firmBusinessText: '请输入正确的主营业务',
            mobileText: '请输入正确电话号码',
            smsCodeText: '请输入正确验证码',
            passwordText: '密码长度需大于等于6位',
            testTel: '请输入正确的手机号码',
            registered: '&times;号码已被注册',
            canRegister: '号码可用',
            checkError: '验证手机号码失败，请检查您的网络',
            countStr: '重新获取 ',
            getCodeText: '获取验证码'
        };


    usernameIpt.oninput = function() {
        data.userName = this.value;
        checkForm();
    };

    firmnameIpt.oninput = function() {
        data.companyName = this.value;
        checkForm();
    };

    firmBusinessIpt.oninput = function() {
        data.companyBusiness = this.value;
        checkForm();
    };

    pwdIpt.oninput = function() {
        data.userPWD = this.value;
        checkForm();
    };

    usernameIpt.onblur = function() {
        if (!testName(data.userName)) {
            Toast.info(message.usernameText);
        }
    };
    firmnameIpt.onblur = function() {
        if (!testFirmName(data.companyName)) {
            Toast.info(message.firmnameText);
        }
    };
    firmBusinessIpt.onblur = function() {
        if (!testFirmBusiness(data.companyBusiness)) {
            Toast.info(message.firmBusinessText);
        }
    };

    pwdIpt.onblur = function() {
        if (!testPwd(data.userPWD)) {
            Toast.info(message.passwordText);
        }
    };

    next.onclick = function() {
        var _confirm = confirm('您的注册信息为：' + '\n' + '用户类型：' + (data.userType === 1 ? '贸易商' : '厂商')+ '\n' + '主营业务：' + data.companyBusiness + '\n' + '电话号码：' + data.userMobile + '\n' + '用户姓名：' + data.userName + '\n' + '企业名称：' + data.companyName + '\n' + '密码：' + data.userPWD.substr(0, 2) + ('*'._repeat(data.userPWD.length - 4)) + data.userPWD.substr(data.userPWD.length - 2, data.userPWD.length - 1)
        );
        if (_confirm) {
            reg(data, function (res) {
                console.log('注册返回值', res);
                if (res.code === 0) {
                    Toast.success({
                        text: '登录成功',
                        duration: 1000,
                        complete: function() {
                            location.href = '../login/login.html';
                            // location.href = '../login/login.html?registed=1';
                        }
                    });
                } else {
                    Toast.info(res.message);
                }
            });
        }
    };

    String.prototype._repeat = String.prototype._repeat || function(num) {
        var str = '',
            i;
        if (typeof num !== 'number' || isNaN(num)) {
            return;
        }
        for (i = 0; i < num; i++) {
            str += this;
        }
        return str;
    };

    function checkForm() {
        if (_check()) {
            next.removeAttribute('disabled');
        } else {
            next.setAttribute('disabled', 'disabled');
        }
    }
    function _check() {
        if (testName(data.userName) && testFirmName(data.companyName) && testPwd(data.userPWD) && testFirmBusiness(data.companyBusiness)) {
            return true;
        } else {
            return false;
        }
    }
    /*if (document.addEventListener) {
        window.addEventListener('pageshow', function (event) {
                if (event.persisted || window.performance &&
                    window.performance.navigation.type == 2)
                {
                    location.reload();
                }
            },
            false);
    }*/
})();