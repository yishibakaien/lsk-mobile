// create by cloud_cb on 2017/04/14.

'use strict';

var TIP_ID = '_blackTip_';
var STATE_HIDE = 0;
var STATE_SHOW = 1;

var id = 0;

function _getId() {
    return ++id;
}

function BlackTip(config) {
    this.defaults = {
        text: '',
        type: 'loading',
        time: 1500,
        mask: false,
        zIndex: 999,
        complete: null
    };
    this.timer = null;
    this._init(config);
}

BlackTip.prototype._init = function(config) {
    this.eleId = _getId();
    
    if (typeof config !== 'object') {
        return;
    }

    for (var key in config) {
        if (!config.hasOwnProperty(key)) {
            continue;
        }
        this.defaults[key] = config[key];
    }

    if (!document.getElementById(TIP_ID + 'style')) {
        this._insertStyle();
    }

    this._createDom();

    this.timer = setTimeout(function() {
        this.hide();
        if (typeof this.defaults.complete === 'function') {
            this.defaults.complete();
        }
    }.bind(this), this.defaults.time);
};

BlackTip.prototype.set = function() {
    switch (this.defaults.type) {
    case 'default':
        this.icon.style.display = 'none';
        break;
    case 'info':
        this.icon.innerText = '!';
        this.icon.className += ' info';
        break;
    case 'success':
        // this.icon.innerText = '√';
        this.icon.className += ' success';
        break;
    case 'loading':
        this.icon.className += ' loading';
        break;
    default:
        this.icon.style.display = 'none';
        break;
    }
    if (this.defaults.text) {
        this.text.innerText = this.defaults.text;
    } else {
        this.text.display = 'none';
    }
    if (this.defaults.zIndex) {
        this.blackTip.style.zIndex = this.defaults.zIndex;
    }
    this.show();
};

BlackTip.prototype.show = function() {
    this.state = STATE_SHOW;
    document.body.appendChild(this.blackTip);
};

BlackTip.prototype.hide = function() {
    this.blackTip.style.display = 'none';
    this.state = STATE_HIDE;
};

BlackTip.prototype.remove = function() {
    document.body.removeChild(this.blackTip);

    // console.log(window[TIP_ID + this.eleId]);
    try {
        delete window[TIP_ID + this.eleId];
    } catch (e) {
        console.log(e);
    }
    // console.info(window[TIP_ID + this.eleId]);
    this.timer = null;
    clearTimeout(this.timer);
};

BlackTip.prototype._createDom = function() {
    this.blackTip = window[TIP_ID + this.eleId] = document.createElement('div', TIP_ID + this.eleId);
    this.state = STATE_SHOW;

    this.blackTip.className = TIP_ID;

    this.icon = document.createElement('div');
    this.icon.className = 'icon';

    this.text = document.createElement('p');
    this.text.className = 'text';

    this.blackTip.appendChild(this.icon);
    this.blackTip.appendChild(this.text);

    this.set();
};

