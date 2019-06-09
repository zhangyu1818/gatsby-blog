---
title: dva.js 初探索
date: "2018-09-29"
description: ""
---

由于后台管理项目需要使用 `Ant Design Pro` 搭建，于是熟悉了一下结构，发现了 dva。
阅读官网，我感觉 dva 是对 redux-sage 和 react-router 的再一层封装，将传统 redux 的 action，reducer，store 糅合在了一个文件中。

在 dva 里，数据只需要放在一个 js 文件的对象中，分为了 namespace、state、effects、reducers、subscription。
数据文件会自动匹配上，不需要上面配置，js 文件放入 models 文件夹里，数据就会自动加载进 store，特别的高级。

namespace 是当前的对象在总 state 中的键名，state 数据，effects 用于处理异步操作、执行多个 action，reducers 对当前数据进行修改操作，subscription 是订阅，不过看官网实力没明白什么，好像是 url 修改了会触发订阅的事件。

```javascript
export default {
  // 命名空间 即总state数据中的键名
  namespace: "dva",

  // state
  state: {
    count: 0,
  },

  // 用于处理action触发的异步操作
  effects: {
    *fetchCountNum({ payload }, { call, put, select }) {
      // select可以用于获取state
      const state = select(state => state);

      const num = yield call(/*异步函数*/);
      // 触发action执行reducers的方法
      yield put({
        type: "countAdd",
        payload: num,
      });
      // 可执行多个call或者put操作
      yield put({
        type: "doSomething",
        payload: data,
      });
    },
  },

  // action触发的操作
  reducers: {
    countAdd(state, { payload }) {
      return {
        count: state.count + payload,
      };
    },
  },

  // 目前测试学习暂时没用到，也不太明白，官网示例太少了
  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change,
      // trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== "undefined") {
          window.ga("send", "pageview", pathname + search);
        }
      });
    },
  },
};
```

effects 需要写 generator 函数，现在用 async/await 蛮多的，不过这里的写法大致差不多，call 用于执行异步的函数得到结果，put 触发 action，select 可以取得 state，除去 call、put、select，还可以得到 redux-saga 里的方法，不过我技术没这么好。
在配置文件中还可以将 dva-immer 打开，可以直接对 state 赋值操作，上面的 reducers 可以写为以下

```javascript
reducers: {
	countAdd(state, { payload }) {
	state.count += payload,
	},
}
```

不过这个 dva-immer 就更没有资料了，google 也木有，在 github 的 example 里 with-immer 看出了一点端倪，但是有 immer.js 的其它方法吗？
dva 里还提供了连接数据的 connect，可以用装饰器写法@connect，感觉很不错。
感觉 dva 挺不错的，就是文档太简单了，尤其是 api 就只有寥寥几句文字描述。
