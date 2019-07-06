---
title: 《css世界》读书笔记
date: "2019-06-30 16:19"
description: "阅读记录"
---

# 块级元素、内联元素

1. 其实，一个元素拥有2个盒子，一个是外盒子，一个是内盒子，如`display:block`，其实是外盒子`block`，内盒子也是`block`，但是如`display:inline-block`，之所以表现为行内但是可以设置宽高的原因是外盒子为`inline`，内盒子为`block`，外盒子只是用来控制元素的表现形式，是块级还是内联，而内盒子才是控制元素属性，如`widht/height`。除此之外，还有标记盒子，如`display:list-item`前面的小点
2. 元素的宽度分为外部尺寸和内部尺寸，外部尺寸如`display:block`或者是绝对定位且同时有`left`和`right`的元素，他们的尺寸会默认撑满外部容器，内部尺寸即是由内部的元素决定，而非外部的容器，如元素内没有内容时，宽度为为0。
内部尺寸的首选最小宽度，即是外部容器宽为0时，元素的宽度，中文默认为每个汉字的宽度，英语是特定的连续子母组成的单词，如果想让英语也想汉字一样以每个子母为宽度需要设置`word-break:break-all`
3. `<input type="button"/>`和`<button/>`的一个区别就是`input`中默认是`white-space:pre`，不会换行
4. 替换元素就是指内容可以被替换的元素，如`<img>`


# 关于height:100%

`height:100%`的声明，如果父级的高度是`auto`，这时候`100%`是没有作用的，比如像结构如`<body><div></div></body>`，想给里层的`div`声明`height:100%`,就得给`body`也声明，`body`声明也不行，必须给`html`也声明上，这`width:100%`就十分不同，因为`width`的百分比是一定会生效的。这个在规范中给出了答案

> 如果包含块的高度没有显式指定（即高度由内容决定），并且该元素不是绝对定位，则计算值为`auto`。

而宽度的解释却是

> 如果包含块的宽度取决于该元素的宽度，那么产生的布局在css 2.1中是未定义的

实际按照包含块真实的计算值作为百分比计算的基数

## 那么如何让元素支持height:100%

