# 布局

## float 布局

[连接](https://blog.csdn.net/qq_39594951/article/details/82083059)

## position 布局

1. 移动端慎用 absolute/fixed 布局，因为当点击触发手机的键盘显示时，页面显示区域缩小了，而这两者一般都是基于这个区域来布局的，会出现如：`position: fixed; bottom: 0` 的元素在打开键盘后，紧挨着键盘的顶部。。。很尬

2. 以下代码，分别给节点 #box 增加如下样式，设置不同的 position，问节点 #box 距离 body 的上边距是多少？
    ```html
    <body style=”margin:0;padding:0”>
      <div id=”box” style=”top:10px;margin:20px 10px;”></div>
    </body>

    position: static ; 则上边距为(  20 ) px  静态定位 top值无效
    position: relative ; 则上边距为(  30 ) px 移动的时候会包括margin
    position: absolute ; 则上边距为(  30 ) px 移动的时候会包括margin
    position: fixed ; 则上边距为(  30 ) px  固定定位的margin也会生效  移动的时候也会包括margin
    position: sticky ; 则上边距为(  20 ) px，页面滚动起来为（10）px，margin会无效；页面没滚动的 时候是静态定位
    ```

## flex 布局

1. flex + margin: auto 可以实现垂直居中。

## 垂直居中

[CSS Trick](https://css-tricks.com/centering-css-complete-guide/)