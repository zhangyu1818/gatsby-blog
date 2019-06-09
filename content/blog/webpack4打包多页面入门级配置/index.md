---
title: webpack4打包多页面入门级配置
date: "2018-10-01 10:00"
description: ""
---

> 公司叫我写静态页面官网，写到实在没劲，于是打算学习使用 webpack 搭建项目，所以研究了一下 webpack，webpack 是我学习前端以来，未曾踏足的一个未知领域，感觉真的特别复杂，通过各种查阅，复制粘贴，学习配置了这个项目，可能在配置中有出错的地方，但是也学到了一些知识，至少在面试的时候不会对 webpack 一窍不通了！加油鸭小张！

### 项目结构

```
// 项目结构
│-  package-lock.json
│-  package.json
│-  postcss.config.js	// postcss的配置文件
│-  webpack.config.js	// webpack的配置文件
└─src
	│  // src根目录的 pug页面
    │-  about.pug
    │-  contact.pug
    │-  index.pug
    │-  news.pug
    ├─css	// css样式，使用的stylus
    ├─images	// 静态资源
    ├─javascript	// 页面对应的入口js文件目录
    └─templates		// pug模版
           - footer.pug
           - header.pug
           - layout.pug
```

### 安装 webpack

> `npm install --save-dev webpack webpack-cli webpack-dev-server`

### 安装依赖

> `npm install --save-dev clean-webpack-plugin mini-css-extract-plugin html-webpack-plugin html-loader pug-html-loader css-loader style-loader postcss-loader stylus-loader file-loader autoprefixer`

package.json 依赖配置如下

```json
  "dependencies": {
    "webpack-cli": "^3.1.2",
    "webpack": "^4.23.1"
  },
  "devDependencies": {
    "autoprefixer": "^9.3.1",	// 打包后能自动添加上浏览器前缀
    "clean-webpack-plugin": "^0.1.19",	// 打包生成前自动清除打包的目录
    "css-loader": "^1.0.1",		// css-loader处理js中import的css
    "file-loader": "^2.0.0",	// 打包静态资源
    "html-loader": "^0.5.5",	// 可以将html页面最小化
    "html-webpack-plugin": "^3.2.0",	//根据模版创建html页面，同时可以引入js
    "mini-css-extract-plugin": "^0.4.4",	// 将css分文件打包
    "postcss-loader": "^3.0.0",		// postcss但是我不懂，只是autoprefixer好像依赖这个
    "pug-html-loader": "^1.1.5",	// 将pug模版的页面转换成html
    "style-loader": "^0.23.1",		// 将css直接写入html页面的style标签中
    "stylus": "^0.54.5",			// 项目的预处理器使用stylus
    "stylus-loader": "^3.0.2",		// stylus的loader
    "webpack-dev-server": "^3.1.10"	// webpack的热更新服务器
  },
```

### webpack 配置文件

根目录创建 webpack.config.js

