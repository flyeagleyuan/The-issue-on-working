
## 介绍
vue主要是数据驱动试图，UI=render(state)
分为2部分，一个是Object的侦测变化，二是Array的侦测变化
主要是通过`Object.defineProperty`方法实现

## Object的侦测变化
如何使Object'可观测'，如下先定义一个数据对象cat
```js
let cat = {
  'age':3
}
```
如何用`Object.defineProperty`改变后，检测属性的改变呢，请看下面的例子

```js
let cat = {}
let age = 3
Object.defineProperty(cat,'age',{
  enumerable:true,
  configurable:true,
  get(){
    console.log('age属性被读取了')
    return age
  }
  set(newAge){
    console.log('age属性被修改了')
    age = newAge
  }
})
```
通过`Object.defineProperty()`方法给`cat`定义了一个`age`属性，针对这个属性的读和写分别使用`get()`和`set()`进行了拦截，当该属性被读或者写的时候就会触发`get()`和`set`。如下图：
![alt defineProperty拦截器](../images/01.png)

从图片可以看出，`cat`的属性读写都被监测到了。

怎么把`cat`的所有属性都可监测呢，如下

```js
// 源码位置：src/core/observer/index.js

/* *
*Observer类通过递归把一个对象所有的属性都转化为可观测对象
*/
export class Observer {
  value: any;

  constructor (value: any) {
    this.value = value
    //给value增加一个__ob__属性
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      //当value为数组时的逻辑
      // ···
    } else {
      this.walk(value)
    }
  }

  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }
}

/**
 * 使一个对象转化成可观测对象
 * @param { Object } obj 对象
 * @param { String } key 对象的key
 * @param { Any } val 对象的某个key的值
 */
function defineReactive (
  obj: Object,
  key: string,
  val: any,

) {

  const property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  const getter = property && property.get
  const setter = property && property.set
  //如果参数只有obj和key，那么val=obj[key]
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
    console.log(`${key}`属性被读取了)
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      console.log(`${key}`属性被修改了)
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
    }
  })
}
```
以上代码使`object`的属性可观测,同时给`value`新增`__ob__`属性，`__ob__`为`value`的`Observer`实例，这样做是为`value`打标记，表示它已经转化为响应式了，避免重复操作。




## Array的侦测变化


