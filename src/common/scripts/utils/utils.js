// import Base64 from './text2base64/text2base64';
/**
 * 选择器
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
function c(str) {
    var str1 = str.charAt(0);
    var strsub = str.substr(1);
    switch (str1) {
    case '#':
        return document.getElementById(strsub);
    case '.':
        return document.getElementsByClassName(strsub);
    default:
        return document.getElementsByTagName(str);
    }
}
/**
 * 获取url参数
 * @param  {[type]} key [description]
 * @return {[type]}     [description]
 */
function getQueryString(key) {
    var reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
    var result = window.location.search.substr(1).match(reg);
    return result ? decodeURIComponent(result[2]) : null;
}
/**
 * 绑定事件
 * @param  {[nodeList]} el    [元素]
 * @param  {[String]} event [事件名]
 * @param  {[type]} func  [description]
 * @return {[type]}       [description]
 */
function bind(el, event, func) {
    el.addEventListener(event, func, false);
}

// 添加active
function addActive(els) {
    var i,
        n,
        len = els.length;
    for (i = 0; i < len; i++) {
        (function(i) {
            els[i].onclick = function() {

                for (n = 0; n < len; n++) {
                    els[n].className = els[n].className.split('active').join(' ');
                }
                if (this.className.indexOf('active') === -1) {
                    this.className += ' active';
                }
            };
        })(i);
    }
}

/*格式化时间*/
function formatDate(date, fmt) {
    if (typeof date === 'number') {
        date = new Date(date);
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            var str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : _padLeftZero(str));
        }
    }
    return fmt;

    function _padLeftZero(str) {
        return ('00' + str).substr(str.length);
    }
}
/*格式化单位*/
function formatUnit(unit) {
    unit = Number(unit);
    var _unit = '';
    if (unit === 400010) {
        _unit = '码';
    } else if (unit === 400011) {
        _unit = '公斤';
    } else if (unit === 400012) {
        _unit = '条';
    } else {
        _unit = '';
    }
    return _unit;
}

/*格式化金额*/
function formatMoney(price, unit) {
    // 金额以 分 作为单位
    price = Number(price);

    if (price < 0.1 ) {
        return '价格面议';
    }
    unit = Number(unit);
    var _unit = '';
    if (unit === 400010) {
        _unit = '码';
    } else if (unit === 400011) {
        _unit = '公斤';
    } else if (unit === 400012) {
        _unit = '条';
    }
    return '￥ ' + (price / 100).toFixed(2) + ' / ' + _unit;
}
/*格式化供应类型*/
function formatSupplyShape(num) {
    num = Number(num);
    if (num === 200010) {
        return '胚布';
    } else if (num === 200011) {
        return '成品';
    } else if (num === 200012) {
        return '现货';
    } else if (num === 200013) {
        return '做货';
    } else {
        return '未分类';
    }
}

function formatSupplyType(num) {
    num = Number(num);
    if (num === 100010) {
        return '面料';
    } else if (num === 100011) {
        return '大边';
    } else if (num === 100012) {
        return '小边';
    } else if (num === 100013) {
        return '睫毛';
    } else {
        return '未分类';
    }
}

function formatProduceShape(num) {
    num = Number(num);
    if (num === 200010) {
        return '胚布';
    } else if (num === 200011) {
        return '成品';
    } else {
        return '成品';
    }
}

/*设置元素背景图片*/
function setBackgroundImage(ele, url) {
    // console.log(ele);
    // console.log(url);
    ele.style.backgroundImage = 'url(' + url +')';
}

// function formatPicUrl(url, needSmall) {
//     var _url = url.split('?')[0];
//     var companyName = localStorage.companyName;
//     // console.log('companyName', companyName);
//     if (companyName) {
//         if (companyName.replace(/./g, 'ii').length > 40) {
//             companyName = companyName.slice(0, 20);
//         }
//         // companyName = Base64.encodeURI(companyName);
//         // console.log('转换的base64', companyName);
//         return _url + '?x-oss-process=image/' + (needSmall ? 'resize,w_300,h_300/' : '') + 'watermark,color_FFFFFF,t_70,size_20,g_center,text_' + companyName;
//     }
// }
function formatPicUrl(url, size) {
    var _url = url.split('?')[0];
    // var companyName = localStorage.companyName;
    // console.log('companyName', companyName);
    // if (companyName) {
    //     if (companyName.replace(/./g, 'ii').length > 40) {
    //         companyName = companyName.slice(0, 20);
    //     }
        // companyName = Base64.encodeURI(companyName);
        // console.log('转换的base64', companyName);
    return _url + (size ? '?x-oss-process=image/resize,w_' + size + ',h_' + size + '/' : '');
    // }
}

// 获取时间间隔值
function getDateDiff(dateTimeStamp){
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var now = new Date().getTime();
    var diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
        return;
    }
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    var result;
    if(weekC >= 1){
        // result ='' + parseInt(weekC) + '周前';
        result = '' + formatDate(dateTimeStamp, 'yyyy-MM-dd');
    }
    else if(dayC >= 1){
        result =''+ parseInt(dayC) +'天前';
    }
    else if(hourC >= 1){
        result =''+ parseInt(hourC) +'小时前';
    }
    else if(minC >= 1){
        result =''+ parseInt(minC) +'分钟前';
    }else {
        result = '刚刚';
    }
    return result;
}

