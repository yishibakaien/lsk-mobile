require('common/styles/index.styl');
require('./personal_info.styl');
import Toast from 'plugins/toast/Toast';
import {
    c,
    checkAndroid
    // getQueryString
} from 'utils/utils';
// import uploadPictrue from 'utils/uploadPictrue';
// import Cropper from 'plugins/cropper/ts57_cropper.js';
// import OSS from 'plugins/ali_oss/ali_oss';
// console.log(OSS);
import {aliupload} from 'plugins/ali_oss/aliupload';

import {
    // testAccount,
    // testPwd,
    // testImgCode,
} from 'utils/reg';

import {
    getUserInfo,
    updateUser
}  from 'api/user';

(function () {
    var avatar = c('#avatar');
    var rightSlide = c('#rightSlide');
    // var bottomSlide = c('#bottomSlide');
    var arrow = c('#arrow');
    // var cancel = c('#cancel');
    var inputPic = c('#inputPic');
    var rightSideAvatar = c('#rightSideAvatar');
    var userName = c('#userName');
    var confirm = c('#confirm');
    
    // var companyName = c('#companyName');
    // 截图组件
    var cropperWrapper = c('#cropperWrapper');
    var image = c('#cropperImage');


    var wechat = c('#wechat');
    var qq = c('#qq');
    var email = c('#email');

    // 高版本 IOS 点击input[captrue=camera]会直接打开相机，但是这样会导致电脑上选择图片打开缓慢
    if (checkAndroid()) {
        inputPic.setAttribute('captrue', 'camera');
    }
    var userData = {
        email: '',
        qq: '',
        userHeadIcon: '',
        userName: '',
        wechat: ''
    };
    avatar.onclick = function (e) {
        e.cancelBubble = true;
        e.stopPropagation();
        rightSlide.style.right = 0;
    };

    rightSlide.onclick = function (e) {
        e.cancelBubble = true;
        e.stopPropagation();
        rightSlide.style.right = '-100%';
    };

    arrow.onclick = function () {
        // 点击调起相册 或 相机
        inputPic.click();
    };

    inputPic.onchange = function() {
        Toast.loading('正在上传..');
        aliupload.call(this, 1, function(res) {
            console.log('图片上传返回值', res);
            Toast.hide();
            userData.userHeadIcon = rightSideAvatar.src = avatar.src = res[0];
        }, function(res) {
            Toast.error('图片上传失败，请重试');
        });
    };

    getUserInfo({}, function(res) {
        var data = res.data;
        console.log(res);
        if (res.data && data.userHeadIcon) {
            avatar.src = data.userHeadIcon;
            rightSideAvatar.src = data.userHeadIcon;
        }
        userData.userHeadIcon = data.userHeadIcon;
        userData.userName = userName.value = data.userName;
        userData.wechat = wechat.value = data.wechat;
        userData.qq = qq.value = data.qq;
        userData.email = email.value = data.email;

    });

    confirm.onclick = function() {
        userData.userName = userName.value;
        userData.wechat = wechat.value;
        userData.qq = qq.value;
        userData.email = email.value;
        Toast.loading('正在提交..');
        console.log('提交的用户数据', userData);
        if (userData.userName === '') {
            Toast.hide();
            alert('姓名不能为空');
            return;
        }
        updateUser(userData, function(res) {
            console.log('修改用户数据res', res);
            if (res.code === 0) {
                Toast.success('修改信息成功');
                location.href = './personal_center.html';
            } else {
                Toast.hide();
                alert(res.message);
            }
        });
    };

    // cancel.onclick = function () {
    //     bottomSlide.style.bottom = '-100%';
    // };


    // var takePicture = c('#takePicture');
    // var fromAlbum = c('#fromAlbum');
    //     takePicture.onchange = function(event) {
    //         var files = event.target.files,
    //             file;
    //         if (files && files.length > 0) {
    //             file = files[0];
    //             try {
    //                 var URL = window.URL || window.webkitURL;
    //                 var blob = URL.createObjectURL(file);  // 获取照片的文件流
    //                 compressPicture(blob);  // 压缩照片
    //         } catch (e) {
    //                 try {
    //                     var fileReader = new FileReader();
    //                     fileReader.onload = function(event) {
    //                     // 获取照片的base64编码
    //                         compressPicture(event.target.result); // 压缩照片
    //                     };
    //                     fileReader.readAsDataURL(file);
    //                 } catch (e) {
    //                     alert('请重试！');
    //                 }
    //             }
    //         }
    //     };
    // var compressPicture = function(blob) {
    //     var quality = 0.5,
    //         image = new Image();
    //     image.src = blob;
    //     image.onload = function() {
    //         var that = this;
    //         // 生成比例
    //         var width = that.width,
    //             height = that.height;
    //         width = width / 4;
    //         height = height / 4;
    //         // 生成canvas画板
    //         var canvas = document.createElement('canvas');
    //         var ctx = canvas.getContext('2d');
    //         canvas.width = width;
    //         canvas.height = height;
    //         ctx.drawImage(that, 0, 0, width, height);
    //         // 生成base64,兼容修复移动设备需要引入mobileBUGFix.js
    //         var imgurl = canvas.toDataURL('image/jpeg', quality);
    //         // 修复IOS兼容问题
    //         if (navigator.userAgent.match(/iphone/i)) {
    //             var mpImg = new MegaPixImage(image);
    //             mpImg.render(canvas, {
    //                 maxWidth: width,
    //                 maxHeight: height,
    //                 quality: quality
    //             });
    //             imgurl = canvas.toDataURL('image/jpeg', quality);
    //         }
    //         // 上传照片
    //         console.log(imgurl);
    //         // uploadPicture(imgurl);
    //     };
    // };
})();