---
title: 使用hooks，简易管理表单字段
date: "2019-06-13 22:54"
description: ""
---

这两天在开发一个ios内嵌的页面，其实就是个挺简单的表单页面，不过ios说不好写样式，让我用h5做

那我也只有用react做了，移动端也没找着啥好的ui库，不过没了`ant design`表单字段确实不好管理,寻思着就做一个简单的表单字段管理`hook`了

首先，得理清思路，像`ant design`的`form`文档自定义组件讲的

> 提供受控属性 `value` 或其它与 `valuePropName` 的值同名的属性。<br/>
 提供 `onChange` 事件或 `trigger` 的值同名的事件。

由此可见，通过绑定的组件，都是受控组件，并且需要接受一个受控值`value`和改变值的函数`onChange`，组件通过`props`的`onChange`来修改表单对应的`value`值

有了个思路，开始写，第一步，需要创建一个存储表单值的对象，并且这个对象可以更新节点，所以需要用到`useState`

``` jsx
import React, { useState } from "react";

const useForm = () => {
    // 存表单字段
    const [formFields, setFields] = useState({});
}
```

接下来，写一个方法，用来改变表单中对应的字段值，这个方法需要作为`onChange`传递给绑定的组件，这里命名为`onFieldChange`

```jsx
    // 接收一个参数fieldName，返回一个函数接受value，用来更改表单字段
    const onFieldChange = fieldName => value => {
        // 判断一下参数是否是事件，如果是就从target.value取值
        if (typeof value === "object" && value.target) value = value.target.value;
        // useState回调函数可以获得上一次的state
        setFields(prev => ({ ...prev, [fieldName]: value }));
    };
```

接下来，需要一个绑定表单字段的方法，这个方法需要传入表单字段的键名和需要绑定的组件，并且将对应的`value`和`onChange`传递给该组件，写一个方法`createField`来实现

```jsx
    const createField = fieldName => {
        if (fieldName === undefined || fieldName === "")
            throw new Error("field must has name");
        return Component => {
            return React.cloneElement(Component, {
                value: formFields[fieldName],
                onChange: onFieldChange(fieldName)
            });
        };
    };
```

这里测试时遇见一个问题`Warning: A component is changing an uncontrolled input of type text to be controlled`

经过检查，是因为传递个给组件的`value`是`undefined`，因为`formFields[fieldName]`没有值，我尝试在这里用`setFields`进行赋值，但是会报错，说是一直`reRender`，想来`setState`是异步的，这样使用肯定是有错的，所以这个`hooks`需要传递一个初始值，包括了所有需要使用的字段键名，也就意味着无法动态的添加了

```jsx
const useForm = initialValue => {
    const [formFields, setFields] = useState(initialValue);
    // ...
    return {createField};
}
```
这样`createField`方法就会将组件变为受控组件，并保存对应表单字段的值

最后，再写两个方法`setFieldsValue`,`getFieldsValue`分别用来设置和获取表单值

```jsx
const useForm = initialValue => {
    const [formFields, setFields] = useState(initialValue);
    
    // onFieldChange...
    // createField...
    
    const setFieldsValue = fields => {
        setFields(prev => ({ ...prev, ...fields }));
    };

    const getFieldsValue = fields => {
        // 如果没有传参就返回所有字段
        if (fields === undefined) return formFields;
        return fields.reduce((values, field) => {
            values[field] = formFields[field];
            return values;
        }, {});
    };
    
    return {createField, setFieldsValue, getFieldsValue};
}
```
一个简单的表单字段管理`hooks`就完成了,不再需要单独给组件设置`state`值和`onChange`事件，使用看看
```jsx
function Form() {
  const form = useForm({ name: "zhang yu", phone: "", address: "chengdu" });
  const { createField, setFieldsValue, getFieldsValue } = form;
  const set = () => setFieldsValue({ name: "haha", phone: "18181919" });
  const get = () => console.log(getFieldsValue());
  return (
    <div>
      {createField("name")(<input type="text" />)}
      {createField("phone")(<input type="text" />)}
      {createField("address")(<input type="text" />)}
      <button onClick={set}>set</button>
      <button onClick={get}>get</button>
    </div>
  );
}
```
在此基础上，还可以添加一些功能，比如简单的验证

完整代码

[github](https://github.com/zhangyu1818/useform)
