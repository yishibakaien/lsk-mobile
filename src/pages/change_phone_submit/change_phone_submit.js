require('common/styles/index.styl');
require('./change_phone_submit.styl');
import Toast from 'plugins/toast/Toast';
import {
    c,
    getQueryString
} from 'utils/utils';
import {
    testTel,
    testVcode
} from 'utils/reg';

import {
    checkPhone,
    changeSMSCode,
    changeMobile
}  from 'api/user';
// var aes = require('plugins/aes/mode-ecb');


(function(){
    var telIpt = c('#telIpt');
    var codeIpt = c('#codeIpt');
    var getVcodeBtn = c('#getVcodeBtn');
    var confirm = c('#confirm');
    var tip = c('.tip')[0];
    var tel;
    var code;
    var timer;
    var isgetVcoding = false;
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
    };
    var data = {
        mobile: '',
        smsCode: ''
    };

    c('#phoneNum').innerHTML = getQueryString('tel');

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
            tip.style.display = 'none';
            tip.innerHTML = `<i class="loading"></i>
                <span class="text">检验手机号码</span>`;
        }
    };

    telIpt.onblur = function() {
        if (!testTel(this.value)) {
            Toast.info(message.testTel);
        }
    };

    codeIpt.oninput = function() {
        code = this.value;

    };

    codeIpt.onblur = function() {
        if (!testVcode(this.value)) {
            Toast.info(message.testVcode);
        }
    };

    getVcodeBtn.onclick = function() {
        var that = this;
        if (testTel(tel)) {
            Toast.loading();
            this.setAttribute('disabled', 'disabled');
            isgetVcoding = true;
            changeSMSCode({mobile: tel}, function (res) {
                console.log('获取短信返回值', res);
                if (res.code === 0) {
                    Toast.success(res.message);
                } else {
                    Toast.info(res.message);
                }
            });
        } else {
            Toast.info(message.testTel);
            return;
        }
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

    function _check() {
        if (!testTel(tel)) {
            Toast.info(message.testTel);
            return false;
        }
        if (!testVcode(code)) {
            Toast.info(message.testVcode);
            return false;
        }
        if (testTel(tel) && testVcode(code)) {
            return true;
        } else {
            return false;
        }
    }
    confirm.onclick = function() {
        console.log('check', _check());
        console.log('code', code);
        if (_check()) {
            data.smsCode = code;
            data.mobile = tel;
            console.log(data);
            Toast.loading();
            changeMobile(data, function (res) {
                console.log('修改手机号返回值', res);
                if (res.code === 0) {
                    Toast.success(res.message);
                    location.href = './personal_center.html';
                } else {
                    Toast.info(res.message);
                }
            });
        }
    };
})();
