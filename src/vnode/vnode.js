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
class Vnode {
  constructor(tagName, data, children) {
    this.tagName = tagName
    this.data = data
    this.children = children
    this.key = data && data.key
    this.count = this.getCount(children)
  }

  getCount(children) {
    let count = 0
    children.forEach((child, i) => {
      if (child instanceof Vnode) {
        count += child.count
      } else {
        children[i] = '' + child
      }
      count++
    })
    return count
  }
}

/**
 * render 将virdual-dom 对象渲染为实际 DOM 元素
 */
Vnode.prototype.render = function () {
  const el = document.createElement(this.tagName)
  const data = this.data
  const children = this.children || []

  for (let key in data) {
    let value = data[key]
    el.setAttribute(key, value)
  }

  children.forEach((child) => {
    let childEl =
      child instanceof Vnode
        ? child.render() // 如果子节点也是虚拟DOM，递归构建DOM节点
        : document.createTextNode(child) // 如果字符串，只构建文本节点
    el.appendChild(childEl)
  })

  return el
}

export function el(tagName, props, children) {
  return new Vnode(tagName, props, children)
}
