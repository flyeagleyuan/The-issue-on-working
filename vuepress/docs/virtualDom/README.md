## 何为虚拟 DOM

本质上虚拟 DOM 为一个普通的 javasceipt 对象，包含了描述特征的属性例如`tag,props,children`。

```js
let vNode = {
  tag: 'div', //元素标签
  props: {    //属性
    className: 'aaa',
  },
  text: '这是个节点', //文本内容
  children: [],   //子元素
};
```
以上对象，描述的就是一个虚拟`DOM`，我们可以把这个`js`对象转化为真实的`dom`。

## 为什么使用虚拟DOM

因为真实的`DOM`非常耗性能，故`VUE`操作`dom`是通过虚拟`dom`，利用`DOM-diff`算法计算出需要更新的地方，然后精准的更新视图。这样可以大幅的提升`VUE`的性能。

## VUE种虚拟DOM的特性
1.