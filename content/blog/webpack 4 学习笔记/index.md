---
title: webpack 4 学习笔记
date: "2018-10-05"
description: ""
---

这段时间一来，一直有用 webpack，从之前不知道是干什么用的到现在略知一二，还是有所进步，再对 webpack 的学习做一些知识总结

# webpack 是什么

webpack 是一个基于 Node.js 环境的静态资源打包器，能识别 es module、amd、cmd 的引入规则的 js 文件，再配合 loader 可以实现各种类型的文件打包

# loader

## 文件

### `file-loader`

`import avatar from "./avatar.png"`

- 用于打包任意类型的静态资源文件
- 原理： - 将文件更名并移动至 dist 目录，并为 import 的资源返回新的名字

### `url-loader`

- 和 file-loader 功能几乎相同
- 可以添加 limit 配置，当图片文件小于 limit 规定的字节时，会将图片转换为 base64 编码

## 样式

### `css-loader`

- 分析引入的 css 文件，将 css 文件中@import 的另外 css 合并为一个 css
- `options` - `importLoaders:2` - 如果 A.scss 引入了 B.scss，那么很有可能 B.scss 不会走 sass-loader 和 postcss-loader 了，那么这个属性可以让引入的文件再走 2 个 loader，loader 的运行顺序是数组倒序 - `modules:true` - 开启 css 的模块化打包,css modules

### `style-loader`

- 将 css 挂载到 html 页面的 head 标签中

### `sass-loader`

- 解析 sass/scss 文件

### `postcss-loader`

- 对 css 文件做后处理，需要额外配置`postcss.config.js`文件 - `autoprefixer` - 自动给 css 代码加上兼容性前缀

### `mini-css-extract-plugin`

