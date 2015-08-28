/**
 * 一些底层的方法
 *
 * @author hbmu
 * @date   2015/2/3
 *
 * @name   common
 * @example
 * define(['common'], function(c) { ... })
 */
define(function () {
	"use strict";

	var
		common = {},
		class2type = {},
		Ctor = function() {},
		ArrayProto = Array.prototype,
		StrProto = String.prototype,
		ObjProto = Object.prototype,
		nativeTrim = StrProto.trim,
    nativeKeys = Object.keys,
		toString = ObjProto.toString,
		hasOwn = ObjProto.hasOwnProperty,
		nativeCreate = Object.create,
		nativeIsArray = ArrayProto.isArray,
		rWord = /[^,| ]+/g,
		// 在<IE9下，不枚举的bug
		hasEnumBug = !{toString: null}.propertyIsEnumerable('toString'),
		nonEnumerableProps = ['toString',	'toLocaleString', 'valueOf', 'hasOwnProperty',	'isPrototypeOf', 'propertyIsEnumerable', 'constructor']; // 分隔符正则

	// 判断数据类型基础方法
	function type(obj) {
		return typeof obj === 'object' || typeof obj === 'function' ? class2type[toString.call(obj)] : typeof obj;
	};

	'Boolean Number String Function Date RegExp Object'.replace(rWord, function(name) {
		var lowerName = name.toLowerCase();
		class2type['[object ' + name + ']'] = lowerName; // for common.type method
		common['is' + name] = function(obj) {
			return type(obj) === lowerName;
		};
	});

  /**
   * 判断是否是非继承属性
   *
   * @name has
   * @grammar c.has(obj, key)
   */
	common.has = function(obj, key) {
		return hasOwn.call(obj, key);
	};

	/**
   * 兼容 IE8- 下有些不枚举的属性，例如'toString',	'toLocaleString', 'valueOf', 'hasOwnProperty',	'isPrototypeOf', 'propertyIsEnumerable', 'constructor'
   *
	 * @param {object} obj
	 * @param {function} iteratee
	 *   - param {*} value
	 *   - param {*} key
	 *   - param {object} forIn的第一个参数obj
	 * @param {object} iteratee的上下文,可选
   *
   * @name    forIn
   * @grammar c.forIn(obj, iteratee[, context])
   * @example
   * c.forIn({a: 1, b: 2, toString: 3}, function(v, k) {
   *   console.log(k + ':' + v) => 依次输出: 'a: 1', 'b: 2', 'toString: 3'
   * })
	 */
	common.forIn = function(obj, cb, context) {
		for (var key in obj) if (cb.call(context, obj[key], key, obj) === false) return; // normal

		if (hasEnumBug) { // nonEnumerableProps
			var
				index = 0,
				len = nonEnumerableProps.length;
			for (; index < len; index++) if (cb.call(context, obj[index], index, obj) === false) return;
		}
	}

	/**
   * 合并对象到第一个obj
   *
	 * @param   {boolean} 是否深度复制,可选
	 * @param   {object|array} 目标对象
	 * @param.. {object|array} 需要extend的对象,可多个参数
	 * @return  {object|array} extend后的object
   *
   * @name    extend
   * @grammar c.extend([isDeep,] obj1, obj2, obj3...)
   * @example
   * c.extend({a: 1}, {b: 2}, {c: 3}) => {a: 1, b: 2, c: 3}
   * // 浅拷贝
   * c.extend({a: {b: 1}}, {a: {c: 2}}) => {a: {c: 2}}
   * // 深度拷贝
   * c.extend(true, {a: {b: 1}}, {a: {c: 2}}) => {a: {b: 1, c: 2}}
	 */
	common.extend = function() {
		var
			src, source, deep, srcType, copyType, clone, copyIsArray,
			index = 1,
			args = arguments,
			len = args.length,
			target = args[0];

		// 校正参数
		deep = typeof target === 'boolean';
		if (deep) {
			index++;
			target = args[1];
		}

		// 如果只有一个参数,直接合并到调用的对象上
		if (index === len) {
			target = this;
			index--;
		}

		for (; index < len; index++) {
			source = arguments[index]; // 需要extend的参数

			if (source != null) {
				this.forIn(source, function(copy, prop) {
					src = target[prop];

					// 防止循环引用
					if (target === copy) {
						return false;
					}

					if (deep && (copyType = copy && type(copy)) && (copyType === 'object' && this.has(source, prop) || (copyIsArray = copyType === 'array'))) { // 深拷贝
            srcType = src && type(src);
            if (copyIsArray) {
              copyIsArray = false;
              clone = srcType === 'object' ? src : [];
            } else {
              clone = srcType === 'array' ? src : {};
            }
						target[prop] = this.extend(deep, clone, copy);
					} else { // 浅拷贝
						if (copy !== undefined) {
							target[prop] = copy;
						}
					}
				}, this)
			}
		}

		return target;
	};

	common.extend({
    /**
     * 判断对象的类型
     *
     * @name    type
     * @grammar c.type(*)
     * @example
     * c.type({a: 1}) => 'object'
     * c.type('mo.js') => 'string'
     * c.type(2) => 'number'
     */
		type: function(obj) {
			if (obj == null) {
				return obj + '';
			}
			return type(obj);
		},
    /**
     * 是否是Boolean类型
     *
     * @name isBoolean
     * @grammar c.isBoolean(*)
     */
    /**
     * 是否是Number类型
     *
     * @name isNumber
     * @grammar c.isNumber(*)
     */
    /**
     * 是否是String类型
     *
     * @name isString
     * @grammar c.isString(*)
     */
    /**
     * 是否是Function类型
     *
     * @name isFunction
     * @grammar c.isFunction(*)
     */
    /**
     * 是否是Date类型
     *
     * @name isDate
     * @grammar c.isDate(*)
     */
    /**
     * 是否是RegExp类型
     *
     * @name isRegExp
     * @grammar c.isRegExp(*)
     */
    /**
     * 是否是Object类型
     *
     * @name isObject
     * @grammar c.isObject(*)
     */
    /**
     * 是否是数组
     *
     * @name isArray
     * @grammar c.isArray(*)
     */
		isArray: nativeIsArray || function(obj) {
			return type(obj) === 'array';
		},
    /**
     * 是否是类数组, 例如nodelist,arguments,具有length并且keys为0.1.2...的obj
     *
     * @name    isArraylike
     * @grammar c.isArraylike(*)
     */
    isArraylike: function(obj) {
      var
        len = obj.length,
        type = this.type(obj);

      return !!len || type === 'array' || typeof len === 'number' && len > 0 && (len - 1) in obj || len === 0;
    },
    /**
     * 判断是否为NaN
     *
     * @name isNaN
     * @grammar c.isNaN(*)
     */
    isNaN: function(obj) {
      return obj === undefined ? false : isNaN(obj);
    },
    /**
     * 返回obj的长度
     *
     * @name size
     * @grammar c.size(obj)
     */
		size: function(obj) {
			if (obj == null) return 0;
			return this.isArraylike(obj) ? obj.length : this.keys(obj).length;
		},
    /**
     * 去掉字符串前后的空
     * @name    trim
     * @grammar c.trim(text)
     */
    trim: function(text) {
      if (nativeTrim) return nativeTrim.call(text);

      text.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    },
    /**
     * 获取对象的key集合
     *
     * @name keys
     * @grammar c.keys(obj)
     */
    keys: function(obj) {
      var
        keys;
      if (nativeKeys) return nativeKeys(obj);
      keys = [];

      this.forIn(obj, function(value, key) {
        if (this.has(obj, key)) keys.push(key);
      })

      return keys;
    },
    /**
     * 当前时间戳
     *
     * @name    now
     * @grammar c.now()
     */
    now: Date.now || function() {
      return +new Date();
    },
    /**
     * 同console.log()
     *
     * @name log
     * @grammar c.log(*)
     */
    log: function() {
      window.console && Function.apply.call(console.log, console, arguments);
    },
    /**
     * 同Objec.create(prototype)
     *
     * @param  {object} prototype
     * @return {object} 原型为参数prototype的对象
     *
     * @name    baseCreate
     * @grammar c.baseCreate(prototype)
     * @example
     * c.prototype({a: function(){}, b: function() {}})
     */
    baseCreate: function(prototype) {
      if (!this.isObject(prototype)) return {};
      if (nativeCreate) return nativeCreate(prototype);
      Ctor.prototype = prototype;
      var result = new Ctor;
      Ctor.prototype = null;
      return result;
    },
		/**
     * 创建一个构造函数(继承、原型方法都可选,继承可以通过新构造函数的superCtor访问父级构造函数)
     *
		 * @param  {function} (子级)构造函数
		 * @param  {object} 原型的方法集，可选
		 * @param  {function} 父级构造函数，可选
		 * @return {function} 新的构造函数
     *
     * @name    baseClass
     * @grammar c.baseClass(subCtor, prototypes, superCtor)
     * @example
     * c.baseClass(A, {a: function() {}, b: function(){}}, B) => A继承B,并且prototype上添加方法a和b
     * c.baseClass(A, {a: function() {}, b: function(){}}) => A的prototype上添加方法a和b
     * c.baseClass(A, B) => A继承B
		 */
		baseClass: function(subCtor, prototypes, superCtor) {
			var
				noProtos = typeof arguments[1] !== 'object',
				Ctor, isInherit;

			// 参数校正
			if (noProtos) superCtor = prototypes;
			// 是否是调用继承
			isInherit = superCtor != null;

			// 输出的构造函数
			Ctor = function() {
				if (arguments.length) {
					isInherit && superCtor.apply(this, arguments);
					subCtor.apply(this, arguments);
				} else {
					isInherit && superCtor.call(this);
					subCtor.call(this);
				}
			};

			// subCtor继承superCtor的prototypes
			if (isInherit) {
				Ctor.superCtor = superCtor;
				Ctor.prototype = common.baseCreate(superCtor.prototype);
				Ctor.prototype.constructor = Ctor;
			}

			// 自定义的prototypes
      common.forIn(prototypes, function(prototype, name) {
				Ctor.prototype[name] = prototype;
			})

			return Ctor;
		}
	});

	return common;
});