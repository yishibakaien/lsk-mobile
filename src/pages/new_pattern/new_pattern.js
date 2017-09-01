require('common/styles/index.styl');
require('./new_pattern.styl');

var recording = {
    pattern: '',
    stock: '',
    area: []
};
//    var isSelected = false;
var newPattern = document.getElementById('newPattern');
var reset = document.getElementById('reset');
var confir = document.getElementById('confir');
var triangle = document.getElementById('triangle');
var filterLayerBtn = document.getElementById('filterLayerBtn');
var filterLayer = document.getElementById('filterLayer');
var filterAllItemsBtn = document.getElementById('filterLayer').getElementsByTagName('span');
var mask = document.getElementsByClassName('mask')[0];
var patternBtns = document.getElementById('pattern').getElementsByTagName('span');
var stockBtns = document.getElementById('stock').getElementsByTagName('span');
var areaBtns = document.getElementById('area').getElementsByTagName('span');


filterLayerBtn.onclick = filterLayerToggle;
for (var i = 0; i < patternBtns.length; i++) {
    patternBtns[i].index = i;
    patternBtns[i].onclick = function () {
        for (var n = 0; n < patternBtns.length; n++) {
            patternBtns[n].className = '';
        }
        this.className = 'active';
        recording.pattern = this.index;
    }
};

for (var i = 0; i < stockBtns.length; i++) {
    stockBtns[i].index = i;
    stockBtns[i].onclick = function () {
        for (var n = 0; n < stockBtns.length; n++) {
            stockBtns[n].className = '';
        }
        this.className = 'active';
        recording.stock = this.index;
    }
};

//    传值未完
for (var i = 0; i < areaBtns.length; i++) {
    areaBtns[i].index = i;
    areaBtns[i].onclick = function () {
        if (this.className === 'active') {
            this.className = '';
            recording.area.push(this.index);
        } else {
            this.className = 'active';
        }
        console.log(recording);
    }
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
confir.onclick = filterLayerToggle;

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