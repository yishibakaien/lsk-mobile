require('common/styles/static/reset/reset.styl');
require('common/fonts/font.css');
require('common/styles/common.styl');
require('plugins/swiper/swiper-3.4.2.min.css');
require('./supply_info.css');

// const Toast = require('plugins/toast/Toast');

var Swiper = require('plugins/swiper/swiper-3.4.2.min.js');

var text = [
    {
        text: '发布供应',
        link: './publish_supply.html'
    },
    {
        text: '发布求购',
        link: './publish_buying.html'
    }
];

//        console.log(text[0].link);
var headRightText = document.getElementById('headRightText');
var swiperTag = document.getElementsByClassName('swiper-tag')[0].getElementsByTagName('span');
var contentSwiper = new Swiper ('.swiper-container', {
    onSlideChangeEnd: swiperControl
    });
slideControl();

function slideControl() {
    for (var i = 0; i < swiperTag.length; i++) {
        (function(i) {
            swiperTag[i].addEventListener('click', function() {
                contentSwiper.slideTo(i, 300, false);
                swiperControl(contentSwiper);
            }, false);
        })(i);
    }
}

function swiperControl(swiper) {
    for (var i = 0; i < swiperTag.length; i++) {
        swiperTag[i].className = swiperTag[i].className.replace('active', '');
    }
    swiperTag[swiper.activeIndex].className += ' active';
    headRightText.innerHTML = text[swiper.activeIndex].text;
    headRightText.setAttribute('href', text[swiper.activeIndex].link);
}