/**
 * @author hbmu
 * @date   2015/4/17
 *
 * @name   LocalStore
 * @desc   AbstractStore的子类
 * @examples
 * var store = new AbstractStore({
 *   proxy: window.localStore, // 默认值
 *   key: 'USER'
 * })
 */
define(['common', 'AbstractStore'], function (c, AbstractStore) {
	"use strict";

	var
		LocalStore = c.baseClass(function (options) {
			this.options = c.extend(this.options, {
				proxy: window.localStorage
			}, options)
		}, AbstractStore);

	return LocalStore;
});