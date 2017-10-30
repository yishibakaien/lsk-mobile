require('common/styles/index.styl');
require('./version_cloth_made.styl');
import wx from 'weixin-js-sdk';
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
    if (!localStorage['x-token']) {
        Toast.info({
            text: '用户未登录',
            duration: 2100,
            complete: function() {
                location.replace('./login.html?from=' + location.href);
            }
        });
    }
    // 表单部分
    var firmNameIpt = c('#firmNameIpt');
    var userNameIpt = c('#userNameIpt');
    var telIpt = c('#telIpt');
    var addressIpt = c('#addressIpt');
    var descIpt = c('#descIpt');
    // 上传图片部分
    var imgArr = [];
    var itemWrapper = c('#itemWrapper');
    var imgForm = c('#imgForm');
    var inputPic = c('#inputPic');
    var upload = c('#upload');
    var submit = c('#submit');
    // 拨打电话
    var tel = c('#tel');
    var cancelDial = c('#cancelDial');
    var confirmDial = c('#confirmDial');
    var dialLayout = c('#dialLayout');
    var mask = c('#mask');
    tel.onclick = function () {
        mask.style.display = 'block';
        dialLayout.style.display = 'block';
        document.body.className = 'modal-open';
    };
    cancelDial.onclick = closeMask;
    mask.onclick = closeMask;

    function closeMask() {
        mask.style.display = 'none';
        dialLayout.style.display = 'none';
        document.body.className = '';
    }
    confirmDial.addEventListener('click', function() {
        location.href = 'tel:' + '4008013357';
    }, false);
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
        Toast.loading('正在上传..');
        aliupload.call(this, 3, function(res) {
            console.log('图片上传返回值', res);
            Toast.hide();
            var str = '';
            var div = document.createElement('div');
            div.className = 'item';
            imgArr.push(res[0]);
            // data.buyPicUrl = res[0];
            console.log('imgArr值', imgArr);
            str = `<img src="${res[0]}">
        <span class="icon-close"></span>`;
            div.innerHTML = str;
            itemWrapper.insertBefore(div, upload);
            isSingleImg();
            imgView();
            div.getElementsByClassName('icon-close')[0].onclick = function (e) {
                e.cancelBubble = true;
                e.stopPropagation();
                this.parentElement.parentElement.removeChild(this.parentElement);
                for(var i = 0; i < imgArr.length; i++) {
                    if(imgArr[i] === this.previousElementSibling.getAttribute('src')) {
                        imgArr.splice(i, 1);
                        break;
                    }
                }
                console.log('imgArr删除后剩余值', imgArr);
                imgForm.reset();
                isSingleImg();
                imgView();
            };
        }, function(res) {
            Toast.error('图片上传失败，请重试');
        });
    };
    function imgView() {
        var imgItem = document.querySelectorAll('.item');
        Array.prototype.forEach.call(imgItem, function (item) {
            item.onclick = function () {
                wx.previewImage({
                    current: this.getElementsByTagName('img')[0].getAttribute('src'),
                    urls: imgArr
                });
            };
        });
    }
    function isSingleImg() {
        if (imgArr.length > 2) {
            // itemWrapper.style.textAlign = 'left';
            upload.style.display = 'none';
        } else {
            // itemWrapper.style.textAlign = 'center';
            upload.style.display = 'block';
        }
    }

    // var swiperItem = document.querySelectorAll('.swiper-slide');
    // Array.prototype.forEach.call(swiperItem, function (item) {
    //     item.onclick = function () {
    //         console.log(this.getAttribute('url'), imgArr);
    //         wx.previewImage({
    //             current: this.getAttribute('url'),
    //             urls: imgArr
    //         });
    //     };
    // });
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
                            location.href = './shouye.html?time=' + ((new Date()).getTime());
                        }
                    });
                } else {
                    Toast.info(res.message);
                }
            });
        }
    };
})();