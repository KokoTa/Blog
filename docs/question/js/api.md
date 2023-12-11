# API

## escape/encodeURI/encodeURIComponent

```js
// 编码字符串，不和URL有半毛钱关系，用 escape
escape('<script>alert(1)</script>') // "%3Cscript%3Ealert%281%29%3C/script%3E"

// 编码整个URL，用 encodeURI
encodeURI('http://www.baidu.com/ a b') // "http://www.baidu.com/%20a%20b"

// 编码URL参数，用 encodeURIComponent
encodeURIComponent('a+b-c') // "a%2Bb-c"
```

## Element.closest

[Element.closest](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/closest)：匹配特定选择器且离当前元素最近的祖先元素（也可以是当前元素本身）

## apply

```js
// 这个函数的作用是啥？
function spread(fn) {
    return Function.apply.bind( fn, null );
}

// 测试代码
spread(function (x,y) {
  console.log(x, y, this)
})([1,2]) // 1, 2, Window

// 结论
// Function.apply.bind(fn, null) === fn.apply(null, args)

// 解析
// 设 Function.apply 为 method
// 即原来的式子为 method.bind(fn, null)
// method.bind(fn, null) 会返回一个新函数 (...args) => method.call(fn, null, ...args)
// 即式子被转换为 (...args) => (Function.apply).call(fn, null, ...args)
// 最终式子等价于 fn.apply(null, args)

```

## parseInt

parseInt 用于其他进制转十进制，第二个参数来指定这个原始值的基数：

```js
parseInt(1011101, 2) // 93

parseInt(1011101, 10) // 1011101

parseInt(12, 2) // 1

parseInt(12, 10) // 12

parseInt(12, 1) // NaN

parseInt(12, 0) // 12
```

十进制转其他进制：

```js
prseInt(数).toString(进制)
```

## target/currentTarget

事件对象中的 target 指向点击时的元素，currentTarget 指向绑定事件的元素

## Intersection Observer API

通过 [Intersection Observer API](http://www.ruanyifeng.com/blog/2016/11/intersectionobserver_api.html) 监听元素和其他元素交接，可以完成懒加载功能 [连接](https://www.zhihu.com/question/67328049)

但由于兼容性原因，我们可以使用 scroll + getBoundingClientRect 的方式实现

## 浏览器路由的三种方式

1. 页面路由，页面重新加载，会有历史记录：

    ```js
    window.location.href = "http://www.baicu.com"
    history.back()
    ```

2. hash路由，页面不会重新加载，会有历史纪录：

    ```js
    window.location.href = "#hash"
    window.onhashchange = () => {
      console.log(window.location.hash)
    }

3. h5路由，页面不会重新加载，会有历史记录：

    ```js
    history.pushState('title', 'Title', '/title')
    history.replaceState('title', 'Title', '/title')
    window.onpopstate = () => {
      console.log(window.location.href)
      console.log(window.location.pathname)
      console.log(window.location.hash)
      console.log(window.location.search)
    }
    ```