require('common/styles/index.styl');
require('./personal_info.styl');
import Toast from 'plugins/toast/Toast';
import {
    c,
    // getQueryString
} from 'utils/utils';

import {
    // testAccount,
    // testPwd,
    // testImgCode,
} from 'utils/reg';

import {
    // checkPhone
}  from 'api/user';


(function () {
    var avatar = c('#avatar');
    var rightSlide = c('#rightSlide');
    var bottomSlide = c('#bottomSlide');
    var arrow = c('#arrow');
    var cancel = c('#cancel');
    avatar.onclick = function () {
        rightSlide.style.right = 0;
    };

    rightSlide.onclick = function () {
        rightSlide.style.right = '-100%';
    };

    arrow.onclick = function () {
        bottomSlide.style.bottom = 0;
    };

    cancel.onclick = function () {
        bottomSlide.style.bottom = '-100%';
    };


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