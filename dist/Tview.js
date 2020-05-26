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
   * @LastEditTime: 2020-04-20 18:25:19
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
        }
      }
    }, {
      key: "observeArray",
      value: function observeArray(items) {
        for (var i = 0, l = items.length; i < l; i++) {
          observe(items[i]);
        }
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
   * @LastEditTime: 2020-04-21 18:09:34
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
                var dir = attrName.substring(2);
                console.log(node.childNodes); // 执行指令

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
        console.log(node, this.$vm, RegExp.$1);
        this.update(node, this.$vm, RegExp.$1, 'text');
      } // 更新函数

    }, {
      key: "update",
      value: function update(node, vm, exp, dir) {
        var updaterFn = this[dir + 'Updater']; // 初始化

        updaterFn && updaterFn(node, vm[exp]); // console.log(vm, exp)
        // 依赖收集

        var watcher = new Watcher(vm, exp, function (value) {
          updaterFn && updaterFn(node, value);
        }); // 存储依赖

        vm._watchers.push(watcher);
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
      key: "for",
      value: function _for(node, vm, exp) {
        this.update(node, vm, exp, 'for');
      }
    }, {
      key: "forUpdater",
      value: function forUpdater(node, value) {
        node.textContent = value;
      }
    }, {
      key: "textUpdater",
      value: function textUpdater(node, value) {
        if (Array.isArray(value)) {
          var arrStr = [];

          var arr2str = function arr2str(val) {
            val.forEach(function (item) {
              var str = '';

              for (var key in item) {
                if (Array.isArray(item[key])) {
                  arr2str(item[key]);
                } else {
                  str = str + "{".concat(key, "\uFF1A").concat(item[key], "}");
                  arrStr.push(str);
                }
              }
            });
          };

          arr2str(value);
          node.textContent = '[' + arrStr.join(',') + ']';
        } else {
          node.textContent = value;
        }
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

  /*
   * @Author: xiatairui_i
   * @Date: 2020-04-15 17:45:46
   * @LastEditors: xiatairui_i
   * @LastEditTime: 2020-04-16 11:11:29
   * @Description: File Content
   */

  /**
   * Element virdual-dom 对象定义
   * @param {String} tagName - dom 元素名称
   * @param {Object} props - dom 属性
   * @param {Array<Element|String>} - 子节点
   */
  var Vnode = /*#__PURE__*/function () {
    function Vnode(tagName, data, children) {
      _classCallCheck(this, Vnode);

      this.tagName = tagName;
      this.data = data;
      this.children = children;
      this.key = data && data.key;
      this.count = this.getCount(children);
    }

    _createClass(Vnode, [{
      key: "getCount",
      value: function getCount(children) {
        var count = 0;
        children.forEach(function (child, i) {
          if (child instanceof Vnode) {
            count += child.count;
          } else {
            children[i] = '' + child;
          }

          count++;
        });
        return count;
      }
    }]);

    return Vnode;
  }();
  /**
   * render 将virdual-dom 对象渲染为实际 DOM 元素
   */


  Vnode.prototype.render = function () {
    var el = document.createElement(this.tagName);
    var data = this.data;
    var children = this.children || [];

    for (var key in data) {
      var value = data[key];
      el.setAttribute(key, value);
    }

    children.forEach(function (child) {
      var childEl = child instanceof Vnode ? child.render() // 如果子节点也是虚拟DOM，递归构建DOM节点
      : document.createTextNode(child); // 如果字符串，只构建文本节点

      el.appendChild(childEl);
    });
    return el;
  };

  function el(tagName, props, children) {
    return new Vnode(tagName, props, children);
  }

  /*
   * @Author: xiatairui_i
   * @Date: 2020-04-15 19:02:31
   * @LastEditors: xiatairui_i
   * @LastEditTime: 2020-04-16 11:44:14
   * @Description: File Content
   */
  var REPLACE = 0; // 替换原先的节点

  var REORDER = 1; // 重新排序

  var PROPS = 2; // 修改了节点的属性

  var TEXT = 3; // 文本内容改变

  function patch(node, patches) {
    var walker = {
      index: 0
    };
    dfsWalk(node, walker, patches);
  }

  function dfsWalk(node, walker, patches) {
    // 从patches拿出当前节点的差异
    var currentPatches = patches[walker.index];
    var len = node.childNodes ? node.childNodes.length : 0; // 深度遍历子节点

    for (var i = 0; i < len; i++) {
      var child = node.childNodes[i];
      walker.index++;
      dfsWalk(child, walker, patches);
    } // 对当前节点进行DOM操作


    if (currentPatches) {
      applyPatches(node, currentPatches);
    }
  }

  function applyPatches(node, currentPatches) {
    currentPatches.forEach(function (currentPatch) {
      switch (currentPatch.type) {
        case REPLACE:
          var newNode = typeof currentPatch.node === 'string' ? document.createTextNode(currentPatch.node) : currentPatch.node.render();
          node.parentNode.replaceChild(newNode, node);
          break;

        case REORDER:
          reorderChildren(node, currentPatch.moves);
          break;

        case PROPS:
          setProps(node, currentPatch.props);
          break;

        case TEXT:
          node.textContent = currentPatch.content;
          break;

        default:
          throw new Error('Unknown patch type ' + currentPatch.type);
      }
    });
  }

  function setProps(node, props) {
    for (var key in props) {
      if (!props[key]) {
        node.removeAttribute(key);
      } else {
        var value = props[key];
        setAttr(node, key, value);
      }
    }
  }

  function reorderChildren(node, moves) {
    var staticNodeList = Array.from(node.childNodes);
    var maps = {};
    staticNodeList.forEach(function (node) {
      // 如果是一个元素节点
      if (node.nodeType === 1) {
        var key = node.getAttribute('key');

        if (key) {
          maps[key] = node;
        }
      }
    });
    moves.forEach(function (move) {
      var index = move.index;

      if (move.type === 0) {
        // type为 0，表示新的dom对象已经删除该节点
        if (staticNodeList[index] === node.childNodes[index]) {
          // maybe have been removed for inserting
          node.removeChild(node.childNodes[index]);
        }

        staticNodeList.splice(index, 1);
      } else if (move.type === 1) {
        // type为 1，表示新的dom对象插入该节点
        var insertNode = maps[move.item.key] ? maps[move.item.key].cloneNode(true) // reuse old item
        : _typeof(move.item) === 'object' ? move.item.render() : document.createTextNode(move.item);
        staticNodeList.splice(index, 0, insertNode);
        node.insertBefore(insertNode, node.childNodes[index] || null);
      }
    });
  }

  function setAttr(node, key, value) {
    switch (key) {
      case 'style':
        node.style.cssText = value;
        break;

      case 'value':
        var tagName = node.tagName || '';
        tagName = tagName.toLowerCase();

        if (tagName === 'input' || tagName === 'textarea') {
          node.value = value;
        } else {
          // if it is not a input or textarea, use `setAttribute` to set
          node.setAttribute(key, value);
        }

        break;

      default:
        node.setAttribute(key, value);
        break;
    }
  }

  patch.REPLACE = REPLACE;
  patch.REORDER = REORDER;
  patch.PROPS = PROPS;
  patch.TEXT = TEXT;

  /**
   * Diff two list in O(N).
   * @param {Array} oldList - Original List
   * @param {Array} newList - List After certain insertions, removes, or moves
   * @return {Object} - {moves: <Array>}
   *                  - moves is a list of actions that telling how to remove and insert
   */
  function diff (oldList, newList, key) {
    var oldMap = makeKeyIndexAndFree(oldList, key);
    var newMap = makeKeyIndexAndFree(newList, key);

    var newFree = newMap.free;

    var oldKeyIndex = oldMap.keyIndex;
    var newKeyIndex = newMap.keyIndex;

    var moves = [];

    // a simulate list to manipulate
    var children = [];
    var i = 0;
    var item;
    var itemKey;
    var freeIndex = 0;

    // fist pass to check item in old list: if it's removed or not
    while (i < oldList.length) {
      item = oldList[i];
      itemKey = getItemKey(item, key);
      if (itemKey) {
        if (!newKeyIndex.hasOwnProperty(itemKey)) {
          children.push(null);
        } else {
          var newItemIndex = newKeyIndex[itemKey];
          children.push(newList[newItemIndex]);
        }
      } else {
        var freeItem = newFree[freeIndex++];
        children.push(freeItem || null);
      }
      i++;
    }

    var simulateList = children.slice(0);

    // remove items no longer exist
    i = 0;
    while (i < simulateList.length) {
      if (simulateList[i] === null) {
        remove(i);
        removeSimulate(i);
      } else {
        i++;
      }
    }

    // i is cursor pointing to a item in new list
    // j is cursor pointing to a item in simulateList
    var j = i = 0;
    while (i < newList.length) {
      item = newList[i];
      itemKey = getItemKey(item, key);

      var simulateItem = simulateList[j];
      var simulateItemKey = getItemKey(simulateItem, key);

      if (simulateItem) {
        if (itemKey === simulateItemKey) {
          j++;
        } else {
          // new item, just inesrt it
          if (!oldKeyIndex.hasOwnProperty(itemKey)) {
            insert(i, item);
          } else {
            // if remove current simulateItem make item in right place
            // then just remove it
            var nextItemKey = getItemKey(simulateList[j + 1], key);
            if (nextItemKey === itemKey) {
              remove(i);
              removeSimulate(j);
              j++; // after removing, current j is right, just jump to next one
            } else {
              // else insert item
              insert(i, item);
            }
          }
        }
      } else {
        insert(i, item);
      }

      i++;
    }

    function remove (index) {
      var move = {index: index, type: 0};
      moves.push(move);
    }

    function insert (index, item) {
      var move = {index: index, item: item, type: 1};
      moves.push(move);
    }

    function removeSimulate (index) {
      simulateList.splice(index, 1);
    }

    return {
      moves: moves,
      children: children
    }
  }

  /**
   * Convert list to key-item keyIndex object.
   * @param {Array} list
   * @param {String|Function} key
   */
  function makeKeyIndexAndFree (list, key) {
    var keyIndex = {};
    var free = [];
    for (var i = 0, len = list.length; i < len; i++) {
      var item = list[i];
      var itemKey = getItemKey(item, key);
      if (itemKey) {
        keyIndex[itemKey] = i;
      } else {
        free.push(item);
      }
    }
    return {
      keyIndex: keyIndex,
      free: free
    }
  }

  function getItemKey (item, key) {
    if (!item || !key) return void 666
    return typeof key === 'string'
      ? item[key]
      : key(item)
  }

  var makeKeyIndexAndFree_1 = makeKeyIndexAndFree; // exports for test
  var diff_2 = diff;

  var diff_1 = {
  	makeKeyIndexAndFree: makeKeyIndexAndFree_1,
  	diff: diff_2
  };

  var listDiff2 = diff_1.diff;

  /*
   * @Author: xiatairui_i
   * @Date: 2020-04-15 18:20:51
   * @LastEditors: xiatairui_i
   * @LastEditTime: 2020-04-16 14:04:00
   * @Description: File Content
   */
  function diff$1(oldTree, newTree) {
    var index = 0; // 当前节点的标志

    var patches = {}; // 用来记录每个节点差异的对象

    dfsWalk$1(oldTree, newTree, index, patches);
    return patches;
  } // 对两棵树进行深度优先遍历

  function dfsWalk$1(oldNode, newNode, index, patches) {
    var currentPatch = [];

    if (typeof oldNode === 'string' && typeof newNode === 'string') {
      // 文本内容改变
      if (newNode !== oldNode) {
        currentPatch.push({
          type: patch.TEXT,
          content: newNode
        });
      }
    } else if (newNode != null && oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
      // 节点相同，比较属性
      var propsPatches = diffProps(oldNode, newNode);

      if (propsPatches) {
        currentPatch.push({
          type: patch.PROPS,
          props: propsPatches
        });
      } // 比较子节点，如果子节点有'ignore'属性，则不需要比较


      if (!isIgnoreChildren(newNode)) {
        diffChildren(oldNode.children, newNode.children, index, patches, currentPatch);
      }
    } else if (newNode !== null) {
      // 新节点和旧节点不同，用 replace 替换
      currentPatch.push({
        type: patch.REPLACE,
        node: newNode
      });
    }

    if (currentPatch.length) {
      patches[index] = currentPatch;
    }
  } // 遍历子节点


  function diffChildren(oldChildren, newChildren, index, patches, currentPatch) {
    var diffs = listDiff2(oldChildren, newChildren, 'key');
    newChildren = diffs.children;

    if (diffs.moves.length) {
      var reorderPatch = {
        type: patch.REORDER,
        moves: diffs.moves
      };
      currentPatch.push(reorderPatch);
    }

    var leftNode = null;
    var currentNodeIndex = index;
    oldChildren.forEach(function (child, i) {
      var newChild = newChildren[i];
      currentNodeIndex = leftNode && leftNode.count ? currentNodeIndex + leftNode.count + 1 : currentNodeIndex + 1;
      dfsWalk$1(child, newChild, currentNodeIndex, patches);
      leftNode = child;
    });
  } // 比较节点属性


  function diffProps(oldNode, newNode) {
    var count = 0;
    var oldProps = oldNode.props;
    var newProps = newNode.props;
    var propsPatches = {}; // 查找属性值不同的属性

    for (var key in oldProps) {
      if (newProps[key] !== oldProps[key]) {
        count++;
        propsPatches[key] = newProps[key];
      }
    } // 查找新属性


    for (var key in newProps) {
      if (!oldProps.hasOwnProperty(key)) {
        count++;
        propsPatches[key] = newProps[key];
      }
    } // 没有属性改变


    if (count === 0) {
      return null;
    }

    return propsPatches;
  }

  function isIgnoreChildren(node) {
    return node.props && node.props.hasOwnProperty('ignore');
  }

  /*
   * @Author: xiatairui_i
   * @Date: 2020-04-12 21:37:47
   * @LastEditors: xiatairui_i
   * @LastEditTime: 2020-04-16 11:14:13
   * @Description: File Content
   */
  var vd = {
    el: el,
    diff: diff$1,
    patch: patch
  };

  /*
   * @Author: xiatairui_i
   * @Date: 2020-04-20 18:17:13
   * @LastEditors: xiatairui_i
   * @LastEditTime: 2020-04-20 21:39:37
   * @Description: File Content
   */
  function initState(vm) {
    vm._watchers = [];
    var opts = vm.$options; // 初始化data

    if (opts.data) {
      initData(vm);
    } else {
      observe(vm._data = {});
    }
  }

  function initData(vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function' ? data.call(vm) : data || {}; // proxy data on instance

    var keys = Object.keys(data);
    var i = keys.length;

    while (i--) {
      proxy(vm, keys[i]);
    } // observe data


    observe(data);
  }

  function proxy(vm, key) {
    Object.defineProperty(vm, key, {
      configurable: true,
      enumerable: true,
      get: function proxyGetter() {
        return vm._data[key];
      },
      set: function proxySetter(val) {
        vm._data[key] = val;
      }
    });
  }

  window.vd = vd;

  var Tview = function Tview(options) {
    _classCallCheck(this, Tview);

    this.$options = options; // 数据响应化

    this.$data = options.data;
    initState(this);
    new Observer(this.$data, this);
    new Compile(options.el, this); // created执行

    if (options.created) {
      options.created.call(this);
    }
  };

  return Tview;

})));
