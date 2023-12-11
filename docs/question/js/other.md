# 其他

1. [中文数组排序](https://segmentfault.com/q/1010000002546028)

2. `(Math.floor(i / 3)+1) + ',' + ((i % 3)+1)` -> 九宫格行列位置计算

3. `0.1+0.2=0.30000000000000004` 精度丢失的问题用一句话来概括就是，计算机中用二进制来存储小数，而大部分小数转成二进制之后都是无限循环的值，因此存在取舍问题，也就是精度丢失，number-precision 和 mathjs 可以解决精度问题

4. 之所以会有最大安全整数这个概念，本质上还是因为数字类型在计算机中的存储结构。在尾数位不够补零之后，只要是多余的尾数为 1 所对应的整数都不能被精确表示

5. `Math.floor((Math.random() * ((max - min) + 1)) + min);` 可以得到两个数字之间的任意整数，包括这两个数

6. Java 与前端双向通信：使用 sockjs-client 来快速实现 ws，使用 stomp.js 完成代理

7. 模块规范时间线：AMD -> RequireJS || CMD -> SeaJS || CommonJS -> Node || import/export -> ES6

8. [Mac/Window 字体显示问题](https://www.v2ex.com/t/135783)

9. 代码回收规则如下：
  1.全局变量不会被回收
  2.局部变量会被回收，也就是函数一旦运行完以后，函数内部的东西都会被销毁
  3.只要被另外一个作用域所引用就不会被回收

10. JS有两种类型：主要数据类型和引用类型（对象）。有六种主要类型：String、Number、Boolean、Symbol、Null、Undefined

11. JSON.stringify 会过滤掉 Symbol 值：

    ```js
    const a = {
      x: Symbol(),
      y: 10
    }

    console.log(JSON.stringify(a)) // {"y":10}
    ```

12. [类型数组](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Typed_arrays)是用来操作二进制数据的一种类数组

13. [数组扁平化](http://www.cnblogs.com/caihg/p/6519422.html)

14. [复杂判断优化](https://juejin.im/post/5bdfef86e51d453bf8051bf8)

15. 函数节流是指一定时间内js方法只跑一次。比如人的眨眼睛，就是一定时间内眨一次。这是函数节流最形象的解释。 函数防抖是指频繁触发的情况下，只有足够的空闲时间，才执行代码一次。比如生活中的坐公交，就是一定时间内，如果有人陆续刷卡上车，司机就不会开车。只有别人没刷卡了，司机才开车。

16. [观察者模式和发布订阅模式有什么不同](https://www.zhihu.com/question/23486749)

17. 触摸和点击事件的发生顺序为：

    * touchstart
    * 零个或多个touchmove事件，取决于手指的移动
    * touchend
    * mousemove
    * mousedown
    * mouseup
    * click

    如果 touchstart, touchmove or touchend 被取消了(preventDefault)，则不会触发后面的其他事件