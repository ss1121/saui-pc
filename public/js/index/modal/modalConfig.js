import Modal from 'component/modules/modal'

const modalConfig = (param) => {
  const title = param.title
  const body = param.body
  const type = param.type || 'tips'     //tips, options
  const showFooter = param.showFooter ? true : false
  const cancelText = param.cancelText || '取消'
  const showCancel = param.showCancel ? true : false
  const confirmText = param.confirmText || '确定'
  const width = param.width || 'wid-p20'
  const Wrap = Aotoo.wrap(
    <div className={'modal ' + type}>
      <div className='modal-header'>{title}</div>
      {
        body ?
          <div className='modal-body'>{body}</div>
        : ''
      }
      {
        showFooter ?
        <div className='modal-footer'>
          {
            showCancel ? <a href='javascript:;' className='item-btn ss-button btn-grey plain click-cancel'>{cancelText}</a> : ''
          }
          <a href='javascript:;' className='item-btn ss-button btn-default click-confirm'>{confirmText}</a>
        </div>
        : ''
      }
      
    </div>
  )
  return Modal(<Wrap />, {
    closeBtn: '.click-cancel',
    pW: width,
  })
}

module.exports = {
  modalConfig
}
