//数组的可侦测

## 1.序言

上一篇讲述了`object`的变化侦测方式，这一篇讲述`Array`的变化侦测。

因为`Array`常用的操作是`push`,`shift`,`unshift`,`pop`等。这些方法来自于数组的原型，其不能被`Object.defineProperty`侦测。故`Vue`对`Array`的变化侦测单独设计了数据监测
