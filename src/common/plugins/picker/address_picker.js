var Picker = require('plugins/picker/picker.min.js');
var city = require('plugins/picker/area.js');

var nameEl = document.getElementById('sel_city');

var first = []; /* 省，直辖市 */
var second = []; /* 市 */
var third = []; /* 镇 */

var selectedIndex = [0, 0, 0]; /* 默认选中的地区 */

var checked = [0, 0, 0]; /* 已选选项 */

function creatList(obj, list){
    obj.forEach(function(item, index, arr){
        var temp = {};
        temp.text = item.areaName;
        temp.value = item.areaCode;
        list.push(temp);
    });
}

creatList(city, first);

if (city[selectedIndex[0]].hasOwnProperty('childAreas')) {
    creatList(city[selectedIndex[0]].childAreas, second);
} else {
    second = [{text: '', value: 0}];
}

if (city[selectedIndex[0]].childAreas[selectedIndex[1]].hasOwnProperty('childAreas')) {
    creatList(city[selectedIndex[0]].childAreas[selectedIndex[1]].childAreas, third);
} else {
    third = [{text: '', value: 0}];
}

var picker = new Picker({
    data: [first, second, third],
    selectedIndex: selectedIndex,
    title: '地址选择'
});

picker.on('picker.select', function (selectedVal, selectedIndex) {
    var text1 = first[selectedIndex[0]].text;
    var text2 = second[selectedIndex[1]].text;
    var text3 = third[selectedIndex[2]] ? third[selectedIndex[2]].text : '';

    nameEl.value = text1 + '-' + text2 + (text3 === '' ? '' : '-') + text3;
});

picker.on('picker.change', function (index, selectedIndex) {
    if (index === 0){
        firstChange();
    } else if (index === 1) {
        secondChange();
    }

    function firstChange() {
        second = [];
        third = [];
        checked[0] = selectedIndex;
        var firstCity = city[selectedIndex];
        if (firstCity.hasOwnProperty('childAreas')) {
            creatList(firstCity.childAreas, second);

            var secondCity = city[selectedIndex].childAreas[0];
            if (secondCity.hasOwnProperty('childAreas')) {
                creatList(secondCity.childAreas, third);
            } else {
                third = [{text: '', value: 0}];
                checked[2] = 0;
            }
        } else {
            second = [{text: '', value: 0}];
            third = [{text: '', value: 0}];
            checked[1] = 0;
            checked[2] = 0;
        }

        picker.refillColumn(1, second);
        picker.refillColumn(2, third);
        picker.scrollColumn(1, 0);
        picker.scrollColumn(2, 0);
    }

    function secondChange() {
        third = [];
        checked[1] = selectedIndex;
        var first_index = checked[0];
        if (city[first_index].childAreas[selectedIndex].hasOwnProperty('childAreas')) {
            var secondCity = city[first_index].childAreas[selectedIndex];
            creatList(secondCity.childAreas, third);
            picker.refillColumn(2, third);
            picker.scrollColumn(2, 0);
        } else {
            third = [{text: '', value: 0}];
            checked[2] = 0;
            picker.refillColumn(2, third);
            picker.scrollColumn(2, 0);
        }
    }

});

picker.on('picker.valuechange', function (selectedVal, selectedIndex) {
    console.log(selectedVal);
    console.log(selectedIndex);
});
//    picker.show();

nameEl.addEventListener('click', function () {
    picker.show();
});