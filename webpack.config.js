/*
 * @Author: xiatairui_i
 * @Date: 2020-03-17 21:03:46
 * @LastEditors: xiatairui_i
 * @LastEditTime: 2020-04-06 19:12:07
 * @Description: File Content
 */
const path = require('path')
module.exports = {
  //入口文件的配置项
  entry: {
    entry: './src/index.js',
  },
  //出口文件的配置项
  output: {
    //输出的路径，用了Node语法
    path: path.resolve(__dirname, 'dist'),
    //输出的文件名称
    filename: 'bundle.js',
  },
  mode: 'development', //注意最新版本必须加mode，否则会报错
  //模块：例如解读CSS,图片如何转换，压缩
  module: {},
  //插件，用于生产模版和各项功能
  plugins: [],
  //配置webpack开发服务功能
  devServer: {},
}
