# JavaScript

## 闭包

闭包是函数作用域的特殊情况：

1. 函数作为参数被传递

    ```js
    // 函数作为参数被传递
    function foo() {
      console.log(a)
    }

    function bar(fn) {
      let a = 100
      fn()
    }

    let a = 200
    bar(foo) // 200
    ```

2. 函数作为返回值被返回

    ```js
    // 函数作为返回值被返回
    function foo() {
      let a = 100
      return function() {
        console.log(a)
      }
    }

    let a = 200
    const bar = foo()
    bar() // 100
    ```

自由变量的查找，是在函数定义的地方，向上级作用域查找，而非执行的地方

## Event Loop

1. JS 是单线程运行的
2. 异步是基于回调实现的
3. 异步具体的实现原理是 Event Loop

```js
// 下面代码的执行顺序：
// 1. 遇到同步代码并放入调用栈(call stack)，即 console.log(1)，执行输出1
// 2. 遇到 setTimeout，将回调函数放入 web apis 栈中
// 3. 遇到同步代码并放入调用栈(call stack)，即 console.log(3)，执行输出3
// 4. 调用栈为空，事件循环(event loop)开始工作
// 5. 1s后将 web apis 栈中的回调函数取出，放入任务队列(callback queue)中
// 6. 事件循环发现任务队列中有函数，取出并放入调用栈
// 7. 调用栈执行函数，输出2
console.log(1)
setTimeout(() => console.log(2), 1000)
console.log(3)
```

## Promise 的状态

1. pending 状态，不会触发 then 和 catch
2. resolved 状态，会触发 then
3. rejected 状态，会触发 catch
4. 如果 then 正常返回，则继续触发 then 或者返回 resolved 状态
5. 如果 then 报错，则继续触发 catch 或者返回 rejected 状态
6. 如果 catch 正常返回，则继续触发 then 或者返回 resolved 状态
7. 如果 catch 报错，则继续触发 catch 或者返回 rejected 状态

```js
// 输出 1
Promise.resolve()
  .then(() => {
    console.log(1)
  })
  .catch(() => {
    console.log(2)
  })
```

```js
// 输出 2
Promise.reject()
  .then(() => {
    console.log(1)
  })
  .catch(() => {
    console.log(2)
  })
```

```js
// 输出 1 2
Promise.reject()
  .catch(() => {
    console.log(1)
  })
  .then(() => {
    console.log(2)
  })
```

```js
// 输出 1
Promise.reject()
  .catch(() => {
    console.log(1)
  })
  .catch(() => {
    console.log(2)
  })
```

## async/await的顺序

```js
// 输出 4 1 3 5 2
async function fn1() {
  console.log(1)
  await fn2()
  console.log(2)
}
async function fn2() {
  console.log(3)
}

console.log(4)
fn1()
console.log(5)
```

