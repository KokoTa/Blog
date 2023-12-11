# 属性值

## position: sticky

[官方文档](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position)

[兼容性方案](https://github.com/KokoTa/Vue2-music/blob/master/src/base/listview/listview.vue#L106)

## position: fixed

position: fixed 可以利用 top/bottom/left/right 来调整容器大小，而 relative/absolute 不行

## display: box 和 display: flex

移动端box布局比flex布局兼容性好，但需要加前缀

<iframe height='400' scrolling='no' title='DisplayBox VS. DisplayFlex' src='//codepen.io/PennyOrAmy/embed/qoKadM/?height=265&theme-id=0&default-tab=html,result' frameborder='no' allowtransparency='true' allowfullscreen='true' style='width: 100%;'>See the Pen <a href='https://codepen.io/PennyOrAmy/pen/qoKadM/'>DisplayBox VS. DisplayFlex</a> by Amy Peng (<a href='https://codepen.io/PennyOrAmy'>@PennyOrAmy</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## transform: translate3D

translate3D 会开启 GPU 加速，而普通的 translateX/Y/X 不会，移动端尽量少使用该属性

## 文字格式化

[word-break、word-wrap、white-space 的关系](https://juejin.im/post/5b8905456fb9a01a105966b4)

* word-spacing 单词之间的间距。
* letter-spacing 字(母)之间的间距。
* white-space 用来格式化空白和换行符，跟 word 没关系。

## 文字单行过长省略

```css
white-space: nowrap;
text-overflow: ellipsis;
overflow: hidden;
```

## line-height

line-height 对 block 元素是无效的，实际作用的是 block 内部的 text 和 inline 元素

## caret-color

caret-color: transparent; 可以隐藏光标