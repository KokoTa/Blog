function deepClone(obj: any, map = new WeakMap()): any { // WeakMap 是为了避免循环引用
   if (typeof obj !== 'object' || obj == null) return obj

  // 避免循环引用
  const objFromMap = map.get(obj)
  if (objFromMap) return objFromMap

  let target: any = {}
  map.set(obj, target)

  // Map
  if (obj instanceof Map) {
    target = new Map()
    obj.forEach((value, key) => {
      const k = deepClone(key, map) // Map 的 key 不一定是字符串，需要深拷贝
      const v = deepClone(value, map)
      target.set(k, v)
    })
  }

  // Set
  if (obj instanceof Set) {
    target = new Set()
    obj.forEach(value => {
      const v = deepClone(value, map)
      target.add(v)
    })
  }

  // Arrray
  if (obj instanceof Array) {
    target = obj.map((item) => deepClone(item, map))
  }

  // Object
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      target[key] = deepClone(obj[key], map)
    }
  }

  return target
}