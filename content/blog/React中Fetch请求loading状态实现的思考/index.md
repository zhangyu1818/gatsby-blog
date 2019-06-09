---
title: React中Fetch请求loading状态实现的思考
date: "2019-04-02"
description: ""
---

wordpress 大概用了半年多，也折腾了好些时候，但是发现了问题的所在：

1. 太笨重了，不得不说功能是很强大，插件、主题应有尽有，但是后台管理系统的复杂程度，不太适合仅仅做一个用于博客的网站
2. 作为一个前端，唯一能修改的就是页面样式，php 的代码一窍不通

所以最近着手在自己开发一个基于 Nodejs 的服务端和 React 的后台管理系统，做这个系统的时候，引出了我关于交互体验——loading 的思考

Loading 状态我觉得在后台管理系统中尤为重要，后台管理系统通常都是与数据打交道，CRUD，每次请求后如果页面没有任何的请求反馈，那可能都不知道到底有没有发出请求

在 React 中，如果使用 dva 或者直接就用 ant design pro，那么基于 dva 的数据流管理会自带一个 loading 状态，无论是全局，页面级，甚至只是一个 effect 请求，都会有相对于的 Loading 状态，这一点实在是非常方便，局限性就是，你只能用 dva

比如 class component 中，如果想在组件中保存一个 loading 的 state，由于 setState 是异步的，那么很可能代码就是如下

```javascript
	...
	this.setState({loading:true },()=>{
		// fetch
		fetch.then(()=>{
			this.setState({loading:false})
		})
  });
	...
```

实际上我并没有试过不把请求写在 setState 的 callback 里，因为 setState 是异步的，如果不写在 callback 里也许会出现和预期不一样的问题，也可能并没有什么问题～

这是在 class component 中的写法，但是 hooks 的出世，很少写 class 了，不是说 class 不好用，实在是 hooks 太方便，某些情况下我认为 class 还是很方便的，比如可以 this 可以存数据，不像 hooks 必须用 ref.current
在 hooks 里的问题就是，useState 并没有 callback，所以只能写成

```javascript
	...
	setLoading(true);
	await fetch...
	setLoading(false)
	...
```

或者是用 Promise 把 useState 改造一下，预想中 useState 都没有 callback，那 resovle 也不知道放在哪里执行，但是实际上可以达到效果的，可能是异步顺序执行的原因

但是每一个组件里，可能有多个 loading 的状态，管理起来是十分麻烦，命名也不好想

因为 dva loading 只能用 dva，但是我之前学习的 graphql，客户端用的 apollo client，它提供了查询的 React 组件，每一个查询组件可以对应一个自己的 loading，查询结果会通过 render props 的方式传递给 children 组件，着实好用，但是我觉得性能上也许不是最佳，因为观察组件发现会有额外的执行次数

我想象中，如果通过组件的方式，把 loading 状态传给子组件，把请求方法写在组件里，通过 render props 再传给子组件调用，感觉还是不错的，但是其中有一个很致命的问题，就是多个请求的情况，会发生多个请求组件嵌套的情况，这时候不仅是 jsx 看上去不美观，而且命名问题也会存在

```jsx
	...
	<Query cb={fetch}>
	{
		(loading1,fn1)=>(
		<Spin loading={loadng} onClick={fn1}>
			<Query cb={fetch}>
			{
				(loading2,fn2)=>(
				<Spin lading={loadng} onClick={fn2}>
					// 除去嵌套问题，loading和fn重名，eslint会报错
				</Spin>)
			}
			</Query>
		</Spin>)
	}
	</Query>
	...
```

另外一个想法就是通过 hooks 来实现，传入一个方法到自定的 hooks，传出一个 loading 和包装过的方法，感觉这个方法会更加实用一点，不过还没有想好怎么写

所以想完发现 dva loading 才真的很好用，佩服云谦大佬，我现在的程度还根本没法想出是如何实现的

这两天想做一个纯粹的极客，把电脑装成了 Manjaro，折腾了好久，过两天再写个记录，hackintosh 太复杂，我的 nuc8i7 好像还得换网卡，驱动也没有，所以还是努力工作，mac mini yes 吧～

最近家里事真的好烦，哎，可与人言无一二，越长大越觉得伯牙子期之神奇了，可能是我本身也不愿意和别人交流吧
