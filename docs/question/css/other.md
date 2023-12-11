# 其他

## 浏览器渲染方式

浏览器对CSS阻塞渲染有两种处理方式，要么等css解析完一起渲染，chrome就是这么做的，但是会造成白屏；要么先把无样式的dom渲染出来等css解析好了再渲染一次，Firefox就是这么做的，但是会造成无样式内容闪烁

## 消除空隙

给父元素设置 font-size: 0 来消除 inline-block 元素之间的空隙。

## 清除浮动

[连接](https://www.jianshu.com/p/09bd5873bed4)

## CSS重排重绘及其性能优化

[CSS重排重绘及其性能优化](https://segmentfault.com/a/1190000000490328#articleHeader10)

[CSS动画性能解释](https://github.com/ccforward/cc/issues/42)