/*
 * @Author: xiatairui_i
 * @Date: 2020-04-12 21:37:47
 * @LastEditors: xiatairui_i
 * @LastEditTime: 2020-04-12 21:54:28
 * @Description: File Content
 */
export default class VNode {
  constructor(
    tag,
    data,
    children,
    text,
    elem,
    context,
    componentOptions,
    asyncFactory
  ) {
    this.tag = tag //节点名称
    this.data = data //节点数据
    this.children = children //子节点
    this.text = text //节点文本
    this.elem = elem //节点元素
    this.ns = undefined
    this.context = context //当前节点实例
    //函数式组件相关
    this.functionalContext = undefined
    this.functionalOptions = undefined
    this.functionalScopeId = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions //组件节点选项参数
    this.componentInstance = undefined //组件实例
    this.parent = undefined //父节点
    this.raw = false
    this.isStatic = false //是否静态节点
    this.isRootInsert = true //是否从根节点插入
    this.isComment = false //是否注释节点
    this.isCloned = false //是否为克隆节点
    this.isOne = false //是否渲染一次
    this.asyncFactory = asyncFactory
    this.isAsyncPlaceholder = false
  }

  // 获取组件实例
  get child() {
    return this.componentInstance
  }
}
