# Cookie与Session与Token

我：MMP，又要输入密码了！
他：你的令牌过期了？
我：什么令牌？
他：token啊~
我：令牌不是session吗？
他：那是会话啊~
我：会话不是cookie吗？
他：那是一个存放对象啊~
我：噢~~
他：懂了？
我：那是啥？
他：MMP。。。

## Cookie

我们先来说说cookie：  
它是用来存放client信息的对象，每次请求时都会发送给server。  
cookie是不可跨域的，如果不想让js操作某cookie键值，可以设置httpOnly属性使之只能在server操作。  
机智的人民群众当年把用户名和密码简单加密后存放在cookie上，最后被黑客们捅爆了菊花。  
因为敏感信息完全暴露，所以这是一个不靠谱的方法。  

## Session

后来我们机制的人民群众又想出了一个方法，利用session！  

**流程解析：**  

* client第一次请求 -> 注册/登录 -> server生成session -> session中存放信息 -> cookie中设置一个sessionID(对应创建的session)来作为身份标识 -> 返回响应给client  
* client第二次请求 -> server从cookie中取出sessionID -> 根据id在数据库中查找对应session  -> 从session中提取信息并进行操作 -> 返回响应给client  
* client第三次请求 -> sessionID过期 -> 重新登录 -> server生成新session -> ...同第一次请求  

以上方法又称为cookie-session方法，cookie中不存放敏感数据，就放一个id就可以了，而server用来存放敏感数据并根据id进行数据查找。  
感觉是不是很棒棒？  
是不是很简单？  
是不是很easy？  
然而这个方法有两个问题：  

1. 要占用大量的服务器空间，因为session中存放着大量数据（session可以存放在文件/内存/数据库中）  
2. 单点登录问题，即一次注册，一次登录与退出，状态可以在子域名间共享。简单来说如果我们登录了豆瓣，那么就等于登录了豆瓣FM、豆瓣电影，状态是共享的。假设以session方式来存储用户id，一开始用户的session只会存储在一台服务器上。对于有多个子域名的站点，每个子域名至少会对应一台不同的服务器。如果要在其他的子域名下依然可以取到Session，这要求我们在多台服务器上同步Session。

## Token

那有木有更好的方法啊，我亲爱的汤姆？  
当然啦！杰瑞！我们可以利用token啊！  
token是啥？  
token又称令牌，目前主流的token实现遵循jwt(JSON Web Token)规范，即由**三个部分组成**：头部、载荷、签名。  
jwt适合用于向Web应用传递一些非敏感信息。

### 头部(head)

描述jwt基本信息的对象：  

```json
{
  'typ': 'JWT', // token规范类型
  'alg: 'HS256', // 所用加密算法
}
```

### 载荷(payLoad)

描述token信息的对象，包含关于用户的非敏感信息(用户名/权限):  

```json
{
    "iss": "KokoTa", // 签发者
    "iat": 1441593502, // 签发时间
    "exp": 1441594722, // 过期时间
    "aud": "www.example.com", // 接收方
    "sub": "jrocket@example.com", // 用户方
    "user_name": "Karo", // 用户名
    "admin": true, // 用户权限
}
```

### 签名(sign)

jwt规范规定用 **base64编码后的头部.载荷** + **secret字符串** + **HS256算法加密** 后的值 作为签名。  
如果有人对头部以及载荷的内容解码之后进行修改，再进行编码的话，那么新的签名和之前的签名就将是不一样的。  

### 最终的token

token = 头部.载荷.签名，例子如下：  

```shell
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcm9tX3VzZXIiOiJCIiwidGFyZ2V0X3VzZXIiOiJBIn0.rSWamyAYwuHCo7IFAgd1oRpSP7nzL7BF5t7ItqpKViM
```

### token流程  

**流程解析：**  

* client第一次请求 -> 注册/登录 -> server生成token -> 放在cookie中返回给client  
* client第二次请求 -> server从cookie中获得token -> server对比sign是否正确，token是否过期，接收方是否正确等来判断有效性 -> 有效则继续操作  
* client第三次请求 -> 请求了子域名 -> 由于cookie设置了domian -> 可以取到token -> 验证token -> 有效则继续操作  
* client第四次请求 -> token过期 -> 重新登录 -> server生成token -> ...同第一次请求  

