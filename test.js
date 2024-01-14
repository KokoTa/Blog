function reactive(data) {
  // 判断是否是数组或对象(函数不考虑)
  if (typeof data !== 'object' || data == null) {
    return data
  }

  const proxyConfig = {
    get(target, key, receiver) {
      // 只处理本身的属性(非原型属性)
      const keys = Reflect.ownKeys(target)
      if (keys.includes(key)) {
        console.log('get', key)
      }

      // 正常执行，不影响赋值
      const res = Reflect.get(target, key, receiver)
      // 递归，深度监听
      // 相比于 vue2 一次性全部设置监听，vue3 只在获取时设置监听，是惰性的
      return reactive(res)
    },
    set(target, key, val, receiver) {
      // 重复的数据不处理
      const oldVal = target[key]
      if (val === oldVal) return true

      // 判断是否是新增属性
      const keys = Reflect.ownKeys(target)
      if (!keys.includes(key)) {
        console.log('add', key)
      } else {
        console.log('update', key)
      }

      const res = Reflect.set(target, key, val, receiver)
      console.log('set', key, val)
      return res
    },
    deleteProperty(target, key) {
      const res = Reflect.deleteProperty(target, key)
      console.log('delete', key)
      return res
    }
  }

  const observed = new Proxy(data, proxyConfig)
  return observed
}

// 测试
const data = {
  name: 'KokoTa',
  info: {
    city: 'Xiamen'
  },
  arr: [1]
}

const proxyData = reactive(data)

proxyData.name = 'a'

console.log(proxyData.info.city)

proxyData.age = 28
