# HTML

## 如何理解语义化

1. 增加代码可读性
2. 让搜索引擎更容易读懂(SEO)

## 块状元素和内联元素

1. 块状元素：div h1 h2 table ul ol p; display:block/table
2. 内联元素：span img input button; display:inline/inline-block

## DOM 中 attribute 和 property 有什么区别

在DOM中，attribute和property是两个不同的概念。Attribute是HTML标签上的特性，例如 `id、class、title、data-name`，它的值只能是字符串。而Property是DOM元素作为对象的附加内容，例如 `childNodes、firstChild`，它是DOM对象自身就拥有的属性，是JavaScript里的对象。两者之间的数据绑定是单向的，attribute可以同步到property，但property的更改不会改变attribute。

特性（attribute）和属性（property）的区别如下：

1. 特性（attribute）是写在HTML中的内容，而属性（property）是DOM对象中的内容。
2. 属性的类型可以是任何值，而特性的类型始终是字符串。
3. 属性的名字是大小写敏感的，而特性的名字是大小写不敏感的。

## DOM 操作优化

1. 缓存 DOM 查询结果，以方便复用
2. 将频繁的操作改为一次性操作，比如要批量插入 dom 可以使用 `createDocumentFragment`
