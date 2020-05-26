/*
 * @Author: xiatairui_i
 * @Date: 2020-04-10 09:58:02
 * @LastEditors: xiatairui_i
 * @LastEditTime: 2020-04-20 18:25:19
 * @Description: File Content
 */
export function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true,
  })
}

export function isObject(obj) {
  return obj !== null && typeof obj === 'object'
}

const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key)
}

export function isReserved(str) {
  const c = (str + '').charCodeAt(0)
  return c === 0x24 || c === 0x5f
}
