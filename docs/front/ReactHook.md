# ReactHook

## class 组件和函数组件

函数组件特点：

`见 React基础.md` -> `函数组件和 Class 组件的区别`

Class 组件的问题：

1. 大型组件难拆分和重构，很难测试(即 Class 组件不易拆分)
2. 相同业务逻辑，分散到各个方法中，逻辑混乱(比如挂载和更新时都要获取数据，需要写两遍)
3. 复用逻辑变得复杂(比如 Mixins/HOC/Render Props)

函数组件的优势：

1. React 提倡函数式编程，view = fn(props)
2. 函数更灵活，更容易拆分，更容易测试
3. 但函数组件太简单，需要 Hook 增强能力

## Hook 解决了什么问题

1. 逻辑分割
2. 逻辑复用
3. 避免 this
4. 保存函数组件状态

## Hook 如何模拟组件周期

useEffect 可以用来模拟 挂载/更新/卸载

```jsx
function Component() {
  const [count, setCount] = useState(0);

  // 模拟 didMount + didUpdate
  // 第二个参数不传，任意操作都会触发
  useEffect(() => {
    console.log(1)
  })

  // 模拟 didMount
  // 不依赖任何变量，只触发一次
  useEffect(() => {
    console.log(2)
  }, [])

  // 模拟 didMount + didUpdate
  // 依赖 count 变量，count 初始化和更新时会触发
  useEffect(() => {
    console.log(3)
  }, [count])

  // 模拟 willUnmount
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log(4)
    }, 1000)
    
    return () => {
      clearTimeout(timer)
    }
  }, [])

  return <div onClick={() => setCount(count + 1)}>
    count: {count}
  </div>;
}
```

纯函数是没有副作用的，即输入参数、返回结果

所谓副作用就是对函数之外造成影响，比如定时器

函数组件需要副作用，所以需要 Hook 钩到纯函数中

## useEffect 返回函数 fn 的注意事项

1. useEffect 依赖 []，则组件销毁时执行 fn，等于 willUnmount
2. useEffect 无依赖或依赖 [count]，则组件更新或销毁时执行 fn，即下次执行 effect 之前执行 fn

## useRef/useContext/useReducer/useMemo/useCallback

useRef:

```jsx
function Component() {
  const btnRef = useRef(null);

  useEffect(() => {
    console.log(btnRef.current)
  }, [])

  return <div>
    <button ref={btnRef}>按钮</button>
  </div>
}
```

useContext:

```jsx
// useContext
const themes = {
  light: {},
  dark: {}
}

const ThemeContext = React.createContext(themes.light);

function App() {
  return <ThemeContext.Provider value={themes.dark}>
    <Component />
  </ThemeContext.Provider>
}

function Component() {
  const theme = useContext(ThemeContext);

  return <div style={theme}></div>
}
```

useReducer:

```jsx
const initState = { count: 0 }

const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    default:
      return state
  }
}

function Component() {
  const [state, dispatch] = useReducer(reducer, initState)

  return <div onClick={() => dispatch({ type: 'increment' })}>{state.count}</div>
}
```

useReducer 和 redux 的区别：

1. 前者是 useState 的替代方案，用于 state 复杂变化
2. 前者是单组件的状态管理，组件通讯还是需要 props
3. 后者是全局的状态管理，多组件共享数据

useMemo:

```jsx
// React 默认情况下父组件刷新，所有子组件也会刷新
// class 组件通过 SCU 和 PureComponent 实现
// 函数组件通过 useMemo 实现，两者原理相同
const Component = memo({ userInfo }) => {
  return <div>{userInfo.name}</div>
}

const App = () => {
  const [count, setCount] = useState(0)

  const userInfo = useMemo(() => {
    return { count, name: 'koko' }
  }, [count])

  return <Component userInfo={userInfo} />
}
```

useCallback:

```jsx
// useMemo 用于数据，useCallback 用于函数
const Component = memo({ onChange }) => {
  return <input onChange={onChange} />
}

const App = () => {
  const onChange = useCallback(() => {
    console.log(e.target.value)
  }, [])

  return <Component onChange={onChange} />
}
```

## 如何自定义 Hook

```jsx
// 举一个 axios 的例子
function useAxios(url) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    axios.get(url).then(res => {
      setData(res.data)
    }).catch(err => {
      setError(err)
    }).finally(() => {
      setLoading(false)
    })
  }, [url])

  return [loading, data, error]
}

function Component() {
  const [loading, data, error] = useAxios('/api/user')

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return <div>{data}</div>
}
```

## Hook 使用规范

1. 命名以 use 开头，比如 useState
2. 只能用于函数组件或自定义 Hook 中
3. 只能用于顶层代码，不能在循环、判断中使用
4. 可以使用 eslint-plugin-react-hooks 插件检查规范

## Hook 的顺序很重要

1. class 组件不会销毁，且有实例；函数组件，调用完就销毁，没有实例，因此需要有 Hook 帮忙
2. 函数组件第一次调用时，Hook 会保存状态，第二次调用时 Hook 会读取状态，因此需要有机制保证读取正确
3. Hook 的状态会通过其声明的顺序做上标记，后续通过该标记读取对应的状态，因此 Hook 不能出现在循环、判断中，否则容易出现标记混乱

## Hook 与 HOC 和 Render Props 相比，逻辑复用上有什么优势

class 组件逻辑复用方式：

1. Mixins(已废弃)
2. HOC
   * 缺点：
     1. 组件层级嵌套过多，不易渲染，不易调试
     2. HOC 会劫持 props，必须严格规范，否则容易出疏漏
3. Render Props
   * 缺点：
     1. 学习成本高，不易理解
     2. 只能传递纯函数，默认情况下纯函数功能有限

Hook 做逻辑复用的优势：

1. 完全符合 Hook 原有规则，没有其他要求，容易理解记忆
2. 变量作用域明确
3. 不会产生组件嵌套

## Hook 注意事项

1. useState 只会初始化一次：即如果初始化时传入一个变量，则以变量的初始值为准，变量变化不会重新设值
2. useEffect 如果依赖为空数组，则拿到的值永远是初始值：这是因为此时 effect 只会执行一次，而初始值被传入 effect 函数闭包中，取值取的是闭包值。解决方法是不传第二个参数，或者不使用 useState，改为使用 useRef。

    ```jsx
    function Component() {
      const [count, setCount] = useState(0)

      useEffect(() => {
        console.log(count) // 永远为 0
        const timer = setInterval(() => {
          setCount(count + 1) // 0 + 1 = 1
        }, 1000)
        return () => clearTimeout(timer)
      }, []) // 依赖为空，count 将一直为初始值 0

      return <div>{count}</div> // 永远为 1
    }
    ```

3. useEffect 如果依赖的项为数组或对象，可能出现死循环：这是因为 effect 使用 `Object.is` 做对比，依赖项如果用引用类型可能出现值相同但内存地址不同的情况。解决方法是把依赖项解构出来。