[async/await 设计原理](https://juejin.cn/post/7007031572238958629)

## 宏任务和微任务

1. 宏任务：setTimeout、setInterval、Ajax、DOM事件
2. 微任务：Promise、async/await
3. 宏任务在 DOM 渲染后触发
4. 微任务在 DOM 渲染前触发
5. 宏任务是由浏览器规定的(可以放入 web apis 栈中)
6. 微任务是由ES语法规定的

执行流程：

1. 清空 call stack
2. 执行微任务
3. 渲染 DOM
4. 触发 event loop，执行宏任务

```js
// 输出 5 8 1 3 9 6 2 7 4
async function fn1() {
  console.log(1)
  await fn2()
  console.log(2)
}
async function fn2() {
  console.log(3)
}

setTimeout(() => {
  console.log(4)
}, 0)

new Promise((resolve) => {
  console.log(5)
  resolve()
}).then(() => {
  console.log(6)
}).then(() => {
  console.log(7)
})

console.log(8)
fn1()
console.log(9)
```

## 实现 Promise

```js
class MyPromise {
  status = 'pending' // pending fullfilled rejected
  value = undefined // 成功后的值
  reason = undefined // 失败后的值

  resolveArr = [] // pending 状态下存储成功的回调
  rejectArr = [] // pending 状态下存储失败的回调

  constructor(fn) {
    const resolve = (value) => {
      if (this.status === 'pending') {
        this.status = 'fulfilled'
        this.value = value
        this.resolveArr.forEach((fn) => fn(this.value))
      }
    }
    const reject = (reason) => {
      if (this.status === 'pending') {
        this.status ='rejected'
        this.reason = reason
        this.rejectArr.forEach((fn) => fn(this.reason))
      }
    }
    
    try {
      fn(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(fn1, fn2) {
    // 防止传入非函数发生错误
    fn1 = typeof fn1 === 'function'? fn1 : (value) => value
    fn2 = typeof fn2 === 'function'? fn2 : (reason) => reason
  
    if (this.status === 'pending') {
      return new MyPromise((resolve, reject) => {
        this.resolveArr.push(() => {
          try {
            const newValue = fn1(this.value)
            resolve(newValue)
          } catch (error) {
            reject(error)
          }
        })
        this.rejectArr.push(() => {
          try {
            const newReason = fn2(this.reason)
            resolve(newReason)
          } catch (error) {
            reject(error)
          }
        })
      })
    }

    if (this.status === 'fullfilled') {
      return new MyPromise((resolve, reject) => {
        try {
          const newValue = fn1(this.value)
          resolve(newValue)
        } catch (error) {
          reject(error)
        }
      })
    }

    if (this.status === 'rejected') {
      return new MyPromise((resolve, reject) => {
        try {
          const newReason = fn2(this.reason)
          resolve(newReason)
        } catch (error) {
          reject(error)
        }
      })
    }
  }

  catch(rejectFn) {
    return this.then(null, rejectFn)
  }
}

// 异步示例
// 每一个 then 方法都会返回一个新的 Promise
// 首先实例化了一个 Promise，称作 p
// 由于 p 使用了定时器，因此不会马上 resolve
// 此时调用 p 的 then 方法
// 由于 p 的状态是 pending，因此 then 传入的函数会放到 p 的 resolveArr 中，并返回一个新的 Promise，即 p1
// 后续 p1 调用了 then 方法
// 由于 p1 还未 resolve，因此 then 传入的函数会放到 p1 的 resolveArr 中，并返回一个新的 Promise，即 p2
// 为什么 p1 还未 resolve？
// 因为 p1 的状态需要 p 去控制，当定时器时间到, p resolve 后，p 会执行 resolveArr 中的函数，函数执行后就会将 p1 resovle
// 因此具体的执行逻辑是：1s 后 -> p resovle -> p 执行 resolveArr -> p1 resolve -> p1 执行 resolveArr -> p2 resolve
const p = new MyPromise((resolve) => {
  setTimeout(() => {
    resolve('success')
  }, 1000)
})

const p1 = p.then((value) => {
  console.log(value)
  return value
})

const p2 = p1.then((value) => {
  console.log(value)
  return value
})
```

```js
MyPromise.resolve = (value) => new MyPromise((resolve) => resolve(value))

MyPromise.reject = (reason) => new MyPromise((resolve, reject) => reject(reason))

MyPromise.all = (promises = []) => {
  return new MyPromise((resolve, reject) => {
    const result = []
    let count = 0
    promises.forEach((p) => {
      p.then((value) => {
        result.push(value)
        count++
        if (count === promises.length) resolve(result)
      }).catch((reason) => {
        reject(reason)
      })
    })
  })
}

MyPromise.race = (promises = []) => {
  return new MyPromise((resolve, reject) => {
    promises.forEach((p) => {
      p.then((value) => {
        resolve(value)
      }, (reason) => {
        reject(reason)
      })
    })
  })
}
```

## 实现普通深拷贝

1. 只考虑 Object/Array
2. 不考虑 Map/Set/循环引用

```js
const obj1 = {
  name: 'Brain',
  age: 24,
  address: {
    city: 'Quanzhou'
  },
  tags: ['a', 'b', 'c'],
  fn: () => {}
}

function deepClone(obj) {
  // obj == null 相当于 (obj === null || obj === undefined)
  if (typeof obj !== 'object' || obj == null) {
    return obj
  }

  let result = null
  // 不考虑函数的情况
  if (obj instanceof Array) {
    result = []
  } else {
    result = {}
  }

  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = deepClone(obj[key])
    }
  }

  return result
}

const obj2 = deepClone(obj1)

obj2.address.city = 'Xiamen'

console.log(obj1)
console.log(obj2)
```

## 实现高级深拷贝

考虑 Map/Set/循环引用

JSON.stringify 的缺点：

1. 无法转换函数(会被忽略)
2. 无法转换 Map/Set(会被隐式转换)
3. 无法转换循环引用(会报错)

```ts
function deepClone(obj: any, map = new WeakMap()): any {
   if (typeof obj !== 'object' || obj == null) return obj

  // 使用 WeakMap 避免循环引用
  const objFromMap = map.get(obj)
  if (objFromMap) return objFromMap

  let target: any = {}
  map.set(obj, target)

  // Map
  if (obj instanceof Map) {
    target = new Map()
    obj.forEach((value, key) => {
      const k = deepClone(key, map) // Map 的 key 不一定是字符串，需要深拷贝
      const v = deepClone(value, map)
      target.set(k, v)
    })
  }

  // Set
  if (obj instanceof Set) {
    target = new Set()
    obj.forEach(value => {
      const v = deepClone(value, map)
      target.add(v)
    })
  }

  // Arrray
  if (obj instanceof Array) {
    target = obj.map((item) => deepClone(item, map))
  }

  // Object
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      target[key] = deepClone(obj[key], map)
    }
  }

  return target
}
```

## 实现简单的 jQuery

```js
class jQuery {
  constructor(selector) {
    const res = document.querySelectorAll(selector);
    const length = res.length
    for (let i = 0; i < length; i++) {
      this[i] = res[i];
    }
    this.length = length
  }

  get(index) {
    return this[index]
  }

  each(fn) {
    for (let i = 0; i < this.length; i++) {
      fn.call(this[i], this[i], i);
    }
  }

  on(type, fn) {
    for (let i = 0; i < this.length; i++) {
      this[i].addEventListener(type, fn, false);
    }
  }
}
```

## 实现 call/apply/bind

```js
Function.prototype.call = function(context, ...args) {
  if (context == null) context = globalThis
  if (typeof context !== 'object') context = new Object(context) // 将值类型转为对应的对象类型
  const self = this
  const key = Symbol() // 避免属性重复
  context[key] = self
  const result = context[key](...args)
  delete context[key]
  return result
}

Function.prototype.bind = function(context, ...args1) {
  if (context == null) context = globalThis
  if (typeof context !== 'object') context = new Object(context)
  const self = this // 指向调用的函数
  return function(...args2) {
    return self.apply(
      context,
      args1.concat(args2) // 合并参数
    )
  }
}
```

## 实现 instanceof

```js
function myInstanceof(instance, origin) {
  // 排除 null 和 undefined
  if (instance == null) return false

  // 排除值类型
  const type = typeof instance
  if (type !== 'object' && type !== 'function') return false

  let tempInstance = instance // 防止修改 instance
  while (tempInstance) {
    if (tempInstance === origin.prototype) return true
    tempInstance = tempInstance.__proto__
  }
}
```

## 实现防抖/节流

防抖是指：一段时间后执行一次，多次点击会延迟执行

```js
function debounce(fn, delay) {
  let timer = null
  return function() {
    const context = this
    const args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(context, args)
      timer = null
    }, delay)
  }
}
```

节流是指：一段时间后执行一次，多次点击会无视掉

```js
function throttle(fn, delay) {
  let timer = null
  return function() {
    const context = this
    const args = arguments
    if (timer) return
    timer = setTimeout(() => {
      fn.apply(context, args)
      timer = null
    }, delay)
  }
}
```

## 实现深度比较函数

```js
function isObject(obj) {
    return obj !== null && typeof obj === 'object'
}

function isEqual(obj1, obj2) {
    // 如果是值类型
    if (!isObject(obj1) || !isObject(obj2)) {
        // 值类型
        return obj1 === obj2
    }
    // 如果是同一个对象
    if (obj1 === obj2) {
        return true
    }
    // 两个都是对象或数组，且不相等(不考虑函数的情况)
    // 1. 比较属性个数
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false
    }
    // 2. 比较属性值
    for (let key in obj1) {
        if (!isEqual(obj1[key], obj2[key])) {
            return false
        }
    }
    return true
}
```

## 数组扁平化

1. 单层扁平化：

    ```js
    // 方案一：使用 flat API
    const arr = [1, 2, [3, 4, [5, 6]]]
    const res = arr.flat()
    console.log(res)

    // 方案二：forEach + push
    const arr = [1, 2, [3, 4, [5, 6]]]
    const res = []
    arr.forEach((item) => {
      if (Array.isArray(item)) {
        item.forEach((subItem) => {
          res.push(subItem)
        })
      } else {
        res.push(item)
      }
    })
    console.log(res)

    // 方案三：forEach + concat
    const arr = [1, 2, [3, 4, [5, 6]]]
    let res = []
    arr.forEach((item) => {
      res = res.concat(item)
    })
    console.log(res)
    ```

2. 全部扁平化：

    ```js
    // 方案一：使用 flat API
    const arr = [1, 2, [3, 4, [5, 6]]]
    console.log(arr.flat(Infinity))

    // 方案二：使用 toString API -- 只能用于值类型
    const arr = [1, 2, [3, 4, [5, 6]]]
    const res = arr.toString().split(',')
    console.log(res)

    // 方案三：reduce + concat + 递归
    const arr = [1, 2, [3, 4, [5, 6]]]
    const flatten = (arrary) => arrary.reduce((prev, cur) => prev.concat(Array.isArray(cur) ? flatten(cur) : cur), []);
    const res = flatten(arr);
    console.log(res);
    ```

## LazyMan

1. 支持 sleep 和 eat 方法
2. 支持链式调用

```ts
class LazyMan {
  private name: string = ''
  private tasks: Function[] = []

  constructor(name: string) {
    this.name = name
    setTimeout(() => this.next()) // 等待同步都执行结束后再执行
  }

  private next() {
    const task = this.tasks.shift() // 取出 tasks 的第一个任务
    task && task()
  }

  eat(food: string) {
    this.tasks.push(() => {
      console.log(`${this.name} is eating ${food}`)
      this.next()
    })
    return this
  }

  sleep(seconds: number) {
    this.tasks.push(() => {
      console.log(`${this.name} is sleeping ${seconds}s`)
      setTimeout(() => {
        this.next()
      }, seconds * 1000)
    })
    return this
  }
}

const man = new LazyMan('Brain')
man.eat('apple').sleep(2).eat('banana')
```

## 柯里化

```ts
function curry(fn: Function) {
  const fnArgLength = fn.length // 获取函数参数长度
  let totalArgs: number[] = []

  function calc(...args) {
    // 积累参数
    totalArgs = [...totalArgs, ...args]

    if (totalArgs.length < fnArgLength) {
      // 参数不足，返回函数
      return calc
    } else {
      // 参数足够，返回结果
      // 注意这里的 apply，因为 calc 可能被指定 this 后调用，比如 curryAdd.call({...}, 1)
      return fn.apply(this, totalArgs.slice(0, fnArgLength))
    }
  }

  return calc
}

function add(a: number, b: number, c: number) {
  return a + b + c
}

const curryAdd = curry(add)
curryAdd(1)(2)(3) // 6
```

## EventBus

需要实现 on/once/emit/off

```ts
class MyEventBus {
  // 存储的数据格式
  // {
  //   [key]: [
  //     { fn: fn1, isOnce: false },
  //     { fn: fn2, isOnce: true }
  //   ]
  // }
  private events: { [key: string]: Array<{ fn: Function, isOnce: boolean }> }

  constructor() {
    this.events = {}
  }

  on(type: string, fn: Function, isOnce: Boolean = false) {
    if (this.events[type] == null) {
      this.events[type] = []
    }
    this.events[type].push({ fn, isOnce: false })
  }

  once(type: string, fn: Function) {
    this.on(type, fn, true)
  }

  off(type: string, fn?: Function) {
    if (!fn) { // 解绑所有
      this.events[type] = []
    } else { // 解绑单个
      this.events[type] = this.events[type].filter(item => item.fn !== fn)
    }
  }

  emit(type: string, ...args: any[]) {
    if (!this.events[type] && !this.events[type].length) return
    this.events[type].filter((event) => {
      const { fn, isOnce } = event
      fn(...args)
      return !isOnce
    })
  }
}
```

## LRU 缓存

即最近使用缓存

1. 使用哈希表实现 get/set，才能有 O(1) 复杂度
2. 必须是有序的，常用数据放在前面，不常用的放在后面
3. 哈希 + 有序 = Map，Map 结合了数组和链表的优点

```ts
class LRUCache {
  private length: number
  private data: Map<any, any> = new Map()

  constructor(length: number) {
    if (length < 1) throw new Error('length must be greater than 0')
    this.length = length
  }

  set(key: any, value: any) {
    const data = this.data
    // 删除旧数据
    if (data.has(key)) {
      data.delete(key)
    }
    // 新增数据(map.set 时会把数据放最前面)
    data.set(key, value)
    // 如果超出容量限制，则删除最后面的数据
    if (data.size > this.length) {
      data.delete(data.keys().next().value)
    }
  }

  get(key: any) {
    const data = this.data

    if (!data.has(key)) return null

    const value = data.get(key)

    // 把数据放最前面
    data.delete(key)
    data.set(key, value)

    return value
  }
}

const lruCache = new LRUCache(2)
lruCache.set('a', 1) // a=>1
lruCache.set('b', 2) // a=>1 b=>2
lruCache.set('c', 3) // b=>2 c=>3
lruCache.set('d', 4) // c=>3 d=>4
lruCache.get('c') // d=>4 c=>3
lruCache.set('e', 5) // c=>3 e=>5
```

不适用 Map，如何实现 LRU？

可以使用 Object + Array 模拟 Map 的效果

```ts
const obj1 = { key: 'a', value: 1 }
const obj2 = { key: 'b', value: 2 }
const obj3 = { key: 'c', value: 3 }

const data = [obj1, obj2, obj3] // 有序
const map = { a: obj1, b: obj2, c: obj3 } // 哈希
```

但是存在性能问题，数组的 shift/splice 效率低

比如第一个元素移除，后续所有元素都需要移动

可以使用 双向链表 优化性能，它的 新增/删除/移动 效率高

```ts
interface IListNode {
  key: string // 存储 key 方便查找和删除，避免遍历
  value: any
  prev?: IListNode
  next?: IListNode
}

class LRUCache {
  private length: number
  private data: { [key: string]: IListNode } = {}
  private dataLength: number = 0
  private head: IListNode | null = null
  private tail: IListNode | null = null

  constructor(length: number) {
    if (length < 1) throw new Error('length must be greater than 0')
    this.length = length
  }

  // 将元素移动到最后
  private moveToTail(node: IListNode) {
    const prevNode = node.prev
    const nextNode = node.next

    // 如果是最后一个节点，就不管
    if (node === this.tail) return

    // 如果这个节点是头节点，则需要更新 head
    if (this.head === node && nextNode) this.head = nextNode

    // 1. 让 prevNode/nextNode 断绝与 node 的关系
    if (prevNode && nextNode) {
      prevNode.next = nextNode
      nextNode.prev = prevNode
    }
    if (prevNode && !nextNode) {
      delete prevNode.next
    }
    if (!prevNode && nextNode) {
      delete nextNode.prev
    }

    // 2. 让 node 断绝与 prevNode/nextNode 的关系
    delete node.prev
    delete node.next

    // 3. 在末尾建立 node 的新关系
    if (this.tail) {
      this.tail.next = node
      node.prev = this.tail
    }
    this.tail = node
  }

  // 清除头节点(最旧的节点)
  private tryClean() {
    while (this.dataLength > this.length) {
      const head = this.head
      const headNext = head?.next
      if (head == null) throw new Error('head is null')
      if (headNext == null) throw new Error('headNext is null')

      // 1. 断绝 head 和 headNext 的关系
      delete head.next
      delete headNext.prev

      // 2. 重新赋值 head
      this.head = headNext

      // 3. 清理 data
      delete this.data[head.key]

      // 4. 更新计数
      this.dataLength--
    }
  }

  get(key: string): any {
    const data = this.data
    const curNode = data[key]

    if (curNode == null) return null

    // 如果该节点为最后一个节点，则不需要额外操作
    if (this.tail === curNode) return curNode.value

    // 如果节点为第一个或中间节点，则移动到最后
    this.moveToTail(curNode)

    return curNode.value
  }

  set(key: string, value: any) {
    const data = this.data
    const curNode = data[key]

    if (curNode == null) {
      // 新增数据
      const newNode: IListNode = {
        key,
        value
      }
      // 移动到最后
      this.moveToTail(newNode)
      // 更新 data
      data[key] = newNode
      this.dataLength++
      // 如果是第一个元素，则需要设置头指针
      if (this.dataLength === 1) this.head = newNode
    } else {
      // 修改数据
      curNode.value = value
      // 移动到最后
      this.moveToTail(curNode)
    }

    // 如果超出容量，则需要清理
    this.tryClean()
  }
}
```
