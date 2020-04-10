/*
 * @Author: xiatairui_i
 * @Date: 2020-04-10 09:38:48
 * @LastEditors: xiatairui_i
 * @LastEditTime: 2020-04-10 10:00:40
 * @Description: File Content
 */
import Observer from './observer'
import Compile from './compile'

class Tview {
  constructor(options) {
    this.$options = options

    // 数据响应化
    this.$data = options.data
    new Observer(this.$data, this)

    new Compile(options.el, this)

    // created执行
    if (options.created) {
      options.created.call(this)
    }
  }
}
export default Tview
