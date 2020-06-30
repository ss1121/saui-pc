
window.allowRequest = true

let interceptType = {
  '0016': require('commonjs/error/funs/e' + '0016'),
  '0018': require('commonjs/error/funs/e' + '0018'),
  '0034': require('commonjs/error/funs/e' + '0034'),
  '0035': require('commonjs/error/funs/e' + '0035'),
  '0036': require('commonjs/error/funs/e' + '0036'),
  '0037': require('commonjs/error/funs/e' + '0037')
}
$(document).ajaxComplete(function (event, xhr, settings) {
  let reg = /^(\/api\/)/
  if (reg.test(settings.url)) {
    let responseData = JSON.parse(xhr.responseText)
    let responseSubCode = responseData.data.subCode

    if (interceptType[responseData.data.subCode]) {
      interceptType[responseData.data.subCode](responseData, '', settings.url)
    }
  }
})
$(document).ajaxSend(function (event, xhr, settings) {
  // console.log('$')
  // console.log(window.allowRequest)
  if (!window.allowRequest) {
    return false
  }
})

$.ajax({
  type: 'post',
  url: '/mapper',
  async: false
}).then(function (data) {
  Aotoo.inject.mapper = {
    js: data.pageJs,
    css: data.pageCss
  }
})


$.ajax({
  type: 'get',
  async: false,
  url: '/getSiteConfig',
  success: function (data) {
    if (_.isEmpty(data)) {
      window.CONFIG = {} // console.error('获取配置异常！')
    } else {
      window.CONFIG = data
      window.goHome = function () { //全局 去首页方法，方便加在html上
        window.location.href = window.CONFIG.SITE.www
      }
    }
  }
})

// 全局储存会话sessionId
$.ajax({
  type: 'get',
  async: false,
  url: '/getLoginKey',
  success: function (data) {
    if (!_.isEmpty(data)) {
      const sessionInfo = SAX('SessionInfo')
      sessionInfo.data.loginKey = data.loginKey
    }
  }
})

// 重置统一的主域名，确保localStorage和sessionStorage可跨子域调用
// try {
//   window.document.domain = CONFIG.SITE.domain
// } catch (e) {
//   console.error(e)
// }


let _sessionStore = window.sessionStore
if (!_sessionStore) {
  window.sessionStore = function (key, val) {
    if (typeof val == 'object') {
      val = JSON.stringify(val)
      sessionStorage.setItem(key, val)
    } else {
      return JSON.parse(sessionStorage.getItem(key))
    }
  }
}
let _localStore = window.localStore
if (!_localStore) {
  window.localStore = function (key, val) {
    if (typeof val == 'object') {
      val = JSON.stringify(val)
      localStorage.setItem(key, val)
    } else {
      return JSON.parse(localStorage.getItem(key))
    }
  }
}