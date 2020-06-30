import { tips, modal } from 'component/client'

const warningAcc = () => {
  const WarningWrap = Aotoo.wrap(
    <div className="modal modal-middle">
      <div className="modal-body">
        <h4 className='modal-title'>账号异常</h4>
        <p className='center'>您的账号异常，请联系企业管理员或在线客服！</p>
      </div>
      <div className="modal-foot">
        <button className="goto-login">确定</button>
      </div>
    </div>,
    {
      rendered: function (dom) {
        $('#Loading').remove()
        
        $(dom).find('.goto-login').off('click').click(function () {
          window.allowReques = true
          ajax.post('/clearuserinfo')
          window.location.href = CONFIG.SITE.u + 'usercenter/login'
        })
      }
    }
  )
  modal(<WarningWrap />, {
    closeBtn: '.clickbtn',
    pW: 'modal-p30',
    bgClose: false,
  })
}


module.exports = (res, errInfo, apiUrl) => {
  if (/u\.(.)*8atour\.com|localhost/.test(location.hostname)) {
    if (typeof res == 'object') {
      if (apiUrl.indexOf('/login') == -1 && window.allowRequest) {
        window.allowRequest = false
        warningAcc()
      } else {
        return res
      }
    }
    // 截断数据不需返回res
    return false
  }else{
    return res
  }
}