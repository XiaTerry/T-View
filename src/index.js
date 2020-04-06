/*
 * @Author: xiatairui_i
 * @Date: 2020-03-22 18:18:38
 * @LastEditors: xiatairui_i
 * @LastEditTime: 2020-04-06 18:47:28
 * @Description: File Content
 */
// new TView({data:{...}})

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
