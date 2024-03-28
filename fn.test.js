/*
 * @Author: KokoTa
 * @Date: 2024-03-28 17:00:42
 * @LastEditTime: 2024-03-28 17:09:41
 * @LastEditors: KokoTa
 * @Description:
 */
const fn = require('./fn')

test('test1', () => {
  expect(fn([1, [2, [3]]])).toEqual([1, 2, 3])
})
