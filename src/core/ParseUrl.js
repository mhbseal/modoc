/**
 * @author hbmu
 * @date   2014/11/7
 *
 * @name   ParseUrl
 * @desc   解析url
 *
 * @examples
 * define(['ParseUrl'], function(ParseUrl) { ... })
 *
 * @more   url注解
 * =====================================================================
 *
 * http://username:password&#64;www.example.com:80/path/file.name?query=string#anchor
 * |__|   |______| |______| |_____________||_||___||________||___________||_____|
 *  |        |        |            |       |   |         |         |        |
 * protocol user   password      host  port directory  file      query   anchor
 *       |_______________|                   |_____________|
 *               |                                 |
 *            userInfo                           path
 *      |___________________________________||_________________________________|
 *                        |                                   |
 *                    authority                          relative
 * |___________________________________________________________________________|
 *                                         |
 *                                       source
 *
 * =====================================================================
 */
define(function () {
	"use strict";

	var
		names = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
		// 匹配正则来自https://github.com/allmarkedup/purl/blob/master/purl.js中parser.loose
		rUrl = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;


  /**
   * @name    ParseUrl
   * @desc    构造函数
   * @grammar new ParseUrl(url)
   *
   * @param   {string} 默认为location.href
   *
   * @examples
   * var parseUrl = new ParseUrl('http://username:password&#64;www.example.com:80/path/file.name?query=string#anchor');
   */
	function ParseUrl(url) {
		if (!url) url = window.location.href;

		var
			resources = rUrl.exec(url),
			result = this.result = {Attr: {}, Param: {}},
			query, i = 14;

		while (i--) result.Attr[names[i]] = resources[i] || '';

		if (query = result.Attr['query']) {
			query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function ($0, $1, $2) {
				if ($1) result.Param[$1] = $2;
			});
		};
	};

	/**
   * @name    getAttr
	 * @desc    读取url中的attr,name为空,则返回所有attr.
   * @grammar parseUrl.getAttr([name])
   *
	 * @param   {string} name,可选 范围"source", "protocol", "authority", "userInfo", "user",
   * "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"
	 * @returns {string} value
   *
   * @examples
   * parseUrl.getAttr('port') => '80'
	 */
	ParseUrl.prototype.getAttr = function(name) {
		var attrs = this.result.Attr;
		return name ? attrs[name] : attrs;
	};

	/**
   * @name    getParam
	 * @desc    读取url中的param,name为空,则返回所有param.
   * @grammar parseUrl.getParam([name])
   *
	 * @param   {string} name
	 * @returns {string} value
   *
   * @examples
   * parseUrl.getParam('query') => 'string'
	 */
	ParseUrl.prototype.getParam = function(name) {
		var params = this.result.Param;
		return name ? params[name] : params;
	};

	return ParseUrl;
});