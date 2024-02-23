# CSS

## 盒模型宽度计算

```css
#box {
  width: 100px;
  padding: 10px;
  border: 1px solid #ccc;
  margin: 10px;
}
```

问：box 的 offsetWidth 是多少？

答：offsetWidth = content + padding + border, 不包含 margin。因此box的offsetWidth = 100px + 20px + 2px = 122px。

问：如何让 offsetWidth 等于100px?

答：可以设置 box-sizing: border-box;

## margin 纵向重叠问题

```css
p {
  font-size: 16px;
  line-height: 1;
  margin-top: 10px;
  margin-bottom: 15px;
}
```

```html
<p>AAA</p>
<p></p>
<p></p>
<p></p>
<p>BBB</p>
```

问：AAA 和 BBB 之间的距离是多少？

答：相邻元素的 margin-top 和 margin-bottom 会发生重叠，AAA 的 margin-bottom 为 15px，后续的空 p margin-top 为 10px，空 p 都被重叠了，因此最终的距离为 15px。

## margin 负值问题

1. margin-top/margin-left 负值，元素向上/左移动
2. margin-right 负值，自身不受影响，右侧元素左移
3. margin-bottom 负值，自身不受影响，下侧元素上移

## BFC

见 `盒模型与BFC与布局`

## 清除浮动

[清除浮动](https://www.jianshu.com/p/09bd5873bed4)

## 圣杯布局

<iframe height="300" style="width: 100%;" scrolling="no" title="圣杯布局" src="https://codepen.io/KokoTa/embed/GRzLdqj?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/KokoTa/pen/GRzLdqj">
  圣杯布局</a> by KonoTa (<a href="https://codepen.io/KokoTa">@KokoTa</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## 双飞翼布局

<iframe height="300" style="width: 100%;" scrolling="no" title="圣杯布局2" src="https://codepen.io/KokoTa/embed/vYbMjJK?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/KokoTa/pen/vYbMjJK">
  圣杯布局2</a> by KonoTa (<a href="https://codepen.io/KokoTa">@KokoTa</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## Flex 实现三点骰子

<iframe height="300" style="width: 100%;" scrolling="no" title="Flex三点骰子" src="https://codepen.io/KokoTa/embed/zYeXMyL?default-tab=html%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/KokoTa/pen/zYeXMyL">
  Flex三点骰子</a> by KonoTa (<a href="https://codepen.io/KokoTa">@KokoTa</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

## absolute 和 relative 分别依据什么定位

1. absolute 依据最近一层的定位元素定位(relative/absolute/fixed/body)
2. relative 依据自身定位

## 水平居中

1. inline 元素：使用 text-align: center;
2. block 元素：使用 margin: 0 auto;
3. absolute 元素：使用 left: 50% + margin-left: 负值;
4. flex 元素：使用 justify-content: center;

## 垂直居中

1. inline 元素：让 line-height 值等于 height 值
2. absolute 元素：使用 top: 50% + margin-top: 负值;
3. absolute 元素：使用 top: 50% + transform: translateY(-50%);
4. absolute 元素：使用 top/bottom 都为 0 + margin: auto 0;
5. flex 元素：使用 align-items: center;

## line-height 如何继承

1. 如果写的是具体数值，则继承该值
2. 如果写的是比例系数，比如 1、1.5、2，则继承 `子元素字体大小 * 系数`
3. 如果写的是百分比，比如 200%，则继承 `父元素字体大小 * 百分比`

## rem 是什么

1. px，绝对长度单位
2. em，相对长度单位，相对于父元素
3. rem，相对长度单位，相对于根元素

## 响应式方案

1. 使用 px，通过 media-query 来设置不同的样式
2. 使用 rem，通过 media-query 来动态设置根元素 font-size

```css
/* rem 根元素媒体查询设置 */

/* iphone5 或更小尺寸 */
@media screen and (max-width: 374px) {
  html {
    font-size: 86px;
  }
}
/* iphone6/7/8/x */
@media screen and (min-width: 375px) and (max-width: 413px) {
  html {
    font-size: 100px;
  }
}
/* iphone6p 或更大尺寸 */
@media screen and (min-width: 414px) {
  html {
    font-size: 110px;
  }
}

body {
  font-size: 0.16rem;
}
```

## rem 的弊端

1. 具有阶梯性，很难细粒度控制根字体大小
2. 相当于等比例缩放，因此大屏幕设备下视图也会很大

可以使用 vw/vh 代替 rem

## 网页视口尺寸

1. window.screen.height 屏幕高度
2. window.innerHeight 网页视口高度
3. document.body.clientHeight body高度

* window.innerWidth === 100vw
* window.innerHeight === 100vh
