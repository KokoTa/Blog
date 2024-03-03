# Vue2基础

## v-if 和 v-show 的区别

1. v-show 通过 CSS display 控制显示和隐藏
2. v-if 组件会真正的渲染和销毁，而不是显示和隐藏
3. 切换频繁使用 v-show，切换不频繁使用 v-if

## v-for 的 key 有什么用

1. vdom diff 算法会根据 key 判断元素是否要删除
2. 匹配了 key，则只移动元素，性能较好
3. 未匹配到 key，则会删除重建，性能较差

## 事件类型

1. vue 方法传入的 event 是原生事件
2. vue 的事件是被挂载到当前元素的

## 组件间如何通讯

1. props + $emit：适合父子组件
2. event bus（记得解绑事件，避免内存泄漏），Vue2 可以 `new Vue()`，Vue3 要使用第三方库 `event-emitter`：适合跨组件
3. $attr：是 `props + emits` 的候补，用于保存传入组件但是没有声明的 `props + emits`，适合父子组件
4. $parent：获取父节点引用，适合父子组件
5. $refs：获取子节点引用，适合父子组件
6. provide/inject：类似 React 的 context，适合跨组件
7. vuex：适合全局组件

## 生命周期

1. 挂载阶段：beforeCreate/created/beforeMount/mounted
2. 更新阶段：beforeUpdate/updated
3. 销毁阶段：beforeDestroy/destroyed
4. keep-alive：activated/deactivated
5. 错误捕获：errorCaptured

## 每个生命周期都做了什么

1. beforeCreate:
   1. 创建空白 Vue 实例
   2. data/method 尚未被初始化，不可使用
2. created：
   1. Vue 实例初始化完成，完成响应式绑定
   2. data/method 都已经初始化完成，可以使用
   3. 尚未开始渲染模板
3. beforeMount：
   1. 编译模板，调用 render 生成 vdom
   2. 还没有开始渲染 DOM
4. mounted:
   1. 完成了 DOM 渲染
   2. 组件创建完成
   3. 开始从创建阶段进入运行阶段
5. beforeUpdate：
   1. data 发生变化
   2. 准备更新 DOM (尚未更新 DOM)
6. updated:
   1. data 发生变化
   2. DOM 更新完成
   3. 不要在该钩子中修改 data，可能导致死循环
7. beforeDestroy：
   1. 组件进入销毁阶段(尚未销毁，可正常使用)
   2. 可移除、解绑一些全局事件、自定义事件
8. destroyed：
   1. 组件被销毁
   2. 所有子组件也被销毁

## 父子组件生命周期顺序

创建：

1. father beforeCreate
2. father created
3. father beforeMount
4. child beforeCreate
5. child created
6. child beforeMount
7. child mounted
8. father mounted

更新：

1. father beforeUpdate
2. child beforeUpdate
3. father updated
4. child updated

销毁：

1. child beforeDestroy
2. father beforeDestroy
3. child destroyed
4. father destroyed

## 实例挂载中发生了什么

1. new Vue() 调用 _init 方法，定义：
   1. `$set`、`$get` 、`$delete`、`$watch` 等方法
   2. `$on`、`$off`、`$emit`、`$off` 等事件
   3. `_update`、`$forceUpdate`、`$destroy` 生命周期
2. 调用 $mount
3. 挂载主要通过 mountComponent 方法
4. 定义 updateComponent 更新函数
5. 执行 render 生成虚拟 dom
6. _update 方法将虚拟 dom 生成真实 dom，并渲染到页面中

## 自定义双向绑定

v-model 本质上是语法糖，以 input 元素为例：

1. input 元素的 value = this.xxx
2. 绑定 input 事件 this.xxx = $event.target.value
3. data 更新触发 re-render

[使用默认的 model-value 和 update:model-value](https://cn.vuejs.org/guide/components/v-model)

如果想自定义名称，可以这样设置：

```html
 <!-- 父组件 -->
 <template>
   <span>{{name}}</span>
   <ChildComp v-model="name"></childComp>
 </template>

 <!-- 子组件 -->
 <template>
   <input type="text" :value="aaa" @input="$emit('bbb', $event.target.value)" />
 </template>

 <script>
 export default {
   model: {
     prop: 'aaa',
     event: 'bbb'
   },
   props: {
     aaa: String
   }
 }
 </script>
```

## $nextTick

1. Vue 是异步渲染
2. data 改变之后，dom 不会立即渲染
3. $nextTick 在 dom 渲染后触发，以获取最新的 dom

## mixin 的缺点

1. 变量来源不明确，不利于阅读
2. 多 mixin 会造成命名冲突
3. mixin 和组件可能出现多对多的关系，复杂度变高

## 为什么组件 data 必须是函数

Vue 实例在创建过程中，会对组件选项中的 data 进行初始化

如果 data 直接是一个对象而不是一个函数返回一个对象

那么每个组件实例在初始化时都会共享相同的对象引用

这意味着它们会共享相同的数据，这可能会导致一个实例中的数据变化会影响其他实例

## 如何将组件所有 props 传递给子组件

```js
<ChildComp v-bind="$props"></ChildComp>
```

## 什么时候使用 beforeDestory

1. 解绑自定义事件(event bus)
2. 清除定时器
3. 解绑自定义 DOM 事件

## 性能优化

1. 合理使用 v-show v-if
2. 合理使用 computed
3. v-for 加 key，避免和 v-if 同时使用
4. 自定义事件和DOM事件要及时销毁
5. 合理使用异步组件
6. 合理使用 keep-alive
7. data 层级不要太深
8. 使用 vue-loader 在开发环境做模板编译(预编译)
9. webpack 优化
10. 前端通用优化，比如图片懒加载等
11. 使用 SSR

## Vue computed 和 watch 区别

1. 前者用于计算生成新的数据，后者用于监听现有数据
2. 前者有缓存，data 不变不会重新计算
3. 后者默认是浅层监听，不会深度监听
4. 后者监听引用类型，拿不到 oldVal

## Vue 什么时候操作 DOM 比较合适

1. mounted 和 updated 都不能保证子组件全部挂载完成
2. 在这两个钩子中使用 $nextTick 操作 DOM 比较合适

## 杂项

1. v-html 有 xss 风险
2. vuex 的组成：state/getter/mutation/action
3. vuex action 处理异步，mutation 不行；mutation 做原子操作；action 可以整合多个 mutation
4. 在 mounted 阶段进行数据获取是比较常见的做法，因为此时可以操作 DOM 了
5. 多个组件有相同逻辑，可以使用 mixin
6. 加载大组件或者路由组件时，可以使用异步组件
7. 当需要缓存组件不需要重复渲染时，比如静态 tab，可以使用 keep-alive
8. v-for 和 v-if 不能一起使用，如果一起使用了，vue2和vue3的优先级是不同的，vue2 v-if 优先，vue3 v-for 优先
