# Webpack与Babel

## 为什么使用 webpack

1. 模块化
2. 代码压缩
3. 代码分割
4. 代码校验
5. 代码优化
6. 兼容性处理
7. 本地服务器
8. 热更新

## 基本配置(6条)

1. 配置拆分和 merge
2. 启动本地服务
3. 处理 ES6
4. 处理样式
5. 处理图片
6. 模块化

一般来说 webpack 会分成三个配置文件，common/dev/prod，dev/prod 会合并 common

基本配置只能做 demo，不能做线上项目

```js
// paths
const path = require('path')

export default {
  srcPath: path.join(__dirname, 'src'),
  distPath: path.join(__dirname, 'dist')
}
```

```js
// common
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { srcPath } = require('./paths')

module.exports = {
  entry: path.join(srcPath, 'index.js'),
  module: {
    rules: [
      {
        test: /\.js$/,
        // babel-loader 通过 .babelrc 配置
        use: ['babel-loader'],
        include: srcPath,
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        // loader 执行顺序是从后到前
        // 先对 css 进行兼容性转换，然后提取 css，接着插入到 html 中
        // postcss-loader 通过 postcss.config.js 配置
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(srcPath, 'index.html'),
      filename: 'index.html'
    })
  ]
}
```

```js
// dev
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const common = require('./common')
const { distPath } = require('./paths')

module.exports = merge(common, {
  mode: 'development',
  module: {
    rules: [
      // 直接引入图片
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: 'file-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      // window.ENV = 'development'
      ENV: JSON.stringify('development')
    })
  ]，
  devServer: {
    port: 8080,
    progress: true, // 显示打包进度
    contentBase: distPath, // 基于哪个目录启动服务
    open: true, // 自动打开浏览器
    compress: true, // 启动 gzip 压缩
    proxy: { // 设置代理
      // 将本地 /api/xxx 代理到 http://localhost:3000/api/xxx
      '/api': 'http://localhost:3000',
      // 将本地 /api2/xxx 代理到 http://localhost:3000/xxx
      '/api2': {
        target: 'http://localhost:3000',
        pathRewrite: {
          '/api2': ''
        }
      }
    }
  }
})
```

```js
// prod
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const common = require('./common')
const { distPath } = require('./paths')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: distPath,
    filename: 'bundle.[contenthash:8].js', // 根据内容生成不同的文件名
    // publicPath: 'http://cdn.com' // 修改所有静态文件的引用地址
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            // < 5kb 使用 base64，否则继续使用 file-loader
            limit: 5 * 1024,
            // 打包到 img 目录下
            outputPath: '/img/',
            // 设置图片 CDN 地址，也可以通过外层的 output 统一修改
            // publicPath: 'http://cdn.com'
          }
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(), // 清空 output.path 文件夹
    new webpack.DefinePlugin({
      // window.ENV = 'production'
      ENV: JSON.stringify('production')
    })
  ]，
})
```

## 高级配置(6条)

1. 多入口(多页面)

    ```js
    entry: {
      index: path.join(srcPath, 'index.js'),
      about: path.join(srcPath, 'about.js')
    },
    output: {
      filename: '[name].[contenthash:8].js' // name 即为多入口文件名
      path: distPath,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(srcPath, 'index.html'),
        filename: 'index.html'
        chunks: ['index'] // 只引用 name 为 index 的 chunk 文件
      }),
      new HtmlWebpackPlugin({
        template: path.join(srcPath, 'about.html'),
        filename: 'about.html'
        chunks: ['about']
      }),
    ]
    ```

2. 抽离 CSS 文件

    ```js
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader'
          ]
        },
        {
          test: /\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'less-loader',
            'postcss-loader'
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css'
      })
    ],
    optimization: {
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})] // 压缩 JS 和 CSS
    }
    ```

3. 抽离公共代码

    ```js
    {
      optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
        // 分割代码块
        splitChunks: {
          // initial 同步 chunk，只对同步导入的文件处理
          // async 异步 chunk，只对异步导入的文件处理
          // all 全部 chunk，同步异步都处理
          chunks: 'all',

          // 缓存分组
          cacheGroups: {
            // 第三方模块
            vendor: {
              name: 'vendor', // chunk 名称
              priority: 1, // 权重越高，越先抽离
              test: /node_modules/, // 匹配 node_modules 文件夹
              minSize: 0, // 大小限制
              minChunks: 1, // 复用次数限制
            },
            // 公共模块
            common: {
              name: 'common',
              priority: 0,
              minSize: 0,
              minChunks: 2 // 复用超过两次及以上才会被抽离
            }
          }
        }
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: path.join(srcPath, 'index.html'),
          filename: 'index.html'
          chunks: ['index', 'vendor', 'common']
        }),
        new HtmlWebpackPlugin({
          template: path.join(srcPath, 'about.html'),
          filename: 'about.html'
          chunks: ['about', 'common']
        }),
      ]
    }
    ```

