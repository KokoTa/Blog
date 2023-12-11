# Vue

## Vue-router

1. Vue-router 在点击链接跳转相同的路由是不会刷新的，不过可以通过 `this.$router.go(0)` 或手动 `window.location.reload()` 刷新页面来保持 Vuex 的状态，不过最佳方案是不刷新页面而是刷新数据。就是操作成功后调用获取数据的方法重新获取数据。go/reload 刷新页面会使 DOM 重新渲染，因此不是很建议

2. vue-router 可以使用 `addRoutes` 来进行动态路由添加，可以用作用户访问权限的管理，比如某用户只限定访问某几个路由，可在登录后进行动态的路由分配。当然最简单的方法就是给路由设置 meta，后端给定特定的 meta，前端根据 meta 匹配，匹配成功就能进入路由。

3. router-view 下的组件可以接收 \$emit 出来的信息，比如: `<router-view @xxx="xxx"></router-view>`

4. Vue 嵌套路由组件传参是可行的，但是不能跨路由想当然的传参，这个坑要注意咯！比如： /index 传参给/index/child 是可行的；/index 传参给/other 是不行的。

5. Vue 想根据情况缓存某些页面状态可以使用 include 属性。React 需要可以引用第三方库或者单纯的使用 display: none 来实现

## 库

1. axios 的 [transformRequest](https://github.com/axios/axios) 函数在发送请求时会触发，可以用于打开 loading 组件

2. 有一些请求需要加头信息，我们可以用 axios 的 header 选项进行添加头信息进行欺骗，比如 referer 和 host 头信息（具体差异可以查看 Chrome 的 network 选项）

3. axios 发送默认的 content-type 是 json，然而后端一般只接受 x-www-form-urlencoded，修改方法见 https://github.com/axios/axios

4. [vue-infinity-scroll](https://segmentfault.com/a/1190000011693433) 是滚动到某个点后进行加载操作

5. [vue-lazyload](https://segmentfault.com/a/1190000011672452) 是某数据项（如图片）未加载时进行加载显示

6. [better-scroll](https://ustbhuangyi.github.io/better-scroll/doc/zh-hans/#better-scroll) 可以实现 [手机滑动的缓冲效果](https://zhuanlan.zhihu.com/p/27407024) 和 轮播图效果

7. 使用 better-scroll 加载 keep-alive 组件，切换时总是有机率出现无法滑动的 BUG，此时的 hasVerticalScroll 为 false，scrollHeight 等值都为 0。通过监听 hasVerticalScroll 后 refresh 组件可以解决问题，但是滚动记录将被重置。[问题原因](http://blog.csdn.net/ohradiance/article/details/78509542)

8. 公司项目使用 [qs](https://github.com/ljharb/qs) 来将对象序列化成 URL 的形式，以&进行拼接，调用的是 qs.stringify()

9. [fastclick](https://www.zhihu.com/question/38100861) 解决了手机端点击 300m 后才响应的问题

10. [popper.js](https://popper.js.org/) 是一个弹出框库

11. [perfect-scrollbar](https://github.com/utatti/perfect-scrollbar) 是一个滚动条美化库

12. [Vue 组件懒加载组件](https://github.com/xunleif2e/vue-lazy-component)

## 规范技巧

1. 重复性较大的模块，务必封装成组件使用，并且需要有完整注释

2. 可以使用 Vue 的自定义指令来实现 throttle，控制点击的触发频率

3. Vue 的视图根据数据改变时，如果渲染有问题，那一般是忘了加 key

4. 在每个组件中 @import 相同 .scss 文件使冗余度增加，可以利用 sass-resources-loader 进行预全局加载，使诸如 @mixin 等宏可以全局使用（详情见音乐播放器项目的 index.scss 文件）。其实吧，最简单的方法就是直接在 App.vue 下 import 文件即可

5. 注意 vue 中，只有设置了初始值才会监听该值，如果是对象，则还需要设置属性的初始值，否则无法进行属性的数据监听

## 框架原理

1. [Vue 生命周期](https://segmentfault.com/a/1190000014376915)

2. [Vue.nextTick 的原理和用途](https://segmentfault.com/a/1190000012861862)

3. [Vue proxy](https://juejin.im/post/5bf3e632e51d452baa5f7375)

4. [前端路由原理](https://github.com/kaola-fed/blog/issues/137)

## 其他

1. Vue 音乐项目中的进度条拖动问题：当拖动时音乐还在播放，此时拖动进度条会产生鬼畜现象。原因是音乐的时间变化触发了进度条的 percent 变化，而拖动滚动条时也触发了 percent 变化，从而导致两者冲突，因此在拖动时要阻止 percent 的变化。

2. 其实 virtual dom 就是把碎片化的 dom 的操作逻辑在 js 中进行合并，最终对逻辑结果进行单次渲染。比如添加 dom 就类似用 js 合并了一个 documentFragment，再 append 出去; 修改 dom 中的数据就类似改变 innerHTML。详情搜索知乎:虚拟 dom；或者参考自己的毕业论文，Em...。另一个问题：[为什么 Vue 写列表时要加 key](https://www.zhihu.com/question/61064119) [key 的作用](https://blog.csdn.net/qq_41861679/article/details/80659278)

3. [Vue 模板渲染问题](https://cn.vuejs.org/v2/guide/components.html#%E8%A7%A3%E6%9E%90-DOM-%E6%A8%A1%E6%9D%BF%E6%97%B6%E7%9A%84%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)，单文件组件方式下没有这个问题：
   ![img](https://trello-attachments.s3.amazonaws.com/5a38a632737961a294ceba1d/5ac32d74fe2f995edc1fd035/2dba68caf1a7b3a9a6f1410cc4981f06/TIM%E6%88%AA%E5%9B%BE20180410143901.png)

4. Vue 在开发模式加载的 CSS 是懒加载(点一个组件加载一个组件的样式，然后点其他组件，再加入新组件的样式)，在生产时会全部打包成一个文件。因此在写组件全局或局部样式时需要注意样式覆盖问题。

5. 利用 DOM 复用来实现[超大数据表格数据渲染](https://developers.google.com/web/updates/2016/07/infinite-scroller)。Vue 对应的插件为 vue-virtual-scroll-list
