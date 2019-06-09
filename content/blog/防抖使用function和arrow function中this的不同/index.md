---
title: 防抖使用function和arrow function中this的不同
date: "2019-04-06"
description: ""
---

之前用防抖大多数是lodash中的，没有深入研究过，自己手写也是一个很简单的防抖，直接对当前的函数做处理，没有专门写传函数为参数的防抖函数，仔细研究了以后发现并没有那么简单，学习了一些新的知识
### html
``` html
<body>
	<div id="wrapper">
		<p>1</p>
		<p>2</p>
		<p>3</p>
		.....
	</div>
</body>
```
测试中将scroll事件绑定在div上
### js

**如果是function**
``` javascript
      const deBounce = function(fn, interval) {
        let timer = null;
        return function() {
          if (timer) {
            clearTimeout(timer);
          }
          timer = setTimeout(function() {
			// 此处的arguments是当前function函数的arguments，并非是return函数的arguments
			// 所以arguments参数中没有event对象
            fn.apply(this, arguments);
          }, interval);
        };
      };
      document.getElementById("wrapper").onscroll = deBounce(function(e) {
        console.log("this=>".padEnd(15), this); //window
        console.log("target=>".padEnd(15), e.target); //报错,e是undefined
        console.log("currentTarget=>", e.currentTarget);
      }, 1000);
```
这种情况下会报错，因为setTimeout里的函数不是箭头函数，arguments指向了当前的函数不是return的函数

**改为箭头函数**
``` javascript
      const deBounce = function(fn, interval) {
        let timer = null;
        return function() {
          if (timer) {
            clearTimeout(timer);
          }
          timer = setTimeout(()=> {
            fn.apply(this, arguments);
          }, interval);
        };
      };
      document.getElementById("wrapper").onscroll = deBounce(function(e) {
        console.log("this=>".padEnd(15), this); // <div id="wrapper"></div>
        console.log("target=>".padEnd(15), e.target); // <div id="wrapper"></div>
        console.log("currentTarget=>", e.currentTarget); // null
      }, 1000);
```
将setTimeout中的回调函数改为箭头函数后，由于箭头函数没有this也没有arguments，所以会向上级找，找到return的函数的this和arguments，return的函数直接绑定给了事件，所以this和e.target相同，currentTarget为何为null还没研究明白

**全改为箭头函数**

``` javascript
      const deBounce = (fn, interval) => {
        let timer = null;
        return () => {
          if (timer) {
            clearTimeout(timer);
          }
          timer = setTimeout(() => {
            fn.apply(this, arguments);
          }, interval);
        };
      };
      document.getElementById("wrapper").onscroll = deBounce(function(e) {
        console.log("this=>".padEnd(12), this);
        console.log("target=>".padEnd(12), e.target);
        console.log("currentTarget", e.currentTarget);
      }, 1000);
```
报错提示arguments is not defined，原因是箭头函数里没有arguments，那既然如此用es6的rest作为参数不就可以了吗

**箭头函数+rest参数**

``` javascript
      const deBounce = (fn, interval) => {
        let timer = null;
        return (...args) => {
          if (timer) {
            clearTimeout(timer);
          }
          timer = setTimeout(() => {
            fn.apply(this, args);
          }, interval);
        };
      };
      document.getElementById("wrapper").onscroll = deBounce((e)=> {
        console.log("this=>".padEnd(12), this); // window
        console.log("target=>".padEnd(12), e.target); //<div id="wrapper"></div>
        console.log("currentTarget", e.currentTarget); // null
      }, 1000);
```

能够正常运行，但是this指向window

### apply
因为我学js的时候es6已经出了，所以对以前的写法比如call和apply，平时在事件中也很少写this，基本使用的e.target，如果在上面的代码中将apply改为直接调用，那结果都是undefined,进过测试，想要让代码中的this指向正确的值，需要将return的函数和deBounce中传入的函数，都改为function函数才行

之前写代码，无论是什么函数，都是无脑const函数变量，万万没想到会有很大的影响，因为this和e.target不一定相等的，e.currentTarget应该和this相等，但是不知道为什么是null