4. 懒加载

    ```js
    import(/* webpackChunkName: "abc" */'./abc.js')
    ```

5. 处理 JSX

    ```js
    // .babelrc
    {
      "presets": ["@babel/preset-env", "@babel/preset-react"]
    }
    ```

6. 处理 Vue

    ```js
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
        include: srcPath
      }
    ]
    ```

## module/chunk/bundle 区别

module: 各个源码文件，也称模块，webpack 中一切皆模块

chunk: 由多个模块合并形成，如 entry/import()/splitChunk

bundle: 最终的输出文件

## 优化构建速度(8条)

1. 优化 babel-loader
   1. 开启缓存：`use: ['babel-loader?cacheDirectory']`
   2. 设置 include/exclude 限制范围
2. IgnorePlugin：避免引入无用模块
   1. 比如 moment.js 有多语言，默认会引入所有语言，代码过大
   2. 忽略 moment.js 的 locale 目录：`new webpack.IgnorePlugin(/\.\/locale$/, /moment/)`
   3. 手动代码引入语言包：`import 'moment/locale/zh-cn'`
3. noParse：避免重复打包
   1. 比如 `xxx.min.js`，这种已经是打包过的了，不需要再进行打包
   2. `noParse: [/babylon\.min\.js$/]`
   3. IgnorePlugin 和 noParse 的区别：
      1. 前者直接不引入，代码干脆就没有
      2. 后者引入，但不打包
4. happyPack：多进程打包
   1. JS 是单线程，开启多进程加速打包

   2. ```js
      {
        module: {
          rules: [
            {
              test: /\.js$/,
              use: ['happypack/loader?id=babel'] // 将 .js 文件交给 id 为 babel 的 HappyPack 实例
              include: srcPath
            }
          ]
        },
        plugins: [
          new HappyPack({
            id: 'babel', // 唯一标识，代表该实例用于处理一类特定的文件
            loaders: ['babel-loader?cacheDirectory'], // 处理 js 文件的 loader，即 babel-loader
          })
        ]
      }
      ```

   3. 放在开发或者生产环境都 OK，毕竟加速打包
5. ParallelUglifyPlugin：多进程压缩 JS
   1. webpack 内置有 Uglify 工具压缩 JS，但是是单线程的
   2. 可以通过这个插件开启多进程，原理和 HappyPack 差不多

   3. ```js
      {
        plugins: [
          new ParallelUglifyPlugin({
            // 传递给 UglifyJS 的选项
            // 还是使用 UglifyJS 压缩，但是开启了多进程
            uglifyJS: {
              output: {
                beautify: false, // 紧凑输出
                comments: false // 删除注释
              },
              compress: {
                drop_console: true, // 删除 console
                collapse_vars: true, // 折叠变量，即把只使用了一次的变量直接转为静态值
                reduce_vars: true // 提取出使用了多次但是没有定义成变量去引用的静态值
              }
            }
          })
        ]
      }
      ```

   4. 放在生产环境，开发环境没必要压缩
6. 自动刷新：一般设置了 devServer 就不需要设置 watch，前者包含了后者

   1. ```js

      {
        watch: true, // 开启监听，默认为 false，开启后 webpack-dev-server 会自动开启和刷新浏览器
        watchOptions: {
          ignored: /node_modules/,
          aggregateTimeout: 300, // 监听到变化后多久再去执行动作，防止文件更新太快导致重新编译频率太高，默认为 300ms
          poll: 1000 // 通过轮询判断文件是否变化，默认 1000ms
        }
      }

      ```

   2. 弊端：速度慢、状态丢失
7. 热更新

   1. ```js
      entry: {
        index: [
          'webpack-dev-server/client?http://localhost:8080',
          'webpack/hot/dev-server',
          path.join(srcPath, 'index.js')
        ]
      },
      plugins: [
        new HotModuleReplacementPlugin()
      ],
      devServer: {
        port: 8080,
        hot: true // 开启热更新后，就不会自动刷新整个页面了，而是部分刷新，状态得以保留
      }
      ```

   2. 配置添加热更新后，CSS 可以直接热更，但是 JS 需要声明要监听的文件，否则还是会自动刷新

      ```js
      if (module.hot) {
        // 监听 abc.js，当其发生变化后，会触发回调函数
        module.hot.accept('./abc.js', function() {
          conosle.log('updated')
        })
      }
      ```

