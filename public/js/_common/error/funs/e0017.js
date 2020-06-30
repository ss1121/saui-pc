import { tips } from 'component/client'

module.exports = (res, errInfo) => {

  if (typeof res == 'object') {
    setTimeout(() => {
      res.errInfo = errInfo
      window.location.href = CONFIG.SITE.u + 'usercenter/login'
    }, 1500);
  }
  // 截断数据不需返回res
  return res
}