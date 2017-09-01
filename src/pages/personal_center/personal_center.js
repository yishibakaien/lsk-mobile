require('common/styles/index.styl');
require('./personal_center.styl');

import {
    checkPhone
} from 'api/user';

console.log(checkPhone);

checkPhone({
    mobile: '18650470415'
}, function(res) {
    console.log(res);
});