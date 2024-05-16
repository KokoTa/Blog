/*
 * @Author: KokoTa
 * @Date: 2023-10-09 17:54:55
 * @LastEditTime: 2024-05-16 11:18:15
 * @LastEditors: KokoTa
 * @Description:
 */

import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
  bundler: viteBundler(),
  theme: defaultTheme({
    sidebar: [
      {
        text: '前端知识点汇总',
        link: '/front/',
        children: [
          '/front/HTML',
          '/front/CSS',
          '/front/JavaScript',
          '/front/盒模型与BFC与布局',
          '/front/事件与类型',
          '/front/原型',
          '/front/类与继承',
          '/front/HTTP',
          '/front/HTTPS',
          '/front/通信与安全',
          '/front/渲染与运行与性能与监控',
          '/front/Cookie与Session与Token',
          '/front/跨域',
          '/front/移动端适配',
          '/front/JS精度问题',
          '/front/服务端踩坑日记',
          '/front/微信开发',
          '/front/JS的this',
          '/front/缓存',
          '/front/MVVM',
          '/front/直播',
          '/front/内网穿透',
          '/front/杂项',
          '/front/Vue2基础',
          '/front/Vue2原理',
          '/front/Vue3相关',
          '/front/React基础',
          '/front/React原理',
          '/front/ReactHook',
          '/front/Webpack与Babel',
          '/front/跨端开发',
          '/front/微服务',
          '/front/项目设计',
          '/front/算法相关',
          '/front/前端问题汇总',
          '/front/掘金文章'
        ]
      },
      {
        text: '前端其他知识点汇总',
        link: '/question/',
        children: [
          {
            text: 'html',
            collapsible: true,
            children: ['/question/html/tag', '/question/html/browser']
          },
          {
            text: 'css',
            collapsible: true,
            children: [
              '/question/css/attribute',
              '/question/css/unit',
              '/question/css/layout',
              '/question/css/other'
            ]
          },
          {
            text: 'javascript',
            collapsible: true,
            children: [
              '/question/js/api',
              '/question/js/es6',
              '/question/js/node',
              '/question/js/webpack',
              '/question/js/other'
            ]
          },
          {
            text: 'net',
            collapsible: true,
            children: [
              '/question/net/http',
              '/question/net/tcp',
              '/question/net/other'
            ]
          },
          '/question/vue/',
          '/question/mongodb/',
          '/question/weixin/',
          '/question/other',
          '/question/interview'
        ]
      }
    ]
  }),
  base: '/blog/',
  lang: 'zh-CN',
  title: "KokoTa's Blog",
  description: 'Just playing around'
})
