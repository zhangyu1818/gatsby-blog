---
title: ant-design之写一个可以拖拽的弹窗组件
date: "2018-10-02"
description: ""
---

思路很简单，就是创建一个react node的节点，在节点绑定事件，做简单的dom操作，代码有参照ant-design的issue中的解决方案
在单一弹窗的拖拽用使用没有问题

``` jsx
import React, { Component } from 'react';
import { Modal } from 'antd';

export default class DraggableModal extends Component {
  constructor(props) {
    super(props);
    const randomId =
      'modal_' +
      Number(
        Math.random()
          .toString()
          .substr(3, 8) + Date.now()
      ).toString(36);
    this.state = {
      id: randomId,
      visible: false,
    };
  }
  onMouseDown = e => {
    const { clientX, clientY } = e;
    if (!this.dragDom) {
      const modalWrapper = document.querySelector('.' + this.state.id);
      this.dragDom = modalWrapper.querySelector('.ant-modal-content');

      // 这两行代码,是多个弹窗拖拽
      // 因为ant-design的modal框，是放在一个body大小的fixed的div里的，这个div始终会拦截住事件
      // 多个弹窗话必须让fixed的div不接受点击事件，让被拖拽的div接受点击，才能穿透fixed的div蒙层
      // 问题是fixed的div不接受事件以后，滚动也不行了，所以多个窗口拖拽，就不能实现滚动的效果
      // 我的方法鱼和熊掌不可兼得吧

      // modalWrapper.style.pointerEvents = 'none';
      // this.dragDom.style.pointerEvents = 'all';
    }
    const left = parseInt(this.dragDom.style.left || 0);
    const top = parseInt(this.dragDom.style.top || 0);
    this.dragDomTop = clientY - top;
    this.dragDomLeft = clientX - left;
    document.addEventListener('mousemove', this.onMouseMove);
  };
  onMouseMove = ({ clientX, clientY }) => {
    this.dragDom.style.left = clientX - this.dragDomLeft + 'px';
    this.dragDom.style.top = clientY - this.dragDomTop + 'px';
  };
  onMouseUp = () => {
    document.removeEventListener('mousemove', this.onMouseMove);
  };
  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
  }
  render() {
    const title = (
      <div
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        style={{ cursor: 'move', userSelect: 'none' }}
      >
        {this.props.title}
      </div>
    );
    return (
      <Modal
        {...this.props}
        wrapClassName={[this.props.wrapClassName, 'draggable-modal', this.state.id].join(' ')}
        title={title}
      />
    );
  }
}

```
