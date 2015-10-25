/**
 * AbstractStore的子类
 *
 * @author hbmu
 * @date   2015/4/17
 *
 * @name   LocalStore
 * @example
 * var store = new AbstractStore({
 *   key: 'USER'
 * })
 */
define(['common', 'AbstractStore'], function (c, AbstractStore) {
	"use strict";

	var
		LocalStore = c.baseClass(function (options) {
      c.extend(this.options, options, {
        storage: window.localStorage
      })

      this.init();
		}, AbstractStore);

	return LocalStore;
});