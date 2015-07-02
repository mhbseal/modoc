/**
 * @author hbmu
 * @date   2015/2/3
 *
 * @name   es5
 * @desc   es5 polyfill or shim. 其中each,map,filter,some,every可以应用到类数组,对象. indexOf,lastIndexOf,reduce,reduceRight可以应用到类数组.
 *
 * @examples
 * define(['es5'], function(date) { ... })
 */
define(['common'], function (c) {
	"use strict";

	var
		es5 = {},
		// 原型
		ArrayProto = Array.prototype,
		FuncProto = Function.prototype,
		// 原型方法
		slice = ArrayProto.slice,
		nativeBind = FuncProto.bind;

	// for reduce, reduceRight
	function createReduce(dir) {
		return function(array, cb, memo, context) {

			var
				len = array.length,
				index = dir > 0 ? 0 : len - 1;

			if(arguments.length < 3) { // 如果不存在memo,则把array[index]赋值给memo,并且跳过index这次iteratee
				memo = array[index];
				index += dir;
			}

			for (; index >= 0 && index < len; index += dir) {
				memo = cb.call(context, memo, array[index], index, array);
			}

			return memo;
		}
	};


	es5 = {
		/**
     * @name    each
		 * @desc    遍历类数组或者对象,如果想终止循环return false即可
     * @grammar es5.each(obj, iteratee[, context])
     *
		 * @param   {arraylike|object} 类数组或者对象
		 * @param   {function} 迭代函数
		 *   - param {*} value
		 *   - param {*} index|key
		 *   - param {array|object} each的第一个参数
		 * @param   {object} iteratee的上下文,可选
		 */
		each: function(obj, cb, context) {
			var
				index = 0,
				len = obj.length;

			if (c.isArraylike(obj)) { // 类数组
				for (; index < len; index++) if (cb.call(context, obj[index], index, obj) === false) break; //执行并且判断返回是否为false,如果false则终止循环
			} else { // 对象
				c.forIn(obj, function(value, key) {
					if (c.has(obj, key) && cb.call(context, value, key, obj) === false) return false;
				})
			}
		},
		/**
     * @name    map
		 * @desc    遍历类数组或者对象,返回一个新数组(obj执行iteratee后的返回值的集合)
     * @grammar es5.map(obj, iteratee[, context])
     *
		 * @param   {arraylike|object} 类数组或者对象
		 * @param   {function} 迭代函数
		 *   - param {*} value
		 *   - param {*} index/key
		 *   - param {array|object} map的第一个参数
		 * @param   {object} iteratee的上下文,可选
		 * @returns {array} 结果
		 */
		map: function(obj, cb, context) {
			var results = [];

			this.each(obj, function(value, index, obj) {
				results.push(cb.call(context, value, index, obj))
			});

			return results;
		},
		/**
     * @name filter
		 * @desc 遍历类数组或者对象,返回一个新数组(obj执行iteratee后返回值为真的obj的元素的集合),其他同map
		 */
		filter: function(obj, cb, context) {
			var results = [];

			this.each(obj, function(value, index, obj) {
				cb.call(context, value, index, obj) && results.push(value)
			});

			return results;
		},
		/**
     * @name some
		 * @desc 遍历类数组或者对象,obj执行iteratee后返回值如果有一个为真,则返回true,否则返回false,其他同map
		 */
		some: function(obj, cb, context) {
			var result = false;

			this.each(obj, function(value, index, obj) {
				if(cb.call(context, value, index, obj) === true) {
					result = true;
					return false;
				}
			});

			return result;
		},
		/**
		 * @name every
     * @desc 遍历类数组或者对象,obj执行iteratee后返回值如果全为真,则返回true,否则返回false,其他同map
		 */
		every: function(obj, cb, context) {
			var result = true;

			this.each(obj, function(value, index, obj) {
				if(cb.call(context, value, index, obj) === false) {
					return (result = false);
				}
			});

			return result;
		},
		/**
		 * @name    indexOf
     * @desc    返回item在arraylike中的索引值(从0开始找),如果item不存在arraylike中就返回-1,原生不支持NaN
     * @grammar es5.indexOf(array, item[, from])
     *
		 * @param   {arraylike} 需要查找的类数组
		 * @param   {*} 需要查找的元素
		 * @param   {number} 开始索引,可选
		 * @returns {number} 查找到元素的索引值
		 */
		indexOf: function(array, item, from) {
			var
				index = 0,
				len = array.length;

			if (typeof from === 'number') {
				index = from < 0 ? Math.max(0, len + from) : from;
			}

			if (item !== item) { // 查找NaN(注：原生indexOf不能查找出NaN)
				for (; index < len; index++) if (c.isNaN(array[index])) return index;
			} else {
				for (; index < len; index++) if (array[index] === item) return index;
			}

			return -1;
		},
		/**
		 * @name    lastIndexOf
     * @desc    同indexOf,区别是从arraylike的末尾开始(从右到左)
		 */
		lastIndexOf: function(array, item, from) {
			var index = array ? array.length : 0;

			if (typeof from == 'number') {
				index = from < 0 ? index + from + 1 : Math.min(index, from + 1);
			}

			if (item !== item) {
				while (--index >= 0) if (c.isNaN(array[index])) return index;
			} else {
				while (--index >= 0) if (array[index] === item) return index;
			}

			return -1;
		},
		/**
		 * @name    bind
     * @desc    函数绑定
     * @grammar es5.bind(func, context[, arg1] [, arg2...])
     *
		 * @param   {function} 需要绑定上下文或者是添加参数的函数
		 * @param   {object} func的上下文
		 * @param.. {*} 需要添加的n个参数
		 * @returns {function} 绑定上下文或者是添加参数后函数
		 */
		bind: function(func, context) {
			if (nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
			if (!c.isFunction(func)) throw new TypeError('Bind must be called on a function');
			// bind返回的函数应用分为普通函数和构造函数,如果以构造函数应用,则以构造函数原型创建的对象的实例为上下文,如果apply后,返回对象不是Object,则返回构造函数原型创建的对象
			var
				args = slice.call(arguments, 2),
				executeBound = function(bound, args) {
					var
						self = c.baseCreate(func.prototype),
						retult = func.apply(func instanceof bound ? self : context, args);

					return c.isObject(retult) ? retult : self;
				},
				bound = function() {
					return executeBound(bound, args.concat(slice.call(arguments)));
				};

			return bound;
		},
		/**
		 * @name    reduce
     * @desc    接收一个函数作为累加器,类数组中的每个值从左到右开始缩减，最终为一个值
     * @grammar es5.reduce(arraylike, iteratee[, memo][, context])
     *
     * @param {arraylike} 类数组
     * @param {function} 迭代函数
     *   - param {*} previousValue
     *   - param {*} currentValue
     *   - param {*} index/key
     *   - param {array|object} reduce的第一个参数
     * @param {*} 可选,作为第一次调用iteratee的第一个参数,如果不存在,则把第一次要iteratee的value复制给memo,并且跳过index这次iteratee
     * @param {object} iteratee的上下文,可选
		 */
		reduce: createReduce(1),
		/**
		 * @name    reduceRight
     * @desc    同reduce,区别是从类数组的末尾开始(从右到左)
		 */
		reduceRight: createReduce(-1)
	};

	return es5;
});