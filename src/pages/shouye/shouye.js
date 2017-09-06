require('common/styles/index.styl');
require('./shouye.styl');

var Swiper = require('plugins/swiper/swiper-3.4.2.min.js');

import {PIC_SEARCH} from '../../common/scripts/pic_search.js';
import {TEXT_SEARCH} from 'common/scripts/text_search.js';
PIC_SEARCH();
TEXT_SEARCH();
var settledInfoSwiper = new Swiper('.settled-info-swiper', {
    slidesPerView: 2,
    slidesPerGroup: 2,
    direction: 'vertical',
    autoplay: 3000,
    loop: true,
    autoplayDisableOnInteraction: false
});

var newArrivalSwiper = new Swiper('.new-arrival-swiper', {
    slidesPerView: 3,
    slidesPerGroup: 3,
    autoplay: 4000,
    loop: true,
    autoplayDisableOnInteraction: false
});

var supplyBuyingInfoSwiper = new Swiper('.supply-buying-info-swiper', {
    slidesPerView: 3,
    slidesPerGroup: 3,
    autoplay: 5000,
    loop: true,
    autoplayDisableOnInteraction: false
});

var versionSwiper = new Swiper('.version-swiper', {
    slidesPerView: 3,
    slidesPerGroup: 3,
    autoplay: 6000,
    loop: true,
    autoplayDisableOnInteraction: false
});

