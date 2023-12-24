let wm = new WeakMap()
function test2() {
  let obj = {}
  wm.set(obj, 'obj')
}

test2()
console.log(wm.get(obj)) // null