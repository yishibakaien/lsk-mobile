require('common/styles/index.styl');
require('./publish_buying.styl');
import wx from 'weixin-js-sdk';
import Toast from 'plugins/toast/Toast';
import {
    c,
    checkAndroid,
    formatUnit,
    formatSupplyType,
    formatProduceShape,
    getQueryString
} from 'utils/utils';
import {
    // testPurchaseNum
} from 'utils/reg';

import {aliupload} from 'plugins/ali_oss/aliupload';

import {
    releaseProductBuy
}  from 'api/user';

(function () {
    // 遮罩层
    var mask = c('#mask');
    // 弹出层&表单操作部分
    var popShowBar = c('.pop-show-bar');
    var popUp = c('.pop-up');
    var popConfirm = c('.pop-confirm');
    var popClose = c('.pop-close');
    // 弹出层确定按钮
    // var typePopBtn = c('#typePopBtn');
    // var shapePopBtn = c('#shapePopBtn');
    var numPopBtn = c('#numPopBtn');
    // tagwrapper
    var typeItem = c('#typeItem');
    var shapeItem = c('#shapeItem');
    var numItem = c('#numItem');
    // 弹出层数字输入框
    var numIpt = c('#numIpt');
    // tag
    var typeBtns = typeItem.getElementsByTagName('span');
    var shapeBtns = shapeItem.getElementsByTagName('span');
    var numBtns = numItem.getElementsByTagName('span');
    // 非弹出层各项inner部分
    var buyType = c('#buyType');
    var buyShape = c('#buyShape');
    var buyNum = c('#buyNum');
    var isStartUpBtn = c('#select').getElementsByTagName('i');
    var descIpt = c('#descIpt');
    // getQueryString
    var buyDescData = getQueryString('buyDesc');
    var buyNumData = parseInt(getQueryString('buyNum'));
    var buyPicUrlData = getQueryString('buyPicUrl');
    var buyShapesData = getQueryString('buyShapes');
    var buyTypeData = parseInt(getQueryString('buyType'));
    var buyUnitData = parseInt(getQueryString('buyUnit'));
    var isStartUpData = parseInt(getQueryString('isStartUp'));
    var from = getQueryString('from');
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
    var data = {
        buyPicUrl: buyPicUrlData  || '',
        buyDesc: buyDescData || '',
        buyNum: buyNumData || 0,
        buyShapes: buyShapesData || '200010',
        buyType: buyTypeData || 100010,
        buyUnit: buyUnitData || 400010,
        isStartUp: isStartUpData || 0
    };
    console.log(Number((data.isStartUp)));
    console.log(isStartUpData);
    // 初始化
    initTag(typeBtns, data.buyType);
    initTag(shapeBtns, data.buyShapes);
    initTag(numBtns, data.buyUnit);
    numPopBtn.setAttribute('item-value', data.buyNum);
    isStartUpBtn[Number(!(data.isStartUp))].className = 'icon-gou active';

    if (from) {
        buyType.innerHTML = formatSupplyType(data.buyType);
        buyShape.innerHTML = formatProduceShape(data.buyShapes);
        buyNum.innerHTML = (parseInt(data.buyNum) && parseInt(data.buyUnit)) ? data.buyNum + formatUnit(data.buyUnit) : '面议';
        descIpt.value = data.buyDesc;
        numIpt.value = data.buyNum;
        imgArr.push(buyPicUrlData);
        // imgArr[0] = data.buyPicUrl;
        imgHandler(buyPicUrlData);
    }
    // 高版本 IOS 点击input[captrue=camera]会直接打开相机，但是这样会导致电脑上选择图片打开缓慢
    if (checkAndroid()) {
        inputPic.setAttribute('captrue', 'camera');
    }

    upload.onclick = function () {
        // 点击调起相册 或 相机
        inputPic.click();
    };

    inputPic.onchange = function() {
        Toast.loading('正在上传..');
        aliupload.call(this, 4, function(res) {
            console.log('图片上传返回值', res);
            Toast.hide();
            imgArr.push(res[0]);
            imgHandler(res[0]);
        }, function(res) {
            Toast.error('图片上传失败，请重试');
        });
    };
    // 表单部分
    // 右箭头部分
    for (var i = 0; i < popShowBar.length; i++) {
        popShowBar[i].index = i;
        popShowBar[i].onclick = function () {
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
                buyType.innerHTML = formatSupplyType(data.buyType);
            } else if (this.getAttribute('item-index') === '1') {
                data.buyShapes = this.getAttribute('item-id');
                buyShape.innerHTML = formatProduceShape(data.buyShapes);
            } else if (this.getAttribute('item-index') === '2') {
                data.buyNum = (this.getAttribute('item-value') ? parseInt(this.getAttribute('item-value')) : 0);
                data.buyUnit = parseInt(this.getAttribute('item-id'));
                buyNum.innerHTML = (data.buyNum && data.buyUnit) ? data.buyNum + formatUnit(data.buyUnit) : '面议';
            }
        };
    }
    // 求购类型
    setTagBtnMethod(typeBtns);
    // 求购形态
    setTagBtnMethod(shapeBtns);
    // 求购数量
    setTagBtnMethod(numBtns);
    numIpt.oninput = function () {
        var setTagDtToConfBtn = this.parentElement.parentElement.parentElement.getElementsByClassName('pop-confirm')[0];
        setTagDtToConfBtn.setAttribute('item-value', this.value);
    };
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
        // for (var k = 0; k < 3; k++) {
        //     data['refPic' + (k + 1)] = '';
        // }
        // for (var i = 0; i < imgArr.length; i++) {
        //     data['refPic' + (i + 1)] = imgArr[i];
        // }
        data.buyPicUrl = (imgArr[0] ? imgArr[0] : '');
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

    function initTag(btns, num) {
        var index = String(num)[5];
        var setTagDtToConfBtn = btns[index].parentElement.parentElement.parentElement.parentElement.getElementsByClassName('pop-confirm')[0];
        console.log(setTagDtToConfBtn);
        btns[index].className = 'active';
        setTagDtToConfBtn.setAttribute('item-id', num);
    }
    function imgHandler(url) {
        var div = document.createElement('div');
        div.className = 'item';
        var str = '';
        str = `<img src="${url}"><span class="icon-close" id="ss"></span>`;
        div.innerHTML = str;
        uploadWrapper.insertBefore(div, upload);
        isSingleImg();
        imgView();
        div.getElementsByClassName('icon-close')[0].addEventListener('click', function (e) {
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
    function imgView() {
        var imgItem = document.querySelectorAll('.upload-image-wrapper')[0].querySelectorAll('item');
        Array.prototype.forEach.call(imgItem, function (item) {
            item.onclick = function () {
                wx.previewImage({
                    current: this.getElementsByTagName('img')[0].getAttribute('src'),
                    urls: imgArr
                });
            };
        });
    }
    function setTagBtnMethod(eles) {
        for (var j = 0; j < eles.length; j++) {
            eles[j].onclick = function () {
                for (var p = 0; p < eles.length; p++) {
                    eles[p].className = '';
                }
                this.className = 'active';
                var setTagDtToConfBtn = this.parentElement.parentElement.parentElement.parentElement.getElementsByClassName('pop-confirm')[0];
                console.log(this.getAttribute('item-id'));
                setTagDtToConfBtn.setAttribute('item-id', this.getAttribute('item-id'));
            };
        }
    }
    function check() {
        if (!data.buyPicUrl) {
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
})();