require('common/styles/index.styl');
require('./safety_check.styl');

// var aes = require('plugins/aes/mode-ecb');

import Toast from 'plugins/toast/Toast';

import {
    c,
    getQueryString
} from 'utils/utils';

import {
    testTel,
    testVcode
    // testImgCode,
    // testPwd,
    // testName,
    // testFirmName,

} from 'utils/reg';

import {
    checkPhone,
    getVerifyCode,
    getRegSMSCode,
    // reg
}  from 'api/user';


(function(){
    var telIpt = c('#telIpt');
    var codeIpt = c('#codeIpt');
    var getVcodeBtn = c('#getVcodeBtn');
    var next = c('#next');
    var tip = c('.tip')[0];
    var userType = getQueryString('userType');
    // var Xtoken;
    var tel;
    var code;
    // var telFlag;
    // var codeFlag;
    var timer;
    var isgetVcoding = false; // 正在获取验证码（正在倒计时）状态
    var seconds = 60;
    var message = {
        testTel: '请输入正确的手机号码',
        telRegistered: '手机号码已被注册',
        getCodeText: '获取验证码',
        countStr: ' 秒后可重新获取',
        testVcode: '验证码格式不正确',
        checkVcode: '验证码不正确，请重新输入',
        registered: '&times;号码已被注册',
        canRegister: '号码可用',
        checkError: '验证手机号码失败，请检查您的网络'
    };


    telIpt.oninput = function() {
        tel = this.value;
        if (testTel(tel) && !isgetVcoding) {
            tip.style.display = 'inline-block';
            checkPhone({mobile: tel}, function (res) {
                console.log('检查手机号返回值', res);
                if (res.data === true) {
                    tip.style.color = '#f53535';
                    tip.innerHTML = message.registered;
                    getVcodeBtn.setAttribute('disabled', 'disabled');
                } else {
                    tip.style.color = 'green';
                    tip.innerHTML = message.canRegister;
                    getVcodeBtn.removeAttribute('disabled');
                }
            });
        } else {
            getVcodeBtn.setAttribute('disabled', 'disabled');
        }
        checkTelAndCode();
    };
    codeIpt.oninput = function() {
        code = this.value;
        checkTelAndCode();
    };

    telIpt.onblur = function() {
        if (!testTel(this.value)) {
            Toast.info(message.testTel);
            return;
        }
    };
    getVcodeBtn.onclick = function() {
        var that = this;
        if (!testTel(tel)) {
            Toast.info(message.testTel);
            return;
        }
        this.setAttribute('disabled', 'disabled');
        isgetVcoding = true;
        getRegSMSCode({mobile: tel}, function (res) {
            console.log('获取注册短信返回值', res);
        });

        timer = setInterval(function() {
            if (seconds > 1) {
                seconds--;
                that.innerText = seconds + message.countStr;
            } else {
                clearInterval(timer);
                that.removeAttribute('disabled');
                that.innerText = message.getCodeText;
                isgetVcoding = false;
                seconds = 60;
            }
        }, 1000);
    };

    codeIpt.onblur = function() {
        if (!testVcode(this.value)) {
            Toast.info(message.testVcode);
        }
    };
    function checkTelAndCode() {
        if (_check()) {
            next.removeAttribute('disabled');
        } else {
            next.setAttribute('disabled', 'disabled');
        }
    }
    function _check() {
        if (testTel(tel) && testVcode(code)) {
            return true;
        } else {
            return false;
        }
    }
    next.onclick = function() {

        location.href = 'register.html?userMobile=' + tel + '&userType=' + userType + '&smsCode=' + code;

    };

    //  回退，清空表单值

    // window.addEventListener('pageshow', function (event) {
    //         if (event.persisted || window.performance &&
    //             window.performance.navigation.type == 2)
    //         {
    //             codeIpt.value = '';
    //             telIpt.value = '';
    //         }
    //     },
    //     false);
})();