8. DllPlugin：动态链接库插件，webpack 已内置该插件
   1. 前端框架如 React/Vue 体积大，构建慢
   2. 前端框架安装后都是比较稳定的，不会经常改动版本
   3. 配置之后，同一个版本只会构建一次，不用每次都构建
   4. DllPlugin：打包出 dll 文件：

      ```js
      // dll webpack config
      {
        mode: 'development',
        entry: {
          react: ['react', 'react-dom'] // 把 react 相关的模块放入单独的动态链接库
        },
        output: {
          filename: '[name].dll.js',
          path: distPath, // 动态链接库的输出地址，输出的内容就是 react 相关的模块集合
          library: '_dll_[name]' // 存放动态链接库的全局变量名称，加 _dll_ 是为了防止全局变量冲突
        },
        plugins: [
          new DllPlugin({
            name: '_dll_[name]', // 名称要和上面一致，该名称会放入 manifest.json -> name 中
            path: path.join(distPath, '[name].manifest.json') // 描述动态链接库的 json 文件的输出地址
          })
        ]
      }
      ```

   5. DllReferencePlugin：使用 dll 文件

       ```html
       <!-- index.html -->
       <script src="xxx/react.dll.js" />
       ```

       ```js
       // dev webpack config
       {
        plugins: [
          new DllReferencePlugin({
            manifest: require(path.join(distPath, 'react.manifest.json'))
          })
        ]
       }
       // babel-loader 部分需要 exclude 掉 react 的模块，不进行处理
       ```

可用于生产环境：babel-loader 优化、IgnorePlugin、noParse、happyPack、ParallelUglifyPlugin

可用于开发环境：自动刷新、热更新、DllPlugin

关于开启多进程：

1. 项目较大，打包较慢，开启多进程能提高速度
2. 项目较小，打包很快，开启多进程反而会降低速度(进程开销)

## 优化产出代码(8条)

期望的效果：

1. 体积更小
2. 合理分包，不重复加载
3. 速度更快，内存使用更少

可用的方式：

1. 小图片 base64
2. bundle 加 hash
3. 懒加载
4. 提取公共代码
5. IgnorePlugin
6. CDN 加速
7. 设置 mode 为 production
   1. 会自动开启代码压缩(单线程)
   2. React/Vue 等会自动删掉调试代码(如开发环境的 warning)
   3. 会自动开启 Tree Shaking(只有 ES6 Module 才生效)
8. Scope Hosting
   1. 多个文件打包为一个文件时，引用的文件都会变成一个函数
   2. 如果引用的文件多，就会导致函数也变多
   3. 该方式可以减少函数体积、合并函数、避免函数跨作用域调用、提高代码可读性

   4. ```js
      {
        // scope hosting 只能在 ES6 Module 规范下生效
        // 因此需要在 resolve 中设置引用第三方包时优先引用 ES6 Module 规范的文件
        resolve: {
          // 针对 npm 中的第三方模块，优先采用 jsnext:main 中指向的 ES6 Module 文件
          mainFields: ['jsnext:main', 'browser', 'main'],
        },
        plugins: [
          // 开启 scope hosting
          new ModuleConcatenationPlugin()
        ]
      }
      ```

## ES6 Module 和 CommonJS 的区别

1. 前者是静态引入，编译时引入
2. 后者是动态引入，执行时引入
3. 只有前者才能静态分析，实现 Tree Shaking

```js
// CommonJS
const a = require('./a')
if (isDev) {
  // 正常执行，可以动态引入文件
  const b = require('./b')
}

// ES6 Module
import a from './a'
if (isDev) {
  // 编译报错，只能静态引入文件
  import b from './b'
}
```

## Babel相关

1. @babel/cli: 命令行工具
2. @babel/core: babel 的核心库，提供 API
3. @babel/preset-env: babel 的预设库，是多个 plugin 的集合，它只转换语法，不提供补丁
4. @babel/polyfill: 相当于 core-js + regenerator，babel 7.4 之后废弃，推荐使用 @babel/runtime
   1. core-js：是一个浏览器 API 标准库，集成了大部分 API 补丁(比如 Promise)
   2. regenerator：配合 core-js 使用，集成了其他 API 补丁(比如 yield)
   3. 该库是直接引入，直接引入的文件较大，会引入了所有补丁，需要在入口文件中写入 `require('@babel/polyfill')`
   4. 该库会污染全局变量
