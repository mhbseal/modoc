/**
 * AbstractStore的子类
 *
 * @author hbmu
 * @date   2015/4/17
 *
 * @name   SessionStore
 * @example
 * var store = new AbstractStore({
 *   key: 'USER'
 * })
 */
define(['common', 'AbstractStore'], function (c, AbstractStore) {
	"use strict";

	var
		SessionStore = c.baseClass(function (options) {
			c.extend(this.options, options, {
        proxy: window.sessionStorage
      })

      this.init();
		}, AbstractStore);

	return SessionStore;
});