# MVVM

## 传统的 MVC 模式

Model（模型）表示应用程序核心（比如数据库记录列表）
View（视图）显示数据（数据库记录）
Controller（控制器）处理输入（写入数据库记录）

![mvc](/images/mvc.png)

## MVVM 模式

传统 MVC 模式中的 View 依赖 Model，简而言之就是前端中我们获取后端数据(model)后需要操作DOM更新视图(view)，久而久之代码就会变臃肿

MVVM 模式是 MVC 模式的改进版，它切断了 Model 改变 View 这条线，将 Control 换成了 ViewModel，简而言之就是前端中我们使用的 Vue 框架的双向数据绑定，视图(view)改变会改变前端数据(view model)，同时也会改变后端数据(model)，反之亦然，精简了大量冗余代码，提高了开发效率

![mvvm](/images/mvvm.png)

## Vue 双向数据绑定

View 和 ViewModel 的通信是双向数据通信，在前端框架中，就是双向数据绑定

![vue双向数据绑定](/images/vue双向数据绑定.png)

上图简要说明了双向数据绑定的方法

![双向绑定设计模式](/images/双向绑定设计模式.png)

上图简要说明了双向数据绑定的设计模式(发布/订阅模式)：

Observer 就是 Object.definedProperty，用来监听数据变化
Dep 就是放置订阅者的列表
Watcher 就是订阅者
View 就是视图

当我们声明数据时，会生成一个 Watcher 放到 Dep 中，即完成订阅
当我们改变数据时，Observer 会监听到然后通知 Dep 中的所有 Watcher 执行 update 回调函数更新视图

## Vue 框架解析

[地址](https://github.com/KokoTa/All-demo/tree/master/other/MVVM)
