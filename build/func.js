'use strict';
const path = require('path');
const glob = require('glob');

/**
 * 读取文件目录，获取文件名，路径等信息
 * @param  {String} filePath 文件路径
 * @return {Array}           文件路径及文件名信息集合
 */
function getEntries(filePath) {
    let files = glob.sync(filePath);
    let basename = [],
        extname;
    for (let item of files) {
        extname = path.extname(item);
        basename.push({
            basename: path.basename(item, extname),
            path: item
        });
    }
    return basename;
}

module.exports = {
    getEntries
}