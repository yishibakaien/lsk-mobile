require('common/styles/index.styl');
require('./publish_buying.styl');

import Toast from 'plugins/toast/Toast';
import {
    c,
    checkAndroid,
    formatUnit
    // getQueryString
} from 'utils/utils';
import {
    // testPurchaseNum
} from 'utils/reg';

import {aliupload} from 'plugins/ali_oss/aliupload';

import {
    releaseProductBuy
}  from 'api/user';

(function () {
    // 弹出层通用
    var mask = c('#mask');
    // 表单操作部分
    var popShow = c('.pop-show');
    var popUp = c('.pop-up');
    var popConfirm = c('.pop-confirm');
    var popClose = c('.icon-close');
    var typeItem = c('#typeItem');
    var shapeItem = c('#shapeItem');
    var numItem = c('#numItem');
    var numIpt = c('#numIpt');
    // 非弹出层各项
    var buyType = c('#buyType');
    var buyShape = c('#buyShape');
    var buyNum = c('#buyNum');
    var isStartUpBtn = c('#select').getElementsByTagName('i');

    var descIpt = c('#descIpt');

    // 上传图片部分
    var imgArr = [];
    var uploadWrapper = c('#uploadWrapper');
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
        buyPicUrl: '',
        buyDesc: '',
        buyNum: 0,
        buyShapes: '',
        buyType: '',
        buyUnit: '',
        isStartUp: 1
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
            data.buyPicUrl = res[0];
            console.log('imgArr值', imgArr);
            str = `<img src="${res[0]}">
        <span class="icon-close"></span>`;
            div.innerHTML = str;
            uploadWrapper.insertBefore(div, upload);
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
                isSingleImg();
            };
        }, function(res) {
            Toast.error('图片上传失败，请重试');
        });
    };

    function isSingleImg() {
        if (imgArr.length > 0) {
            uploadWrapper.style.textAlign = 'left';
            // upload.style.display = 'none';
        } else {
            uploadWrapper.style.textAlign = 'center';
            // upload.style.display = 'block';
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
    // 弹出层确定按钮
    for (var k = 0; k < popConfirm.length; k++) {
        popConfirm[k].index = k;
        popConfirm[k].onclick = function () {
            popUp[this.index].style.display = 'none';
            mask.style.display = 'none';
            if (this.getAttribute('item-index') === '0') {
                data.buyType = parseInt(this.getAttribute('item-id'));
                buyType.innerHTML = this.getAttribute('item-inner');
            } else if (this.getAttribute('item-index') === '1') {
                data.buyShapes = this.getAttribute('item-id');
                buyShape.innerHTML = this.getAttribute('item-inner');
            } else if (this.getAttribute('item-index') === '2'){
                data.buyNum = parseInt(this.getAttribute('item-value'));
                data.buyUnit = parseInt(this.getAttribute('item-id'));
                buyNum.innerHTML = data.buyNum ? data.buyNum + this.getAttribute('item-inner') : '面议';
            }
        };
    }
    // 求购类型
    var typeBtns = typeItem.getElementsByTagName('span');
    for (var j = 0; j < typeBtns.length; j++) {
        typeBtns[j].onclick = function () {
            activeClear(typeBtns);
            this.className = 'active';
            setTagDtToConfBtn(this, 0);
        };
    }
    // 求购形态
    var shapeBtns = shapeItem.getElementsByTagName('span');
    for (var t = 0; t < shapeBtns.length; t++) {
        shapeBtns[t].onclick = function () {
            activeClear(shapeBtns);
            this.className = 'active';
            setTagDtToConfBtn(this, 1);
        };
    }
    // 求购数量
    var numBtns = numItem.getElementsByTagName('span');
    numIpt.oninput = function () {
        var setTagDtToConfBtn = this.parentElement.parentElement.parentElement.getElementsByClassName('pop-confirm')[0];
        setTagDtToConfBtn.setAttribute('item-value', this.value);
        setTagDtToConfBtn.setAttribute('item-index', 2);
    };
    for (var g = 0; g < numBtns.length; g++) {
        numBtns[g].onclick = function () {
            activeClear(numBtns);
            this.className = 'active';
            setTagDtToConfBtn(this, 2);
            data.buyUnit = parseInt(this.getAttribute('item-id'));
        };
    }
    // 选择是否接受开机
    for (var m = 0; m < isStartUpBtn.length; m++) {
        isStartUpBtn[m].onclick = function () {
            for (var p = 0; p < isStartUpBtn.length; p++) {
                isStartUpBtn[p].className = 'icon-gou';
            }
            this.className = 'icon-gou active';
            data.isStartUp = parseInt(this.getAttribute('star-up-st'));
        };
    }
    // 描述详细信息
    descIpt.oninput = function () {
        data.buyDesc = this.value;
    };
    // 发布按钮
    publish.onclick = function() {
        // console.log(check());
        console.log('发布求购Data:', data);
        if (check()) {
            releaseProductBuy(data, function (res) {
                console.log(res);
                if (res.code === 0) {
                    Toast.success({
                        text: res.message,
                        duration: 1000,
                        complete: function() {
                            location.href = './publish_buying_tip.html';
                        }
                    });
                } else {
                    Toast.info(res.message);
                }
            });
        }
    };
    function setTagDtToConfBtn(_this, index) {
        var setTagDtToConfBtn = _this.parentElement.parentElement.parentElement.parentElement.getElementsByClassName('pop-confirm')[0];
        setTagDtToConfBtn.setAttribute('item-id', _this.getAttribute('item-id'));
        setTagDtToConfBtn.setAttribute('item-inner', _this.innerHTML);
        setTagDtToConfBtn.setAttribute('item-index', index);
    }
    function check() {
        if (data.buyPicUrl === '') {
            Toast.info('请上传图片');
        } else if (data.buyType === '') {
            Toast.info('请填写求购类型');
        } else if (data.buyShapes === '') {
            Toast.info('请填写求购形态');
        } else if (data.buyDesc === '') {
            Toast.info('请填写求购描述');
        }
        return ((data.buyPicUrl !== '') && (data.buyType !== '') && (data.buyShapes !== '') && (data.buyDesc !== ''));
    }
    function activeClear(eles) {
        for (var p = 0; p < eles.length; p++) {
            eles[p].className = '';
        }
    }
})();