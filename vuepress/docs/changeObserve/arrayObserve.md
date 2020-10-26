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

由于所有数据都是在 return 的`object`（即{}）中，所以如果使用`arr`,就必须从`object`中获取，而从`object`中获取就必然触发`arr`的`getter`。所以忍让可以从`getter`中收集依赖。

## 3.如何使 Array 可观测

上一章说明了如何收集依赖，即知道了`Array`如何读取。接下来分析当`Array`数据变化时如何得知。

### 3.1 分析

`object`的数据变化是在`setter`中得知的，但是`Array`的`setter`不能收集所有的`Array`的所有方法，所以要另寻他法。

因为`Array`的方法就只有 7 个`push,pop,shift,unshift,splice,sort,reverse`，我们可以把这些方法从写一边，例如

```js
let arr = [1, 2, 3, 4, 5];
arr.push(6);
Array.prototype.newPush = function (val) {
  console.log('arr被修改了');
  this.push(val);
};
arr.newPush(7);
```

上述例子中，`newPush`这个方法完全和原生`push`的方法功能一致。同时我们又可以在`newPush`中通知`Array`的变化

### 3.2 建立数组拦截器

根据上面的分析我们建立一个拦截器，这个拦截器在数组实例和`Array.prototype`之间，当数组实例使用数组的方法时，其实使用的是拦截器中重写过的方法。其源码如下

```js
// 源码位置：/src/core/observer/array.js

const arrayProto = Array.prototype;
export const arrayMethods = Object.create(arrayProto);

const methodsToPatch = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method];
  def(arrayMethods, method, function mutator(...args) {
    const result = original.apply(this, args);
    const ob = this.__ob__;
    let inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
    }
    if (inserted) ob.observeArray(inserted);
    // notify change
    ob.dep.notify();
    return result;
  });
});

//源码位置：/src/core/util/lang.js
export function def(obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true,
  });
}
```
