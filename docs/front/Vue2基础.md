# Vue2基础

## v-if 和 v-show 的区别

1. v-if 会在渲染前做判断，如果不符合就不会有对应的 DOM
2. v-show 会有 DOM，如果不符合就设置 display: none
3. 切换不频繁使用 v-if，切换频繁使用 v-show

## v-for 的 key 有什么用

1. v-for 和 v-if 不能一起使用，如果一起使用了，vue2和vue3的优先级是不同的，vue2 v-if 优先，vue3 v-for 优先
2. diff 算法会先比较同一层级的节点，如果节点类型不同，则会删除当前节点并创建新节点，而不会比较该节点的子节点；如果类型相同，则重新设置该节点的属性，完成更新
3. key 可以提高渲染性能，避免重复删除和创建元素
4. key 可以避免数据混乱，确保跟踪的节点身份，以便重用和重排元素
5. key 不能乱写，比如 random 或 index

## 事件类型

1. vue 方法传入的 event 是原生事件
2. vue 的事件是被挂载到当前元素的

## 组件间如何通讯

1. props + $emit
2. event bus（记得解绑事件，避免内存泄漏）

## 生命周期

1. 挂载阶段：beforeCreate/created/beforeMount/mounted
2. 更新阶段：beforeUpdate/updated
3. 销毁阶段：beforeDestroy/destroyed
4. keep-alive：activated/deactivated
5. 错误捕获：errorCaptured

## 父子组件生命周期顺序

1. father created -> child created -> child mounted -> father mounted
2. father before update -> child before update ->

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

## 杂项

1. computed 有缓存，data 不变不会重新计算
2. watch 默认是浅层监听，不会深度监听
3. watch 监听引用类型，拿不到 oldVal
4. v-html 有 xss 风险
5. vuex 的组成：state/getter/mutation/action
