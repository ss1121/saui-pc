module.exports = (res, errInfo) => {

  if (typeof res == 'object') {
    res.errInfo = errInfo
  }
  // 截断数据不需返回res
  return res
}