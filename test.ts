function findMinK(node: any | null, k: number) {
  const arr: number[] = []

  const inOrder = (n: any | null) => {
    if (n) {
      inOrder(n.left)
      arr.push(n.value)
      inOrder(n.right)
    }
  }

  inOrder(node)

  return arr[k - 1]
}

const tree = {
  value: 5,
  left: {
    value: 3,
    left: {
      value: 2,
      left: null,
      right: null
    },
    right: {
      value: 4,
      left: null,
      right: null
    }
  },
  right: {
    value: 7,
    left: {
      value: 6,
      left: null,
      right: null
    },
    right: {
      value: 8,
      left: null,
      right: null
    }
  }
}

console.log(findMinK(tree, 7))