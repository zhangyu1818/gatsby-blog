---
title: 《你不知道的JavaScript》(上卷)笔记
date: "2019-05-06"
description: "一些知识点的记录..."
---

# 异常

- `ReferenceError` —— 作用域判别失败相关
- `TypeError` —— 作用域判别成功，但是对结果的操作是非法或不合理的，如引用`null`或`undefined`类型的值中的属性

# 作用域

## 查找

- 作用域查找会在找到第一个匹配的标识符时停止，在多层的嵌套作用域中可以定义同名的标识符，这叫做“遮蔽效应 ”（内层的标识符“遮蔽”了外部的标识符）（eslint 中存在不允许同名变量遮蔽的规则）

- 无论函数在那里被调用，也无论它如何被调用，它的词法作用域都只是函数被声明时所处的位置决定

## 动态更改作用域的方法

- `eval(...)`
- `with(...)`

由于引擎无法优化，并且在严格模式下也是禁用的，所以不要使用它们

# var,let,const

- `var`声明的变量会放在全局对象上（严格模式不会），而`let`和`const`不会如:

```javascript
var a = 1;
function foo() {
  console.log(this.a); // 1
}

const a = 1;
function foo() {
  console.log(this.a); // undefined
}
```

# this

- `this`是在运行时进行绑定的，并不是在编写时绑定，它的上下文取决于函数调用时的各种条件，`this`的绑定和函数声明的位置没有任何关系，只取决于函数的调用方法

- 默认绑定 —— `this`的默认绑定会指向全局对象
- 隐式绑定 —— 当函数引用有上下文对象时，隐式绑定规则会把函数调用中的`this`绑定到这个上下文对象，如`obj.foo() //this -> obj`
- 隐式丢失 —— `this`被隐式绑定的函数会丢失绑定对象，也就是说它会应用默认绑定（全局对象）,最常见的情况在回调函数，如:

```javascript
function foo() {
  console.log(this.a);
}

function doFoo(fn) {
  // fn其实引用的foo
  fn(); // <-- 调用位置
}

var obj = {
  a: 2,
  foo: foo,
};

var a = "oops,global"; // a是全局对象的属性

doFoo(obj.foo); // "oops,global"
```

虽然`obj.foo`通过了隐式绑定，但是在调用过程中，传入的实际是`obj.foo`的引用，引用的是`foo`函数本身，在调用时`fn()`是一个不带任何修饰的函数调用，因此应用了默认绑定

- 显示绑定 —— 使用`call`、`apply`、`bind`方法
- `new`绑定 —— 使用`new`来调用函数，或者说发生构造函数调用时，会自动执行下面的操作：
  - 创建(或者说构造)一个全新的对象
  - 这个新对象会被执行`[[Prototype]]`的连接(对象的`__proto__`指向该函数的`prototype`)
  - 这个新对象会被绑定到函数调用的`this`
  - 如果函数没有返回其他对象，那么`new`表达式中的函数调用会自动返回这个新对象

## 优先级

`new` > 显式绑定 > 隐式绑定 > 默认绑定

# 赋值表达式

```javascript
let a,
  b = () => {};
console.log((a = b));
```

赋值表达式会返回等号右边的值

# 不变性

- `Object.defineProperty` -> `writeable:false`,`configurable:false` —— 对象对应的值不能修改，不能再更改`defineProperty`
- `Object.preventExtensions` —— 禁止扩展，不能添加新属性
- `Object.seal` —— 密封，该方法实际上会调用`Objet.preventExtensions`并把所有属性标记为`configurable:false`
- `Object.freeze` —— 冻结，改方法实际上会调用`Object.seal`并把所有属性标记为`writable:false`

所有的不变性方法都是浅不变的，如值是数组能修改数组内的元素

# [[Get]]和[[Put]]

## [[Get]]

`obj.a`其实是实现了`[[Get]]`操作，有点像函数调用:`[[Get]]()`，如果在对象中查找到名称相同的属性，就会返回这个属性的值，否则就会遍历可能存在的`[[Prototype]]`链，如果无论如何都没有找到名称相同的属性，就会返回`undefined`;

## [[Put]]

`[[Put]]`被触发时，实际的行为取决于许多因素，包括对象中是否已经存在这个属性(这是最重要的因素)

- 如果存在
  - 属性是否是描述符？如果是并且存在`setter`就调用`setter`
  - 属性的数据描述符中`writable`是否是`false`，如果是，在非严格模式下静默失败，在严格模式下抛出`TypeError`异常
  - 如果都不是，将该值设置为属性的值
- 如果不存在
  - 如果这个属性存在于`[[Prototype]]`链上层并且没有被标记为只读(`writable:false`)，那么就会直接在该对象中添加一个新的属性，他是屏蔽属性(会屏蔽掉原型链上层的同名属性)
  - 如果这个属性存在于`[[Prototype]]`链上层并且被标记为只读(`writable:false`)，那么无法修改原型链上的已有属性或者在该对象上创建屏蔽属性，严格模式下回抛出错误，否则会被忽略，总之不会发生屏蔽
  - 如果在`[[Prototype]]`链上层存在这个属性并且它是一个`setter`，那么一定会调用这个`setter`，这个属性不会被添加(或者说屏蔽于)对象，也不会重新定义原型链上的这个`setter`

如果你希望在不存在的第二种和第三种的情况下也屏蔽原型链上层的同名属性，那就不能用`=`操作符来赋值，而是使用`Object.defineProperty()`

## 存在性

```javascript
const obj = {};
Object.defineProperty(obj, "a", { enumerable: true, value: 2 });
Object.defineProperty(obj, "b", { enumerable: false, value: 2 });

("a" in obj)(
  // true
  "b" in obj
); // true

obj.hasOwnProperty("a"); // true
obj.hasOwnProperty("b"); // true

for (let k in obj) {
  console.log(k, obj[k]);
}
// "a" 2

obj.propertyIsEnumerable("a"); // true
obj.propertyIsEnumerable("a"); // false

Object.keys(obj); // ["a"]
Object.getOwnPropertyNames(obj); // ["a","b"]
```

- `in` 操作符会检查属性是否存在于对象及其原型链中,而`hasOwnProperty()`只会检查属性是否存在于对象中，不会检查原型链
- `enumerable:false`的属性不会再`for...in`循环中遍历出来
- `Object.keys`会返回所有可枚举属性
- `Object.getOwnPropertyNames`只会查找对象直接包含的属性

读到继承、类的时候就草草的读完了，Js 中的类太难以让人理解了，`__protp__`,`prototype`,舍弃对象...什么的，感觉实际使用中并不太会深入的使用类，所以这部分没有细度，之前看的高设上的有些内容也忘记了，毕竟有了`class`，谁还会去写 es5 风格的类呢
