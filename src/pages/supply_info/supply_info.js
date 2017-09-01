require('common/styles/index.styl');
require('./supply_info.styl');

// require('plugins/weui/weui.min.css');

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

var headRightText = document.getElementById('headRightText');
var swiperTag = document.getElementsByClassName('swiper-tag')[0].getElementsByTagName('span');
var contentSwiper = new Swiper ('.swiper-container', {
    onSlideChangeEnd: swiperControl,
    spaceBetween: 30
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