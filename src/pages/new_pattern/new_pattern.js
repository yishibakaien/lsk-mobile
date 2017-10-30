require('common/styles/index.styl');
require('./new_pattern.styl');

import {textSearch} from 'common/scripts/text_search_core.js';
import {render} from 'common/scripts/render_new_patterns_list.js';
import {pullUpLoad} from 'common/scripts/pull_up_load.js';


import {TEXT_SEARCH} from 'common/scripts/text_search.js';
import {PIC_SEARCH} from '../../common/scripts/pic_search.js';
TEXT_SEARCH();
PIC_SEARCH();
import Toast from 'plugins/toast/Toast';

import {
    c
    // getQueryString
} from 'utils/utils';

// 获取入驻商家地点 列表
// import {
//     getSettledLands
// } from 'api/search.js';
import {getSettledLands} from 'api/search.js';

// import {
//     // testAccount,
//     // testPwd,
//     // testImgCode,
// } from 'utils/reg';

// import {
//
// }  from 'api/user';


// var recording = {
//     pattern: [],
//     stock: '',
//     area: []
// };
//    var isSelected = false;
var newPatternBtn = c('#newPatternBtn');
var filterLayerText = c('#filterLayerText');
var newPatternText = c('#newPatternText');
var reset = c('#reset');
var confir = c('#confir');
var triangle = c('#triangle');
var filterLayerBtn = c('#filterLayerBtn');
var filterLayer = c('#filterLayer');
var filterAllItemsBtn = c('#filterLayer').getElementsByTagName('span');
var mask = c('#mask');
var patternBtns = c('#pattern').getElementsByTagName('span');
var stockBtns = c('#stock').getElementsByTagName('span');
// var areaBtns = c('#area').getElementsByTagName('span');

var searchParamas = {
    categorys: '',
    dateSort: 2,
    isStock: 1,
    keywords: '',
    pageNo: 1,
    pageSize: 10,
    settledLands: ''
};
doSearch();

newPatternBtn.onclick = function () {
    if (!newPatternText.classList.contains('active')) {
        searchParamas = {
            categorys: '',
            dateSort: 2,
            isStock: 1,
            keywords: '',
            pageNo: 1,
            pageSize: 10,
            settledLands: ''
        };
        console.log(searchParamas);
        Toast.loading('正在加载中');
        doSearch(false, true);
    }
};
function doSearch(isFilter, isNewPattern) {
    textSearch(searchParamas, function(res) {
        console.log(res);
        Toast.hide();
        var list = res.data.list;
        if (isFilter) {
            document.querySelector('.new-pattern-list-wrapper').innerHTML = '';
            filterLayerText.className = 'active';
            newPatternText.className = '';
        }
        if (isNewPattern) {
            document.querySelector('.new-pattern-list-wrapper').innerHTML = '';
            filterLayerText.className = '';
            newPatternText.className = 'active';
        }
        render(list, document.querySelector('.new-pattern-list-wrapper'), function() {
            console.log('渲染完毕');
        });

        var hasMore = res.data.pageNO < res.data.totalPage;
        if (hasMore) {
            searchParamas.pageNo++;
        }
        pullUpLoad(hasMore, doSearch);
    }, function(res) {
        Toast.info('加载失败');
        pullUpLoad(false, doSearch);
        console.error(res);
    });
}

getSettledLands({}, function(res) {
    console.log('获取入驻商家地址', res);
    var data = res.data;
    var str = '';
    data.forEach(function(item) {
        str += `<span type="settledLands" data="${item.value}">${item.name}</span>`;
    });
    // str += '<span type="settledLands" data="">其他</span>';
    c('#areaBtns').innerHTML = str;
    var areaBtns = c('#area').getElementsByTagName('span');

    // 筛选地区
    for (var i = 0; i < areaBtns.length; i++) {
        areaBtns[i].index = i;
        areaBtns[i].onclick = function () {
            if (this.classList.contains('active')) {
                this.className = '';
                // for(var t = 0; t < recording.area.length; t++) {
                //     if(recording.area[t] === this.index) {
                //         recording.area.splice(t, 1);
                //         break;
                //     }
                // }
            } else {
                this.className = 'active selected';
                // recording.area.push(this.index);
            }
            // console.log(recording);
        };
    }

}, function(res) {
    console.error('获取入驻商家地址', res);
});

filterLayerBtn.onclick = filterLayerToggle;

// 筛选category
for (var i = 0; i < patternBtns.length; i++) {
    patternBtns[i].index = i;
    patternBtns[i].onclick = function () {
        if (this.classList.contains('active')) {
            this.className = '';
            // for(var t = 0; t < recording.pattern.length; t++) {
            //     if(recording.pattern[t] === this.index) {
            //         recording.pattern.splice(t, 1);
            //         break;
            //     }
            // }
        } else {
            this.className = 'active selected';
            // recording.pattern.push(this.index);
        }
        // console.log(recording);
    };
    // patternBtns[i].onclick = function () {
    //     for (var n = 0; n < patternBtns.length; n++) {
    //         patternBtns[n].className = '';
    //     }
    //     this.className = 'active selected';
    //     recording.pattern = this.index;
    // };
}

// 筛选库存
for (var i = 0; i < stockBtns.length; i++) {
    stockBtns[i].index = i;
    stockBtns[i].onclick = function () {
        for (var n = 0; n < stockBtns.length; n++) {
            stockBtns[n].className = '';
        }
        this.className = 'active selected';
        // recording.stock = this.index;
        // console.log(recording);
    };
}

reset.onclick = function () {
    for (var i = 0; i < filterAllItemsBtn.length; i++) {
        filterAllItemsBtn[i].className = '';
    }
};
//
//    if (isSelected === true) {
//        confir.onclick = filterLayerToggle;
//    }
confir.onclick = function() {
    filterLayerToggle();
    var selectedItems = document.querySelectorAll('.selected');
    var areaArr = [];
    var categorysArr = [];
    Array.prototype.forEach.call(selectedItems, function(item) {
        var key = item.getAttribute('type');
        if (key === 'settledLands') {
            areaArr.push(item.getAttribute('data'));
        } else if (key === 'categorys') {
            categorysArr.push(item.getAttribute('data'));
        } else {
            searchParamas[key] = item.getAttribute('data');
        }
    });
    searchParamas['settledLands'] = areaArr.join(',');
    searchParamas['categorys'] = categorysArr.join(',');
    searchParamas.pageNo = 1;
    console.log('筛选的字段', searchParamas);
    Toast.loading('正在加载中');
    doSearch(true);
};

mask.onclick = filterLayerToggle;

function filterLayerToggle () {
    if (triangle.className === 'icon-xiasanjiao') {
        triangle.className = triangle.className.replace('icon-xiasanjiao', 'icon-shangsanjiao');
        filterLayer.style.display = 'block';
        mask.style.display = 'block';
        document.body.className = 'modal-open';
    } else {
        triangle.className = triangle.className.replace('icon-shangsanjiao', 'icon-xiasanjiao');
        filterLayer.style.display = 'none';
        mask.style.display = 'none';
        document.body.className = '';
    }
}