/*
 * @Author: xiatairui_i
 * @Date: 2020-04-10 09:56:16
 * @LastEditors: xiatairui_i
 * @LastEditTime: 2020-04-21 18:09:34
 * @Description: File Content
 */
const doc = document
import Watcher from '../observer/watcher'

export default class Compile {
  constructor(el, vm) {
    // 要遍历的宿主节点
    this.$el = doc.querySelector(el)

    this.$vm = vm

    // 编译
    if (this.$el) {
      // 转换内部内容为片段Fragment
      this.$fragment = this.node2Fragment(this.$el)
      // 执行编译
      this.compile(this.$fragment)
      // 将编译完的html结果追加至$el

      this.$el.appendChild(this.$fragment)
    }
  }

  // 将宿主元素中代码片段拿出来遍历，这样做比较高效
  node2Fragment(el) {
    const frag = doc.createDocumentFragment()

    // 将el中所有子元素搬家至frag中
    let child
    while ((child = el.firstChild)) {
      frag.appendChild(child)
    }

    return frag
  }

  // 编译过程
  compile(el) {
    let childNodes = el.childNodes

    Array.from(childNodes).forEach((node) => {
      // 类型判断
      if (this.isElement(node)) {
        // 元素
        // console.log('编译元素'+node.nodeName);
        // 查找t-，@，:

        const nodeAttrs = node.attributes

        Array.from(nodeAttrs).forEach((attr) => {
          const attrName = attr.name //属性名
          const exp = attr.value // 属性值
          if (this.isDirective(attrName)) {
            // t-text
            const dir = attrName.substring(2)
            console.log(node.childNodes)

            // 执行指令
            this[dir] && this[dir](node, this.$vm, exp)
          }
          if (this.isEvent(attrName)) {
            const dir = attrName.substring(1) // @click
            this.eventHandler(node, this.$vm, exp, dir)
          }
        })
      } else if (this.isInterpolation(node)) {
        // 文本
        // console.log('编译文本'+node.textContent);
        this.compileText(node)
      }

      // 递归子节点
      if (node.childNodes && node.childNodes.length > 0) {
        this.compile(node)
      }
    })
  }

  compileText(node) {
    console.log(node, this.$vm, RegExp.$1)

    this.update(node, this.$vm, RegExp.$1, 'text')
  }

  // 更新函数
  update(node, vm, exp, dir) {
    const updaterFn = this[dir + 'Updater']
    // 初始化
    updaterFn && updaterFn(node, vm[exp])
    // console.log(vm, exp)

    // 依赖收集
    const watcher = new Watcher(vm, exp, function (value) {
      updaterFn && updaterFn(node, value)
    })
    // 存储依赖
    vm._watchers.push(watcher)
  }

  text(node, vm, exp) {
    this.update(node, vm, exp, 'text')
  }

  //   双绑
  model(node, vm, exp) {
    // 指定input的value属性
    this.update(node, vm, exp, 'model')

    // 视图对模型响应
    node.addEventListener('input', (e) => {
      vm[exp] = e.target.value
    })
  }

  modelUpdater(node, value) {
    node.value = value
  }

  html(node, vm, exp) {
    this.update(node, vm, exp, 'html')
  }

  htmlUpdater(node, value) {
    node.innerHTML = value
  }

  for(node, vm, exp) {
    this.update(node, vm, exp, 'for')
  }

  forUpdater(node, value) {
    node.textContent = value
  }

  textUpdater(node, value) {
    if (Array.isArray(value)) {
      const arrStr = []

      const arr2str = (val) => {
        val.forEach((item) => {
          let str = ''
          for (const key in item) {
            if (Array.isArray(item[key])) {
              arr2str(item[key])
            } else {
              str = str + `{${key}：${item[key]}}`
              arrStr.push(str)
            }
          }
        })
      }

      arr2str(value)

      node.textContent = '[' + arrStr.join(',') + ']'
    } else {
      node.textContent = value
    }
  }

  //   事件处理器
  eventHandler(node, vm, exp, dir) {
    //   @click="onClick"
    let fn = vm.$options.methods && vm.$options.methods[exp]
    if (dir && fn) {
      node.addEventListener(dir, fn.bind(vm))
    }
  }

  isDirective(attr) {
    return attr.indexOf('t-') == 0
  }

  isEvent(attr) {
    return attr.indexOf('@') == 0
  }

  isElement(node) {
    return node.nodeType === 1
  }

  // 插值文本
  isInterpolation(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }
}
