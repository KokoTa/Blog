# 盒模型与BFC与布局

他：盒模型是什么？
我：就是一个盒子啊！
他：能具体说说看吗？
我：不能。
他：吔屎啦你！

## 盒模型

### 盒模型概念

1. 盒模型包含：margin, border, padding, content 这四部分。
2. 盒模型分为两种：标准盒模型和IE盒模型。
3. 标准盒模型的模型高度 = content的高度
 IE盒模型的模型高度 = content + padding + border 的高度(宽度同理)
 ![Standard-box](/images/standard-box.jpg)
 ![IE-box](/images/ie-box.jpg)
4. CSS3的`box-sizing`提供了两种盒模型的转换：
 `box-sizing: border-box`：标准转IE
 `box-sizing: content-box`：IE转标准
5. JS如何获取盒模型的宽高：
   1. dom.style.width/height：只能获取内联的 content 的宽高
   2. dom.currentStyle.width/height：获取最终渲染的 content 的宽高(只有IE支持)
   3. window.getComputedStyle(dom).width/height：同2(Firefox和Chrome支持)
   4. dom.getBoundingClientRect().width/height：获取最终渲染的盒子的宽高和位置

### 盒模型问题

盒模型垂直方向会发生外边距重叠。
![边距重叠](/images/边距重叠.png)
上图显示了我们给红块添加了一个上外边距`margin-top: 100px`，那么此时body的位置是否发生了变化？
![边距重叠](/images/边距重叠2.png)
答案是body也会有一个上外边距`margin-top: 100px`的效果。
那么为什么会发生重叠呢？
这个就要扯到BFC了。
但在此之前还需要声明的是，外边距重叠分为三种类型：
父子元素重叠，兄弟元素重叠，空元素重叠
它们都是取的外边距最大值

## BFC

### BFC概念

块格式化上下文（block formatting context）是一个独立的渲染区域，容器里面的子元素不会在布局上影响到外面的元素。只有Block-level box参与， 它规定了内部的Block-level Box如何布局。块格式化上下文包括了创建该上下文的元素的所有子元素，但不包括创建了新的块格式化上下文的子元素。
其实上面废话这么多总结一句就是：BFC会创建一个独立的盒子，这个盒子，包括里面的东西都是与外界隔绝的。

### 如何生成BFC

1. 根元素，即HTML元素
2. float的值不为none
3. overflow的值不为visible
4. display的值为inline-block、table-cell、table-caption等
5. position的值为absolute或fixed

### BFC布局规则/原理

1. 内部的Box会在垂直方向，一个接一个地放置。
解释：内部的Box就像文档流从上到下一样，按顺序排列
2. 属于同一个BFC的两个相邻Box的margin会发生重叠。
3. 父元素左边的border，与子元素左边的margin相接触(对于从左往右的格式化)。即使存在浮动也是如此。
4. BFC的区域不会与Float Box重叠。
![BFC与Float](/images/BFC与Float.png)
如上图所示，两个同级元素，左边是浮动块，右边是BFC块，两者不会发生重叠。
5. 计算BFC的高度时，浮动元素也参与计算。
解释：如图一开始我们设置了一个黑色背景的父元素和一个红色背景的子元素
![BFC高度1](/images/BFC高度1.png)
接下来我们使红色元素左浮动，我们发现父元素的高度变为了0
![BFC高度2](/images/BFC高度2.png)
此时如果我们给父元素添加BFC，浮动元素也参与父元素的高度计算
![BFC高度1](/images/BFC高度1.png)
Look!终于正常了！

### BFC应用

1. 自适应两栏布局
解释：见原理第4点
2. 可以阻止元素被浮动元素覆盖和清除内部浮动
解释：见原理第5点
3. 分属于不同的BFC时可以阻止margin重叠

## 布局

1. [三栏布局的五种写法](https://github.com/KokoTa/All-demo/blob/master/demo/Layout/%E4%B8%89%E6%A0%8F%E5%B8%83%E5%B1%80/index.html)
