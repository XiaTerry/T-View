/*
 * @Author: xiatairui_i
 * @Date: 2020-04-20 18:17:13
 * @LastEditors: xiatairui_i
 * @LastEditTime: 2020-04-20 21:39:37
 * @Description: File Content
 */
import { observe } from '../observer/index'

export function initState(vm) {
  vm._watchers = []
  const opts = vm.$options

  // 初始化data
  if (opts.data) {
    initData(vm)
  } else {
    observe((vm._data = {}), true /* asRootData */)
  }
}

function initData(vm) {
  let data = vm.$options.data
  data = vm._data = typeof data === 'function' ? data.call(vm) : data || {}

  // proxy data on instance
  const keys = Object.keys(data)
  let i = keys.length
  while (i--) {
    proxy(vm, keys[i])
  }
  // observe data
  observe(data, true /* asRootData */)
}

function proxy(vm, key) {
  Object.defineProperty(vm, key, {
    configurable: true,
    enumerable: true,
    get: function proxyGetter() {
      return vm._data[key]
    },
    set: function proxySetter(val) {
      vm._data[key] = val
    },
  })
}
