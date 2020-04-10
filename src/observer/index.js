/*
 * @Author: xiatairui_i
 * @Date: 2020-04-10 09:55:43
 * @LastEditors: xiatairui_i
 * @LastEditTime: 2020-04-10 10:16:52
 * @Description: File Content
 */
import Dep from './dep'
import { arrayMethods } from './array'
import { def, isObject, hasOwn } from '../util'

const hasProto = '__proto__' in {}
const arrayKeys = Object.getOwnPropertyNames(arrayMethods)
export default class Observer {
  constructor(value, vm) {
    this.value = value
    this.dep = new Dep()
    def(value, '__ob__', this)
    this.vm = vm

    if (Array.isArray(value)) {
      const augment = hasProto ? protoAugment : copyAugment
      augment(value, arrayMethods, arrayKeys)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }

  walk(obj) {
    const keys = Object.keys(obj)

    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
      this.proxyData(keys[i])
    }
  }

  observeArray(items) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }

  proxyData(key) {
    const { vm } = this

    Object.defineProperty(vm, key, {
      get() {
        return vm.$data[key]
      },
      set(newVal) {
        vm.$data[key] = newVal
      },
    })
  }
}

function defineReactive(obj, key, val) {
  // 如果只传了obj和key，那么val = obj[key]

  if (arguments.length === 2) {
    val = obj[key]
  }

  if (typeof val === 'object') {
    new Observer(val)
  }
  let childOb = observe(val)
  const dep = new Dep()

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      dep.depend()

      if (childOb) {
        childOb.dep.depend()
      }
      return val
    },
    set(newVal) {
      if (val === newVal) {
        return
      }

      val = newVal
      dep.notify()
    },
  })
}

function protoAugment(target, src, keys) {
  target.__proto__ = src
}

function copyAugment(target, src, keys) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}

function observe(value, asRootData) {
  console.log(value)

  if (!isObject(value)) {
    return
  }
  let ob
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else {
    ob = new Observer(value)
  }

  return ob
}
