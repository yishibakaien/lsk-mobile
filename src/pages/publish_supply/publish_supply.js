require('common/styles/index.styl');
require('./publish_supply.styl');
import wx from 'weixin-js-sdk';
import Toast from 'plugins/toast/Toast';
import {
    c,
    checkAndroid,
    formatUnit,
    formatSupplyType,
    formatSupplyShape,
    // getQueryString
} from 'utils/utils';
import {
    // testPurchaseNum
} from 'utils/reg';

import {aliupload} from 'plugins/ali_oss/aliupload';

import {
    releaseCompanySupply
}  from 'api/user';

(function () {
    // 弹出层通用
    var mask = c('#mask');
    // 表单操作部分
    var popShow = c('.pop-show');
    var popUp = c('.pop-up');
    var popConfirm = c('.pop-confirm');
    var popClose = c('.pop-close');
    var typeItem = c('#typeItem');
    var shapeItem = c('#shapeItem');
    var numItem = c('#numItem');
    var numIpt = c('#numIpt');
    // 非弹出层各项
    var supplyType = c('#supplyType');
    var supplyShape = c('#supplyShape');
    var supplyNum = c('#supplyNum');
    // var isStartUpBtn = c('#select').getElementsByTagName('i');

    var descIpt = c('#descIpt');

    // 上传图片部分
    var imgArr = [];
    var uploadWrapper = c('#uploadWrapper');
    var imgForm = c('#imgForm');
    var inputPic = c('#inputPic');
    var upload = c('#upload');
    var publish = c('#publish');
    // 截图组件
    var cropperWrapper = c('#cropperWrapper');
    var image = c('#cropperImage');
    // 高版本 IOS 点击input[captrue=camera]会直接打开相机，但是这样会导致电脑上选择图片打开缓慢
    if (checkAndroid()) {
        inputPic.setAttribute('captrue', 'camera');
    }
    var data = {
        productPicUrl: '',
        supplyDesc: '',
        supplyNum: 0,
        supplyShapes: '',
        supplyType: '',
        supplyUnit: ''
    };

    upload.onclick = function () {
        // 点击调起相册 或 相机
        inputPic.click();
    };

    inputPic.onchange = function() {
        Toast.loading('正在上传..');
        aliupload.call(this, 4, function(res) {
            console.log('图片上传返回值', res);
            Toast.hide();
            var str = '';
            var div = document.createElement('div');
            div.className = 'item';
            imgArr.push(res[0]);
            // data.productPicUrl = res[0];
            console.log('imgArr值', imgArr);
            str = `<img src="${res[0]}"><span class="icon-close pic-close"></span>`;
            div.innerHTML = str;
            uploadWrapper.insertBefore(div, upload);
            isSingleImg();
            imgView();
            div.getElementsByClassName('pic-close')[0].onclick = function (e) {
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
        if (imgArr.length > 0) {
            // uploadWrapper.style.textAlign = 'left';
            upload.style.display = 'none';
        } else {
            // uploadWrapper.style.textAlign = 'center';
            upload.style.display = 'block';
        }
    }
    // 表单部分
    // 右箭头部分
    for (var i = 0; i < popShow.length; i++) {
        popShow[i].index = i;
        popShow[i].onclick = function () {
            popUp[this.index].style.display = 'block';
            mask.style.display = 'block';
        };
    }
    // 关闭按钮
    for (var n = 0; n < popClose.length; n++) {
        popClose[n].index = n;
        popClose[n].onclick = function () {
            popUp[this.index].style.display = 'none';
            mask.style.display = 'none';
        };
    }
    // 确定按钮
    for (var k = 0; k < popConfirm.length; k++) {
        popConfirm[k].index = k;
        popConfirm[k].onclick = function () {
            popUp[this.index].style.display = 'none';
            mask.style.display = 'none';
            if (this.getAttribute('item-index') === '0') {
                data.supplyType = parseInt(this.getAttribute('item-id'));
                supplyType.innerHTML = formatSupplyType(data.supplyType);
            } else if (this.getAttribute('item-index') === '1') {
                data.supplyShapes = this.getAttribute('item-id');
                supplyShape.innerHTML = formatSupplyShape(data.supplyShapes);
            } else if (this.getAttribute('item-index') === '2') {
                data.supplyNum = (this.getAttribute('item-value') ? parseInt(this.getAttribute('item-value')) : 0);
                data.supplyUnit = parseInt(this.getAttribute('item-id'));
                console.log((data.supplyUnit && data.supplyNum));
                supplyNum.innerHTML = (data.supplyNum && data.supplyUnit) ? data.supplyNum + formatUnit(data.supplyUnit) : '面议';

            }
        };
    }
    // 求购类型
    var typeBtns = typeItem.getElementsByTagName('span');
    for (var j = 0; j < typeBtns.length; j++) {
        typeBtns[j].onclick = function () {
            activeClear(typeBtns);
            this.className = 'active';
            setTagDtToConfBtn(this);
        };
    }
    // 求购形态
    var shapeBtns = shapeItem.getElementsByTagName('span');
    for (var t = 0; t < shapeBtns.length; t++) {
        shapeBtns[t].onclick = function () {
            activeClear(shapeBtns);
            this.className = 'active';
            setTagDtToConfBtn(this);
        };
    }
    // 求购数量
    var numBtns = numItem.getElementsByTagName('span');
    numIpt.oninput = function () {
        var setTagDtToConfBtn = this.parentElement.parentElement.parentElement.getElementsByClassName('pop-confirm')[0];
        setTagDtToConfBtn.setAttribute('item-value', this.value);
    };
    for (var g = 0; g < numBtns.length; g++) {
        numBtns[g].onclick = function () {
            activeClear(numBtns);
            this.className = 'active';
            setTagDtToConfBtn(this);
        };
    }
    // 选择是否接受开机
    // for (var m = 0; m < isStartUpBtn.length; m++) {
    //     isStartUpBtn[m].onclick = function () {
    //         for (var p = 0; p < isStartUpBtn.length; p++) {
    //             isStartUpBtn[p].className = 'icon-gou';
    //         }
    //         this.className = 'icon-gou active';
    //         data.isStartUp = parseInt(this.getAttribute('star-up-st'));
    //     };
    // }
    // 描述详细信息
    descIpt.oninput = function () {
        data.supplyDesc = this.value;
    };
    // 发布按钮
    publish.onclick = function() {
        // for (var k = 0; k < 3; k++) {
        //     data['refPic' + (k + 1)] = '';
        // }
        // for (var i = 0; i < imgArr.length; i++) {
        //     data['refPic' + (i + 1)] = imgArr[i];
        // }
        data.productPicUrl = (imgArr[0] ? imgArr[0] : '');
        console.log('发布求购Data:', data);
        if (check()) {
            releaseCompanySupply(data, function (res) {
                console.log(res);
                if (res.code === 0) {
                    Toast.success({
                        text: res.message,
                        duration: 1000,
                        complete: function() {
                            location.href = './publish_supply_tip.html';
                        }
                    });
                } else {
                    Toast.info(res.message);
                }
            });
        }
    };


    function setTagDtToConfBtn(_this) {
        var setTagDtToConfBtn = _this.parentElement.parentElement.parentElement.parentElement.getElementsByClassName('pop-confirm')[0];
        setTagDtToConfBtn.setAttribute('item-id', _this.getAttribute('item-id'));
    }
    function check() {
        if (data.productPicUrl === '') {
            Toast.info('请上传图片');
        } else if (data.supplyType === '') {
            Toast.info('请填写求购类型');
        } else if (data.supplyShapes === '') {
            Toast.info('请填写求购形态');
        } else if (data.supplyDesc === '') {
            Toast.info('请填写求购描述');
        }
        return ((data.productPicUrl !== '') && (data.supplyType !== '') && (data.supplyShapes !== '') && (data.supplyDesc !== ''));
    }
    function activeClear(eles) {
        for (var p = 0; p < eles.length; p++) {
            eles[p].className = '';
        }
    }
})();