BlackTip.prototype._insertStyle = function() {
    this.style = document.createElement('style');
    this.style.id = TIP_ID + 'style';
    this.style.innerText = '._blackTip_{margin:0;padding:0;line-height:1.6;position:fixed;z-index:5000;width:7.6em;min-height:7.6em;top:180px;left:50%;margin-left:-3.8em;background:rgba(17,17,17,0.7);text-align:center;border-radius:5px;color:#fff;word-break:break-all}._blackTip_ .icon.info{display:inline-block;height:40px;line-height:40px;width:40px;margin-bottom:6px;margin-top:28px;font-size:30px;border-radius:50%;color:rgba(7,17,27,0.8);background-color:#fff}._blackTip_ .icon.loading{display:inline-block;margin-top:30px;width:38px;height:38px;-webkit-animation:blackTipLoading 1s steps(12,end) infinite;animation:blackTipLoading 1s steps(12,end) infinite;background:transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMTIwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgZD0iTTAgMGgxMDB2MTAwSDB6Ii8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTlFOUU5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTMwKSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iIzk4OTY5NyIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgzMCAxMDUuOTggNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjOUI5OTlBIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDYwIDc1Ljk4IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0EzQTFBMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA2NSA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNBQkE5QUEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoMTIwIDU4LjY2IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0IyQjJCMiIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgxNTAgNTQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjQkFCOEI5IiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKDE4MCA1MCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDMkMwQzEiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCA0NS45OCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNDQkNCQ0IiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA0MS4zNCA2NSkiLz48cmVjdCB3aWR0aD0iNyIgaGVpZ2h0PSIyMCIgeD0iNDYuNSIgeT0iNDAiIGZpbGw9IiNEMkQyRDIiIHJ4PSI1IiByeT0iNSIgdHJhbnNmb3JtPSJyb3RhdGUoLTkwIDM1IDY1KSIvPjxyZWN0IHdpZHRoPSI3IiBoZWlnaHQ9IjIwIiB4PSI0Ni41IiB5PSI0MCIgZmlsbD0iI0RBREFEQSIgcng9IjUiIHJ5PSI1IiB0cmFuc2Zvcm09InJvdGF0ZSgtNjAgMjQuMDIgNjUpIi8+PHJlY3Qgd2lkdGg9IjciIGhlaWdodD0iMjAiIHg9IjQ2LjUiIHk9IjQwIiBmaWxsPSIjRTJFMkUyIiByeD0iNSIgcnk9IjUiIHRyYW5zZm9ybT0icm90YXRlKC0zMCAtNS45OCA2NSkiLz48L3N2Zz4=) no-repeat;background-size:100%}._blackTip_ .icon.success{display:inline-block;margin:22px 0 -5px 0;width:52px;height:52px;background:transparent url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGMAAABHCAYAAAATBvm1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTQ1NTJEN0UzODc4MTFFNzk2QzBDNzMwNjc2MjQxMzciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTQ1NTJEN0YzODc4MTFFNzk2QzBDNzMwNjc2MjQxMzciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5NDU1MkQ3QzM4NzgxMUU3OTZDMEM3MzA2NzYyNDEzNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5NDU1MkQ3RDM4NzgxMUU3OTZDMEM3MzA2NzYyNDEzNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoJXkggAAAOkSURBVHja7Jw/aBRBFMb34on/AuqBBLTwMCaIESwESRCE2IgIEQvR2GljoY2VTSptgoWgIHbBKoWNoGCIBtFCYmEKBVGDiGAUBU0gakQNWb8HL7gcd7nc7tuZt3vvg4+FI2Rn3u92vp3ZnQsCk1OFYbjou/BL+ATcSp+Z3ILYCL8L/2se/gk/JxgrrETOQOzEYRLeFPm4BZ6D/8BFq5KbYelYuLR+wffsykgXRAGHQfhqnT+lq+KbVSw9ECvhkXD5sqI5Cup6emYB7i6ol9IE3AMvWPXcBnWlxmk4s+oJBzU82CCIh7CNTJ6D2kAoCWoDkVZQ82StEY0YCP9BTboNt1gF/Qa1gVAS1AZCSVCThg2E/6AmDfFCocljUBsIJUFtIJQENem6gfAf1KQr9kzCf1AbCCVBbSCUBDXpkoHwH9SkAQPhP6gNhJKgNhBKgpp0XgWIyAu7zRjUpLNq+p5VGAJB7Q8EPRaE2ypPnkUYAkHtHgROtg2+DN+HH3EjLkTXWbIGQyCoSadcg1jPD0EW4L8VjRmD1zRhUJP6nX/xcMIeeJZhVNMM3NFEQe0HBHfgADdgtk4DT2seooSC2h8I7kQfb2dajm5pfDdUKKhJR7x+4XDy3gYbPAVvzllQkw5p6MwG+GuMxvf5/BYJBrUOEJFOPY7ZiRs+XlcUDGo9ICIw+hN0hvYylzIY1KT9Gu/LyWcSdIrmJ/vSHrYEg5rUrXmiFPDUP4kupvV2hGBQ6wVRBcpAwo4+gdcpDepsgBAG8h3epSyoSbuzuP4f8FsPSXUu7rAlHNSkriCrYiDXBIpwB17lMaizDaJimBgSKMYXeKuHoM4HiAogw0KFOV7r9jeFoKbb7fYgb6INH7wDR0I34WLKQU0gykFexUDGhIpFeVDm/1mCRw1EEBQaBELrUA/gXqX9mYc7CoXC+9zDYCA0xDyF9yjryxyD+JTV0Sf2HACHcUVACEQ7QHzOchTEXkfiucMLuNNAyCj2tlh0/jcOtLwwaSA8XxmRK6QVh9fwFsdtn+aMmM7LHavIcjcDeQu3OQSxHSBm8jR9EHv2QOtJDKRkIDzDYCAE4gO81kA4DPAaoU7FaudgldZHuJxXEOJXRuQKoTCnWXBREMQOgPgRmGIBKVd5kTqOpvgGwZQQSKeB0AWkKyaIN/Bqq6A8kL0GQheQbgOhC8hBA6ELyOEaICbsd8HdwyCfhF9FQIzy1gQrkCcgi/sJj0Z30jYzkH8CDACzAKL6kyfM1wAAAABJRU5ErkJggg==) no-repeat;background-size:100%;background-position:center}._blackTip_ .text{margin:0;padding:0 12px}@keyframes blackTipLoading{0%{transform:rotate3d(0,0,1,0deg)}100%{transform:rotate3d(0,0,1,360deg)}}@-webkit-keyframes blackTipLoading{0%{-webkit-transform:rotate3d(0,0,1,0deg)}100%{-webkit-transform:rotate3d(0,0,1,360deg)}}';
    document.head.appendChild(this.style);
};

module.exports = function(obj) {
    return new BlackTip(obj);
};
