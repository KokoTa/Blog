# Vue2原理

## Vue的特点

1. 组件化
2. 数据驱动视图
3. MVVM

```js
                      ViewModel(Vue)
View(DOM)     --->     DOM Listener     --->     Model(Plain JS Object)
              <---       Directive      <---
                   
```

## Vue响应式

Vue2 使用 `Object.defineProperty` 实现：

```js
// 不污染数组原型的情况下，对数组方法进行改写
const newProto = Object.create(Array.prototype);
['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(method => {
  newProto[method] = function () {
    // 调用原生方法
    Array.prototype[method].apply(this, arguments)
    // 更新视图
    updateView()
  }
})

// 对象监听函数
function observer(data) {
  // 判断是否是数组或对象(函数不考虑)
  if (typeof data !== 'object' || data == null) {
    return data
  }
  // 判断是否是数组，如果是需要改变原型
  if (Array.isArray(data)) {
    data.__proto__ = newProto
  }
  // 给属性设置监听
  for (let key in data) {
    defineReactive(data, key, data[key])
  }
}

// 属性监听函数
function defineReactive(data, key, val) {
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get() {
      return val
    },
    set(newVal) {
      if (newVal !== val) {
        // 设置新值
        // 注意 val 一直在闭包中，设置完之后，get 的就是新的值
        val = newVal
        // 更新视图
        updateView()
        // 深度监听(递归)
        observer(val)
      }
    }
  })

  // 深度监听(递归)
  observer(val)
}

// 更新视图函数
function updateView() {
  console.log('更新视图完成')
}

// 测试
const data = {
  name: 'KokoTa',
  info: {
    city: 'Xiamen'
  },
  arr: [1]
}

observer(data)

data.name = 'Brain'

data.info.city = { name: 'Licheng' }
data.info.city.name = 'Fengze'

data.home = 'Fujian'

data.arr.push(2)
```

`Object.defineProperty` 的缺点：

1. 深度监听需要递归，一次性计算量大
2. 无法监听新增/删除属性，需要使用 `Vue.set/Vue.delete`
3. 无法监听数组变动，需要重写数组方法，需要使用 `Object.create(Array.prototype)`

## 虚拟DOM

DOM 操作的弊端：

1. DOM 操作非常耗性能
2. DOM 操作需要自己控制时机，手动调整

虚拟 DOM 的特点：

1. 用 JS 模拟 DOM 结构(vnode)
2. 新旧 vnode 对比，得出最小更新范围，最后更新 DOM
3. 数据驱动视图的模式下，能有效控制 DOM 操作

虚拟 DOM 数据结构 be like：

```html
<div id="header" class="header">
  <p id="title" class="title" style="color: red">Hello World</p>
</div>
```

```js
{
  tag: 'div',
  attrs: {
    id: 'header',
    class: 'header'
  },
  children: [
    {
      tag: 'p',
      attrs: {
        id: 'title',
        class: 'title',
        style: 'color: red'
      },
      children: ['Hello World']
    }
  ]
}
```

