import Toast from '../../common/plugins/toast/Toast.js';
require('./register.styl');
import baseURL from '../../config/domain.js';

import {
    c,
    testTel,
    testPwd,
    testImgCode,
} from '../../common/scripts/utils/utils';

(function () {
    var telIpt = c('#telIpt'),
        VcodeIpt = c('#VcodeIpt'),
        getVcodeBtn = c('#getVcodeBtn'),
        usernameIpt = c('#usernameIpt'),
        firmnameIpt =
        next = document.getElementById('next'),
        tip = document.getElementsByClassName('tip')[0],
        // userType = getRequest().userType,
        Xtoken,
        tel,
        code,
        telFlag,
        codeFlag,
        timer,
        getVcoding = false, // 正在获取验证码（正在倒计时）状态
        seconds = 60,
        message = {
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


    telIpt.oninput = function () {
        tel = this.value;
        if (testTel(tel) && !getVcoding) {
            tip.style.display = 'inline-block';
            Ajax({
                methods: 'GET',
                url: baseURL + '/front/user/checkPhone',
                data: {
                    mobile: tel
                },
                headers: {
                    'x-version': '1.0',
                    'x-client': '1'
                },
                success: function (res, status, xhr) {
                    //var res = JSON.parse(res);
                    console.log('res', res);
                    console.log('status', status);
                    console.log('xhr', xhr.getResponseHeader('x-token'));
                    Xtoken = xhr.getResponseHeader('x-token');
                    if (res.data === true) {
                        tip.style.color = '#f53535';
                        tip.innerHTML = message.registered;
                    } else {
                        tip.style.color = 'green';
                        tip.innerHTML = message.canRegister;
                        getVcodeBtn.removeAttribute('disabled');
                    }
                },
                error: function (res) {
                    console.error('error', res);
                    blackTip(message.checkError);
                }
            });

        } else {
            getVcodeBtn.setAttribute('disabled', 'disabled');
        }
        checkTelAndCode();
    }
    VcodeIpt.oninput = function () {
        code = this.value;
        checkTelAndCode();
    }

    telIpt.onblur = function () {
        if (!testTel(this.value)) {
            blackTip(message.testTel);
            return;
        }
    }
    getVcodeBtn.onclick = function () {
        var _this = this;
        if (!testTel(tel)) {
            blackTip(message.testTel);
            return;
        }
        this.setAttribute('disabled', 'disabled');
        getVcoding = true;

        var _data = JSON.stringify({mobile: tel.toString()});
        Ajax({
            method: 'POST',
            url: baseURL + '/front/user/getRegSMSCode',
            data: _data,
            headers: {
                'x-version': '1.0',
                'x-client': '1',
                'x-token': Xtoken
            },
            success: function (res) {

                console.log('success', res);
            },
            error: function (res) {

                console.log(res);
            }
        });

        timer = setInterval(function () {
            if (seconds > 1) {
                seconds--;
                _this.innerText = seconds + message.countStr;
            } else {
                clearInterval(timer);
                _this.removeAttribute('disabled');
                _this.innerText = message.getCodeText;
                getVcoding = false;
                seconds = 60;
            }
        }, 1000);
    }

    VcodeIpt.onblur = function () {
        if (!testVcode(this.value)) {
            blackTip(message.testVcode);
        }
    }

    function checkTelAndCode() {
        if (_check()) {
            next.removeAttribute('disabled');
        } else {
            next.setAttribute('disabled', 'disabled');
        }

        function _check() {
            if (testTel(tel) && testVcode(code)) {
                return true;
            } else {
                return false;
            }
        }
    }

    next.onclick = function () {

        // 这里checkCode

        if (true) {
            location.href = '../register/register.html?userMobile=' + tel + '&userType=' + userType + '&smsCode=' + code;
        }
    }

    //  回退，清空表单值

    window.addEventListener('pageshow', function (event) {
            if (event.persisted || window.performance &&
                window.performance.navigation.type == 2) {
                VcodeIpt.value = '';
                telIpt.value = '';
            }
        },
        false);

})();