生产环境适用，因为不能 HMR
如果配置了`Tree Shaking`需要修改`sideEffects`
配置`splitChunks`将多个 css 打包在一个 css 文件中
[文档](https://webpack.js.org/plugins/mini-css-extract-plugin)

- 将 css 文件单独打包，不能和`style-loader`同时使用 - 配置`optimize-css-assets-webpack-plugin`,css 合并和压缩

```javascript
optimization: {
  minimizer: [new OptimizeCSSAssetsPlugin({})];
}
```

## JS

- `babel-loader` - [webpack setup](https://babeljs.io/setup#installation) - `presets` - `@babel/polyfill` 将转换 ES6，如果使用`@babel/polyfill`,会注入全局，污染全局对象 - `useBuiltIns` 配置如何`@babel/preset-env`处理 polyfill - `usage` 只引入使用的 - `target` [运行环境](https://github.com/browserslist/browserslist) - `plugins` - `@babel/plugin-transform-runtime` 适合做类库的时候使用，会使用闭包的方式进行处理，不会污染全局 - `options`

```json
{
  "corejs": 2, // npm install --save @babel/runtime-corejs2
  "helpers": true,
  "regenerator": true,
  "useESModules": false
}
```

# plugins

### `html-webpack-plugin`

- 打包结束后自动生成一个 html 文件并且引入 js - `options` - `template` - 指定模版生成 html,如 pug

### `clean-webpack-plugin`

- 打包之前先删除以前的 dist 目录

# output

- `filename` - 文件名,使用占位符,可配置`[contenthash]`来解决浏览器缓存问题
- `chunkFileName` - 代码分割打包的文件的名字
- `path` - 打包路径
- `publicPath`: - 引入 js 的前缀，如 js 上传到 cdn 就可以加上 cdn 的域名

# devtool

[官方文档](https://webpack.js.org/configuration/devtool)

- `source-map` - 打包出的文件和 src 目录下的源文件的映射关系,会创建单独的 map 文件，如打包后出错，对应错误会指向 src 下的源文件，而不会指向打包后的 js
- `inline-source-map` - 打包后不创建 map 文件而是通过 base64 的字符串写入打包后的 js 里
- `inline-cheap-source-mao` - 打包后的错误只精确到行，而不精确到第几个字符出的错
- `cheap-module-source-map` - 打包后的错误提示不仅仅来源于源文件，也包含第三方模块和 loader
- `eval` - 使用 eval 方法执行代码的同时映射 source map
- `eval`、`source-map`、`cheap`、`module`、`inline`是可以任意组合的
- 最佳实践 - `development` - `cheap-module-eval-source-map` - `production` - `none`或者`cheap-module-source-map`
- 原理 - 使用 VLQ 编码，以`,`来分位置，以`;`来分行，每个位置有 5 位 - 例如: `mappings:"AAAAA,BBBBB;CCCCC"` - 表示转换后的源码分成两行，第一行有两个位置，第二行有一个位置。 - [阮一峰 - Source Map](http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html)

# webpack-dev-server

[配置](https://webpack.js.org/configuration/dev-server#devserverhotonly)

- `contentBase` - 静态资源文件路径，可以有多个
- `port` - 启动的端口
- `proxy` - 代理
- `open` - 浏览器自动打开
- `hot - 开启 HMR
- `hotonly` - 不会主动刷新页面

# Hot Module Replacement

[热模块更新](https://webpack.js.org/guides/hot-module-replacement)

- `new webpack.HotModuleReplacementPlugin()`
- 模块单独更新 - `module.hot.accept` - css 不需要手写更新逻辑的原因是`css-loader`已经配置了

# Tree Shaking

- 在打包时只打包使用的模块 - 只支持 ES Module 的引入方式，因为 ES Moudule 是静态导入，而 CommonJS 不是

```javascript
module.exports = {
  //...
  optimization: {
    usedExports: true,
  },
};
```

- 如果例如是`import "./index.css"`,那么 Tree Shaking 在检察到模块并没有导出使用，那么就不会打包，这个时候需要配置`sideEffects`

```json
{
  // ...
  "sideEffects": false
  // 如["@babel-polyfill"]、["*.css"]
}
```

# Code Splitting

- `optimization.splitChunks` - 同步 - 会自动将引入的第三方库文件单独打包 - 异步 - 异步请求的代码单独拆分 - 需要安装`@babel/plugin-syntax-dynamic-import` - 打包文件名使用 Magic Comment 修改，如`import(/*webpackChunksName:"lodash"*/ lodash)` - 默认配置

```javascript
optimization: {
	splitChunks: {
		chunks: 'async', //指明是对同步还是异步代码做代码分割 all|async|initial
		minSize: 30000, // 打包的最小大小  <- 30kb
		maxSize: 0, // 打包的最大大小，如果大于会尝试二次代码分割
		minChunks: 1, // 文件在代码中引入了几次后才打包，如值为2，那么只import了一次的代码就不会打包
		maxAsyncRequests: 5, // 入口文件最多有5个异步打包的请求
		maxInitialRequests: 3, // 入口文件最多有3个同步打包的请求
		automaticNameDelimiter: '~', // 代码分割后名字的分隔符
		name: true, // cacheGroups中的命名有效
		cacheGroups: { // 缓存组，会将符合下列规则的代码缓存后合并在一个文件里
			vendors: {
				test: /[\\/]node_modules[\\/]/, // 文件符合test规则在node_modules路径中
				priority: -10,	// 打包组的权重，越大的权重越高，符合的代码就会打包在权重高的组里
				filename:"vendors.js" // 文件名
			},
			default: { // 其他的文件打包在default组中，文件默认都符合default分组
				priority: -20,
				reuseExistingChunk: true // 如果代码有循环引用，就不会重复打包了
				}
			}
		}
}
```

# Prefetching/Preloading

在 chrome 浏览器中，可以打开 show coverage 来检测文件的代码覆盖率
如点击事件触发的代码，在点击时才会执行，那么在页面首屏加载的时候，其实不需要加载这些代码的，所以可以使用 code splitting 来做代码分割，异步加载点击后触发的代码，但是响应时间慢会对用户体验不好，可以使用[Prefetching/Preloading](https://webpack.js.org/guides/code-splitting#prefetchingpreloading-modules)

- `prefetching` parent chunk 加载完成后加载，并且不会执行
- `preload` 和 parent chunk 并行加载，并会执行

# Shimming

- 模块文件之间是独立的，如果需要全局变量，就需要做`Shimming Globals`

```javascript
plugins: [
  new webpack.ProvidePlugin({
    _: "lodash",
  }),
];
```

# Bundle Analysis 打包分析

[Bundle Analysis](https://webpack.js.org/guides/code-splitting#bundle-analysis)

- 官方提供工具 - 在`package.json`的`script`添加`webpack --profile --json > stats.json`，打包后会生成描述的 json 文件 - [官方分析工具](http://webpack.github.com/analyse)
- 第三方插件 - [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) 可视化工具

# 开发环境和生产环境区分

- 使用多个`config.js`文件，如共有配置`webpack.common.js`,开发环境`webpack.dev.js`,生产环境`webpack.prod.js`
- 使用`webpack-merge`来做配置合并
