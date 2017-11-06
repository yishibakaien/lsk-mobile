require('common/styles/index.styl');
require('./publish_supply.styl');
import wx from 'weixin-js-sdk';
import Toast from 'plugins/toast/Toast';
import {
    c,
    checkAndroid,
    // formatUnit,
    // formatSupplyType,
    // formatProduceShape,
    // getQueryString
} from 'utils/utils';
// import {
//     testPurchaseNum
// } from 'utils/reg';

import {aliupload} from 'plugins/ali_oss/aliupload';

import {
    releaseCompanySupply
}  from 'api/user';

(function () {
    // 遮罩层
    var mask = c('#mask');
    // 弹出层&表单操作部分
    var popShowBar = c('.pop-show-bar');
    var popUpWrapper = c('.pop-up-wrapper');
    var popConfirm = c('.pop-confirm');
    var popClose = c('.pop-close');
    // 弹出层确定按钮
    // var numPopConfirm = c('#numPopConfirm');
    // tagwrapper
    var typeBtnWrapper = c('#typeBtnWrapper');
    var shapeBtnWrapper = c('#shapeBtnWrapper');
    var numBtnWrapper = c('#BtnWrapper');
    // 弹出层数字输入框
    var numIpt = c('#numIpt');
    // 描述输入框
    var descIpt = c('#descIpt');
    // tags
    var typeBtns = typeBtnWrapper.getElementsByTagName('span');
    var shapeBtns = shapeBtnWrapper.getElementsByTagName('span');
    var unitBtns = numBtnWrapper.getElementsByTagName('span');
    // var isStartUpBtns = c('#select').getElementsByTagName('i');
    // 非弹出层各项inner部分
    var supplyType = c('#supplyType');
    var supplyShape = c('#supplyShape');
    var supplyNum = c('#supplyNum');
    // getQueryString
    // var supplyDescString = getQueryString('supplyDesc');
    // var supplyPicUrlString = getQueryString('supplyPicUrl');
    // var isStartUpString = getQueryString('isStartUp');
    // var supplyShapesString = formatString(getQueryString('supplyShapes'));
    // var supplyNumString = formatString(getQueryString('supplyNum'));
    // var supplyTypeString = formatString(getQueryString('supplyType'));
    // var supplyUnitString = formatString(getQueryString('supplyUnit'));
    // var from = getQueryString('from');

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
        supplyPicUrl: '',
        supplyDesc: '',
        supplyNum: '',
        supplyShapes: '',
        supplyType: '',
        supplyUnit: ''
    };

    // if (from) {
    //     // 初始化
    //     initBtnTag(typeBtns, supplyTypeString);
    //     initBtnTag(shapeBtns, supplyShapesString);
    //     if (supplyNumString) {
    //         initBtnTag(unitBtns, supplyUnitString);
    //     }
    //     isStartUpBtns[Number(!(Number(isStartUpString)))].className = 'icon-gou active selected';
    //
    //
    //     supplyType.innerHTML = formatSupplyType(supplyTypeString);
    //     supplyShape.innerHTML = formatProduceShape(supplyShapesString);
    //     (supplyNumString && supplyUnitString) ? supplyNum.innerHTML = supplyNumString + formatUnit(supplyUnitString) : '';
    //     descIpt.value = supplyDescString;
    //     numIpt.value = supplyNumString;
    //
    //     function initBtnTag(elementBtns, str) {
    //         var index = String(str)[5];
    //         if (index) {
    //             elementBtns[index].className = 'active selected';
    //         }
    //     }
    //
    //     if (supplyPicUrlString) {
    //         imgArr.push(supplyPicUrlString);
    //         // imgArr[0] = data.supplyPicUrl;
    //         imgHandler(supplyPicUrlString);
    //     }
    // }
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
            popUpWrapper[this.index].style.display = 'block';
            mask.style.display = 'block';
        };
    }
    // 关闭按钮
    for (var n = 0; n < popClose.length; n++) {
        popClose[n].index = n;
        popClose[n].onclick = function () {
            popUpWrapper[this.index].style.display = 'none';
            mask.style.display = 'none';
            var btns = popUpWrapper[this.index].getElementsByClassName('btn')[0].getElementsByTagName('span');
            for (var x = 0; x < btns.length; x++) {
                if (btns[x].classList.contains('selected')) {
                    btns[x].className = 'selected active';
                } else {
                    btns[x].className = '';
                }
            }
        };
    }

    // 弹出层确定按钮
    for (var k = 0; k < popConfirm.length; k++) {
        popConfirm[k].index = k;
        popConfirm[k].onclick = function () {
            popUpWrapper[this.index].style.display = 'none';
            mask.style.display = 'none';
            var btns = popUpWrapper[this.index].getElementsByClassName('btn')[0].getElementsByTagName('span');

            if (numIpt.value) {
                var _numIpt = numIpt.value;
                for (var a = 0; a < unitBtns.length; a++) {
                    if (unitBtns[a].classList.contains('active')){
                        numIpt.value = _numIpt;
                        break;
                    } else {
                        numIpt.value = '';
                    }
                }
            }

            for (var x = 0; x < btns.length; x++) {
                if (btns[x].classList.contains('active')) {
                    if (btns[x].getAttribute('item-id')[0] === '1') {
                        btns[x].className = 'selected active';
                        supplyType.innerHTML = btns[x].innerHTML;
                    }
                    if (btns[x].getAttribute('item-id')[0] === '2') {
                        btns[x].className = 'selected active';
                        supplyShape.innerHTML = btns[x].innerHTML;
                    }
                    if (btns[x].getAttribute('item-id')[0] === '4') {
                        if (numIpt.value) {
                            btns[x].className = 'selected active';
                            supplyNum.innerHTML = numIpt.value + ' ' +  btns[x].innerHTML;
                        } else {
                            numIpt.value = '';
                            for (var p = 0; p < btns.length; p++) {
                                btns[p].className = '';
                                supplyNum.innerHTML = '请选择数量';
                            }
                        }
                    }
                } else {
                    btns[x].className = '';
                }
            }
        };
    }
    // 供应类型
    setTagBtnActive(typeBtns);
    // 供应形态
    setTagBtnActive(shapeBtns);
    // 供应数量
    setTagBtnActive(unitBtns);
    // 选择是否接受开机
    // for (var m = 0; m < isStartUpBtns.length; m++) {
    //     isStartUpBtns[m].onclick = function () {
    //         for (var p = 0; p < isStartUpBtns.length; p++) {
    //             isStartUpBtns[p].className = 'icon-gou';
    //         }
    //         this.className = 'icon-gou active selected';
    //     };
    // }
    // 发布按钮
    publish.onclick = function() {
        // for (var k = 0; k < 3; k++) {
        //     data['refPic' + (k + 1)] = '';
        // }
        // for (var i = 0; i < imgArr.length; i++) {
        //     data['refPic' + (i + 1)] = imgArr[i];
        // }

        data.supplyPicUrl = (imgArr[0] ? imgArr[0] : '');
        data.supplyNum = Number(numIpt.value) ? Number(numIpt.value) : '';
        data.supplyDesc = descIpt.value;
        for (var g = 0; g < typeBtns.length; g++) {
            if (typeBtns[g].classList.contains('selected')) {
                data.supplyType = Number(typeBtns[g].getAttribute('item-id'));
                break;
            } else {
                data.supplyType = '';
            }
        }
        for (var p = 0; p < shapeBtns.length; p++) {
            if (shapeBtns[p].classList.contains('selected')) {
                data.supplyShapes = shapeBtns[p].getAttribute('item-id');
                break;
            } else {
                data.supplyShapes = '';
            }
        }
        for (var m = 0; m < unitBtns.length; m++) {
            if (unitBtns[m].classList.contains('selected')) {
                data.supplyUnit = Number(unitBtns[m].getAttribute('item-id'));
                break;
            } else  {
                data.supplyUnit = '';
            }
        }
        // for (var u = 0; u < isStartUpBtns.length; u++) {
        //     if (isStartUpBtns[u].classList.contains('selected')) {
        //         data.isStartUp = Number(isStartUpBtns[u].getAttribute('star-up-st'));
        //         break;
        //     } else {
        //         data.isStartUp = '';
        //     }
        // }

        console.log('发布供应Data:', data);
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

    function imgHandler(url) {
        var div = document.createElement('div');
        div.className = 'item';
        var str = '';
        str = `<img src="${url}"><span class="icon-close pic-close"></span>`;
        div.innerHTML = str;
        uploadWrapper.insertBefore(div, upload);
        isSingleImg();
        imgView();
        div.getElementsByClassName('pic-close')[0].addEventListener('click', function (e) {
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
    function setTagBtnActive(eles) {
        for (var j = 0; j < eles.length; j++) {
            eles[j].onclick = function () {
                for (var p = 0; p < eles.length; p++) {
                    eles[p].className = eles[p].className.replace(' active', '');
                }
                this.className += ' active';
            };
        }
    }
    function check() {
        if (!data.supplyPicUrl) {
            Toast.info('请上传图片');
        } else if (!data.supplyType) {
            Toast.info('请填写供应类型');
        } else if (!data.supplyShapes) {
            Toast.info('请填写供应形态');
        } else if (!data.supplyDesc) {
            Toast.info('请填写供应描述');
        }
        return ((data.supplyPicUrl !== '') && (data.supplyType !== '') && (data.supplyShapes !== '') && (data.supplyDesc !== ''));
    }
    // function formatString(str) {
    //     return (/^(1|2|3|4)[0]{3}[1](0|1|2|3)$/.test(str || '')) ? str : '';
    // }
})();