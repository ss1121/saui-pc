import {
  encrypt_3des,
  decrypt_3des
} from './des'
import './dataformat'
import './globalvar'

const pagelife = SAX('PAGELIFE')
const pageStore = SAX('encrypt')

pageStore.off('encryptPwd')
pageStore.on('encryptPwd', function (param) {
  let [uuid, secretKey] = ['', '']
  if (param.method == 'login.do' || param.method == 'register.do' || param.method == 'updatePassword.do' || param.method == 'mobileRetrievePassword.do' || param.method == 'emailRetrievePassword.do') {
    $.ajax({
      type: 'post',
      async: false,
      data: {
        method: 'getSecretKey.do'
      },
      url: '/api/getSecretKey',
      success: function (data) {
        if (data.data.code == '00') {
          uuid = data.data.data.uuid
          secretKey = data.data.data.secretKey
        }
      }
    })
  }
  if (param.method == 'login.do' && param.loginType != '7') {
    param.password = encrypt_3des(param.userName + secretKey + param.loginType, param.password)
    param.uuid = uuid
  } else if (param.method == 'register.do') {
    const accNo = param.type == 2 ? param.mobile : param.email
    param.loginPwd = encrypt_3des(accNo + secretKey + param.type, param.loginPwd)
    param.repeatPwd = encrypt_3des(accNo + secretKey + param.type, param.repeatPwd)
    param.uuid = uuid
  } else if (param.method == 'updatePassword.do') {
    if (param.type == 1) {
      param.originalPwd = encrypt_3des(param.memberId + secretKey + param.type, param.originalPwd)
      param.loginPwd = encrypt_3des(param.memberId + secretKey + param.type, param.loginPwd)
      param.repeatPwd = encrypt_3des(param.memberId + secretKey + param.type, param.repeatPwd)
    } else {
      param.originalPwd = encrypt_3des(param.memberId + secretKey + param.type, param.originalPwd)
      param.paymentPwd = encrypt_3des(param.memberId + secretKey + param.type, param.paymentPwd)
      param.repeatPwd = encrypt_3des(param.memberId + secretKey + param.type, param.repeatPwd)
    }
    param.uuid = uuid
  } else if (param.method == 'mobileRetrievePassword.do' || param.method == 'emailRetrievePassword.do') {
    const accNo = param.mobile ? param.mobile : param.email
    if (param.type == 1) {
      param.loginPwd = encrypt_3des(accNo + secretKey + param.type, param.loginPwd)
      param.repeatPwd = encrypt_3des(accNo + secretKey + param.type, param.repeatPwd)
    } else {
      param.paymentPwd = encrypt_3des(accNo + secretKey + param.type, param.paymentPwd)
      param.repeatPwd = encrypt_3des(accNo + secretKey + param.type, param.repeatPwd)
    }
    param.uuid = uuid
  }
  return param
})

pagelife.on('pageStart', function () {
  console.log('======== pagestart');
})
function _BindDocument(el, evt, fn ){
  if (typeof evt == 'function') {
    fn = evt
    evt = 'click'
  }
  document.addEventListener(evt, function(e){
    let obj
    if(Array.isArray(el) || (typeof el == 'object' && el.length)){
      obj = el
    }else{
      obj = [el]
    }
    let bol = true;
    for(let i=0,l=obj.length;i<l;i++){
      if(obj[i].nodeType){
        if(obj[i].contains(e.target)){
          bol = false;
        }
      }
    }
    if (bol && typeof fn == 'function') {
      fn.call(this,e)
    }
  })
}
function _NumberToZh(num) {
  const zh = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const unit = [ '','十', '百', '千'];
  const bUnit = ['万', '亿']
  num = String(num)
  let numArr = [], numArr2 = [], numStr = '', l = num.length, zero = l >= 2
  for(let i=0;i<l;i++){
    if(zero){
      numArr.push(num[i] == 0 ? '' : zh[num[i]])
    }else{
      numArr.push(zh[num[i]])
    }
  }
  let index = 0,bIndex = 0
  for(let i=numArr.length,l=0;i>l;i--){
    let u = ''
    u = index < 4 ? unit[index] : ''
    index++
    if(index > 4){
      u += bUnit[bIndex]
      index = 1
      bIndex++
    }
    numArr2.push(numArr[i - 1] + u)
  }
  for(let i=numArr2.length,l=0;i>l;i--){
    numStr += (numArr2[i - 1])
  }
  if(numStr.length >= 2 && numStr.length <= 3 && numStr[0] == zh[1]){
    numStr = numStr.replace(zh[1], '')
  }
  return numStr
}
window.bindDocument = _BindDocument
window.numbertozh = _NumberToZh