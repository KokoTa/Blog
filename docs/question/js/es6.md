# ES6

## Promise

1. resolve()里的内容可能为通过，也可能为拒绝。拒绝是因为有可能传入的是一个 Promise，且这个 Promise 的状态最终为拒绝。resolve 将递归展开传入的 Promise

2. 可以对你不了解属性的值调用 Promise.resolve(..)来进行可行性测试

3. then(..) 和 catch(..) 也会创建并返回一个新的 promise：
   - 如果回调中抛出异常，则返回的 promise 被拒绝，向浏览器抛出拒绝的异常。
   - 如果任意一个回调返回非 Promise、非 thenable 的立即值，这个值会被用作返回 promise 的完成值。
   - 如果完成处理函数返回一个 promise 或 thenable，那么这个值会被展开，最终值作为返回 promise 的决议值。

4. var all = Promise.all; 后，使用 all([p1, p2]) 时会报错。原因是 Promise.all 的 this 需要指向 Promise，但这里的赋值是函数赋值，调用时 this 指向的是  window

5. [原理](https://juejin.im/post/5c41297cf265da613356d4ec)

6. 永远要记住想要在同步代码里拿到异步结果是不可能的

7. 多个 async 函数调用：forEach 执行是并发执行；for 循环继发执行；promise.all 并发执行

## Import

```javascript
export function Func() {}
import { Func } from 'func';

export default function Func() {}
import Func from 'func';
```

ES6 中的 exports 和 export default 不会冲突，可以同时存在

## generator

原理：

```js
const it = foo() -> 得到一个生成器迭代器
it.next() -> 执行到第一个yield处停下，返回一个obj，obj的属性done表示是否结束，属性value返回yield后面的值，此时给第一个next传参没卵用，因为第一个next对应不到yield
it.next(xx) -> xx赋值给第一个的yield，然后程序继续执行直到下一个yield停下
```

示例：

```js
function* x() {
  const a = yield 1;
  console.log(a);
  const b = yield 2;
  console.log(b);
}

const xx = x();
console.log(xx.next('aa')); // {value: 1, done: false}
console.log(xx.next('bb')); // bb {value: 2, done: false}
console.log(xx.next('cc')); // cc {value: undefined, done: true}
```

## js 方法简写问题

```js
const a = {
 method() {
 }
}
```

上面的方法的简写等同于

```js
const a = {
  method: function() {}
}
```

以上两种写法和下面这种写法 this 指向是不一样的

```js
const a = {
  method: () => {}
}
```

箭头函数的 this 将指向 window/global

## Set 的实现

[链接](https://zhuanlan.zhihu.com/p/60255589)