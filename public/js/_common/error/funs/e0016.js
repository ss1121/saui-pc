module.exports = (res, errInfo) => {

  let returnUrl = ''
  if (/\/usercenter|\/buyer|\/shop\/supply/.test(location.pathname)) {
    returnUrl = encodeURIComponent(location.origin + location.pathname)
  }
  if (/u\.(.)*8atour\.com/.test(location.hostname)) {
    if (typeof res == 'object') {
      window.onbeforeunload = null
      setTimeout(() => {
        res.errInfo = errInfo
        window.location.href = CONFIG.SITE.u + 'usercenter/login' + (returnUrl ? ('?return='+returnUrl) : '')
      }, 1500);
    }
    // 截断数据不需返回res
    return false
  } else  {
    return res
  }
}