---
title: 写一个非常简单的React Scroll组件
date: "2018-10-01 11:00"
description: ""
---

由于业务需要,点击 Tabs 栏，列表滚动到指定的位置，但是我比较笨，想半天也不知道怎么做到，网上找了下 react 的 scroll 组件又太复杂了，想念 vue 的第 16 天。
于是只有自己摸索了一晚上，写了一个异常简单的 scroll 组件，使用 css 做移动动画，拥有的功能只有 scrollToElement,~~并且不会动态适应内层元素高度~~，在 componentsdidupdate 里做了高度的更新判断，
代码如下

```javascript
import React, { Component } from "react";

export default class Scroll extends Component {
  wrapperEle = React.createRef();
  animateEle = React.createRef();

  static defaultProps = {
    // 滚动持续时间
    duration: 300,
    // 滚动速度
    distance: 100,
  };

  state = {
    scrollTop: 0,
  };

  componentDidMount = () => {
    //将实例传递出去，外面才能调用scrollToElement
    const wrapperEle = this.wrapperEle.current;
    const { bindInstance } = this.props;
    bindInstance && bindInstance(this);
    this.refresh();
    wrapperEle.addEventListener("mousewheel", this.scrollEvent);
  };
  componentWillUnmount = () => {
    const wrapperEle = this.wrapperEle.current;
    wrapperEle.removeEventListener("mousewheel", this.scrollEvent);
  };
  componentDidUpdate = () => {
    // 如果更新时高度不一致则重新计算
    const wrapperHeight = this.wrapperEle.current.offsetHeight;
    const innerHeight = this.animateEle.current.clientHeight;
    if (
      this.wrapperHeight !== wrapperHeight ||
      this.innerHeight !== innerHeight
    )
      this.refresh();
  };
  scrollEvent = e => {
    // 滚动的时候设置scrollTop,做一下边界判断
    const { distance } = this.props;
    const ele = this.animateEle.current;
    ele.style.transition = "none";
    const { scrollTop } = this.state;
    if (e.deltaY > 0) {
      //向下滚
      let nextOffset = scrollTop - distance;
      if (nextOffset < -this.maxOffset) nextOffset = -this.maxOffset;
      this.setState(() => ({
        scrollTop: nextOffset,
      }));
    } else {
      //向上滚
      let nextOffset = scrollTop + distance;
      if (nextOffset > 0) nextOffset = 0;
      this.setState(() => ({
        scrollTop: nextOffset,
      }));
    }
  };
  //移到里层的某个元素
  scrollToElement = element => {
    const { duration } = this.props;
    const ele = this.animateEle.current;
    ele.style.transition = `all ${duration}ms`;
    const top = element.offsetTop;
    this.setState({
      scrollTop: top > this.maxOffset ? -this.maxOffset : -top,
    });
  };
  //计算高度
  refresh = () => {
    //计算里层高度和最大偏移
    //如果里层元素不够高，就不初始化了
    const wrapperEle = this.wrapperEle.current;
    const animateEle = this.animateEle.current;
    const wrapperHeight = wrapperEle.clientHeight;
    const innerHeight = animateEle.offsetHeight;
    if (wrapperHeight >= innerHeight) return;
    //计算wrapper元素的高度做最大偏移计算
    const padding =
      parseInt(getComputedStyle(wrapperEle).paddingTop) +
      parseInt(getComputedStyle(wrapperEle).paddingBottom);
    this.wrapperHeight = wrapperHeight;
    this.innerHeight = innerHeight;
    this.maxOffset = innerHeight - wrapperHeight + padding;
  };

  render() {
    const { scrollTop } = this.state;
    const { style, className } = this.props;
    return (
      <div
        ref={this.wrapperEle}
        className={className}
        style={{
          position: "relative",
          overflow: "hidden",
          ...style,
        }}
      >
        <div
          ref={this.animateEle}
          style={{
            transform: `translateY(${scrollTop}px)`,
          }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}
```

**可以传递的 props**

 - className 类名
 - style 样式
 - duration 动画的持续时间
 - distance 鼠标滚轮移动的距离

组件需要定高，可以用 style 传递
外层需要传递回调函数得到组件实例，才能调用 scrollToElement 方法

```javascript
<Scroll
  bindInstance={scrollEle => (this.scrollEle = scrollEle)}
  style={{ height: "400px" }}
>
  <div />
  <div />
  <div />
  <div />
  <div />
  ...
</Scroll>;
// 调用
this.scrollEle.scrollToElement(/*one element*/);
```

如果打出 this.scrollEle 可以看到就是类里的一堆东西，虽然不懂为什么，连里面的 this 指向我都不明白
但是我觉得没有 private 的类真的有点难受，暴露了根本不想暴露的东西……希望能快点更新新特性！
虽然很弱智，并没有人会用我这个组件，但是我想了一晚上
我希望有一天，我能够写出 better-scroll 这样牛皮的组件。
