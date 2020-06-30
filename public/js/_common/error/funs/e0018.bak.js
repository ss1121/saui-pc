import { tips, modal } from 'component/client'

const warningAcc = () => {
  const WarningWrap = Aotoo.wrap(
    <div className="modal modal-middle">
      <div className="modal-body">
        <h4 className='modal-title'>下线提示</h4>
        <p>您的账号已在其他地方登录，如非本人操作，则密码可能已泄露，建议尽快登录账号修改密码。</p>
      </div>
      <div className="modal-foot">
        <button className="goto-login">确定</button>
      </div>
    </div>,
    {
      rendered: function (dom) {
        $(dom).find('.goto-login').off('click').click(function () {
          window.location.href = CONFIG.SITE.u + 'usercenter/login'
        })
      }
    }
  )
  modal(<WarningWrap />, {
    closeBtn: '.clickbtn',
    pW: 'modal-p30',
  })
}


module.exports = (res, errInfo) => {
  if (typeof res == 'object') {

    warningAcc()
  }
  // 截断数据不需返回res
  return false
}