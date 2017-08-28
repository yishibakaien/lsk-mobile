/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var loaderUtils = require("loader-utils");

module.exports = function(content) {
	this.cacheable && this.cacheable();
	if(!this.emitFile) throw new Error("emitFile is required from module system");
	var query = loaderUtils.parseQuery(this.query);
	var url = loaderUtils.interpolateName(this, query.name || "[hash].[ext]", {
		context: query.context || this.options.context,
		content: content,
		regExp: query.regExp
	});
	// ****** 2017年6月3日14:55:19 hack by cloud_cb 
	// https://github.com/webpack/webpack/issues/1370
	var to = (query.to) && loaderUtils.interpolateName(this, query.to, {
        context: query.context || this.options.context,
        content: content,
        regExp: query.regExp
    });
	// ***** 2017年6月3日14:55:19 hack by cloud_cb
	// https://github.com/webpack/webpack/issues/1370
	this.emitFile((to) ? to : url, content);
	
	// this.emitFile(url, content);
	return "module.exports = __webpack_public_path__ + " + JSON.stringify(url) + ";";
}
module.exports.raw = true;
