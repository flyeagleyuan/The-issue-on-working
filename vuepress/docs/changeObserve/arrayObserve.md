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
  // 把数组原来的方法缓存
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

上述代码主要进行的内容有： 首先继承`Array`原型的空对象`arrayMethods`，接下来在`arrayMethods`上使用`def`(即`Object.defineProperty`方法)，将数组的 7 个方法遍历封装。这样我们使用`Array`的方法时，实际使用的就是`arrayMethods`的方法`mutator`,在`mutator`中我们发送了`Array`的变化通知，然后返回了缓存的`Array`的方法`original`.

### 3.3 使用数组拦截器

如何使用拦截器？要把它挂载到数组实例与`Array.prototype`之间，如何挂载呢？只需要将数据的`__proto__`属性设置为拦截器`arrayMethids`即可，源码如下

```js{13-20}
const arrayKeys = Object.getOwnPropertyNames(arrayMethods);

export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor(value: any) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, '__ob__', this);
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods);
      } else {
        copyAugment(value, arrayMethods, arrayKeys);
      }
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }

  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk(obj: Object) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i]);
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray(items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  }
}

function protoAugment(target, src: Object) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

function copyAugment(target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i];
    def(target, key, src[key]);
  }
}
```

如上代码，即为之前分析的`Observer`类，在高亮位置，先判断`value`为`Array`时再判断浏览器是否支持，支持则调用`protoAugment`，把`value.__proto__=arrayMethods`，不支持则调用`copyAugment`函数把拦截器中重写的 7 个方法加到`value`上。这样我们就能监测数组的数据变化了。

## 4.依赖收集分析

### 4.1 数组依赖收集的不同

上面我们讲到数组的依赖收集依然在`getter`中，具体如何收集呢？我们看源码

```js{9,31-51,67,78}
//源码位置：/src/core/observer/index.js
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor(value: any) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, '__ob__', this);
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods);
      } else {
        copyAugment(value, arrayMethods, arrayKeys);
      }
      this.observeArray(value); //深度侦测
    } else {
      this.walk(value);
    }
  }
  observeArray(items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  }
}

export function observe(value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) {
    return;
  }
  let ob: Observer | void;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob;
}

export function defineReactive(obj: Object, key: string, val: any, customSetter?: ?Function, shallow?: boolean) {
  const dep = new Dep();

  const property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return;
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get;
  const setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  let childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value;
    },
    set: function reactiveSetter(newVal) {
      const value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return;
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return;
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    },
  });
}
```

1. 如上代码,在 9 行实例化一个收集器,此实例用来收集数组依赖.
2. 在`defineReactive`函数中，第 67 行先调用函数`observe`返回`Observer`的实例.
3. 在`observe`中,先判断当前的数据是否有`__ob__`属性（可以判断是否已经是响应式），如果有此属性则返回`Observer`实例，没有则创建新的实例`new Observer(value)`.
4. 在`defineReactive`函数中，`getter`函数的第 78 行调用`Observer`实例上的依赖管理器，收集依赖。

### 4.2 通知更新

只需要在拦截器中，通知即可,如下源码

```js{19}
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
```

在上面代码中第 19 行通知。分析：因为拦截器是挂载在数组原型`Array.prototype`上，所以第 6 行的`this`即为`Observer`类的实例，`this.__ob__`上可以找到依赖管理器`dep.notify()`方法，就可以通知依赖

## 5. 如何深度侦测

因为数组有可能深层嵌套,所以我们必须考虑子数据的数据变化侦测.实现代码如下

```js{18}
//源码位置：/src/core/observer/index.js
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor(value: any) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, '__ob__', this);
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods);
      } else {
        copyAugment(value, arrayMethods, arrayKeys);
      }
      this.observeArray(value); //深度侦测
    } else {
      this.walk(value);
    }
  }
  observeArray(items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  }
}
```

如上代码,第 18 行,当`value`为数组时调用`observeArray`函数,在此函数中遍历数组,通过`observe`函数将每一个子元素转化为可侦测的响应式数据.

### 6.缺点

因为我们数组是通过拦截器实现的变化可侦测,故下面这种情况拦截器拦截不到

```js
let arr = [1, 2, , 3];
arr[0] = 4; //通过下标修改数组中的数据
arr.length = 0; //通过修改数组长度清空数组
```

这 2 种情况不可监测,`Vue`用两个全局 API 解决这个问题`Vue.set`和`Vue.delete`,这两个 API 我们在后面的章节会讲解.

## 7.综述

1. 相对于`Object`,数组被访问时和`object`一样.
2. 但是被修改却不知道,于是我们创建了拦截器,使变化可侦测.同时针对数组可能存在的子数据我们进行了深度侦测.
3. 针对通过下标更改和数组长度修改,不可被侦测,我们通过全局 API`Vue.set`和`Vue.delete`解决.

至此所有`Array`的变化侦测分析完成
