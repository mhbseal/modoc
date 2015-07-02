/**
 * @author hbmu
 * @date   2014/09/12
 *
 * @name   Cookie
 * @desc   操作cookie的方法
 *
 * @examples
 * define(['Cookie'], function(Cookie) { ... })
 */
define(['common', 'es5'], function(c, es5) {
	"use strict";

	function encode(str, isRaw) {
		return isRaw ? str : encodeURIComponent(str);
	};
	function decode(str, isRaw) {
		return isRaw ? str : decodeURIComponent(str);
	};
	function stringifyCookie(obj, isJson) {
		return encode(isJson ? JSON.stringify(obj) : String(obj));
	};
	function parseCookie(str, isJson) {
		return isJson ? JSON.parse(decode(str)) : decode(str);
	};

	/**
   * @name Cookie
	 * @desc 构造函数
   * @grammar new Cookie(options)
   *
	 * @param {object} options
	 *   - isRaw {boolean} 是否原生字符（不转码）, 默认为false
	 *   - isJson {boolean} 是否str->json, 默认为false
   *
   * @examples
   * var cookie = new Cookie();
	 */
	function Cookie(options) {
		this.options = c.extend({
			isRaw: false,
			isJson: false
		}, options);
	};

  /**
   * @name  set
   * @desc  设置cookie
   * @grammar cookie.set(name, value[, options])
   *
   * @param {string} name
   * @param {*} value
   * @param {obj} options
   *   - expires {number|string} 失效时长,单位 ‘天’, 默认为Session
   *   - path    {string} 路径,path只能设置当前path的子path, 默认为当前path
   *   - domain  {string} 域,domain只能设置当前domain的子domain, 默认为当前domain
   *   - secure  {boolean} 安全策略,只有https下能设置 ture or false, 默认为false
   *
   * @examples
   * cookie.set('user', 'mo')
   */
  Cookie.prototype.set = function(name, value, options) {
    var
      options = options || {},
      expires = new Date();

    if(options.expires) expires.setTime(+expires + +options.expires * 864e+5);

    document.cookie = [
      encode(name), '=', stringifyCookie(value),
      options.expires ? '; expires=' + expires : '', // use expires attribute, max-age is not supported by IE
      options.path    ? '; path=' + options.path : '',
      options.domain  ? '; domain=' + options.domain : '',
      options.secure  ? '; secure' : ''
    ].join('');
  };

	/**
   * @name    get
	 * @desc    读取cookie
   * @grammar cookie.get(name)
   *
	 * @param   {string} cookie的name
	 * @returns {*} cookie的value
   *
   * @examples
   * cookie.get('user')
	 */
	Cookie.prototype.get = function(name) {
		var
			cookieStr = document.cookie,
			cookies = cookieStr ? cookieStr.split('; ') : [],
			result = null;

		es5.each(cookies, function(cookie) {
			var
				parts = cookie.split('='),
				key = decode(parts[0], this.isRaw);

			if (name === key) {
				result = parseCookie(parts[1], this.isJson);
				return false;
			}
		}, this)

		return result;
	};

	/**
   * @name  remove
   * @desc  删除cookie
   * @grammar cookie.remove(name)
   *
	 * @param {string} cookie的name
   *
   * @examples
   * cookie.remove('user')
	 */
	Cookie.prototype.remove = function(name) {
		this.set(name, '', {expires: -1});
	};

	return Cookie;
});