**标注：**

1. token的广泛用处之一是**API权限控制**。  
2. 客户端可以将token存储在cookie/内存/loacalStorage中。  
3. 通过给cookie的token键值对设置`domain=.taobao.com`，这样所有子域名都能接收到这个token，如果再设置一下httpOnly，那么这个token就不能被前端操作，防止了XSS攻击，但将token存放在cookie的方法无法阻止CSRF攻击，不过这个方法对于展示型网站也就足够了，比如扇贝、B站等(它们的支付都是扫码，CSRF没啥卵用)。  
4. 除了上面利用cookie传递token的方法，还可以将token加在请求/响应的header中传递。前者会发生CSRF问题，因为点击诱导连接后，cookie被自动发送，而cookie中含有token，server直接验证通过后就发生操作了；但后者不会，因为诱导连接不能操作cookie，cookie只能在本域下操作，我们让本域操作cookie并提取token(或者token存储在localStorage中，让本域取出)，再将其添加到请求头中发送，server验证请求头的token而不是验证cookie中的token，这样就避免了token被自动传递识别的问题，然而这又会发生XSS问题(高级浏览器会自己禁用XSS攻击，另外如果使用框架的话也无需担心XSS攻击)。  
5. 由上一点可知，普通的查询、展示、浏览，可以直接用token进行身份验证，而当进行提交表单或其他重要操作时，不能因为client保存了用户状态就认为是用户本人操作。这些重要请求需要在本域中进行加工后(比如请求中加上服务端渲染页面时给的随机字符串，或者请求中加上按照某种约定生成的字符串)再发送给server，而server也要对这些信息进行相应的验证。  
6. [关于如何实现异地登陆后，本地被踢出并提示重新登录的方法](https://segmentfault.com/q/1010000008366262)

### token总结

优点：

1. 解决了session占用内存大的问题。因为只保存密码等敏感信息，其余的非敏感信息都存储在token中。
2. 解决了单点登录的问题。见token流程解析3，注意把token存储在localStorage是不能解决单点问题的，因为localStorage不可跨域。其他解决单点登录的方法见[链接](https://cnodejs.org/topic/55f6e69904556da7553d20dd)
3. 可以预防CSRF攻击
4. 结构简单(JSON)，便于传输
5. 跨语言支持(JAVA、PHP等)

缺点：

1. 缺点就是使server有计算压力（例如加密、编码和解码）。
2. session 有的问题 token 也有，比如泄露问题(使用 HTTPS 解决)、重放攻击问题([解决方案](https://blog.csdn.net/koastal/article/details/53456696))、续签和注销问题

### 状态、有状态、无状态是什么

* 状态：请求的状态是 client 与 server 交互过程中，保存下来的相关信息，client的保存在 page/request/session/application 或者全局作用域中，而 server 的一般存在 session 中。
* 有状态 API：server 保存了 client 的请求状态， server 会通过 client 传递的 sessionID 在其 session 作用域内找到之前交互的信息并应答。(cookie-session方法)
* 无状态 API：无状态是 RESTful 架构设计的一个非常主要的原则。无状态 API 的每一个请求都是独立的，它要求由client保存所有需要的认证信息，每次发请求都要带上自己的状态。(token方法)

## 我们需要更安全的方式

归根结底，表面上保证了用户登录状态的安全，但重点是如果client被攻破，被黑客截取到了cookie/session/token，那岂不是可以拿着这个值冒充用户了吗？就算给它们设置过期值，但只要在过期范围内，还是能逍遥法外。  
因此任何自己想的安全措施都是错误的、或者不完备的，要防范中间人攻击的唯一正确方法就是使用**HTTPS**。以前也流行过SecretKey Hash签名等等，新版本的API大部分都已经放弃掉这些方法了，比如说OAuth的新版本就是只支持HTTPS。HTTP上的方法或多或少是有漏洞的，比如说HMAC校验是不能防范重放攻击的，也没有办法防止中间人从API里窃取敏感信息，更何况如果登录的时候就被监听了那不是完蛋了。  

## 资料

[程序实例：app.js](https://github.com/KokoTa/Http-status/blob/master/app.js)  
[jwt官网](https://jwt.io/)
