/*
 * @Author: xiatairui_i
 * @Date: 2020-04-10 09:38:48
 * @LastEditors: xiatairui_i
 * @LastEditTime: 2020-04-20 18:28:53
 * @Description: File Content
 */
import Observer from '../observer'
import Compile from '../compile'
import vd from '../vnode/index'
import { initState } from './state'
window.vd = vd

class Tview {
  constructor(options) {
    this.$options = options

    // 数据响应化
    this.$data = options.data
    initState(this)
    new Observer(this.$data, this)

    new Compile(options.el, this)

    // created执行
    if (options.created) {
      options.created.call(this)
    }
  }
}

export default Tview
