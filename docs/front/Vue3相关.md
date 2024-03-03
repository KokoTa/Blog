# Vue3相关

## Vue3 比 Vue2 有什么优势

1. 性能更好
2. 体积更小
3. 更好的 TS 支持
4. 更好的代码组织
5. 更好的逻辑抽离
6. 更多新功能

## Vue3 生命周期

1. Options API：
   1. beforeDestroy 改成 beforeUnmount
   2. destroyed 改成 unmounted
   3. 其他沿用 vue2 的生命周期
   4. 即 `beforeCreate -> created -> beforeMount -> mounted -> beforeUpdate -> updated -> beforeUnmount -> unmounted`
2. Composition API：
   1. setup 相当于 beforeCreate + created
   2. `onBeforeMount -> onMounted -> onBeforeUpdate -> onUpdated -> onBeforeUnmount -> onUnmounted`
   3. 触发会比 Options API 早，比如会先触发 `onMounted`，再触发 `mounted`

## 如何看待 Composition API 和 Options API

1. 前者带来了更好的 代码组织(通过 useXXX 将代码组织成独立块)、逻辑复用(代码块复用)、类型推导(避免了 this.xx 这种不确定的引用)
2. 两者不建议共用，会引起混乱
3. 中大型项目、逻辑复杂，推荐用前者
4. 小型项目、逻辑简单，推荐用后者

## 如何理解 ref/toRef/toRefs

**ref:**

1. 可以生成值类型的响应式数据
2. 可以获取元素引用
3. 可用于模板和 reactive
4. 通过 .value 修改值

**toRef:**

1. 针对一个响应式对象(reactive) 的属性，转为一个 ref
2. 让这两者保持引用关系
3. 防止属性失去响应式

4. ```js
   // 用法示例

   const obj = reactive({
     name: 'Brain',
     age: 28
   })

   const nameRef = toRef(obj, 'name')

   // obj.name 改变会影响 nameRef
   // nameRef 改变会影响 obj.name
   ```

**toRefs:**

1. 将响应式对象(reactive) ，转为一个普通对象
2. 普通对象中的每个属性，都是一个 ref
3. 让这两者保持引用关系
4. 防止解构失去响应式

5. ```js
   // 用法示例

   const obj = reactive({
     name: 'Brain',
     age: 28
   })

   const objAsRefs = toRefs(obj)

   // obj.name 改变会影响 objAsRefs.name
   // objAsRefs.name 改变会影响 obj.name
   ```

**最佳实践**:

1. reactive 做对象响应式，ref 做值响应式
2. setup 中返回 toRefs(obj)，或者 toRef(obj, 'xxx')
3. ref 变量都使用 xxRef 命名
4. 合成函数(hook)返回对象，使用 toRefs，保证响应式

**为何需要**：

1. 为何需要 ref：
   1. 返回 `值类型`，会丢失响应式
   2. computed、合成函数、setup 都可能返回 `值类型`
   3. 如果不定义 ref，用户会自己 hack ref 来实现响应式，产生混乱
2. 为何需要 .value：
   1. ref 是一个对象，value 存储值
   2. 通过 .value 的 get/set 实现响应式
   3. 用于 模板/reactive 时，不需要 .value，其他情况都需要

   4. ```js
      // 通过 .value 将值类型转为对象的属性值
      // 通过对象的引用特性完成值更新

      function computed(getter) {
        let ref = {
          value: null
        }
        setTimeout(() => {
          ref.value = getter()
        }, 1000)
        return ref
      }
      // 1s 后获取的值为 100
      const a = computed(() => 100)

      function computed2(getter) {
        let value = null
        setTimeout(() => {
          value = getter()
        }, 1000)
        return value
      }
      // 1s 后获取的值为 null
      const b = computed2(() => 100)
      ```

3. 为何需要 toRef 和 toRefs：
   1. 不丢失响应式的情况下，把对象数据 分解/扩散(解构)
   2. 针对的是响应式对象(reactive)，而非普通对象
   3. 它们不创造响应式，而是延续响应式

