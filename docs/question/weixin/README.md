# 微信相关

## H5

1. H5 [微信防露底](https://blog.ghostry.cn/program/702.html)

2. 语音录入一般是调用微信 SDK

3. [微信内置浏览器如何小窗不全屏播放视频](https://www.zhihu.com/question/36423771)

## 小程序

1. rpx（responsive pixel）: 可以根据屏幕宽度进行自适应。规定屏幕宽为750rpx。如在 iPhone6 上，屏幕宽度为375px，共有750个物理像素，则750rpx = 375px = 750物理像素，1rpx = 0.5px = 1物理像素。

2. 小程序的 openSetting 只显示尝试授权过的那些授权

3. 有一些 css 样式在微信 IDE 中不支持, 例如 font-weight, letter-spacing(及类似调整字间距的样式)等。[连接](http://www.mamicode.com/info-detail-2281911.html) [连接](https://blog.csdn.net/luoyumeiluoyumei/article/details/81509694)

4. 输入框绑定数值时，可能需要 bindinput + bindchange 用以兼容某些奇葩操作。

5. 有懒加载数据函数的页面，在跳转页面复用该函数时，重置调用函数时需要用到的参数。

6. 小程序 switchTab 会调用应用的 reLaunch

7. 可以使用 swiper 模拟左右滑动的界面
