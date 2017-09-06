export function TEXT_SEARCH() {
    var searchTextIpt = document.querySelector('#searchTextIpt');
    var form = document.querySelector('form');
    // var searchParamas = {};
    form.onsubmit = function(e) {
        e.preventDefault();
        location.href = './text_search_result.html?keywords=' + searchTextIpt.value;
    };
}