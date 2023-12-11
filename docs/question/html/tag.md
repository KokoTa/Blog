# 标签

## form

1. 在 H5 中，搜索框外包裹一层 form 元素是为了当移动端点击它时虚拟键盘回车键显示的是 **搜索**。

## video/audio

1. [媒体元素属性和事件](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLMediaElement)

2. audio 元素中当音乐切换过快时会触发错误：`Uncaught (in promise) DOMException: The play() request was interrupted by a new load request`。意思就是 play 函数无法执行，新的音乐加载请求被截断了，play() 函数返回一个 Promise，由于被截断，所以报错，而报错没有 reject 函数解决，所以就输出到了控制台。[解决方法](https://developers.google.com/web/updates/2017/06/play-request-was-interrupted)

3. 可以利用 audio 的 `ended` 事件来实现切换下一首歌

## table

1. 表格套表格，完成任意分割，you know

## a

```html
<!-- 假设当前地址是 xx.com/xx -->
<!-- 下面链接点击将访问 xx.com/A -->
<a href="/A">link-1</a>
<!-- 下面链接点击将访问 xx.com/xx/B -->
<a href="B">link-2</a>
```

## viewport

[获取屏幕的宽高](https://segmentfault.com/a/1190000010746091)

## SVG

SVG的 [dasharray/dashoffset](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dashoffset) 可以实现环形进度效果

## input

input type="file"，选择文件后，会触发 onchange 事件，可以实现自动上传功能

## meta

1. 在页面头部中使用 `dns-prefetch` 可以提前完成 dns 预解析，可以加快资源加载速度

## script

1. `<script type="module" src="index.js">` 设置 type 后可以引入包含模块化的代码