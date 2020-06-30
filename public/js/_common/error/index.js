var subCodeErrors = require('./errorcode')

module.exports = function(res,apiUrl) {
  if (!_.isEmpty(res)) {
    if (res.data && res.data.code && res.data.subCode) {
      const subCode = res.data.subCode.search('fed') == -1
        ? res.data.subCode.length >= 4
          ? res.data.subCode.substr(0, 4)
          : res.data.subCode
        : res.data.subCode
      const subCodeInfo = subCodeErrors[subCode] || ''
      let errorFun
      try {
        if (subCode=='0018') {
          return false
        }else{
           errorFun = require('./funs/e' + subCode)
        }
       
        // // 接口返回0018，则存储会话数据，标记是否被踢出状态
        // if (subCode === '0018') {
        //   // 如果有一个接口申请返回了0018（被迫下线）就存session，
        //   window.sessionStorage.setItem('downline', true);
        // }
      } catch (error) {
        errorFun = function (res) {
          return res
        }
      }
      // console.log('========= res', subCode)
      return errorFun(res, subCodeInfo, apiUrl)
    }else {
      return res
    }
  } else {
    return false
  }
}