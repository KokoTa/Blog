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

## 实现深拷贝

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
Function.prototype.call = function(context) {
  const self = this
  const args = Array.prototype.slice.call(arguments, 1)
  context.fn = self
  const result = context.fn(...args)
  delete context.fn
  return result
}

Function.prototype.apply = function(context, args) {
  const self = this
  context.fn = self
  const result = context.fn(...args)
  delete context.fn
  return result
}

Function.prototype.bind = function(context) {
  const self = this // 指向调用的函数
  const args = Array.prototype.slice.call(arguments, 1) // 将参数转为数组，获取除第一个参数以外的参数

  return function() {
    return self.apply(
      context,
      args.concat(Array.prototype.slice.call(arguments)) // 合并参数
    )
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
