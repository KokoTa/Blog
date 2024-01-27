# React原理

## 什么是纯函数

1. 没有副作用(不改变旧值和其他值)
2. 返回一个新值

## JSX 本质

1. JSX 和 Vue Template 本质是一样的
2. Vue Template 不是 HTML
3. JSX 也不是 JS
4. 两者都会进行编译，最终通过 h 函数生成 vnode

[在线测试](https://babeljs.io/repl)

```jsx
// 编译前
const msg = "message"
const a = <div>
  <p>Hello</p>
  <p>World</p>
  <p>{msg}</p>
  <Component />
</div>

// 编译后
// React.createElement 就是 h 函数
// 第一个参数可能是组件，也可能是标签
// 组件是大写，标签是小写
const msg = "message";
const a = /*#__PURE__*/ React.createElement(
  "div",
  null,
  /*#__PURE__*/ React.createElement("p", null, "Hello"),
  /*#__PURE__*/ React.createElement("p", null, "World"),
  /*#__PURE__*/ React.createElement("p", null, msg),
  /*#__PURE__*/ React.createElement(Component, null)
);

```

## 合成事件

1. React < 17：所有事件挂载到 document 上，流程：`div -> document -> synthetic event -> dispatch event -> handler(绑定的函数)`。
2. React >= 17：所有事件挂载到 root 组件上，这样会利于多个 React 版本并存，比如微前端
3. event 不是原生的，是 SyntheticEvent 合成事件对象
4. event.nativeEvent 是原生事件对象
5. 通过 dispatchEvent 分发到具体处理函数
6. 和 Vue 事件不同，和 DOM 事件也不同

为什么要使用合成事件：

1. 更好的兼容和跨平台
2. 挂载到 document，减少内存消耗，避免频繁解绑
3. 方便事件的统一管理(如事务机制)

## setState 和 batchUpdate

主流程：

* `this.setState(newState) -> newState 存入 pending 队列 -> 检查是否处于 batchUpdate 状态`
* `是 -> 保存组件于 dirtyComponents 中 -> 即异步更新组件状态`
* `不是 -> 遍历所有 dirtyComponents -> 调用 updateComponent -> 更新 pending state or props -> 即同步更新组件状态`

如何判断是否处于 batchUpdate 状态：

```js
// 示例1
increase = () => {
  // React 会设置变量
  // isBatchUpdate = true
  this.setState({
    count: this.state.count + 1 // 此时 isBatchUpdate = true
  })
  // 当函数结束时
  // isBatchUpdate = false
}

// 示例2
increase2 = () => {
  // isBatchUpdate = true
  setTimeout(() => {
    // 上一篇中有提到 setTimeout 的情况下，会进行同步更新
    // 原因在于此时 isBatchUpdate = false
    this.setState({
      count: this.state.count + 1
    })
  })
  // isBatchUpdate = false
}

// 示例3
componentDidMount() {
  // isBatchUpdate = true
  document.body.addEventListener('click', () => {
    // 此时 isBatchUpdate = false
    this.setState({
      count: this.state.count + 1
    })
  })
  // isBatchUpdate = false
}
```

## 事务机制

```js
transaction.initialize = () => {
  console.log(1)
}
transaction.close = () => {
  console.log(2)
}
function method() {
  console.log(3)
}

transaction.perform(method)
// 1
// 3
// 2
```

## 组件渲染

1. 初次：`jsx -> props/state -> render -> vnode -> patch`
2. 更新：`setState -> dirtyComponents -> render -> vnode -> patch`

更新两阶段，patch 被拆分为两个阶段：

1. reconciliation 阶段：执行 diff 算法，纯 JS 计算
2. commit 阶段：将 diff 结果渲染为 DOM

为什么要分两阶段：

1. JS 是单线程，计算和渲染共用一个线程
2. 当组件复杂时，计算和渲染的压力会很大
3. 同时再有 DOM 操作需求(动画、鼠标拖拽等)，将会卡顿

fiber 实现两阶段：

1. reconciliation 阶段进行任务拆分(commit 无法拆分)
2. DOM 需要渲染时暂停任务，空闲时恢复
3. window.requestIdleCallback 用于空闲时恢复任务