/**
 * 格式化传过来花型图片，由于花型样式是用背景图片设置的，这里设置了默认背景图片，
 * defaultPatternsUrl
 * @param  {[type]} url  [description]
 * @param  {[type]} size [description]
 * @return {[type]}      [description]
 */
function formatBgPic(url, size) {
    var defaultPatternsPicUrl = ',url(http://image.tswq.wang/headPic/defaultFactoryIco.png)';

    // 如果图片已经经携带参数
    if (url.indexOf('?') > 0) {
        if (size) {
            url = 'url(' + url + ',image/resize,w_' + size + ',h_' + size + ')';
        }
    } else {
        if (size) {
            url = 'url(' + url + '?x-oss-process=image/resize,w_' + size + ',h_' + size + ')';
        }
    }
    return url + defaultPatternsPicUrl;
    // return url + (size ? '?x-oss-process=image/resize,w_' + size + ',h_' + size + '/' : '');
}

function setDataId(ele, id) {
    ele.setAttribute('data-id', id);
}

function checkAndroid() {
    return navigator.userAgent.indexOf('Android') > -1;
}

function formatPhone(phone) {
    var p1 = phone.slice(0, 3);
    var p2 = phone.slice(7, 11);
    return p1 + '****' + p2;
}
function formatUserName(userName) {
    var length = userName.length;
    var p1 = userName.slice(0, 1);
    for (var i = 1; i < length; i++) {
        p1 += '*';
    }
    return p1;
}

function blackTip(msg, time, callback){ 
    if(document.getElementById('blackTipSpan')){
        var blackTip = document.getElementById('blackTipSpan');
        blackTip.innerText = msg; 
    }else{
        var blackTip = document.createElement('span');
        var animation = document.createElement('style');
        document.getElementsByTagName('head')[0].appendChild(animation);
        blackTip.setAttribute('id', 'blackTipSpan');
        blackTip.innerText = msg;
    }
    blackTip.style.cssText ='z-index:121;position:fixed;width:50%;background:#000;color:#fff;padding:1rem;opacity:0.75;font-size:16px;top:50%;left:50%;border-radius:0.5rem;text-align:center;word-break:break-all;-moz-transform:translateZ(0) translateX(-50%) translateY(-50%);-webkit-transform:translateZ(0) translateX(-50%) translateY(-50%);transform:translateZ(0) translateX(-50%) translateY(-50%);';
 
    document.getElementsByTagName('body')[0].appendChild(blackTip);
    setTimeout(function(){
        if(window.$){
            $(blackTip).stop().fadeOut();
        }else{
            blackTip.style.display = 'none';
        }
        if(callback) {
            callback();
        }
    }, time||2100);
}
// @author lyb 2017-11-28 16:24:36
// 字符串加密
function encrypto( str, xor = 127, hex = 16) {
    if ( typeof str !== 'string' || typeof xor !== 'number' || typeof hex !== 'number') {
        return;
    }
    let resultList = [];
    hex = hex <= 25 ? hex : hex % 25;
    for ( let i=0; i<str.length; i++ ) {
        // 提取字符串每个字符的ascll码
        let charCode = str.charCodeAt(i);
        // 进行异或加密
        charCode = (charCode * 1) ^ xor;
        // 异或加密后的字符转成 hex 位数的字符串
        charCode = charCode.toString(hex);
        resultList.push(charCode);
    }
    // let splitStr = String.fromCharCode(hex + 97);
    let splitStr = '-';
    let resultStr = resultList.join( splitStr );
    return resultStr;
}

// 字符串解密
function decrypto( str, xor = 127, hex = 16) {
    if ( typeof str !== 'string' || typeof xor !== 'number' || typeof hex !== 'number') {
        return;
    }
    let strCharList = [];
    let resultList = [];
    hex = hex <= 25 ? hex : hex % 25;
    // 解析出分割字符
    // let splitStr = String.fromCharCode(hex + 97);
    let splitStr = '-';
    // 分割出加密字符串的加密后的每个字符
    strCharList = str.split(splitStr);
    for ( let i=0; i<strCharList.length; i++ ) {
        // 将加密后的每个字符转成加密后的ascll码
        let charCode = parseInt(strCharList[i], hex);
        // 异或解密出原字符的ascll码
        charCode = (charCode * 1) ^ xor;
        let strChar = String.fromCharCode(charCode);
        resultList.push(strChar);
    }
    let resultStr = resultList.join('');
    return resultStr;
}
// @author lyb 2017-11-28 16:24:44  end

export {
    bind,
    addActive,
    formatDate,
    formatMoney,
    formatUnit,
    formatSupplyShape,
    formatProduceShape,
    formatSupplyType,
    setBackgroundImage,
    formatBgPic,
    setDataId,
    getQueryString,
    c,
    formatPicUrl,
    formatPhone,
    checkAndroid,
    getDateDiff,
    formatUserName,
    blackTip,
    // @author lyb 2017-11-28 16:25:01
    encrypto,
    decrypto
    // end
};
