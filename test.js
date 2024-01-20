/*
 * @Author: KokoTa
 * @Date: 2024-01-05 13:30:40
 * @LastEditTime: 2024-01-18 14:25:53
 * @LastEditors: KokoTa
 * @Description: 
 */
class Test {
  constructor() {
    this.fn = this.fn.bind(this)
  }

  fn() {
    console.log(this)
  }

  fn2 = () => {
    console.log(this)
  }

  test() {
    const t = this.fn // 相当于 onClick={this.fn}
    t()
    const t2 = this.fn2
    t2()
  }
}

const t = new Test()

t.test()