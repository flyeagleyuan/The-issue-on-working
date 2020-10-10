
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
如何用`Object.defineProperty`改变后，检测属性的改变呢，请看

```js
let cat = {}
let age = 3
Object.defineProperty(cat,'age'{
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

## Array的侦测变化


