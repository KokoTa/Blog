/*
 * @Author: KokoTa
 * @Date: 2024-02-25 18:39:55
 * @LastEditTime: 2024-02-29 21:39:33
 * @LastEditors: KokoTa
 * @Description: 
 * @FilePath: \blog\test.js
 */
// 创建一个沙箱函数，接受一个全局对象作为参数
const createSandbox = (global) => {
  // 创建一个空对象作为沙箱的上下文
  const context = Object.create(null);

  // 使用 Proxy 代理上下文对象，让每次判断都返回 true
  const proxy = new Proxy(context, {
    has: () => true,
    get: (target, prop) => {
      // 如果字段在上下文中存在，则返回上下文中的值
      if (prop in target) {
        return target[prop];
      }
      // 否则返回全局对象中的值
      return global[prop];
    },
  });

  // 返回一个函数，该函数接受代码字符串并在沙箱中执行
  return (code) => Function('proxy', `with(proxy){${code}}`)(proxy);
};

// 示例：在全局作用域中定义一个变量
global.aaa = 10;

// 创建一个沙箱
const sandbox = createSandbox(global);

// 在沙箱中执行代码，不会影响全局作用域
sandbox(`
  aaa = 0;
  bbb = 0;
  console.log(aaa, bbb); // 0 0
`);

// 沙箱外部的变量不受影响
console.log(global.aaa, global.bbb); // 10 undefined