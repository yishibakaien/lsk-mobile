require('common/styles/index.styl');
require('./pattern_made.styl');

import Toast from 'plugins/toast/Toast';
import {
    c,
    checkAndroid
    // getQueryString
} from 'utils/utils';

import {
    testFirmName,
    testName,
    testTel,
    testAddress
} from 'utils/reg';

import {aliupload} from 'plugins/ali_oss/aliupload';

import {
    customProduct
}  from 'api/user';

(function () {
    // 表单部分
    var firmNameIpt = c('#firmNameIpt');
    var userNameIpt = c('#userNameIpt');
    var telIpt = c('#telIpt');
    var addressIpt = c('#addressIpt');
    var descIpt = c('#descIpt');
    // 上传图片部分
    var imgArr = [];
    var itemWrapper = c('#itemWrapper');
    var inputPic = c('#inputPic');
    var upload = c('#upload');
    var submit = c('#submit');
    // 截图组件
    var cropperWrapper = c('#cropperWrapper');
    var image = c('#cropperImage');
    // 高版本 IOS 点击input[captrue=camera]会直接打开相机，但是这样会导致电脑上选择图片打开缓慢
    if (checkAndroid()) {
        inputPic.setAttribute('captrue', 'camera');
    }
    var data = {
        companyAddress: '',
        companyId: '',
        companyName: '',
        contactNumber: '',
        contactPerson: '',
        customMemo: '',
        refPic1: '',
        refPic2: '',
        refPic3: ''
    };

    upload.onclick = function () {
        // 点击调起相册 或 相机
        inputPic.click();
    };

    inputPic.onchange = function() {
        var _this = this;
        console.log(this, this.files);
        Toast.loading('正在上传..');
        aliupload.call(this, 3, function(res) {
            console.log('图片上传返回值', res);
            Toast.hide();
            var str = '';
            var div = document.createElement('div');
            div.className = 'item';
            imgArr.push(res[0]);
            // data.buyPicUrl = res[0];
            // console.log('imgArr值', imgArr);
            str = `<img src="${res[0]}"><span class="icon-close"></span>`;
            div.innerHTML = str;
            itemWrapper.insertBefore(div, upload);
            isSingleImg();
            div.getElementsByClassName('icon-close')[0].onclick = function () {
                this.parentElement.parentElement.removeChild(this.parentElement);
                for(var i = 0; i < imgArr.length; i++) {
                    if(imgArr[i] === this.previousElementSibling.getAttribute('src')) {
                        imgArr.splice(i, 1);
                        break;
                    }
                }
                console.log('imgArr删除后剩余值', imgArr);
                console.log(_this, _this.files);
                _this.outerHTML = _this.outerHTML;
                _this.value = '';
                console.log(_this, _this.files);
                isSingleImg();
            };

        }, function(res) {
            Toast.error('图片上传失败，请重试');
        });
    };

    function isSingleImg() {
        if (imgArr.length > 0) {
            // itemWrapper.style.textAlign = 'left';
            upload.style.display = 'none';
        } else {
            // itemWrapper.style.textAlign = 'center';
            upload.style.display = 'block';
        }
    }
    // 发布按钮
    submit.onclick = function() {
        data.companyId = parseInt(localStorage.companyId);
        data.companyName = firmNameIpt.value;
        data.contactPerson = userNameIpt.value;
        data.contactNumber = telIpt.value;
        data.companyAddress = addressIpt.value;
        data.customMemo = descIpt.value;
        for (var k = 0; k < 3; k++) {
            data['refPic' + (k + 1)] = '';
        }
        for (var i = 0; i < imgArr.length; i++) {
            data['refPic' + (i + 1)] = imgArr[i];
        }

        console.log('申请花型定制：', data);
        if (!testFirmName(data.companyName)) {
            Toast.info('公司名称至少三位');
        } else if (!testName(data.contactPerson)) {
            Toast.info('请输入正确的姓名');
        } else if (!testTel(data.contactNumber)) {
            Toast.info('请输入正确的电话号码');
        } else if (!testAddress(data.companyAddress)) {
            Toast.info('请输入地址');
        } else if (data.customMemo === '') {
            Toast.info('请填写描述信息');
        }
        else if (imgArr.length < 1) {
            Toast.info('请上传图片');
        }

        if (testFirmName(data.companyName) && testName(data.contactPerson) && testTel(data.contactNumber) && testAddress(data.companyAddress) && (imgArr.length > 0) && (data.customMemo !== '')) {
            customProduct(data, function (res) {
                console.log(res);
                if (res.code === 0) {
                    Toast.success({
                        text: res.message,
                        duration: 2100,
                        complete: function() {
                            location.href = './pattern_made.html?time=' + ((new Date()).getTime());
                        }
                    });
                } else {
                    Toast.info(res.message);
                }
            });
        }
    };
})();