```javascript
const path = require("path");
// 每次build清除本地之前build的文件
const CleanWebpackPlugin = require("clean-webpack-plugin");
// 打包css文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// 根据html模版生成html文件
const HtmlWebPackPlugin = require("html-webpack-plugin");
// 配置
module.exports = {
  // 生产环境
  // https://www.webpackjs.com/concepts/mode/
  mode: "production",
  // 入口文件
  entry: {
    index: "./src/javascript/index.js",
    contact: "./src/javascript/contact.js",
    about: "./src/javascript/about.js",
    news: "./src/javascript/news.js",
  },
  // 打包出口
  output: {
    // javascript文件夹，[name]是什么键名,[hash]加上hash值
    filename: "javascript/[name].[hash].js",
    // dist文件夹（默认）
    path: path.resolve(__dirname, "dist"),
  },
  //
  resolve: {
    // 配置import 和 require 的路径别名,就可以不用../..之类的了
    alias: {
      "@": path.resolve(__dirname, "src"),
      css: path.resolve(__dirname, "src/css"),
      images: path.resolve(__dirname, "src/images"),
    },
  },
  // 处理模块
  module: {
    //规则
    rules: [
      // html文件使用html-loader处理
      // minimize是否压缩文件
      // 我的项目没有html页面应该可以不写这项吧……
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: true,
            },
          },
        ],
      },
      // 将pug模版页面转成html
      {
        test: /\.pug$/,
        use: [
          {
            loader: "html-loader",
            options: {
              minimize: true,
            },
          },
          "pug-html-loader",
        ],
      },
      // css文件规则
      {
        test: /\.css$/,
        use: [
          {
            // 使用MiniCssExtractPlugin.loader
            // 可以将css文件打包为文件，不嵌入html文档head里的style标签
            loader: MiniCssExtractPlugin.loader,
            // css文件中的静态路径前加上../，因为打包后结构变化了，如果不加该项引入不了资源
            options: {
              publicPath: "../",
            },
          },
          // 如果要将css文件放入style标签，需要注释掉MiniCssExtractPlugin
          // 使用 "style-loader"放入style标签
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        // 处理stylus的样式文件，sass和less应该也是同理
        test: /\.styl(us)?$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../",
            },
          },
          "css-loader",
          "postcss-loader",
          // stylus-loader 处理styl的文件
          "stylus-loader",
        ],
      },
      {
        // 图片资源使用file-loader
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              // images文件夹里，[name]原来的名字,[hash]本次打包的唯一hash值,[ext]原来的拓展名
              name: "images/[hash].[ext]",
            },
          },
        ],
      },
    ],
  },
  // 使用插件
  plugins: [
    // 引入CleanWebpackPlugin，每次build都删除之前打包文件
    new CleanWebpackPlugin(["dist"]),
    // autoprefixer用于自动给css属性加前缀，似乎需要配合postcss-loader
    require("autoprefixer"),
    // 打包css的文件
    new MiniCssExtractPlugin({
      // 打包到css文件夹
      filename: "./css/[name].css",
    }),
    // 打包html插件，应该是每个html文件都需要配置
    new HtmlWebPackPlugin({
      // html文件的模版
      template: "./src/index.pug",
      // 打包出来的文件名
      filename: "./index.html",
      // 该html文件需要引入的js文件，对应的是上方入口的键名
      chunks: ["index"],
    }),
    new HtmlWebPackPlugin({
      template: "./src/contact.pug",
      filename: "./contact.html",
      chunks: ["contact"],
    }),
    new HtmlWebPackPlugin({
      template: "./src/about.pug",
      filename: "./about.html",
      chunks: ["about"],
    }),
    new HtmlWebPackPlugin({
      template: "./src/news.pug",
      filename: "./news.html",
      chunks: ["news"],
    }),
  ],
  // devServer 配置
  devServer: {
    // 默认打开浏览器
    open: true,
    // 压缩文件
    compress: true,
    // 端口号
    port: 8080,
  },
};
```

由于使用了`autoprefixer`自动添加前缀，似乎依赖于`postcss-loader`，所以需要在根目录创建`postcss.config.js`文件，配置如下

```javascript
module.exports = {
  plugins: [
    require("autoprefixer")({
      browsers: ["last 5 versions"],
    }),
  ],
};
```

接下来需要在`package.json`中添加`script`

```javascript
  "scripts": {
    "start": "webpack-dev-server",
    "build": "webpack --mode production"
  },
```

配置完成！**`npm run start`**能够启动`webpack-dev-server`服务器，**`npm run build`**能打包文件。
css 的引入需要在 html 对应的 js 里`import`，所以如果页面不使用`js`可能用不了。

这次算是自己的一次尝试，其中很多东西还是不明白，很多方式也不知是否正确，各种`loader`看的我真的是头皮发麻，英文文档真的是心态爆炸，真不知道造框架的人是怎么能配置的这么牛皮！
可能还有各种地方可以优化，比如小图标应该可以使用`url-loader`把小图标转为 base64 的格式，还有`UglifyjsWebpackPlugin`应该能够缩小 js 文件大小。
项目也没有用到 babel-loader，研究了下真的研究不懂，好像`babel-loader 7` 和 `bable-loader 8` 有很大的差别，研究了好久，现在我也没能知道`stage-0`到底有啥，为什么`bable-loader 8`不能写`state-0`。
今年去北京的美好回忆不小心丢了，今天很难过。
