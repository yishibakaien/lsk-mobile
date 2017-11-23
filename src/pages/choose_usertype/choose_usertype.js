require('common/styles/index.styl');
require('./choose_usertype.styl');

// var aes = require('plugins/aes/mode-ecb');

// import Toast from 'plugins/toast/Toast';

import {
    c
} from 'utils/utils';

(function(){
    var els = c('.usertype-wrapper');
    var userTypeContent = c('.content');
    var next = c('#next');
    var i;
    var userType;
    for (i = 0; i < userTypeContent.length; i++) {
        (function(i) {
            userTypeContent[i].addEventListener('click',  function() {
                userType = this.getAttribute('user-type');
                next.removeAttribute('disabled');
            });
        })(i);
    }
    next.onclick = function () {
        location.href = 'safety_check.html?userType=' + userType;
    };
    addActive(els);

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
})();