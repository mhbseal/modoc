/**
 * @author hbmu
 * @date   2015/2/3
 *
 * @name   common
 * @desc   一些底层的方法
 *
 * @examples
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
   * @name has
   * @desc 判断是否是非继承属性
   * @grammar c.has(obj, key)
   */
	common.has = function(obj, key) {
		return hasOwn.call(obj, key);
	};

	/**
   * @name    forIn
	 * @desc    兼容 IE8- 下有些不枚举的属性，例如'toString',	'toLocaleString', 'valueOf', 'hasOwnProperty',	'isPrototypeOf', 'propertyIsEnumerable', 'constructor'.
   * @grammar c.forIn(obj, iteratee[, context])
   *
	 * @param   {object} obj
	 * @param   {function} iteratee
	 *   - param {*} value
	 *   - param {*} key
	 *   - param {object} forIn的第一个参数obj
	 * @param   {object} iteratee的上下文,可选
   *
   * @examples
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
   * @name    extend
   * @desc    合并对象到第一个obj
   * @grammar c.extend([isDeep,] obj1, obj2, obj3...)
   *
	 * @param   {boolean} 是否深度复制,可选
	 * @param   {object|array} 目标对象
	 * @param.. {object|array} 需要extend的对象,可多个参数
	 * @returns {object|array} extend后的object
   *
   * @examples
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
     * @name type
     * @desc 判断对象的类型
     * @grammar c.type(*)
     *
     * @examples
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
     * @name isBoolean
     * @desc 是否是Boolean类型
     * @grammar c.isBoolean(*)
     */
    /**
     * @name isNumber
     * @desc 是否是Number类型
     * @grammar c.isNumber(*)
     */
    /**
     * @name isString
     * @desc 是否是String类型
     * @grammar c.isString(*)
     */
    /**
     * @name isFunction
     * @desc 是否是Function类型
     * @grammar c.isFunction(*)
     */
    /**
     * @name isDate
     * @desc 是否是Date类型
     * @grammar c.isDate(*)
     */
    /**
     * @name isRegExp
     * @desc 是否是RegExp类型
     * @grammar c.isRegExp(*)
     */
    /**
     * @name isObject
     * @desc 是否是Object类型
     * @grammar c.isObject(*)
     */
    /**
     * @name isArray
     * @desc 是否是数组
     * @grammar c.isArray(*)
     */
		isArray: nativeIsArray || function(obj) {
			return type(obj) === 'array';
		},
    /**
     * @name    isArraylike
     * @desc    是否是类数组, 例如nodelist,arguments,具有length并且keys为0.1.2...的obj
     * @grammar c.isArraylike(*)
     */
    isArraylike: function(obj) {
      var
        len = obj.length,
        type = this.type(obj);

      return !!len || type === 'array' || typeof len === 'number' && len > 0 && (len - 1) in obj || len === 0;
    },
    /**
     * @name isNaN
     * @desc 判断是否为NaN
     * @grammar c.isNaN(*)
     */
    isNaN: function(obj) {
      return obj === undefined ? false : isNaN(obj);
    },
    /**
     * @name size
     * @desc 返回obj的长度
     * @grammar c.size(obj)
     */
		size: function(obj) {
			if (obj == null) return 0;
			return this.isArraylike(obj) ? obj.length : this.keys(obj).length;
		},
    /**
     * @name    trim
     * @desc    去掉字符串前后的空
     * @grammar c.trim(text)
     */
    trim: function(text) {
      if (nativeTrim) return nativeTrim.call(text);

      text.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    },
    /**
     * @name keys
     * @desc 获取对象的key集合
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
     * @name    now
     * @desc    当前时间戳
     * @grammar c.now()
     */
    now: Date.now || function() {
      return +new Date();
    },
    /**
     * @name log
     * @desc 同console.log()
     * @grammar c.log(*)
     */
    log: function() {
      window.console && Function.apply.call(console.log, console, arguments);
    },
    /**
     * @name baseCreate
     * @desc 同Objec.create(prototype)
     * @grammar c.baseCreate(prototype)
     *
     * @param {object} prototype
     * @returns {object} 原型为参数prototype的对象
     *
     * @examples
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
     * @name    baseClass
     * @desc    创建一个构造函数(继承、原型方法都可选,继承可以通过新构造函数的superCtor访问父级构造函数)
     * @grammar c.baseClass(subCtor, prototypes, superCtor)
     *
		 * @param   {function} (子级)构造函数
		 * @param   {object} 原型的方法集，可选
		 * @param   {function} 父级构造函数，可选
		 * @returns {function} 新的构造函数
     *
     * @examples
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