Vue 参考了 [snabbdom](https://github.com/snabbdom/snabbdom) 的思想实现虚拟 DOM

## diff算法

树的 diff 时间复杂度为 o(n^3)：`遍历 tree1 -> 遍历 tree2 -> 排序`

如果有 1000 个节点，就要计算 1 亿次，因此该算法不可用

优化后的时间复杂度为 o(n)：

1. 只比较同级，不跨级比较
2. tag 不同，直接删掉重建，不再深度比较
3. tag 相同 key 不同，直接删掉重建，不再深度比较
4. tag 和 key 都相同，则认为是相同节点，不再深度比较

## snabbdom 的 diff 算法流程

1. h 函数：可以传入 tag、attrs、children 等参数，生成 vnode
2. init 函数：传入模块信息，返回 patch 函数
3. patch 函数：
   1. 可以传入 `一个选择器字符串 + 一个 vnode` 或者 `两个 vnode`
   2. 执行 `pre hook` 钩子函数（类似 vue 的 beforeCreate），如果第一个参数是选择器，则将选择器转为 vnode
   3. 通过 `sel(tag) 和 key`，判断 vnode 是否一致，将第一个 vnode 叫做 old，第二个 vnode 叫做 new
   4. 如果 old 和 new 不相同，则直接删旧建新(PS：删旧建新也有可能表现为移动)
   5. 如果相同，执行 patchVnode 函数
4. patchVnode 函数：
   1. 执行 `prepatch hook` 钩子函数
   2. 检查 `new 的 text/child` 是否存在，二者一般只会存在一个
   3. 如果 `无 child 有 text`，则删旧建新
   4. 如果 `有 child 无 text`，则判断 old 和 new 是否都有 child
   5. 如果 `old 无 new 有`，则删旧建新
   6. 如果 `old 有 new 无`，则删旧
   7. 如果 `old 有 new 有`，执行 updateChildren 函数
5. updateChildren 函数：

    ```js
    // 假设对比的 old child 和 new child 分别为
    // old: a b c d
    // new: b e d c

    // 设置四个变量，分别指向 old 和 new 的开头和结尾
    const oldStartIdx = 0
    const oldEndIdx = oldChildren.length - 1
    const newStartIdx = 0
    const newEndIdx = newChildren.length - 1

    // 然后进行循环，开头和结尾的索引会往中间靠近
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      // if 比较 oldStartIdx 和 newStartIdx 的节点是否一致
      //    相同则调用 patchVnode 继续比较；更新 oldStartIdx 和 newStartIdx

      // if else 比较 oldEndIdx 和 newEndIdx 的节点是否一致
      //    相同则调用 patchVnode 继续比较；更新 oldEndIdx 和 newEndIdx

      // if else 比较 oldStartIdx 和 newEndIdx 的节点是否一致
      //    相同则调用 patchVnode 继续比较；更新 oldStartIdx 和 newEndIdx

      // if else 比较 oldEndIdx 和 newStartIdx 的节点是否一致
      //    相同则调用 patchVnode 继续比较；更新 oldEndIdx 和 newStartIdx

      // else 上面四种情况都没有命中
      //    拿新节点的 key，检查是否能对应到旧节点中某个节点的 key
      //    if 节点的 key 对应不上
      //       直接新建(类似例子中的 e 插入)
      //    else 节点的 key 对应上了
      //      if 节点的 sel 不相等
      //         删旧建新
      //      else 节点的 sel 相等
      //         调用 patchVnode 继续比较；更新 newStartIdx
    }
    ```

## 模板编译

1. 整体流程：`template -> compiler -> render -> with 函数 -> h 函数 -> vnode -> patch -> diff -> dom`
2. 模板编译后会生成 render 函数，render 函数执行后返回 vnode
3. 基于 vnode 再执行 patch 和 diff
4. 使用 webpack vue-loader，会在开发环境下编译模板；使用 cdn 的 vue.js 文件，会在运行时再编译模板

```js
// 举个例子
const template = `<p>{{message}}</p>`
// 编译后为 function render() { with(this) { return _c('p', [_v(_s(message))]) } }
```

```js
// 可以使用 render 替代 template
Vue.component('heading', {
  // template: '<h1>{{title}}</h1>',
  render: function(h) {
    return h('h1', this.title)
  }
})
```

[在线测试](https://template-explorer.vuejs.org/)

## 组件渲染

1. 初次渲染过程
   1. 解析 template 为 render 函数
   2. 执行 render，触发 data 的 getter，放入 watcher(依赖收集)，生成 vnode
   3. 执行 patch
2. 更新过程
   1. 修改 data，触发 data 的 setter，通知对应的 watcher(已经在 getter 的时候添加进 watcher 了)
   2. 重新执行 render，生成 vnode
   3. 执行 patch
3. 异步渲染过程
   1. 汇总 data 修改，一次性更新视图
   2. 减少 DOM 操作次数，提高性能
   3. $nextTick 在异步渲染后进行回调

## Vue-router

**hash**：

1. 使用 hash 路由，跳转时不会刷新页面
2. 如何修改 hash:
   1. 手动修改 url hash
   2. js 修改 url hash
   3. 浏览器点击修改 url hash
3. 使用 onhashchange 监听变化
4. 变化和 server 端没有关系

**history**：

1. 使用 url 规范的路由，但跳转时不刷新页面
2. 使用 history.pushState 修改 url
3. 使用 window.onpopstate 监听前进和后退(PS：执行 pushState 不会触发 onpopstate 事件)
4. 需要 server 端支持

**选择**：

toB 的系统推荐使用 hash，简单易用，对 url 规范不敏感

toC 的系统可以考虑 history，但是需要后端支持

## Vue-router MemoryHistory(abstract)

hash/history 会导致 url 变化，而 memoryHistory 不会

它相当于一个内存中的路由，和 URL 无关