5. @babel/runtime: 为转译后的代码提供运行时支持，包括辅助函数和 polyfill
   1. 该库是按需引入，在 presets 选项中添加 `{ "useBuiltIns": "usage", "corejs": 3 }`
   2. 该库能解决污染全局变量的问题，因此产出第三方 lib 要选择用这个，不要用 @babel/polyfill
6. @babel/plugin-transform-runtime: 优化 @babel/runtime，自动移除语法转换后内联的辅助函数，以及引入 @babel/runtime/helpers 来替代这些辅助函数，防止这些函数被频繁引入到其他依赖的文件中

    ```js
    // .babelrc
    {
      plugins: [
        [
          "@babel/plugin-transform-runtime",
          {
            "absoluteRuntime": false,
            "corejs": 3,
            "helpers": true,
            "regenerator": true,
            "useESModules": false
          }
        ]
      ]
    }
    ```

通过 `npx babel index.js` 进行编译

## 前端为什么要打包和构建

1. 让代码体积更小(压缩、合并、Tree Shaking)，加载更快
2. 编译高级语言或语法(TS、ES6+、模块化、SCSS)
3. 提供兼容性和错误检查(Polyfill、Postcss、Eslint)
4. 统一、高效的开发环境
5. 统一构建流程和产出标准
6. 集成公司构建规范(提测、上线)

## Loader 和 Plugin 的区别

1. 前者是模块转换器，如 less -> css
2. 后者是扩展插件，如 HtmlWebpackPlugin

## Webpack 和 Babel 的区别

1. 前者是打包构建工具，是多个 loader/plugin 的集合
2. 后者是 JS 新语法编译工具，不关心模块化

## Webpack/Rollup/Vite 对比

[Webpack/Rollup/Vite 对比](https://juejin.cn/post/7097493230572273700?searchId=20231221214358EA579256433B7D0B9706)

## Webpack 是如何实现懒加载的

[Webpack 懒加载原理](https://juejin.cn/post/7225989692562047033?from=search-suggest)

## 如何产出一个 lib

参考 DllPlugin 示例

## 为什么 Proxy 不能被 Polyfill

1. Class 可以通过 function 模拟
2. Promise 可以通过 callback 模拟
3. Proxy 无法通过 Object.defineProperty 模拟

## 输入 npm install 会发生了什么

1. 查找 npm  配置信息：检查项目中是否有 `.npmrc` 文件，如果没有就去检查全局 `.npmrc`，如果还没有就使用 npm 内置的默认配置
2. 构建依赖树：如果项目中有 `package-lock.json`，则会判断该文件和 `package.json` 中的依赖版本是否一致，如果一致则使用 lock 的信息，否则使用 `package.json` 的信息；如果没有 lock 就用 `package.json`
3. 下载资源：如果有缓存，直接解压到项目 `node_modules` 中，如果没有就远程下载再解压
4. 生成 package-lock.json：如果项目中没有 lock 文件，就生成一个，有就进行更新

## 如何解决包冲突

[npm 处理依赖与依赖冲突](https://aprilandjan.github.io/npm/2019/08/02/how-npm-handles-dependency-version-conflict/)

**包冲突是什么**：

是指不同依赖模块对同一个包有不同版本的要求，即同一个包存在多个版本的情况

**npm 如何解决包冲突**：

1. 如果没有包冲突，通常会使用扁平化结构。扁平化结构将所有依赖包都放在工程根目录下的 node_modules，避免了重复下载的情况
2. 如果存在包冲突，npm 会采用树形结构来确保不同版本的包不会相互影响。如果不同依赖模块对同一个包有不兼容的版本要求，npm 会将这些包分别安装在不同的目录下，避免了包冲突的问题

**pnpm 如何解决包冲突**：

1. pnpm 使用扁平化结构，所有依赖放在全局的 store 中，避免了重复下载的情况
2. pnpm 通过硬链接和软连接，避免了包冲突的问题

**peerDependencies 配置解决包冲突**：

比如项目中依赖了 2.0，某个插件中依赖了 1.0, 这个时候就会在项目的 `node_modules` 安装 2.0，在插件的 `node_modules` 安装 1.0。如果插件设置了 peerDependencies，则插件会依赖项目的 2.0，而不会安装 1.0，这避免了包冲突，但是如果版本之间有较大改动，就会出问题