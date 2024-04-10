# React相关

## React 和 Vue 的异同

1. 都支持组件化
2. 都是数据驱动视图
3. 都是用 vdom 操作 DOM
4. 前者使用 JSX 拥抱 JS，后者使用模板拥抱 HTML
5. 前者函数式编程(setState 去改变值)，后者声明式编程(直接改变值)
6. 前者需要更多的手动操作，比如性能优化和语法糖实现

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

React < 18:

1. 不可变值，即不更改原来的值，而是生成一个新的值去替换
2. 异步同步的情况
   1. 直接使用是异步的，需要在回调函数中获取最新值
   2. setTimeout 中是同步的
   3. 自定义 DOM 事件中是同步的
3. 数据合并的情况
   1. 传入对象时异步会合并，即多次 `setState({ count: this.state.count + 1 })` 只会累加一次，类似 `Object.assign`；同步不会合并
   2. 传入函数时异步同步都不会合并，即多次 `setState((preState, props) => { count: preState.count + 1 })` 会累加多次

```jsx
// React < 18 的情况
componentDidMount() {
  // 假设 count 初始为 0
  this.setState({ count: this.state.count + 1 })
  console.log(this.state.count) // 0
  this.setState({ count: this.state.count + 2 }, () => console.log(this.state.count)) // 2 (后者会覆盖前者的赋值)
  console.log(this.state.count) // 0
  setTimeout(() => {
    this.setState({ count: this.state.count + 1 })
    console.log(this.state.count) // 3
    this.setState({ count: this.state.count + 1 })
    console.log(this.state.count) // 4
  })
  setTimeout(() => {
    this.setState({ count: this.state.count + 1 })
    console.log(this.state.count) // 5
  })
}
```

React >= 18:

实现了 Automatic Batching 自动批处理

需要将 ReactDOM.render 替换为 ReactDOM.createRoot

此时没有同步了，全部都是异步

此时没有不合并了，全都是合并

另外：

setState 本质是同步的，但是被 React 做成了 “异步” 的样子

这个 “异步” 不是宏任务和微任务，只是执行顺序进行了调整，为了方便理解才叫 “异步”

即微任务 Promise.then 执行之前，state 已经计算完了

因为要考虑性能，多次 state 修改，只能进行一次 DOM 渲染

## 生命周期

[链接](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

Ajax 应该放在 componentDidMount 中

## 函数组件和 Class 组件的区别

1. 纯函数，输入 props，输出 JSX
2. 没有实例，没有生命周期，没有 state
3. 不能扩展其他方法

## 组件间如何通讯

1. 父子组件 props
2. 自定义事件(CustomEvent)
3. Redux/Context

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

1. 修改 CSS 模拟 v-show
2. 循环使用 key
3. 使用 Fragment 减少层级
4. JSX 中不要定义函数
5. 在构造函数中 bind this，而不是在 JSX 中
6. useMemo 缓存数据，useCallback 缓存函数
7. SCU(shouldComponentUpdate，默认返回 true)
   1. 为什么需要这个生命周期？因为 React 默认情况下，父组件更新，所有子组件都会更新，即使子组件数据没有发生变化，因此需要有一个生命周期来控制更新
   2. state 的值如果是数组，不能通过 `this.state.push()` 去添加新元素，因为这相当于更改了原始值，破坏了 immutable 的规则，同时由于修改了原始值，在 SCU 时新旧值将永远相同，无法判断是否可以更新
8. PureComponent 和 React.memo
   1. PureComponent 实现了 SCU 的浅比较，即第一层级比较
   2. memo 相当于函数组件中的 PureComponent
9. 合理使用 immutable.js
   1. 彻底拥抱不可变数据
   2. 和深拷贝不同，基于共享数据，速度更快
   3. 有一定学习和迁移成本
10. 合理使用异步组件
11. 路由懒加载
12. SSR
13. 自定义事件和DOM事件要及时销毁
14. webpack 优化
15. 前端通用优化，比如图片懒加载等

## React 中遇到的坑

1. 自定义组件名称要大写
2. JS 关键词冲突，比如 `class -> className，for -> htmlFor`
3. JSX 数据类型，比如 `<Demo flag="1" />，<Demo flag={1} />`
4. setState 是异步的

## 如何统一监听 React 组件报错

1. ErrorBoundary 组件
   1. 监听所有下级组件报错，还可以降级展示 UI
   2. 只监听组件渲染报错，不监听 DOM 事件、异步报错
   3. 只在 prod 环境生效，dev 环境会直接抛出错误

    ```js
    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props)
        this.state = { error: null }
      }
      static getDerivedStateFromError(error) {
        // 更新 state ，让下一次渲染显示降级后的 UI
        return { error }
      }
      componentDidCatch(error, info) {
        // 统计上报错误信息
        console.log(error, info)
      }
      render() {
        if (this.state.error) {
          return <h1>报错了</h1>
        }
        return this.props.children
      }
    }
    ```

2. try/catch，处理同步报错
3. window.error，处理同步和异步报错
4. window.onunhandledrejection，处理 Promise 报错

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

## Redux

* 单向数据流流程：
  1. action -> dispatch(middleware) -> reducer -> new state -> subscribe
  2. 中间件为什么要放在 dispatch 阶段？reducer 是一个纯函数，只是根据状态返回新值，因此不在这里加；action 只是生成一个信息对象，因此不在这里加；因此只能放在 dispatch 阶段中
* react-redux：
  1. provider
  2. connect
  3. mapStateToProps/mapDispatchToProps
* 异步 action：

  ```js
  // 同步action
  const add = (text) => ({
    type: 'ADD_ITEM',
    text
  })

  // 异步action(redux-thunk)
  const addAsync = (text) => {
    return (dispatch) => {
      fetch(url).then((res) => {
        dispatch(add(res.text))
      })
    }
  }
  ```

最新的 [redux]((https://cn.redux.js.org/introduction/examples#%E5%BC%82%E6%AD%A5)) 集成了 redux-thunk，实际工作中建议使用 [redux-toolkit](https://redux-toolkit.js.org/tutorials/quick-start)，写法类似 Vue3 的 Vuex

## React-Router 如何配置懒加载

```jsx
const Home = lazy(() => import('./Home'))
const About = lazy(() => import('./About'))

const App = () => (
  <Router>
    <Suspense fallback={<div>Loading...</div>}>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/about" component={About} />
      </Switch>
    </Suspense>
  </Router>
)
```

## 杂项

1. React 的事件是组合事件而非原生事件，这个和 Vue 是不一样的
2. React 可以通过 bind 传递参数，`onClick={this.fn.bind(this, a, b)}`，执行时会把 event 放入最后一个参数，`fn(a, b, eventt) {...}`
3. React 没有 Vue 的 v-model，需要自己实现，实现的组件可以称作受控组件
