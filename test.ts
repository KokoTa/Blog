const arr = [0, 0, 1]

0



function moveZero(nums: number[]) {
  let j = -1

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] === 0) {
      if (j < 0) j = i
    }

    if (nums[i] !== 0 && j >= 0) {
      const temp = nums[i]
      nums[i] = nums[j]
      nums[j] = temp
      j++
    }
  }
  
  return nums
}

// console.log(moveZero(arr))