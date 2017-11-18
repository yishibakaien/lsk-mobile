require('common/styles/index.styl');
require('./new_pattern.styl');

import {textSearchPattern} from 'common/scripts/text_search_core.js';
import {patternRender} from 'common/scripts/render_new_patterns_list.js';
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


//    var isSelected = false;
var newPatternBtn = c('#newPatternBtn');
var filterLayerText = c('#filterLayerText');
var newPatternText = c('#newPatternText');
var reset = c('#reset');
var confir = c('#confir');
var triangle = c('#triangle');
var filterLayerBtn = c('#filterLayerBtn');
var filterLayer = c('#filterLayer');
var mask = c('#mask');
var patternBtns = c('#pattern').getElementsByTagName('span');
var stockBtns = c('#stock').getElementsByTagName('span');
var patternWrapper = c('.new-pattern-list-wrapper')[0];

var searchParamas = {
    categorys: '',
    dateSort: 2,
    isStock: 1,
    keywords: '',
    pageNo: 1,
    pageSize: 10,
    settledLands: ''
};
// var areaBtns = c('#area').getElementsByTagName('span');

// 返回上一页状态保留
// 是否第一次render
// var isFirstRender = true;
// var storageRecordingIndex = 0;
// 记录筛选项的index
var recordingIndex = {
    indexNum: []
};
// 记录ajax花型data
var recordingPatternList = [];
//滚动位置记录
// sessionStorage.offsetTop
// 加载页数记录
// sessionStorage.pageNo
// 总页数记录
// sessionStorage.totalPage
// 记录ajax花型data到sessionStorage
// sessionStorage.recordingPatternList



// doSearch();
// 监听浏览器回退事件
window.addEventListener('pageshow', function (event) {
    if (event.persisted || window.performance && window.performance.navigation.type == 2) {
        console.log(searchParamas);
        if (sessionStorage.pageNO) {
            searchParamas.pageNo = Number(sessionStorage.pageNO);
        }
        if (sessionStorage['recordingIndex']) {
            if (JSON.parse(sessionStorage['recordingIndex']).indexNum.length) {
                recordingIndex = JSON.parse(sessionStorage['recordingIndex']);
                patternWrapper.innerHTML = '';
                filterLayerText.className = 'active';
                newPatternText.className = '';
            }
        } else {
            patternWrapper.innerHTML = '';
            filterLayerText.className = '';
            newPatternText.className = 'active';
        }

        if (sessionStorage.recordingPatternList) {
            for (let item of JSON.parse(sessionStorage['recordingPatternList'])) {
                recordingPatternList.push(item);
            }

            patternRender(recordingPatternList, document.querySelector('.new-pattern-list-wrapper'), function() {
                console.log('渲染完毕');
                scrollTopMethod();
                setScrollTop();
            });
        }
        var hasMore = Number(sessionStorage.pageNO) < Number(sessionStorage.totalPage);
        if (hasMore) {
            searchParamas.pageNo++;
        }
        pullUpLoad(hasMore, doSearch);
    } else {
        doSearch();
    }
}, false);


