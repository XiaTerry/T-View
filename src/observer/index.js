/*
 * @Author: xiatairui_i
 * @Date: 2020-03-31 14:36:02
 * @LastEditors: xiatairui_i
 * @LastEditTime: 2020-04-06 18:51:59
 * @Description: File Content
 */

class Observer {
  constructor(value, vm) {
    this.value = value
    this.vm = vm

    if (Array.isArray(value)) {
      console.log(`${value}数组`)
    } else {
      console.log(`${value}对象`)
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

  const dep = new Dep()

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      dep.depend()
      console.log(`${key}属性被读取了`)
      return val
    },
    set(newVal) {
      if (val === newVal) {
        return
      }
      console.log(`${key}属性被修改了`)

      val = newVal
      dep.notify()
    },
  })
}
