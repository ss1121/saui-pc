import { tips as msgtips } from 'component/client'

import 'component/modules/popup/jq'

function pages() {
  const data = [
    { title: '普通提示', idf: 'tipNormal', itemClass: 'item-list' },
    { title: '选择',  parent: 'tipNormal', itemClass: 'ss-button btn-default sys-tips', attr: {value: '选择提示', status: 'warning'}},
    { title: '成功',  parent: 'tipNormal', itemClass: 'ss-button btn-default sys-tips', attr: {value: '成功提示', status: 'success'}},
    { title: '错误',  parent: 'tipNormal', itemClass: 'ss-button btn-default sys-tips', attr: {value: '错误提示', status: 'error'}},
  
    { title: '表单提示', idf: 'tipForm', itemClass: 'item-list' },
    { title: '选择',  parent: 'tipForm', itemClass: 'ss-button btn-default form-tips', attr: {value: '选择提示', status: 'warning'}},
    { title: '错误',  parent: 'tipForm', itemClass: 'ss-button btn-default form-tips', attr: {value: '错误提示', status: 'error'}},
    
    { title: '文字提示', idf: 'tipWord', itemClass: 'item-list flex' },
    { title: '举报',  parent: 'tipWord', itemClass: 'wz-tips ss-link', attr: {value: '网评等级/举报提示相关样式'}},
    { title: (
      <div className='ss-tips-fff'>
        <a className='icon-question color-desc ss-link'>如何设置密码</a>
        <div className='item-tips'><em className='size'>如何设置高强度的密码？</em><p>弱：字母+数字<br/>中：大小写字母+数字<br/>强：大小写字母+数字+特殊字符</p></div>
      </div>
    ),  parent: 'tipWord'},
    { title:(
      <div className='ss-tips-widp100'>
        <em className='ss-link'>纯样式,固定宽度</em>
        <p className='item-tips'>鼠标移入提示样式，最大限宽480px，超出换行。当父级的宽度足够宽的时候，你的浮层就可以根据内容的长度而伸缩</p>
      </div>
    ),  parent: 'tipWord'},
    { title: '组件调用', parent: 'tipWord', itemClass: 'item-hover ss-link' },
  ]

  const tree = Aotoo.tree({
    data: data
  })

  const Pages = Aotoo.wrap(
    <div className='adminDiv' id='tip'>
      <h2 className='item-title-lg'>提示</h2>
      {tree}
    </div>,
    function (dom) {
      $('.sys-tips').click(function(e) {
        e.stopPropagation()
        const val = $(this).data('value')
        const status = $(this).data('status')
        msgtips.toast(val, status ? { type: status } : '')
      })
  
      $('.form-tips').click(function(e) {
        e.stopPropagation()
        const val = $(this).data('value')
        const status = $(this).data('status')
        $(this).append(`<p class="${status} ss-form-tips">${val}</p>`)
      })
  
      $('.wz-tips').hover(function(e) {
        e.stopPropagation()
        const val = $(this).data('value')
        if ($(this).find('.item-tips').length < 1) {
          $(this).append(`<p class="item-tips">${val}</p>`)
        }
      })
  
      $('.item-hover').popup({
        content: `
        <div class='popup-box'>
          <p class='item-tips'>鼠标移入提示样式，最大限宽480px，超出换行。当父级的宽度足够宽的时候，你的浮层就可以根据内容的长度而伸缩</p>
        </div>
        `,
        type: 'hover',
        wrapClass: 'pop-title-arrow',
        hoverPopup: true,
        method: function (e,show){
          if(show){
            console.log('aaaa')
          }
        }
      })
    }
  )
  return <Pages/>
}
export default pages()