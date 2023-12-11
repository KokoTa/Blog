# JS的this

虽然说 `this` 这个东西是前端开发人员必须知道的东西。  
但作为一个失忆少年，还是做一下笔记以防记忆重置。  

以下内容都在 **Node** 环境中运行：

## 全局中的 this

```js
> console.log(this === global); // true
```

如果在命令行中输入该语句，返回 true，的确，全局情况下 this 指向 `global`

```js
// index.js
console.log(this === global); // false
console.log(this === module.exports); // true
console.log(this === exports); // true
console.log(exports == module.exports); // true
```

但如果该语句在文件中并以 node 命令调用，那么 this 指向的是 `module.exports`

```js
'use strict'
console.log(this); // undefined
```

严格模式下，this 指向 `undefined`，因此严格模式的代码相比默认模式会更加健壮

## 函数中的 this

```js
function x() {
  console.log(this === global); // true
}
x();
```

函数中的 this 与调用者有关，这里我们的调用者是全局，因此在非严格模式下，this 指向 `global`，当然严格模式下是指向 `undefined`  

```js
function X(a, b) {
  this.a = a;
  this.b = b;
}
const x = X(1, 2);
console.log(x); // undefined
console.log(this); // {a: 1, b: 2}
```

如果函数不是作为构造函数来调用，那么 this 指向就遵循上一个例子，如果在 this 上赋值，就等于是在 `global` 上赋值，严格模式下会报错

```js
function X(a, b) {
  this.a = a;
  this.b = b;
}
const x = new X(1, 2);
console.log(x); // {a: 1, b: 2}
console.log(this); // {}
```

如果以构造函数的形式调用，构造函数会新建一个对象并把函数里的 this 指向这个 `新对象`

```js
function X(a, b) {
  this.a = a;
  this.b = b;
  return {
    c: 'heihei'
  }
}
const x = new X(1, 2);
console.log(x); // {c: 'heihei'}
console.log(this); // {}
```

```js
function Y(a, b) {
  this.a = a;
  this.b = b;
  return 'heihei';
}
const y = new Y(1, 2);
console.log(y); // {a: 1, b: 2}
console.log(this); // {}
```

使用 return 语句可以覆盖构造函数的默认调用，但是如果 return 的不是一个 `对象`，那么返回的还是默认调用的值  

## 方法中的 this

```js
const obj = {
  name: 'KokoTa',
  method() {
    console.log(this.name);
  }
}
obj.method(); // KokoTa
```

之前我们说过函数的 this 和调用者有关，这里我们可以看到 obj 是调用者，因此 this 指向 `obj`

```js
const m = obj.method;
m(); // undefined

```

如果将方法赋值给变量并调用，全局 是调用者，因此 this 指向 `global`

## call/apply

函数中的 this 是隐式设置的，使用 call/apply 可以显示设置 this 指向  

```js
function method() {
  console.log(this.name);
}
const obj = {
  name: 'KokoTa'
}

method.call(obj); // KokoTa
method.apply(obj); // KokoTa
method(); // undefined
```

在非严格模式下使用 call/apply ，JavaScript引擎会忽略传递给 call/apply 的 null/undefined/全局

## bind

bind 会返回一个绑定了 this 的新函数

```js
const obj = {
  name: 'KokoTa',
  method() {
    console.log(this.name);
  }
}
const b = obj.method.bind(obj);
const m = obj.method;
b(); // KokoTa
m(); // undefined
```

注意是返回一个新函数，而不是调用哦~  

```js
const obj2 = {
  name: 'Brain'
}
b.apply(boj2); // KokoTa
```

绑定后，就算使用 call/apply 也无法改变 this 指向

## 箭头函数中的 this

```js
const obj = {
  name: 'KokoTa',
  method() {
    console.log(this.name);
  },
  method2: () => {
    console.log(this.name);
  }
}
obj.method(); // KokoTa
obj.method2(); // undefined
```

箭头函数是没有自己的 this 的，它的 this 值由外围最近一层非箭头函数决定，否则为 `global`(严格模式下为 `undefined`)  
上述例子中 method2 本身就是最外层函数了，所以它将指向 `global`  
箭头函数不能用作构造函数。因此，我们也不能在箭头函数内给 this 设置属性  
此外，使用 call、apply 或 bind 等方法赋值 this，箭头函数会忽略  

```js
const obj = {
  count: 0,
  increase () {
    setInterval (() => {
      console.log (++this.count);
    }, 1000);
  },
};
obj.increase(); // 1
```

箭头函数的用处之一就是绑定作用域，比如定时器里的函数就绑定在了 obj 对象上  

## Class中的 this

和构造函数同理，Class 本身就是构造函数的语法糖  

## 彩蛋

Babylon.js 是一款基于 WebGL 开发的3D游戏框架，姑且花了一个星期学习了基本用法。  
计算机图形学真是一门令我又好奇又懵逼的学科~~~  
[Babylon官网](http://doc.babylonjs.com/)  
[Babylon Demo](https://github.com/KokoTa/All-demo/blob/master/demo/Babylon/MikuFun.html)
[ArcRotateCamera zoom to mouse position](http://www.html5gamedevs.com/topic/39249-arcrotatecamera-zoom-to-mouse-position/?tab=comments#comment-224029)
