'use strict';

/**
 * 图片上传
 * @param  {[type]} file    input[type=file] dom 元素
 * @param  {[type]} resolve 上传完毕后的回调函数
 */
function uploadPictrue(file, resolve) {
    
    if (file.files && file.files[0]) {

        var reader = new FileReader();

        reader.onload = function(evt) {
            // alert('转码完毕图片地址为:', evt.target.result);
            resolve(evt.target.result);
        };
        
        reader.readAsDataURL(file.files[0]);
    }
}
module.exports = uploadPictrue;