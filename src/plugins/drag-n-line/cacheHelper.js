let simpleNode = []
let withPointNode = []

export function pushToSimpleNodeArray (obj) {
  simpleNode.push(obj)
}

export function getSimpleNodeArray () {
  return simpleNode
}

export function resetSimpleNodeArray () {
  simpleNode = []
}

export function setWithPointNodeArray (array) {
  withPointNode = array
}

export function pushToWithPointNodeArray (obj) {
  withPointNode.push(obj)
}

export function getWithPointNodeArray () {
  return withPointNode
}