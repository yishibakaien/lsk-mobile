'use strict';

/**
 * 返回图片base64地址
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