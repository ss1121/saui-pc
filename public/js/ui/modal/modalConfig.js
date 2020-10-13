import Modal from 'component/modules/modal'

const modalConfig = (param) => {
  const title = param.title
  const id = param.id || ''
  const body = param.body
  const type = param.type || 'tips'     //tips, options
  const showFooter = typeof param.showFooter === 'boolean' ? param.showFooter : true
  const cancelText = param.cancelText || '取消'
  const showCancel = typeof param.showCancel === 'boolean' ? param.showCancel : true
  const confirmText = param.confirmText || '确定'
  const showClose = param.showClose || false
  const width = param.width || 'wid-p20'
  const cb = param.confirmCallball || ''
  const confirmClose = param.confirmClose || 1
  const bodyClass = param.bodyClass || ''
  const Wrap = Aotoo.wrap(
    <div className={'modal ' + type}>
      <div className='modal-header'>{title}{showClose ? <i className='icon-del-primary click-cancel'></i> : ''}</div>
      {
        body ?
          <div className={'modal-body ' + bodyClass}>{body}</div>
        : ''
      }
      {
        showFooter ?
        <div className='modal-footer'>
          {
            showCancel ? <a href='javascript:;' className='item-btn ss-button btn-grey plain click-cancel'>{cancelText}</a> : ''
          }
          <a href='javascript:;' data-id={id} className='item-btn ss-button btn-default click-confirm'>{confirmText}</a>
        </div>
        : ''
      }
      
    </div>, function(dom){
      $(dom).off('click').on('click', '.click-confirm', _.debounce(function(){
        if (confirmClose == 1) modal.close()
        if(cb && typeof cb == 'function'){
          cb()
        }
      },1000))
    }
  )
  let modal =  Modal(<Wrap />, {
    closeBtn: '.click-cancel',
    pW: width,
  })
  return modal
}

module.exports = {
  modalConfig
}
