/**
 * @author hbmu
 * @date   2015/4/10
 *
 * @name   AbstractStore
 * @desc   store的抽象类,针对storage中的key,一般不使用该类,常用他的子类LocalStore(options.proxy = window.localStorage)、SessionStore(options.proxy = window.sessionStorage)
 *
 * @examples
 * define(['AbstractStore'], function(AbstractStore) { ... })
 */
define(['common', 'objectPath'], function (c, objectPath) {
	"use strict";

	/***
	 * 根据liftTime 计算要增加的毫秒数
	 * @param   {string} liftTime 单位D,H,M,S. eg. '24H'
	 * @returns {number} 根据liftTime计算要增加的毫秒数
	 */
	function getLifeTime(lifeTime) {
		var
			timeout,
			unit = lifeTime.charAt(lifeTime.length - 1),
			num = parseInt(lifeTime);

		unit = typeof unit === 'number' ? 'D' : unit.toUpperCase(); // 如果没有单位，给个默认值 ‘天’

		switch (unit) {
			case 'H': // 小时
				timeout = num * 60 * 60 * 1000;
				break;
			case 'M': // 分钟
				timeout = num * 60 * 1000;
				break;
			case 'S': // 秒
				timeout = num * 1000;
				break;
			default : // 默认为‘天’
				timeout = num * 24 * 60 * 60 * 1000;
		}

		return timeout;
	}

  /**
   * @name    AbstractStore
   * @desc    构造函数
   * @grammar new AbstractStore(options)
   *
   * @param   {object} options
   *   - proxy           {storage} window.localStorage/window.sessionStorage
   *   - key             {string} key
   *   - lifetime        {string} 生命周期,默认'1H' 单位D,H,M,S. eg. '24H'
   *   - rollbackEnabled {boolean} 是否回滚
   * @examples
   * var store = new AbstractStore({
   *   proxy: window.localStorage,
   *   key: 'USER'
   * }))
   */
	var
		AbstractStore = c.baseClass(function (options) {
			this.options = c.extend({
				proxy: null,
				key: null,
				lifeTime: '1H',
				rollbackEnabled: false,
			}, options);

      this.proxy = new AbstractStorage({
        storage: this.proxy
      })
		}, {
			/**
       * @name    set
			 * @desc    设置this.key下的value
       * @grammar store.set(value[, tag][, isOld])
       *
			 * @param   {*} value
			 * @param   {string} 可选,tag标识,如果传递tag,get时会比较tag标识,不一致返回null
			 * @param   {string} 可选,默认false,是否设置回滚数据
			 * @returns {boolean} 成功true,失败false
			 */
			set: function (value, tag, isOld) {
				if (!this.options.rollbackEnabled && isOld) throw 'param rollbackEnabled is false'; // 如果不允许roolback,则不能设置回滚数据
				var timeout = +new Date() + getLifeTime(this.options.lifeTime);
				return this.options.proxy.set(this.options.key, value, tag, timeout, isOld);
			},
			/**
       * @name    setAttr
			 * @desc    设置this.key下的value中name的value
       * @grammar store.setAttr(name, value[, tag][, isOld])
       *
			 * @param   {String} name 支持通过路径的方式，如'a.b.c'
			 * @param   {*} value
			 * @param   {string} 可选,tag标识,如果传递tag,get时会比较tag标识,不一致返回null
			 * @param   {string} 可选,默认false,是否设置回滚数据
			 * @returns {boolean} 成功true,失败false
			 */
			setAttr: function (name, value, tag, isOld) {
				if (!this.options.rollbackEnabled && isOld) throw 'param rollbackEnabled is false'; // 如果不允许roolback,则不能设置回滚数据

				var
					i, objValue;

				// name是object时,遍历name执行setAttr然后return
				if (typeof name === 'object') {
					for (i in name) {
						if (name.hasOwnProperty(i)) this.setAttr(i, name[i], tag, isOld);
					}
					return;
				}

				objValue = this.get(tag, isOld) || {};
				objectPath.set(objValue, name, value);

				return this.set(objValue, tag, isOld);
			},
			/**
       * @name    get
			 * @desc    读取this.key下的value
       * @grammar store.get([tag][, isOld])
       *
			 * @param   {string} 可选,tag标识,如果传递tag,get时会比较tag标识,不一致返回null
			 * @param   {string} 可选,默认false,是否设置回滚数据
			 * @returns {*} value
			 */
			get: function (tag, isOld) {
				return this.options.proxy.get(this.options.key, tag, isOld);
			},
			/**
       * @name    getAttr
			 * @desc    读取this.key下的value中name的value
       * @grammar store.getAttr(name[, tag][, isOld])
       *
			 * @param   {String} name 支持通过路径的方式，如'a.b.c'
			 * @param   {string} 可选,tag标识,如果传递tag,get时会比较tag标识,不一致返回null
			 * @param   {string} 可选,默认false,是否设置回滚数据
			 * @returns {*} value
			 */
			getAttr: function (name, tag, isOld) {
				return objectPath.get(this.get(tag, isOld), name);
			},
			/**
       * @name getTag
			 * @desc 获取tag
       * @grammar store.getTag()
			 */
			getTag: function () {
				return this.options.proxy.getTag(this.options.key);
			},
			/**
       * @name remove
			 * @desc 移除存储对象
       * @grammar store.remove()
			 */
			remove: function () {
				return this.options.proxy.remove(this.options.key);
			},
			/**
       * @name setExpireTime
			 * @desc 设置失效时间
       * @grammar store.setExpireTime()
			 */
			setExpireTime: function () {
				return this.options.proxy.setExpireTime(this.options.key);
			},
			/**
       * @name getExpireTime
			 * @desc 返回失效时间
       * @grammar store.getExpireTime()
			 */
			getExpireTime: function () {
				return this.options.proxy.getExpireTime(this.options.key);
			},
			/**
       * @name    rollback
			 * @desc    回滚至上个版本
       * @grammar store.rollback([isClearOld])
       *
			 * @param   {string} 可选,默认false,回滚后是否清除回滚数据
			 * @returns {boolean} 成功true,失败false
			 */
			rollback: function (isClearOld) {
				var tag = this.getTag();
				if (this.options.rollbackEnabled) {
					if (this.set(this.get(null, true), tag)) { // 回滚成功
						isClearOld && this.set(null, tag, true);  // 需要清除oldVlue
						return true;
					}
				} else {
					throw 'param rollbackEnabled is false';
				}
			}
		})

	return AbstractStore;
});