## Vue3 更新了什么

1. createApp

   1. ```js
      const app = createApp(...)
      app.use(...)
      app.mixin(...)
      app.component(...)
      app.directive(...)
      app.mount(...)
      ```

2. emits 属性

   1. ```js
      export default {
        emits: [...],
        setup(props, { emit }) {}
      }
      ```

3. 生命周期变化
4. 多事件

   1. ```html
      <button @click="one($event), two($event)">submit</button>
      ```

5. Fragment
   1. template 标签下可以存在多个根节点了
6. 移除 .sync
   1. 把 .sync 的功能合并到 v-model 上了
7. 异步组件写法变化
8. 移除 filter
9. teleport
   1. 将组件挂在到指定元素上，比如 body
   2. 可以用来实现诸如弹出层的功能
10. suspense
    1. 异步加载组件时提供占位功能
11. composition api
    1. ref
    2. reactive
    3. readonly
    4. watch/watchEffect
    5. setup
    6. 生命周期钩子

## Composition API 如何进行代码逻辑复用

1. 抽离逻辑代码到一个函数
2. 函数命名约定为 useXXX(和 React 一致)
3. 在 setup 中引用

[例子](https://juejin.cn/post/7149112176500801566)

## Vue3 如何实现响应式

**Proxy 的使用：**

```js
const data = ['a', 'b', 'c']

const proxyData = new Proxy(data, {
  get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver) // receiver 就是数据本身，返回布尔值，表示是否操作成功
    console.log('get', key)
    return res
  },
  set(target, key, value, receiver) {
    const res = Reflect.set(target, key, value, receiver)
    console.log('set', key, value)
    return res
  },
  deleteProperty(target, key) {
    const res = Reflect.deleteProperty(target, key)
    console.log('delete', key)
    return res
  }
})

proxyData.push('d')
// get push
// get length
// set 3 d
// set length 4
```

上述的代码在 push 时，会触发两次 get，这不是我们想要的

因为如果后续要触发渲染，那么就会渲染两次，而且本身 get push 这个行为就是多余的

这里可以排除掉原型事件，比如 push/pop 等，使用 `Reflect.ownKeys` 过滤掉

push 也会触发两次 set，由于 set 3 d 之后，length 已经是 4 了，不需要重复再 set length 4 了

这里可以排除掉重复操作，使用 `值对比` 过滤掉

```js
const data = ['a', 'b', 'c']

const proxyData = new Proxy(data, {
  get(target, key, receiver) {
    // 只处理本身的属性(非原型属性)
    const keys = Reflect.ownKeys(target)
    if (keys.includes(key)) {
      console.log('get', key)
    }

    // 正常执行，不影响赋值
    const res = Reflect.get(target, key, receiver)
    return res
  },
  set(target, key, val, receiver) {
    // 重复的数据不处理
    const oldVal = target[key]
    if (val === oldVal) return true

    const res = Reflect.set(target, key, val, receiver)
    console.log('set', key, val)
    return res
  },
  deleteProperty(target, key) {
    const res = Reflect.deleteProperty(target, key)
    console.log('delete', key)
    return res
  }
})

proxyData.push('d')
// get length
// set 3 d
```

**Reflect 的作用**：

1. 和 Proxy 能力一一对应
2. 规范化、标准化、函数式，比如把 `delete xx` 改成 `Reflect.deleteProperty`
3. 代替掉 Object 上的工具函数，比如把 `Object.getOwnPropertyNames` 改成 `Reflect.ownKeys`

**基于上面的知识实现响应式：**

```js
function reactive(data) {
  // 判断是否是数组或对象(函数不考虑)
  if (typeof data !== 'object' || data == null) {
    return data
  }

  const proxyConfig = {
    get(target, key, receiver) {
      // 只处理本身的属性(非原型属性)
      const keys = Reflect.ownKeys(target)
      if (keys.includes(key)) {
        console.log('get', key)
      }

      // 正常执行，不影响赋值
      const res = Reflect.get(target, key, receiver)
      // 递归，深度监听
      // 相比于 vue2 一次性全部设置监听，vue3 只在获取时设置监听，是惰性的
      return reactive(res)
    },
    set(target, key, val, receiver) {
      // 重复的数据不处理
      const oldVal = target[key]
      if (val === oldVal) return true

      // 判断是否是新增属性
      const keys = Reflect.ownKeys(target)
      if (!keys.includes(key)) {
        console.log('add', key)
      } else {
        console.log('update', key)
      }

      const res = Reflect.set(target, key, val, receiver)
      console.log('set', key, val)
      return res
    },
    deleteProperty(target, key) {
      const res = Reflect.deleteProperty(target, key)
      console.log('delete', key)
      return res
    }
  }

  const observed = new Proxy(data, proxyConfig)
  return observed
}

// 测试
const data = {
  name: 'KokoTa',
  info: {
    city: 'Xiamen'
  },
  arr: [1]
}

const proxyData = reactive(data)

proxyData.name = 'a'

console.log(proxyData.info.city)

proxyData.age = 28

```

**使用 Proxy 的好处：**

1. 深度监听，惰性监听，性能更好
2. 可监听 新增/删除 属性
3. 可监听数组变化
4. 无法兼容所有浏览器，无法 polyfill

## watch 和 watchEffect 的区别

1. 两者都可以监听 data 属性变化
2. 前者监听单个属性变化
3. 后者监听多个属性变化
4. 前者需要指定监听的属性，后者会自动检测使用到的属性

## Setup 中如何获取组件实例

1. setup 和 Composition API 中没有 this
2. 通过 getCurrentInstance 获取实例

## Vue3 为什么比 Vue2 快

1. Proxy 响应式
2. PatchFlag
   1. 编译模板时，给动态节点做标记
   2. 标记分为不同类型，如 TEXT/PROPS
   3. diff 算法时可以以此区分静态节点和不同类型的动态节点，这样静态节点就可以跳过对比，只对比动态节点
   4. 可以到这个[链接](https://template-explorer.vuejs.org/#eyJzcmMiOiI8ZGl2PkhlbGxvIFdvcmxkPC9kaXY+Iiwib3B0aW9ucyI6e319)中测试
3. hoistStatic
   1. 将静态节点的定义提升到父作用域，缓存起来
   2. 多个相邻的静态节点会合并起来
   3. 典型的拿空间换时间的优化策略
4. cacheHandler
   1. 缓存事件
   2. 也是拿空间换时间
5. SSR 优化
   1. 静态节点直接输出，绕过 vdom
   2. 动态节点还是需要动态渲染
6. tree-shaking
   1. 编译时根据情况动态引入不同的 API
   2. 删除未引用的 API

## Vite 启动为什么快

1. 开发环境使用 ES Module，无需打包
2. 生产环境用 rollup
3. 惰性编译，按需加载

## Composition API 和 React Hooks 对比

1. 前者 setup 函数只会调用一次，后者函数会被调用多次
2. 前者无需 useMemo/useCallback，因为 setup 函数只会调用一次，即前者使用闭包缓存了，后者需要手动缓存
3. 前者无需顾虑调用顺序，后者需要保证 hooks 的顺序一致，比如后者 hooks 不能放在循环中
4. 前者 reactive + ref 比后者 useState 难理解

## JSX 和 Template 的区别

1. jsx 本质上是 js 代码，可以使用 js 的任何能力
2. template 只能嵌入简单的 js 表达式，其他需要指令实现，如 v-if
3. jsx 是 ES 规范，template 是 Vue 规范
4. 两者本质相同，都会编译为 js 代码(render 函数)

## JSX 和 Slot 作用域插槽

1. jsx 可以通过传入组件函数给子组件完成该功能，即数据流为 `father -> child -> component render(child props)`
2. vue 则需要通过对应的模板语法完成该功能，即数据流为 `father -> child -> component slot(child props)`
