/**
 * pub/sub 发布订阅
 *
 * @author hbmu
 * @date   2015/4/30
 *
 * @name   pubSub
 * @example
 * define(['pubSub'], function(pubSub) { ... })
 */
define(['es5', 'objectPath'], function (es5, objectPath) {
	"use strict";

	var
		messages = {}, // 消息集合
		id = 0; // 处理句柄的id标识

	/**
	 * 订阅,私有方法
   *
	 * @param {object} 消息集合(messages或者包含子message的message)
	 * @param {string} 消息
	 * @param {*} 执行订阅的handler时传入的data
	 */
	function _publish(messages, message, data) {
		var handlers = objectPath.get(messages, message);

		if (handlers) {
			es5.each(handlers, function(v, k) {
				// 循环messages, 若果key字符中包含'id_',则认为它是处理句柄handler,否则认为它是子message的obj,则再次调用pulish
				~k.indexOf('id_') ? v.handler.call(v.context, data) : _publish(handlers, k, data);
			}, this);
		}
	};

	var pubSub = {
		/**
     * 发布
     *
		 * @param {string} 消息,支持子message. eg. 'a.b.c'
		 * @param {*} 执行订阅的handler时传入的data
     *
     * @name    publish
     * @grammar pubSub.publish(message, data)
		 */
		publish: function(message, data) {
			_publish(messages, message, data);
		},
		/**
     * 订阅(注意,message不要包含'id_', eg. '...id_...')
     *
		 * @param {string} 消息
		 * @param {function} 处理句柄
		 * @param {object} handler执行的上下文,可选
     *
     * @name    subscribe
     * @grammar pubSub.subscribe(message, handler[, context])
		 */
		subscribe: function(message, handler, context) {
			var handlers = objectPath.get(messages, message);

			if (handlers == null) objectPath.set(messages, message, handlers = {});
			handlers['id_' + id++] = {
				handler: handler,
				context: context
			};
		},
		/**
     * 取消订阅(只能取消此message上的handler,不能作用于子message)
     *
		 * @param {string} 消息
		 * @param {function} 处理句柄,可选,如果为空则清除message上的所有handler
     *
     * @name    unsubscribe
     * @grammar pubSub.unsubscribe(message, handler)
		 */
		unsubscribe: function(message, handler) {
			var
				handlers = objectPath.get(messages, message),
				result = {};

			if (handlers) {
				if (handler) { // handler存在则循环message,从handlers找出handler并删除.
					es5.each(handlers, function(v, k) {
						if (v.handler === handler) {
							delete handlers[k];
							return false;
						}
					});
				} else { // handler不存在则循环message,找出所有子message,最后重新set message.
					es5.each(handlers, function(v, k) {
						if (!~k.indexOf('id_')) result[k] = v;
					});
					objectPath.set(messages, message, result);
				}
			}
		},
		/**
     * 清除某个message(包含子message)或者所有message的订阅
     *
		 * @param {string} 消息,可选,如果message为空,则清除所有message.
     *
     * @name    clear
     * @grammar pubSub.unsubscribe(message)
		 */
		clear: function(message) {
			if (message) {
				objectPath.set(messages, message, null);
			} else {
				messages = {};
			}
		}
	};

	return pubSub;
});