newPatternBtn.onclick = function () {
    searchParamas = {
        categorys: '',
        dateSort: 2,
        isStock: 1,
        keywords: '',
        pageNo: 1,
        pageSize: 10,
        settledLands: ''
    };
    recordingPatternList = [];
    sessionStorage.removeItem('recordingIndex');
    Toast.loading('正在加载中');
    sessionStorage.offsetTop = 0;
    setScrollTop();
    doSearch(false, true);
};
function doSearch(isFilter, isNewPattern) {
    textSearchPattern(searchParamas, function(res) {
        console.log('doSearch', res);
        sessionStorage.pageNO = res.data.pageNO;
        sessionStorage.totalPage = res.data.totalPage;
        Toast.hide();
        var list = res.data.list;
        for (let item of list) {
            recordingPatternList.push(item);
        }
        console.log('recordingPatternList', recordingPatternList);
        sessionStorage.recordingPatternList = JSON.stringify(recordingPatternList);
        if (isFilter) {
            patternWrapper.innerHTML = '';
            filterLayerText.className = 'active';
            newPatternText.className = '';
        }
        if (isNewPattern) {
            patternWrapper.innerHTML = '';
            filterLayerText.className = '';
            newPatternText.className = 'active';
        }

        patternRender(list, document.querySelector('.new-pattern-list-wrapper'), function() {
            console.log('渲染完毕');
            scrollTopMethod();
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
    var filterAllItemsBtn = c('#filterLayer').getElementsByTagName('span');
    // recordingIndex如果存在写入之前用户操作记录
    if (recordingIndex.indexNum.length) {
        for (var t = 0; t < recordingIndex.indexNum.length; t++) {
            filterAllItemsBtn[recordingIndex.indexNum[t]].className = 'active selected';
        }
        doFilter();
    }
    // 筛选按钮重置事件
    reset.onclick = function () {
        for (var i = 0; i < filterAllItemsBtn.length; i++) {
            filterAllItemsBtn[i].className = '';
        }
    };
    // 筛选地区
    for (var i = 0; i < areaBtns.length; i++) {
        areaBtns[i].index = i;
        areaBtns[i].onclick = function () {
            if (this.classList.contains('active')) {
                this.className = '';
                for(var t = 0; t < recordingIndex.indexNum.length; t++) {
                    if(recordingIndex.indexNum[t] === (this.index + 6)) {
                        recordingIndex.indexNum.splice(t, 1);
                        break;
                    }
                }
            } else {
                this.className = 'active selected';
                recordingIndex.indexNum.push(this.index + 6);
            }
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
            for(var t = 0; t < recordingIndex.indexNum.length; t++) {
                if(recordingIndex.indexNum[t] === this.index) {
                    recordingIndex.indexNum.splice(t, 1);
                    break;
                }
            }
        } else {
            this.className = 'active selected';
            recordingIndex.indexNum.push(this.index);
        }
    };
    // patternBtns[i].onclick = function () {
    //     for (var n = 0; n < patternBtns.length; n++) {
    //         patternBtns[n].className = '';
    //     }
    //     this.className = 'active selected';
    //     recordingIndex.pattern = this.index;
    // };
}

// 筛选库存
for (var i = 0; i < stockBtns.length; i++) {
    stockBtns[i].index = i;
    stockBtns[i].onclick = function () {
        console.log(recordingIndex);
        for (var n = 0; n < stockBtns.length; n++) {
            stockBtns[n].className = '';
            for(var t = 0; t < recordingIndex.indexNum.length; t++) {
                if (recordingIndex.indexNum[t] === 4) {
                    recordingIndex.indexNum.splice(t, 1);
                }
                if (recordingIndex.indexNum[t] === 5) {
                    recordingIndex.indexNum.splice(t, 1);
                }
            }
        }
        this.className = 'active selected';
        recordingIndex.indexNum.push(this.index + 4);
    };
}

confir.onclick = function() {
    sessionStorage.offsetTop = 0;
    searchParamas.pageNo = 1;
    recordingPatternList = [];
    setScrollTop();
    filterLayerToggle();
    doFilter();
    sessionStorage['recordingIndex'] = JSON.stringify(recordingIndex);
    Toast.loading('正在加载中');
    doSearch(true);
};

mask.onclick = filterLayerToggle;
// 拼合筛选字段
function doFilter() {
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
    console.log('筛选的字段', searchParamas);
}

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
        setScrollTop();
    }
}
function scrollTopMethod() {
    document.onscroll = function () {
        if (document.documentElement.scrollTop !== 0) {
            sessionStorage.offsetTop = document.documentElement.scrollTop;
        }
        if (document.body.scrollTop !== 0) {
            sessionStorage.offsetTop = document.body.scrollTop;
        }
        // console.log('sessionStorage.offsetTop', sessionStorage.offsetTop);
    };
}

function setScrollTop() {
    document.documentElement.scrollTop = sessionStorage.offsetTop;
    document.body.scrollTop = sessionStorage.offsetTop;
}