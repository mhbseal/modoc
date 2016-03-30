/**
 * webpack打包目前不能暴漏多个模块，并且他的requrie解析是静态的，所以这里暂时把全部模块挂在mo下，然后输出mo
 */
define(function() {
	"use strict";
  return {
    AbstractStorage: require('AbstractStorage'),
    AbstractStore: require('AbstractStore'),
    LocalStore: require('LocalStore'),
    SessionStore: require('SessionStore'),
    common: require('common'),
    Cookie: require('Cookie'),
    date: require('date'),
    es5: require('es5'),
    IdCard: require('IdCard'),
    objectPath: require('objectPath'),
    ParseUrl: require('ParseUrl'),
    pubSub: require('pubSub'),
    rules: require('rules'),
    util: require('util')
  };
});