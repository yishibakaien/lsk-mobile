require('common/styles/index.styl');
require('./my_buying.styl');
require('plugins/swiper/swiper-3.4.2.min.js');

import Toast from 'plugins/toast/Toast';

import {
    c
} from 'utils/utils';

import {
    myProductBuys
}  from 'api/user';



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
}