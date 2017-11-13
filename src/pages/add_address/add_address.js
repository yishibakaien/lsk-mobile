require('common/styles/index.styl');
require('./add_address.styl');
// var cityDict = require('plugins/picker/city.js');
var picker = require('plugins/picker/address_picker.js');


import Toast from 'plugins/toast/Toast';

import {
    c,
    getQueryString
} from 'utils/utils';

import {
    testName,
    testTel,
    testAddress
} from 'utils/reg';

import {
    addConsignee,
    editorConsignee
}  from 'api/user';

(function () {
    var save = c('#save');
    var nameIpt = c('#nameIpt');
    var phoneIpt = c('#phoneIpt');
    var addressIpt = c('#addressIpt');
    var selCity = c('#sel_city');
    var nameSt;
    var phoneSt;
    var addressSt;
    var addressDtlSt;
    var data = {
        address: '',
        is_def: 0,
        name: '',
        phone: '',
        province: '',
        city: '',
        county: '',
        postCode: ''
    };
    picker.on('picker.valuechange', function (selectedVal, selectedIndex) {
        console.log(selectedVal);
        console.log(selectedIndex);
        data.province = selectedVal[0];
        data.city = selectedVal[1];
        data.county = selectedVal[2];
        console.log(data);
    });

    save.onclick = function () {
        if (testAddress(addressIpt.value)){
            addressSt = true;
        } else {
            addressIpt.value = '';
            Toast.info('请输入详细地址');
            addressSt = false;
        }
        if (testAddress(selCity.value)){
            addressDtlSt = true;
        } else {
            selCity.value = '';
            Toast.info('请选择地址区域');
            addressDtlSt = false;
        }
        if (testTel(phoneIpt.value)){
            phoneSt = true;
        } else {
            phoneIpt.value = '';
            Toast.info('请输入联系电话');
            phoneSt = false;
        }
        if (testName(nameIpt.value)){
            nameSt = true;
        } else {
            nameIpt.value = '';
            Toast.info('请输入姓名');
            nameSt = false;
        }

        if (nameSt && phoneSt && addressSt && addressDtlSt) {
            data.address = addressIpt.value;
            data.is_def = 0;
            data.name = nameIpt.value;
            data.phone = phoneIpt.value;
            data.postCode = '';
            console.log('最终数据', data);

            addConsignee(data, function (res) {
                console.log('新建收货地址', res);
                if (res.code === 0) {
                    Toast.success(res.message, 1000);
                    location.href = './address_manage.html?time=' + ((new Date()).getTime());
                } else {
                    Toast.info(res.message);
                }
            });
        }
    };

    // function formatAddress(data) {
    //     var tranData = {};
    //     for (var i = 0; i < cityDict.length; i++) {
    //         if (cityDict[i].areaCode === data.province) {
    //             console.log('省份', cityDict[i]);
    //             tranData.province = cityDict[i].areaName;
    //             for (var k = 0; k < cityDict[i].childAreas.length; k++) {
    //                 if (cityDict[i].childAreas[k].areaCode === data.city) {
    //                     console.log('市', cityDict[i].childAreas[k]);
    //                     tranData.city = cityDict[i].childAreas[k].areaName;
    //                     for (var g = 0; g < cityDict[i].childAreas[k].childAreas.length;g++) {
    //                         if (cityDict[i].childAreas[k].childAreas[g].areaCode === data.county) {
    //                             console.log('区县', cityDict[i].childAreas[k].childAreas[g]);
    //                             tranData.county = cityDict[i].childAreas[k].childAreas[g].areaName;
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     return tranData;
    // }
})();