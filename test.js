/*
 * @Author: KokoTa
 * @Date: 2024-02-25 18:39:55
 * @LastEditTime: 2024-02-26 11:13:31
 * @LastEditors: KokoTa
 * @Description: 
 * @FilePath: \blog\test.js
 */
function getSymmetricNums(max) {
  const res = []
  if (max <= 0) return res

  for (let i = 1; i <= max; i++) {
    const str = i.toString()
    const length = str.length

    let flag = true // 是否对称的标志
    let startIndex = 0
    let endIndex = length - 1

    while (startIndex < endIndex) {
      if (str[startIndex] !== str[endIndex]) {
        flag = false
        break
      } else {
        startIndex++
        endIndex--
      }
    }

    if (flag) res.push(i)
  }

  return res
}

console.log(getSymmetricNums(100))