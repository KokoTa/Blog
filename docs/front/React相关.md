# React相关

## Class 的函数为什么需要绑定 this

因为在 JSX 中我们给元素绑定事件的写法通常是 `onClick={this.fn}` ，点击调用时 this 指向就不为实例了，所以需要手动绑定 this；使用静态方法的写法则不需要绑定 this

```js
class Test {
  constructor() {
    this.fn = this.fn.bind(this)
  }

  fn() {
    console.log(this)
  }

  fn2 = () => {
    console.log(this)
  }

  test() {
    const fn = this.fn // 相当于 onClick={this.fn}
    fn()
    const fn2 = this.fn2
    fn2()
  }
}

const t = new Test()
t.test()
```

## setState

React <= 17:

1. 不可变值，即不更改原来的值，而是生成一个新的值去替换
2. 可能是异步更新
   1. 直接使用是异步的，需要在回调函数中获取最新值
   2. setTimeout 中是同步的
   3. 自定义 DOM 事件中是同步的
3. 可能会被合并
   1. 传入对象时会合并，即多次 `setState({ count: this.state.count + 1 })` 只会累加一次，类似 `Object.assign`
   2. 传入函数时不会合并，即多次 `setState((preState, props) => { count: preState.count + 1 })` 会累加多次

React >= 18:

实现了 Automatic Batching 自动批处理

没有同步了，全部都是异步

没有不合并了，全都是合并

## 生命周期

[链接](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

## 函数组件

1. 纯函数，输入 props，输出 JSX
2. 没有实例，没有生命周期，没有 state
3. 不能扩展其他方法

## 受控组件和非受控组件

受控组件： 在React中，当表单输入元素（如 `<input>`）的值通过React组件自身的state来管理时，这个组件就是受控组件。这意味着组件渲染时，其value属性会绑定到state的一个变量上；同时，通过onChange事件处理器更新这个state变量，确保每当用户输入时，组件的状态和显示的值都会同步更新。因此，React在整个过程中严格控制了表单数据的输入和变化。

非受控组件： 相反，非受控组件的值不由React state直接管理，而是由DOM原生地处理。这种情况下，表单元素不会提供一个与state关联的value属性，用户的输入直接改变DOM元素内部的value。开发者若需要获取当前的输入值，通常会借助ref对象访问DOM节点。这种方式下，React不主动控制或监听表单字段的变化，表单状态的维护更加接近传统的HTML表单行为，但可能会导致对实时输入状态跟踪的复杂性增加。

非受控组件特点：

1. ref
2. defaultValue/defaultChecked
3. 手动操作 DOM 元素

二者区别：

1. 受控组件一般用于 input/radio/checkbox/select
2. 非受控组件一般用于 file/富文本编辑器
3. 优先使用受控组件

## Portals

类似 Vue3 的 teleport，让组件渲染到父组件之外

`ReactDOM.createPortal(..., document.body)`

使用场景：

1. 父组件 `overflow: hidden` 的情况，限制了子组件展示
2. 父组件 `z-index` 太小的情况，限制了子组件展示
3. 有 fixed 需求的子组件的情况，需要放置到第一层级(body)上

## Context

用于跨组件传递信息

通过 `<XXXContext.Provider value={...}>{ ... }</XXXContext.Provider>` 声明 context

class 组件通过 `static contextType = XXXContext` + `this.context` 获取 context

function 组件通过 `<XXXContext.Consumer>{ value => ... }</XXXContext.Consumer>` 获取 context

## 异步组件

```js
const TestComp = React.lazy(() => import('./TestComp'))

function App() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <TestComp />
    </React.Suspense>
  )
}
```

## 性能优化

1. SCU(shouldComponentUpdate，默认返回 true)
   1. 为什么需要这个生命周期？因为 React 默认情况下，父组件更新，所有子组件都会更新，即使子组件数据没有发生变化，因此需要有一个生命周期来控制更新
   2. state 的值如果是数组，不能通过 `this.state.push()` 去添加新元素，因为这相当于更改了原始值，破坏了 immutable 的规则，同时由于修改了原始值，在 SCU 时新旧值将永远相同，无法判断是否可以更新
2. PureComponent 和 React.memo
   1. PureComponent 实现了 SCU 的浅比较，即第一层级比较
   2. memo 相当于函数组件中的 PureComponent
3. immutable.js
   1. 彻底拥抱不可变数据
   2. 和深拷贝不同，基于共享数据，速度更快
   3. 有一定学习和迁移成本

## 高阶组件(HOC)

高阶组件不是功能，而是一种设计模式

```js
const HOCFactory = (Component) => {
  return class HOC extends React.Component {
    // 在这里定义多个组件的公共逻辑
    render() {
      return <Component {...this.props} /> // 将 HOC 组件传入的参数透传到 Component 中
    }
  }
}

const EnhancedComponent = HOCFactory(TestComponent)
```

## Render Props

也是一种设计模式，组件把自身的 state 传递给传入的 render 函数组件

```js
class Test extends React.Component {
  constructor(props) {
    this.state = { x: 1 }
  }

  render() {
    return <div>{this.props.render(this.state)}</div>
  }
}

const App = () => <Test render={({ x }) => { return <span>{x}</span>}} />
```

HOC 和 Render Props 区别：

1. 前者模式简单，但是会增加组件层级
2. 后者代码简洁，但是学习成本高一点

## 杂项

1. React 的事件是组合事件而非原生事件，这个和 Vue 是不一样的
2. React17 开始，事件就不再绑定到 document 上了，而是绑定到 root 组件上，这样会利于多个 React 版本并存，比如微前端
3. React 可以通过 bind 传递参数，`onClick={this.fn.bind(this, a, b)}`，执行时会把 event 放入最后一个参数，`fn(a, b, eventt) {...}`
4. React 没有 Vue 的 v-model，需要自己实现，实现的组件可以称作受控组件