1. 设置显式的高度
2. 使用绝对定位，不过值得注意的是绝对定位的元素`height:100%`的计算是依照祖先元素的`padding-box`，而平时是`content-box`，[见](https://demo.cssworld.cn/3/2-11.php)
3. 父级为`flex`并且`flex-direction:column`，子元素`flex:1`(使用弹性盒模型实现`height:100%`的效果)


# 关于padding

1. `padding`的计算默认是会增加元素尺寸的
2. 可以设置`box-sizing:border-box`解决，不过某种情况下，如`widht:80px;padding:0 60px`，这时`padding`足够大，`width`会失效，最终宽度为`120px`
3. 张鑫旭老师不推荐全局重置`box-sizing`，但是我认为这种方式的简易性和带来的副作用来看，是比宽度分离准则实现跟容易一点的，比如`ant-design`就是全局重置包括`before`和`after`
4. 通常认为内联元素的`padding`只影响水平方向不影响垂直方向，但是这种认识是不准确的，实际上内联元素的`padding`也会影响垂直方向的布局，[见](https://demo.cssworld.cn/4/2-1.php),只是因为内联元素垂直方向的行为完全受`line-height`和`vertical-align`的影响，所以感觉垂直方向没起作用，如果将父级高度设置为小于内联元素的高度并设置`overflow:scroll`，可以看到父级元素是出现了滚动条的！
5. 根据此特性，移动端可用于增加上下`padding`来增加点击判断的范围
6. `padding`不支持负值，但是支持百分比，这个的妙用就是把页面的banner图设置为宽高等比自适应，[见](https://demo.cssworld.cn/4/2-3.php)


# 关于margin

1. `margin`值可以为负，并且能够改变元素空间尺寸，如父级为`width:300px`，子元素为`margin:0 -20px`，这时候子元素宽度为340，此处的妙用，如`<ul><li>`里，每个`<li>`都`float:left`并且有`margin-right:20px`，这样最后一个`<li>`也有`margin-right`，用这个特性可以解决这个问题，就是给`<ul>`设置`margin-right:-20px`
2. 与`padding`不同的是内联元素的垂直方向的`margin`不管是内部尺寸还是外部尺寸都是没有影响的
3. 不包括浮动和绝对定位的块级元素的垂直方向会发生`margin`合并，关于父子级的合并，[见](https://demo.cssworld.cn/4/3-3.php)，解决这个问题的方法举例两种
    1.  父元素设置为块状格式化上下文元素，`overflow:hidden`
    2.  父元素设置一边的`border`
4. `margin`的合并规则
    1. 正正取最大值
    2. 正负值相加
    3. 负值取最小值
5. `margin`的合并在博客或者是公众号文章中是一个有意义的特性
6. `margin:auto`的填充规则
    1. 如果一侧为定值，一侧为`auto`则`auto`为剩余空间大小
    2. 如果两侧均为`auto`，则平分剩余空间
7. 如果子元素设置为绝对定位，同时`left:0;right:0;top:0;bottom:0`，这时候子元素再设置`width;height`,可以让子元素水平垂直居中，[见](https://demo.cssworld.cn/4/3-5.php)

# 内联元素

## 基线

1. css中的基线`baseline`，是英文字母`x`的下边缘线,`x-height`表示子母`x`的高度，`vertical-align:middle`并不是绝对的垂直居中对其，在`css`中`middle`值的是基线往上`1/2 x-height`高度，字体不同，同样会影响位置

## line-height

1. 对于非替换元素的纯内联元素，其可视高度完全由`line-height`决定
2. 每一行都有行距，包括第一行和最后一行，他们的行距叫做半行距，顾名思义它的高度就是完整的行距的一半，关于半行距，[见](https://demo.cssworld.cn/5/2-2.php)，设置`line-height:1`可以让元素和字体大小高度相同。
3. 行距的计算方式是`行距=line-height - font-size`，依据此公式，能计算出半行距的高度，如`line-height:1.5;font-size:14px`，半行距大小就是`(14px * 1.5 - 14px) / 2 = 3.5px`，由于`border`和`line-height`等传统css属性并没有小数像素的概念，因此需要取整，如果是文字上边距，则向下取整，如果是文字下边距，则向上取整
4. 当`line-height`为2时，半行距是一半文字的大小，两行文字之间的间隙差不多一个文字尺寸大小，如果`line-height`为1，则半行距是0，也就是两行文字会紧紧贴在一起，如果`line-height`为0.5，则此时的行距为负值，两行文字会重叠在一起，[见](https://demo.cssworld.cn/5/2-3.php)
5. `<img>`下面有空隙，原因不是因为`line-height`影响了替换元素，替换元素不会被`line-height`影响，这里作祟的是`幽灵空白节点`
6. 江湖流传一局说法 “单行文字垂直居中，只需要设置`line-height`等于`height`”，其实是有严重误导性的，实际只需要设置`line-height`，并且这里也只是近似垂直居中，如微软雅黑字体，就有大约1像素的下沉
7. 在不同的系统和不同浏览器，默认的中英文字体都是不同的，所以在实际开发中，对`line-height`重置是势在必行的
8. `line-height`值支持数值，长度，百分比，如`1.5`、`1em`、`150%`，其中百分比的计算是基于`font-size`计算的，最好使用数值，因为数值会继承，而其他只会继承父级计算后的结果


## vertical-align

1. `vertical-align`属性值大致分为以下4类
    1. 线性，如`baseline`(默认)、`top`、`middle`、`bottom`
    2. 文本类,如`text-top`、`text-bottom`
    3. 上标下标类，如`sub`，`super`
    4. 数值百分比类,如`20px`、`2em`、`20%`等
2. 关于`vertical-align`数值属性表现，[见](https://demo.cssworld.cn/5/3-2.php)，`vertical-align`的数值大小全部是基于基线位置计算的，所以`vertical-align:0`等于`vertical-align:baseline`
3. `vertical-align`的百分比计算值是相对于`line-height`计算值计算的，在实际网页开发中，百分比值不怎么实用
4. `vertical-align`属性生效的前提条件是：只能引用于内联元素以及`display`值为`table-cell`的元素，父元素必须设置`line-height`,才能让子元素的`vertical-align`属性生效，其中`table-cell`比较特殊，属性值要设置在`table-cell`元素上，子元素垂直对齐会有变化，[见](https://demo.cssworld.cn/5/3-4.php)
5. 块级元素中的图片，下方总是会留白，元凶便是`line-height`、`vertical-align`、幽灵空白节点，解决的办法 - [见](https://demo.cssworld.cn/5/3-5.php)

# float

1. `float`的特性
    1. 包裹性
    2. 块状化并格式化上下文（基本全部转换为`display:block`）
    3. 破坏文档流
    4. 没有任何`margin`合并
2. `float`本意是用于图文环绕的，高度塌陷也是标准

# BFC

1. 触发BFC的条件
    1. `<html>`根元素
    2. `float`的值不为`none`
    3. `overflow`的值为`auto`、`scroll`、`hidden`
    4. `display`的值为`table-cell`、`table-caption`和`inline-block`中的任意一个
    5. `position`的值不为`relative`和`static`
2. `overflow`
    1. `overflow:scroll`的元素，在`chrome`下，会计算容器的`padding-bottom`，而`ie`和`firefox`不会，所以最好不要给滚动元素设置`padding-bottom`
    2. `overflow:scroll`出现的滚动条会占用容器可以的宽度或高度，在`windows 7`下`ie7+`、`chrome`、`firefox`的滚动条宽度均为17px

# absolute

1. 如果祖先元素全是非定位元素，那子`absolute`元素实际上会在当前位置，而不是在浏览器左上方
2. `absolute`不一定需要父级有定位属性，基于`margin`位移即可，[见](https://demo.cssworld.cn/6/5-5.php)
3. 设置了`top`、`right`、`bottom`、`left`，才会真正绝对定位，此时`left:0;right:0`可以让元素有流体特性

# clip

为了更好的无障碍识别，一些网站如logo处，会写上网站的名称，用`text-indent`或`font-size:0`隐藏，另一种方式就是`clip`

`clip`生效的条件必须是`absolute`或者`fixed`，结合上面`absolute`所讲，父级并不需要定位，所以直接`position:absolute;clip:rect(0 0 0 0);`

# 层叠

层叠准则
1. 谁大谁上，`z-index`大的在上
2. 后来居上，层叠水平一致，层叠顺序相同时，`dom`流后面的会覆盖前面的

# font-size

`font-size`关键字属性分以下两类
1. 相对尺寸关键字
    1. `larger` 是`<big>`元素默认的`font-size`值
    2. `smaller` 是`<small>`元素默认的`font-size`值
2. 绝对尺寸关键字，仅受浏览器设置的字号影响
    1. `xx-large` `<h1>`元素计算值一样
    2. `x-large` `<h2>` ~~
    3. `large` `<h3>`元素计算值近似
    4. `medium` `<h4>`元素计算值一样，是浏览器`font-size`的默认值
    5. `small` `<h5>`元素计算值近似
    6. `x-small` `<h6>`~~
    7. `xx-small` 无对应元素


# 感想

购买以后才知道这本书内容不包括`css3`，读完后解决了我以前一直不是很明白的问题，如`line-height`和`vertical-align`，但是实际开发中，如果不考虑ie的兼容性，里面很多布局的技巧，直接用`display:flex`一把梭就好了

如果内容包含`css3`就更好了，希望能再读到张鑫旭大佬`css3`的书吧

笔记也记录的没啥营养含量……
