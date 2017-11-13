require('common/styles/index.styl');
require('./address_manage.styl');
var city = require('plugins/picker/city.js');
import Toast from 'plugins/toast/Toast';

import {
    c
} from 'utils/utils';

import {
    listConsignee,
    deleteConsignee,
    setDefault
}  from 'api/user';

(function () {
    // if (localStorage['editAddress']) {
    //     localStorage.removeItem('editAddress');
    // }
    var delConfirm = c('#delConfirm');
    var cancelConfirm = c('#cancelConfirm');
    var bottomSlide = c('#bottomSlide');
    var newBuild = c('#newBuild');
    var addressWrapper = c('#addressWrapper');
    var addressId;
    var elNode;
    var addressLength;


    listConsignee({}, function (res) {
        console.log('获取收货地址列表', res.data);
        var addressStr = '';
        addressLength = res.data.length;
        for (var n = 0; n < res.data.length; n++) {
            var addTranData = formatAddress(res.data[n]);
            addressStr += `<div class="address" address=${res.data[n].address} city=${res.data[n].city} county=${res.data[n].county} address-id=${res.data[n].id} is-def=${res.data[n].isDef} name=${res.data[n].name} phone=${res.data[n].phone}  province=${res.data[n].province} postcode=${res.data[n].postcode}>
        <div class="user-info border-bottom">
            <div><span class="name">${res.data[n].name}</span><span class="phone">${res.data[n].phone}</span></div>
            <div class="address-text">${addTranData.province}-${addTranData.city}-${addTranData.county}-${res.data[n].address}</div>
        </div>
        <div class="address-handle">
            <div class="choose icon-gou ${res.data[n].isDef ? 'active' : ''}"></div>
            <div class="choose-tip">设为默认</div>
            <div class="delete">
                删除
            </div>
            <div class="edit">
                编辑
            </div>
        </div>
    </div>`;
        }
        addressWrapper.innerHTML = addressStr;
        handleAddress();
    });

    function handleAddress() {
        var choose = c('.choose');
        var edit = c('.edit');
        var del = c('.delete');
        for (var i = 0; i < del.length; i++) {
            del[i].onclick = function () {
                bottomSlide.style.display = 'block';
                document.body.className = 'modal-open';
                addressId = this.parentNode.parentNode.getAttribute('address-id');
                elNode = this.parentNode.parentNode;
            };
        }
        for (var k = 0; k < choose.length; k++) {
            choose[k].onclick = function () {
                var that = this;
                addressId = this.parentNode.parentNode.getAttribute('address-id');
                setDefault({
                    id: addressId
                }, function (res) {
                    console.log('设置默认', res);
                    Toast.success(res.message, 1000);
                    if (res.code === 0) {
                        for (var n = 0; n < choose.length; n++) {
                            choose[n].className = choose[n].className.replace(' active', '');
                            console.log(choose[n].parentNode.parentNode);
                            choose[n].parentNode.parentNode.setAttribute('is-def', 0);
                        }
                        that.className += ' active';
                        that.parentNode.parentNode.setAttribute('is-def', 1);
                    }
                });
            };
        }
        for (var t = 0; t < edit.length; t ++) {
            edit[t].onclick = function () {
                var editData = {
                    address: this.parentNode.parentNode.getAttribute('address'),
                    city: this.parentNode.parentNode.getAttribute('city'),
                    county: this.parentNode.parentNode.getAttribute('county'),
                    id: this.parentNode.parentNode.getAttribute('address-id'),
                    is_def: this.parentNode.parentNode.getAttribute('is-def'),
                    name: this.parentNode.parentNode.getAttribute('name'),
                    phone: this.parentNode.parentNode.getAttribute('phone'),
                    postCode: this.parentNode.parentNode.getAttribute('postCode'),
                    province: this.parentNode.parentNode.getAttribute('province')
                };
                // localStorage.editAddress = JSON.stringify(editData);
                // console.log(localStorage.editAddress);
                location.href = './edit_address.html?province=' + editData.province + '&city=' + editData.city + '&county=' + editData.county + '&address=' + editData.address + '&id=' + editData.id + '&name=' + editData.name + '&is_def=' + editData.is_def  + '&phone=' + editData.phone + '&postCode=' + editData.postCode;
            };
        }
    }



    cancelConfirm.onclick = function () {
        bottomSlide.style.display = 'none';
        document.body.className = '';
    };

    delConfirm.onclick = function () {
        bottomSlide.style.display = 'none';
        document.body.className = '';
        deleteConsignee({
            ids: [addressId]
        }, function (res) {
            if (res.code === 0) {
                Toast.success(res.message, 1000);
                elNode.parentNode.removeChild(elNode);
            } else {
                Toast.info(res.message, 1000);
            }
        });
    };

    newBuild.onclick = function () {
        if (addressLength > 7) {
            Toast.info('收货地址数量不能超过8个', 2500);
        } else {
            location.href = './add_address.html?st=add';
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
    // console.log(city);
})();
