---
title: 上传自己写的包到npm
date: "2018-10-04"
description: ""
---

最近不算忙，又开始学习ts，觉得ts是真的好用啊，自己练习了一个React H5 music项目，还在慢吞吞的加进度，倒是因为首页需要使用轮播图，又慢吞吞的先用ts写了一个轮播图包了，接着上传到了npm，自己的React项目就可以直接引入，感觉好有成就感~

- 首先[注册](https://www.npmjs.com/)账号
- 修改`package.json`
	- `"name"` - 包名，可以先去npm看看有没有重复
	- `"main"` - 指向入口文件路径，比如`./dist/index.js`
	- `repository`、`author`、`description`、`version`字段也可以修改为正确的值
	- 如果npm是淘宝源，先切回npm官方源`npm config set registry http://registry.npmjs.org `
	- 登陆 -- `npm login`，然后输入注册的用户名、密码、邮箱
	- 提交 -- `npm publish`，等待成功就行了，如果提示重复需要修改`package.json`中的`name`哦！
