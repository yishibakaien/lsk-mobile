require('common/styles/static/reset/reset.styl');
require('common/styles/common.styl');
require('common/fonts/font.css');
require('./personal_center.css');

import {
    checkPhone
} from 'api/user';

console.log(checkPhone);

checkPhone({
    mobile: '18650470415'
}, function(res) {
    console.log(res);
});