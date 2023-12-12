<!--
 * @Author: KokoTa
 * @Date: 2023-12-12 10:47:04
 * @LastEditTime: 2023-12-12 12:45:15
 * @LastEditors: KokoTa
 * @Description: 
 * @FilePath: \KokoTa_Site\docs\front\CSS.md
-->
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