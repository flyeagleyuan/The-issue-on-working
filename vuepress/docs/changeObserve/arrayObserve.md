# 数组的双向绑定解析

## 1.序言

上一篇讲述了`object`的变化侦测方式，这一篇讲述`Array`的变化侦测。

因为`Array`常用的操作是`push`,`shift`,`unshift`,`pop`等。这些方法来自于数组的原型，其不能被`Object.defineProperty`侦测。故`Vue`对`Array`的变化侦测单独设计了数据监测

## 2.收集的位置

上一章我们知道数组常用的方法`push`,`shift`,`unshift`,`pop`等在`Array`的原型上，故不可使用`Object.defineProperty`。但我们在`Vue`中`data`的使用方式如下

```js
data(){
  return {
    arr:[1,2,3]
  }
}

```
由于所有数据都是在return的`object`（即{}）中，所以如果使用`arr`,就必须从`object`中获取，而从`object`中获取就必然触发`arr`的`getter`。所以忍让可以从`getter`中收集依赖。

## 3.如何使Array可观测