import { tips, modal } from 'component/client'

const warningAcc = () => {
  const WarningWrap = Aotoo.wrap(
    <div className="modal modal-middle">
      <div className="modal-body">
        <h4 className='modal-title color-333'>下线提示</h4>
        <p>您的账号已在其他地方登录，如非本人操作，则密码可能已泄露，建议尽快登录账号修改密码。</p>
      </div>
      <div className="modal-foot">
        <button className="goto-login">重新登录</button>
      </div>
    </div>,
    {
      rendered: function (dom) {
        $('#Loading').remove()
        
        $(dom).find('.goto-login').off('click').click(function () {
          window.allowRequest = true
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


module.exports = (res, errInfo) => {
  if (/u\.(.)*8atour\.com|localhost/.test(location.hostname)) {
    if (typeof res == 'object') {
      window.allowRequest = false
      warningAcc()
    }
    // 截断数据不需返回res
    return false
  }else{
    return res
  }
}