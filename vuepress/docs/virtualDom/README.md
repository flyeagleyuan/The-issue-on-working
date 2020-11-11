## 何为虚拟 DOM

本质上虚拟 DOM 为一个普通的 javasceipt 对象，包含了描述特征的属性例如`tag,props,children`。

```js
let vNode = {
  tag: 'div', //元素标签
  props: {
    //属性
    className: 'aaa',
  },
  text: '这是个节点', //文本内容
  children: [], //子元素
};
```

以上对象，描述的就是一个虚拟`DOM`，我们可以把这个`js`对象转化为真实的`dom`。

## 为什么使用虚拟 DOM

因为真实的`DOM`非常耗性能，故`VUE`操作`dom`是通过虚拟`dom`，利用`DOM-diff`算法计算出需要更新的地方，然后精准的更新视图。这样可以大幅的提升`VUE`的性能。

## Vue 中虚拟 DOM 的特性

### 1. `vue`中用 VNode 类来表示上文提到的虚拟`dom`对象，源码如下：

```js
export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  fnContext: Component | void; // real context vm for functional nodes
  fnOptions: ?ComponentOptions; // for SSR caching
  devtoolsMeta: ?Object; // used to store functional render context for devtools
  fnScopeId: ?string; // functional scope id support

  constructor(
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function,
  ) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.elm = elm;
    this.ns = undefined;
    this.context = context;
    this.fnContext = undefined;
    this.fnOptions = undefined;
    this.fnScopeId = undefined;
    this.key = data && data.key;
    this.componentOptions = componentOptions;
    this.componentInstance = undefined;
    this.parent = undefined;
    this.raw = false;
    this.isStatic = false;
    this.isRootInsert = true;
    this.isComment = false;
    this.isCloned = false;
    this.isOnce = false;
    this.asyncFactory = asyncFactory;
    this.asyncMeta = undefined;
    this.isAsyncPlaceholder = false;
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child(): Component | void {
    return this.componentInstance;
  }
}
```

以上代码就是`Vue`源码中对 Vnode 的描述，`tag`是节点的标签名，`text`表示节点中包含的文本，`children`是该节点的子节点。`DOM`的所有特征都可以用属性表达。

### 2. vNode 的特征

VNode 的特征总结下来有一下几种

- 注释节点
- 文本节点
- 元素节点
- 组件节点
- 函数式组件节点
- 克隆节点

  #### 2.1. 注释节点

  #### 2.2. 文本节点

  #### 2.3. 元素节点

  #### 2.4. 组件节点

  #### 2.5. 函数式组件节点

  #### 2.6. 克隆节点
