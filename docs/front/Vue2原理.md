# Vue2原理

## Vue的特点

1. 组件化
2. 数据驱动视图
3. MVVM

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