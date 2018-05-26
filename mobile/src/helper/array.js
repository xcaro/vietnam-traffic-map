export default {
  LoopFromAtoBandDo (arr, a, b, callBack) {
    for (let i = a; i <= b; i++) {
      callBack(arr[i])
    }
  }
}
