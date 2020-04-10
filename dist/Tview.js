(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Tview = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  /*
   * @Author: xiatairui_i
   * @Date: 2020-04-10 09:55:51
   * @LastEditors: xiatairui_i
   * @LastEditTime: 2020-04-10 10:06:03
   * @Description: File Content
   */
  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.subs = [];
    }

    _createClass(Dep, [{
      key: "addSub",
      value: function addSub(sub) {
        this.subs.push(sub);
      } // 删除一个依赖

    }, {
      key: "removeSub",
      value: function removeSub(sub) {
        remove(this.subs, sub);
      } // 添加一个依赖

    }, {
      key: "depend",
      value: function depend() {
        if (window.target) {
          this.addSub(window.target);
        }
      } // 通知所有依赖更新

    }, {
      key: "notify",
      value: function notify() {
        var subs = this.subs.slice();

        for (var i = 0, l = subs.length; i < l; i++) {
          subs[i].update();
        }
      }
    }]);

    return Dep;
  }();

  function remove(arr, item) {
    if (arr.length) {
      var index = arr.indexOf(item);

      if (index > -1) {
        return arr.splice(index, 1);
      }
    }
  }

  /*
   * @Author: xiatairui_i
   * @Date: 2020-04-10 09:58:02
   * @LastEditors: xiatairui_i
   * @LastEditTime: 2020-04-10 09:58:02
   * @Description: File Content
   */
  function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    });
  }
  function isObject(obj) {
    return obj !== null && _typeof(obj) === 'object';
  }
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
  }

  /*
   * @Author: xiatairui_i
   * @Date: 2020-04-10 09:55:58
   * @LastEditors: xiatairui_i
   * @LastEditTime: 2020-04-10 10:16:21
   * @Description: File Content
   */
  var arrayProto = Array.prototype;
  var arrayMethods = Object.create(arrayProto);
  ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(function (method) {
    // 缓存源型方法
    var original = arrayProto[method];
    def(arrayMethods, method, function mutator() {
      var i = arguments.length;
      var args = new Array(i);

      while (i--) {
        args[i] = arguments[i];
      }

      var result = original.apply(this, args);
      var ob = this.__ob__;
      var inserted;

      switch (method) {
        case 'push':
          inserted = args;
          break;

        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
          break;
      }

      if (inserted) ob.observeArray(inserted); // 通知变化

      ob.dep.notify();
      return result;
    });
  });

  var hasProto = ('__proto__' in {});
  var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

  var Observer = /*#__PURE__*/function () {
    function Observer(value, vm) {
      _classCallCheck(this, Observer);

      this.value = value;
      this.dep = new Dep();
      def(value, '__ob__', this);
      this.vm = vm;

      if (Array.isArray(value)) {
        var augment = hasProto ? protoAugment : copyAugment;
        augment(value, arrayMethods, arrayKeys);
        this.observeArray(value);
      } else {
        this.walk(value);
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(obj) {
        var keys = Object.keys(obj);

        for (var i = 0; i < keys.length; i++) {
          defineReactive(obj, keys[i]);
          this.proxyData(keys[i]);
        }
      }
    }, {
      key: "observeArray",
      value: function observeArray(items) {
        for (var i = 0, l = items.length; i < l; i++) {
          observe(items[i]);
        }
      }
    }, {
      key: "proxyData",
      value: function proxyData(key) {
        var vm = this.vm;
        Object.defineProperty(vm, key, {
          get: function get() {
            return vm.$data[key];
          },
          set: function set(newVal) {
            vm.$data[key] = newVal;
          }
        });
      }
    }]);

    return Observer;
  }();

  function defineReactive(obj, key, val) {
    // 如果只传了obj和key，那么val = obj[key]
    if (arguments.length === 2) {
      val = obj[key];
    }

    if (_typeof(val) === 'object') {
      new Observer(val);
    }

    var childOb = observe(val);
    var dep = new Dep();
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function get() {
        dep.depend();

        if (childOb) {
          childOb.dep.depend();
        }

        return val;
      },
      set: function set(newVal) {
        if (val === newVal) {
          return;
        }

        val = newVal;
        dep.notify();
      }
    });
  }

  function protoAugment(target, src, keys) {
    target.__proto__ = src;
  }

  function copyAugment(target, src, keys) {
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      def(target, key, src[key]);
    }
  }

  function observe(value, asRootData) {
    console.log(value);

    if (!isObject(value)) {
      return;
    }

    var ob;

    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
      ob = value.__ob__;
    } else {
      ob = new Observer(value);
    }

    return ob;
  }

  /*
   * @Author: xiatairui_i
   * @Date: 2020-04-10 09:56:03
   * @LastEditors: xiatairui_i
   * @LastEditTime: 2020-04-10 10:02:25
   * @Description: File Content
   */
  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, expOrFn, cb) {
      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.cb = cb;
      this.getter = parsePath(expOrFn);
      this.value = this.get();
    }

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        window.target = this;
        var vm = this.vm;
        var value = this.getter.call(vm, vm);
        window.target = undefined;
        return value;
      }
    }, {
      key: "update",
      value: function update() {
        var oldValue = this.value;
        this.value = this.get();
        this.cb.call(this.vm, this.value, oldValue);
      }
    }]);

    return Watcher;
  }();
  var bailRE = /[^\w.$]/;

  function parsePath(path) {
    if (bailRE.test(path)) {
      return;
    }

    var segments = path.split('.');
    return function (obj) {
      for (var i = 0; i < segments.length; i++) {
        if (!obj) return;
        obj = obj[segments[i]];
      }

      return obj;
    };
  }

  /*
   * @Author: xiatairui_i
   * @Date: 2020-04-10 09:56:16
   * @LastEditors: xiatairui_i
   * @LastEditTime: 2020-04-10 10:05:40
   * @Description: File Content
   */
  var doc = document;

  var Compile = /*#__PURE__*/function () {
    function Compile(el, vm) {
      _classCallCheck(this, Compile);

      // 要遍历的宿主节点
      this.$el = doc.querySelector(el);
      this.$vm = vm; // 编译

      if (this.$el) {
        // 转换内部内容为片段Fragment
        this.$fragment = this.node2Fragment(this.$el); // 执行编译

        this.compile(this.$fragment); // 将编译完的html结果追加至$el

        this.$el.appendChild(this.$fragment);
      }
    } // 将宿主元素中代码片段拿出来遍历，这样做比较高效


    _createClass(Compile, [{
      key: "node2Fragment",
      value: function node2Fragment(el) {
        var frag = doc.createDocumentFragment(); // 将el中所有子元素搬家至frag中

        var child;

        while (child = el.firstChild) {
          frag.appendChild(child);
        }

        return frag;
      } // 编译过程

    }, {
      key: "compile",
      value: function compile(el) {
        var _this = this;

        var childNodes = el.childNodes;
        Array.from(childNodes).forEach(function (node) {
          // 类型判断
          console.log(node);

          if (_this.isElement(node)) {
            // 元素
            // console.log('编译元素'+node.nodeName);
            // 查找t-，@，:
            var nodeAttrs = node.attributes;
            Array.from(nodeAttrs).forEach(function (attr) {
              var attrName = attr.name; //属性名

              var exp = attr.value; // 属性值

              if (_this.isDirective(attrName)) {
                // t-text
                var dir = attrName.substring(2); // 执行指令

                _this[dir] && _this[dir](node, _this.$vm, exp);
              }

              if (_this.isEvent(attrName)) {
                var _dir = attrName.substring(1); // @click


                _this.eventHandler(node, _this.$vm, exp, _dir);
              }
            });
          } else if (_this.isInterpolation(node)) {
            // 文本
            // console.log('编译文本'+node.textContent);
            _this.compileText(node);
          } // 递归子节点


          if (node.childNodes && node.childNodes.length > 0) {
            _this.compile(node);
          }
        });
      }
    }, {
      key: "compileText",
      value: function compileText(node) {
        // console.log(RegExp.$1);
        this.update(node, this.$vm, RegExp.$1, 'text');
      } // 更新函数

    }, {
      key: "update",
      value: function update(node, vm, exp, dir) {
        var updaterFn = this[dir + 'Updater']; // 初始化

        updaterFn && updaterFn(node, vm[exp]); // 依赖收集

        new Watcher(vm, exp, function (value) {
          updaterFn && updaterFn(node, value);
        });
      }
    }, {
      key: "text",
      value: function text(node, vm, exp) {
        this.update(node, vm, exp, 'text');
      } //   双绑

    }, {
      key: "model",
      value: function model(node, vm, exp) {
        // 指定input的value属性
        this.update(node, vm, exp, 'model'); // 视图对模型响应

        node.addEventListener('input', function (e) {
          vm[exp] = e.target.value;
        });
      }
    }, {
      key: "modelUpdater",
      value: function modelUpdater(node, value) {
        node.value = value;
      }
    }, {
      key: "html",
      value: function html(node, vm, exp) {
        this.update(node, vm, exp, 'html');
      }
    }, {
      key: "htmlUpdater",
      value: function htmlUpdater(node, value) {
        node.innerHTML = value;
      }
    }, {
      key: "textUpdater",
      value: function textUpdater(node, value) {
        node.textContent = value;
      } //   事件处理器

    }, {
      key: "eventHandler",
      value: function eventHandler(node, vm, exp, dir) {
        //   @click="onClick"
        var fn = vm.$options.methods && vm.$options.methods[exp];

        if (dir && fn) {
          node.addEventListener(dir, fn.bind(vm));
        }
      }
    }, {
      key: "isDirective",
      value: function isDirective(attr) {
        return attr.indexOf('t-') == 0;
      }
    }, {
      key: "isEvent",
      value: function isEvent(attr) {
        return attr.indexOf('@') == 0;
      }
    }, {
      key: "isElement",
      value: function isElement(node) {
        return node.nodeType === 1;
      } // 插值文本

    }, {
      key: "isInterpolation",
      value: function isInterpolation(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
      }
    }]);

    return Compile;
  }();

  var Tview = function Tview(options) {
    _classCallCheck(this, Tview);

    this.$options = options; // 数据响应化

    this.$data = options.data;
    new Observer(this.$data, this);
    new Compile(options.el, this); // created执行

    if (options.created) {
      options.created.call(this);
    }
  };

  return Tview;

})));
