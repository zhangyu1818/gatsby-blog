---
title: html5调用摄像头，拍照并上传服务器
date: "2018-10-06"
description: ""
---

## html5 调用摄像头

html5 调用摄像头的 api 是`window.navigator.mediaDevices.getUserMedia({/*config*/});`,这个[api](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getUserMedia)可以同时调用相机和麦克风，并且可以设置相机的码率和分辨率。

使用`video`标签，将相机的画面实时展示在页面中。

拍照功能用`canvas`实现，先获取`context`画笔，调用`drawImage`方法，将`video`标签中的画面置入`canvas`中

使用`formData`上传，使用`canvas.toBlob`，将图像转为`blob`上传服务器

代码如下:

`index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
    />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Document</title>
  </head>
  <body>
    <p id="message"></p>
    <p id="error"></p>
    <video style="width: 320px;height: 180px;"></video>
    <canvas width="320" height="180 "></canvas>
    <button id="take">take</button>
    <button id="upload">upload</button>
    <input style="display: none;" type="file" accept="image/*" />
    <script src="./index.js"></script>
  </body>
</html>
```

`index.js`

```javascript
document.querySelector("#message").innerHTML =
  "getUserMedia" in navigator.mediaDevices
    ? "api is exist"
    : "api is not exist";

const constraints = {
  audio: false,
  video: {
    width: 180,
    height: 320,
    facingMode: { exact: "environment" },
  },
};
window.navigator.mediaDevices
  .getUserMedia(constraints)
  .then(mediaStream => {
    const video = document.querySelector("video");
    video.srcObject = mediaStream;
    video.onloadedmetadata = e => {
      video.play();
    };
  })
  .catch(err => {
    document.querySelector("#error").innerHTML = err.name + ": " + err.message;
  });
const video = document.querySelector("video");
const canvas = document.querySelector("canvas");
const take = document.querySelector("#take");
const upload = document.querySelector("#upload");

const drawImage = () => {
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
};
const uploadImg = () => {
  canvas.toBlob(blob => {
    const formData = new FormData();
    formData.append("img", blob);
    formData.append("123", "123");
    fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
      .then(response => response.json())
      .catch(error => console.error("Error:", error))
      .then(response => console.log("Success:", response));
  });
};
take.addEventListener("click", drawImage);
upload.addEventListener("click", uploadImg);
```

需要注意的是调用相机需要 https
我写的 demo，配置了后台上传和 https
[github](https://github.com/zhangyu1818/html5-camera-demo)

## 绕过 https 使用摄像头的想法

因为业务需要使用摄像头拍账单，但是公司的后台管理系统做不了 https，所以研究后萌生了使用谷歌浏览器的扩展插件实现绕过 https 的功能

[Chrome 插件(扩展)开发全攻略](https://www.cnblogs.com/liuxianan/p/chrome-plugin-develop.html)

谷歌扩展分了 background.js 和 content.js
background 顾名思义，就是在浏览器后台运行的，域名也是以 chrome-extension 开头的，不能操作当前页面 dom，能使用 chrome 的 api

> chrome-extension://xxxx/background.html
> 在这个页面，调用摄像头是没有任何安全限制的

content 就是在当前访问页面中执行的 js，是可以操作 dom 的，但是只能使用 chrome 部分的 api

思路就是，在 content.js 里通过 chrome 的 api 将消息传递给 background.js，background.js 中进行摄像头的调用，但是好像 chrome 的消息传递是不能带对象的，所以我在 backgournd.js 中将图片 base64 的字符串传给了 content.js，再将图片放在页面的 img 标签里
