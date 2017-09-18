require('common/styles/index.styl');
require('./publish_supply.styl');

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
// import {aliupload} from 'plugins/ali_oss/aliupload';
//
// import {
//     // testAccount,
//     // testPwd,
//     // testImgCode,
// } from 'utils/reg';
//
// import {
//     releaseCompanySupply
// }  from 'api/user';

// (function () {
//     var inputPic = c('#inputPic');
//     var upload = c('#upload');
//     var publish = c('#publish');
//     // 截图组件
//     var cropperWrapper = c('#cropperWrapper');
//     var image = c('#cropperImage');
//     // 高版本 IOS 点击input[captrue=camera]会直接打开相机，但是这样会导致电脑上选择图片打开缓慢
//     if (checkAndroid()) {
//         inputPic.setAttribute('captrue', 'camera');
//     }
//     var userData = {
//         productPicUrl: '',
//         supplyDesc: '',
//         supplyNum: '',
//         supplyShapes: '',
//         supplyType: '',
//         supplyUnit: ''
//     };
//
//     upload.onclick = function () {
//         // 点击调起相册 或 相机
//         inputPic.click();
//     };
//
//     inputPic.onchange = function() {
//         Toast.loading('正在上传..');
//         aliupload.call(this, 1, function(res) {
//             console.log('图片上传返回值', res);
//             Toast.hide();
//             userData.userHeadIcon = rightSideAvatar.src = avatar.src = res[0];
//         }, function(res) {
//             Toast.error('图片上传失败，请重试');
//         });
//     };
//
//     publish.onclick = function() {
//         userData.userName = userName.value;
//         userData.wechat = wechat.value;
//         userData.qq = qq.value;
//         userData.email = email.value;
//         Toast.loading('正在提交..');
//         console.log('提交的用户数据', userData);
//         if (userData.userName === '') {
//             Toast.hide();
//             alert('姓名不能为空');
//             return;
//         }
//     };
// })();