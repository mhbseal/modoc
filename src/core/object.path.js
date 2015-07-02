/**
 * @author hbmu
 * @date   2014/4/13
 *
 * @name   objectPath
 * @desc   读取或设置object path下的value
 *
 * @examples
 * define(['objectPath'], function(objectPath) {
 *   var obj = {
 *      a: {
 *        b: {
 *          c: 'mo.js'
 *        }
 *      }
 *   }
 * })
 */
define(function () {
	"use strict";

	var objectPath = {
		/**
     * @name    set
		 * @desc    设置object path下的value
     * @grammar objectPath.set(obj, path, value)
     *
		 * @param   {object} obj
		 * @param   {string} path
		 * @param   {*} value
		 * @returns {boolean} 成功true,失败false
     *
     * @examples
     * objectPath.set(obj, 'a.d', 'mo.js') => obj.a.d = 'mo.js'
     * objectPath.set(obj, 'a.b.e', 'mo.js') => obj.a.b.e = 'mo.js'
		 */
		set: function (obj, path, value) {
			if (!obj || !path) return false;

			var
				pathArr = path.split('.'),
				i = 0,
				len = pathArr.length;

			while(i < len - 1) { // 遍历 .
				var key = pathArr[i];
				if(obj[key] == null) obj[key] = {};
				if(typeof obj[key] !== 'object') return false; // 如果遍历到的value不是object、undefined、null则放弃操作
				obj = obj[key];
				i++;
			}

			if (value != null) {
				obj[pathArr[i]] = value;
			} else {
				delete obj[pathArr[i]];
			}

			return true;
		},
		/**
     * @name    get
		 * @desc    读取object path下的value
     * @grammar objectPath.set(obj, path)
     *
		 * @param   {object} obj
		 * @param   {string} path
		 * @returns {*} value
     *
     * @examples
     * objectPath.get(obj, 'a.b.e') => 'mo.js'
		 */
		get: function (obj, path) {
			if (!obj || !path) return null;

			var
				pathArr = path.split('.'),
				i = 0,
				len = pathArr.length;

			while(i < len) { // 遍历 .
				if ((obj = obj[pathArr[i++]]) == null) return null;
			}

			return obj;
		}
	}

	return objectPath;
});