(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Tview = factory());
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  /*
   * @Author: xiatairui_i
   * @Date: 2020-04-10 09:38:48
   * @LastEditors: xiatairui_i
   * @LastEditTime: 2020-04-10 09:39:37
   * @Description: File Content
   */
  var Tview = function Tview(value) {
    _classCallCheck(this, Tview);

    this.value = value;
  };

  return Tview;

})));
