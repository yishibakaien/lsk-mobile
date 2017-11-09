// 花型搜索
export function TEXT_SEARCH() {
    var searchTextIpt = document.querySelector('#searchTextIpt');
    var form = document.querySelector('form');
    // var searchParamas = {};
    form.onsubmit = function(e) {
        e.preventDefault();
        location.href = './text_search_result.html?keywords=' + searchTextIpt.value;
    };
}
// 商家搜索 暂时调用原ts57接口
export function TEXT_SEARCH_COMPANY() {
    var searchTextIpt = document.querySelector('#searchTextIpt');
    var form = document.querySelector('form');
    // var searchParamas = {};
    form.onsubmit = function(e) {
        e.preventDefault();
        location.href = './text_search_company_result.html?keywords=' + searchTextIpt.value;
    };
}

