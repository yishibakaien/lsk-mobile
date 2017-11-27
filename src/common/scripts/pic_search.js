import {c, formatSupplyType, getQueryString} from 'utils/utils.js';
import Toast from 'plugins/toast/Toast';

import {
    // 文本搜索
    search,
    // 图片搜索
    encoded,
    // 图片搜索结果轮询
    polling,

    // 获取图片搜索结果
    getResult

} from 'api/search.js';

import {checkAndroid} from 'utils/reg';
import uploadPictrue from 'utils/uploadPictrue';
import Cropper from 'plugins/cropper/ts57_cropper.js';


export function PIC_SEARCH() {


    var camera = c('#camera');
    var searchPicIpt = c('#searchPicIpt');

    var picSearchQueryParams = {
        category: 100010,
        timeout: 60000,
        encoded: '',
        searchType: 300
    };

    // 高版本 IOS 点击input[captrue=camera]会直接打开相机，但是这样会导致电脑上选择图片打开缓慢
    if (checkAndroid()) {
        searchPicIpt.setAttribute('captrue', 'camera');
    }
    camera.onclick = function() {
        searchPicIpt.click();
    };

    var image = c('#cropperImage'); // 拿来切的图
    var cropperWrapper = c('#cropperWrapper'); // 切图器DOM
    var buttons; // 用来点击切图的按钮
    var cropper; // 切图器

    searchPicIpt.onchange = function(e) {
        console.log(e);
        uploadPictrue(this, function(base64) {
            // console.log(base64);
            image.src = base64;
            cropper = new Cropper(image, {
                scalable: false,
                zoomable: false,
                autoCropArea: 0.6,
                minCropBoxWidth: 60,
                minCropBoxHeight: 60
            });
            cropperWrapper.style.display = 'block';

            // 这里需要等待DOM渲染完成之后
            setTimeout(function() {
                bindCropEvent();
            }, 500);
        });
    };
    function bindCropEvent() {
        var btns = c('.btn-cell');
        console.log(btns, btns.length);
        Array.prototype.forEach.call(btns, function(item) {
            item.onclick = picCroped;
        });
    }
    function picCroped() {
        // console.log(this);
        var category = this.getAttribute('category');
        var base64 = cropper.getCroppedCanvas().toDataURL('image/png');
        if (base64.length > 10000000) {
            alert('图片体积过大，您截取的图片大小需要再减少 ' + Math.floor(((base64.length / 10000000) - 1) * 100) + '% 左右');
            Toast.hide();
            return;
        }
        cropperWrapper.style.display = 'none';
        cropper.destroy();
        Toast.loading('搜索' + formatSupplyType(category) + '中');
        picSearchQueryParams.category = category;
        picSearchQueryParams.encoded = base64;
        doPicSearch();
    }
    function doPicSearch() {
        // hidePicBox();
        // console.log(picSearchQueryParams);
        
        encoded(picSearchQueryParams, function(res) {
            if (res.code !== 0) {
                if (res.code === 210018) {
                    Toast.error('用户未登录');
                    return;
                }
            }
            console.log('encoded的res', res);
            console.log('搜索的key', res.data.searchKey);
            var pollingTimer = setInterval(function() {
                polling({
                    searchKey: res.data.searchKey
                }, function(res) {
                    console.log(res.data);
                    if (res.data !== -1) {
                        Toast.hide();
                        clearInterval(pollingTimer);
                        location.href = './pic_search_result.html?searchId=' + res.data;
                        // clearInterval(pollingTimer);
                        // getResultQueryParams.id = res.data;
                        // getResult(getResultQueryParams, function(res) {
                        //     // mockData.res = 1;
                        //     console.log(res);
                        //     if (res.data.list.length === 0) {
                        //         Toast.info('未找到相似花型', 2000);
                        //     }
                        //     htmlHandler(res, searchResultBox, PIC_RESULT);
                        // });
                    }
                });
            }, 1000);
        });
    }

} // END __SEARCH__

