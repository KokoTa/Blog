# MongoDB

## Mongoose

1. Mongoose 自动创建的文本默认都是复数形式的，除非建立 model 时传入第三个参数

2. Mongoose 中通过子查询找到

```json
{ "cardList": [{ "productId": 1, "productNumber": 10 }] }
```

通过 $ 符号表示找到的子文档，并以此更新子文档的其他字段

```js
cardList.$.productNumber
```
