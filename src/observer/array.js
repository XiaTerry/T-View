/*
 * @Author: xiatairui_i
 * @Date: 2020-04-10 09:55:58
 * @LastEditors: xiatairui_i
 * @LastEditTime: 2020-04-10 10:16:21
 * @Description: File Content
 */
const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto)
import { def } from '../util'
/**
 * Intercept mutating methods and emit events
 */
;['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(
  function (method) {
    // 缓存源型方法
    const original = arrayProto[method]
    def(arrayMethods, method, function mutator() {
      let i = arguments.length
      const args = new Array(i)
      while (i--) {
        args[i] = arguments[i]
      }
      const result = original.apply(this, args)
      const ob = this.__ob__
      let inserted
      switch (method) {
        case 'push':
          inserted = args
          break
        case 'unshift':
          inserted = args
          break
        case 'splice':
          inserted = args.slice(2)
          break
      }
      if (inserted) ob.observeArray(inserted)
      // 通知变化
      ob.dep.notify()
      return result
    })
  }
)
