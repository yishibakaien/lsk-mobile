require('common/styles/index.styl');
require('./edit_address.styl');
var city = require('plugins/picker/city.js');
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
    var title = c('#title');
    var nameIpt = c('#nameIpt');
    var phoneIpt = c('#phoneIpt');
    var addressIpt = c('#addressIpt');
    var selCity = c('#sel_city');
    var nameSt;
    var phoneSt;
    var addressSt;
    var addressDtlSt;
    var addressDtlArr;
    var st = getQueryString('st');
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

    if ((st === 'edit') && localStorage.editAddress) {
        document.title = '收货地址管理';
        title.innerHTML = '收货地址管理';
        var editData = JSON.parse(localStorage.editAddress);
        var addTranData = formatAddress(editData);
        console.log(editData);
        nameIpt.value = editData.name;
        phoneIpt.value = editData.phone;
        selCity.value = addTranData.province + '-' + addTranData.city + '-' + addTranData.county;
        addressIpt.value = editData.address;
    }

    save.onclick = function () {
        if (testName(nameIpt.value)){
            nameIpt.className = '';
            nameSt = true;
        } else {
            nameIpt.value = '';
            nameIpt.className = 'invalid';
            nameSt = false;
        }
        if (testTel(phoneIpt.value)){
            phoneIpt.className = '';
            phoneSt = true;
        } else {
            phoneIpt.value = '';
            phoneIpt.className = 'invalid';
            phoneSt = false;
        }
        if (testAddress(addressIpt.value)){
            addressIpt.className = '';
            addressSt = true;
        } else {
            addressIpt.value = '';
            addressIpt.className = 'invalid';
            addressSt = false;
        }
        if (testAddress(selCity.value)){
            selCity.className = '';
            addressDtlSt = true;
        } else {
            selCity.value = '';
            selCity.className = 'invalid';
            addressDtlSt = false;
        }
        if (nameSt && phoneSt && addressSt && addressDtlSt) {
            // addressDtlArr = selCity.value.split('-');
            data.address = addressIpt.value;
            data.is_def = 0;
            data.name = nameIpt.value;
            data.phone = phoneIpt.value;
            // data.province = addressDtlArr[0];
            // data.city = addressDtlArr[1];
            // data.county = addressDtlArr[2];
            data.postCode = '';
            if ((st === 'edit') && localStorage.editAddress) {
                data.id = editData.id;
                data.is_def = editData.is_def;
                console.log('最终数据', data);
                // return;
                editorConsignee(data, function (res) {
                    console.log('地址编辑', res);
                    if (res.code === 0) {
                        localStorage.removeItem('editAddress');
                        Toast.success(res.message, 1000);
                        location.href = './address_manage.html?time=' + ((new Date()).getTime());
                    }
                });
            } else {
                console.log('最终数据', data);
                // return;
                addConsignee(data, function (res) {
                    console.log('新建收货地址', res);
                    if (res.code === 0) {
                        Toast.success(res.message, 1000);
                        location.href = './address_manage.html?time=' + ((new Date()).getTime());
                    }
                });
            }
        }
    };

    function formatAddress(data) {
        var addTranData = {};
        for (var i = 0; i < city.length; i++) {
            if (city[i].areaCode === data.province) {
                console.log('省份', city[i]);
                addTranData.province = city[i].areaName;
                for (var k = 0; k < city[i].childAreas.length; k++) {
                    if (city[i].childAreas[k].areaCode === data.city) {
                        console.log('市', city[i].childAreas[k]);
                        addTranData.city = city[i].childAreas[k].areaName;
                        for (var g = 0; g < city[i].childAreas[k].childAreas.length;g++) {
                            if (city[i].childAreas[k].childAreas[g].areaCode === data.county) {
                                console.log('区县', city[i].childAreas[k].childAreas[g]);
                                addTranData.county = city[i].childAreas[k].childAreas[g].areaName;
                            }
                        }
                    }
                }
            }
        }
        return addTranData;
    }
})();