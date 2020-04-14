/*
 * @Author: xiatairui_i
 * @Date: 2020-04-10 09:42:41
 * @LastEditors: xiatairui_i
 * @LastEditTime: 2020-04-12 13:16:55
 * @Description: File Content
 */
// 告诉rollup如何查找外部模块
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import commonJs from 'rollup-plugin-commonjs'

const getConfig = (minify = false) => {
  const config = {
    input: 'src/index.js',
    output: {
      file: `dist/Tview${minify ? '.min' : ''}.js`,
      format: 'umd', //rollup生成包格式amd(异步模块)，cjs(CommonJs)，umd(通用模式)
      name: 'Tview',
      sourcemap: minify,
    },
    plugins: [
      resolve(),
      babel({
        exclude: 'node_modules/**', // 只编译我们的源代码
      }),
      commonJs(),
    ],
    watch: {
      include: 'src/**',
    },
  }

  if (minify) {
    config.plugins.push(uglify())
  }

  return config
}

export default [getConfig(), getConfig(true)]
