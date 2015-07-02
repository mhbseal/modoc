/**
 * @author hbmu
 * @date   2015/4/17
 *
 * @name   SessionStore
 * @desc   AbstractStore的子类
 * @examples
 * var store = new AbstractStore({
 *   proxy: window.sessionStore, // 默认值
 *   key: 'USER'
 * })
 */
define(['common', 'AbstractStore'], function (c, AbstractStore) {
	"use strict";

	var
		SessionStore = c.baseClass(function (options) {
			this.options = c.extend(this.options, {
				proxy: window.sessionStorage
			}, options)
		}, AbstractStore);

	return SessionStore;
});