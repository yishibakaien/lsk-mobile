require('common/styles/index.styl');
require('./publish_supply.styl');

var preview = document.getElementById('preview');
var browse = document.getElementById('browse');
browse.onchange = function () {
    var files = browse.files;
    console.log(111);
    function readAndPreview(file) {
        if ( /\.(jpe?g|png|gif)$/i.test(file.name)) {
            var reader = new FileReader();
            reader.addEventListener("load", function () {
                var image = new Image();
                console.log(222);
                image.height = 100;
                image.title = file.name;
                image.src = this.result;
                preview.appendChild( image );
            }, false);
            reader.readAsDataURL(file);
        }
    }
    if (files) {
        [].forEach.call(files, readAndPreview);
    }
}