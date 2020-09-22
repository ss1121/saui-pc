import {formWrap, searchPopList, searchList, iNum} from './input'

import {checkTextareaNum} from './inputOptions'

function pages() {
  const Pages = Aotoo.wrap(
    <div className='adminDiv color-default size' id='form'>
      <h2 className='item-title-lg'>表单</h2>
      <h5>组件</h5>
      {formWrap.render()}
      <h5 className='mb-defalut'>纯结构写表单</h5>
      <ul className='like-form'>
        <li className='ss-item'>
          <label className='item-title'>老人年龄1</label>
          <div className='item-coentent'>
            <label className='item-label form-tips'><input className='form_control' type='text' /><span className='item-desc'>-</span><span className='ss-form-tips'></span></label>
            <label className='item-label form-tips'><input className='form_control' type='text' /><span className='item-desc'>周岁 ( 不含 )</span><span className='ss-form-tips'></span></label>
          </div>
        </li>
        <li className='ss-item'>
          <label className='item-title'>老人年龄2</label>
          <div className='item-coentent'>
            <label className='item-label form-tips'><input className='form_control' type='text' /><span className='item-desc'>-</span><span className='ss-form-tips'></span></label>
            <label className='item-label form-tips'><input className='form_control' type='text' /><span className='item-desc'>周岁 ( 不含 )</span><span className='ss-form-tips'></span></label>
          </div>
          <a href='javascript:;' className='item-opt ss-link-primary'>删除</a>
        </li>
      </ul>
    </div>
    , function(dom) {
      //多行文本
      // checkTextareaNum(formWrap, 'textarea', 200)
      // $(document).click(function () {
      //   $(".item-pop-list").removeClass('active');
      // });
      // //搜索框
      // $(dom).find('.pages-search .form_control').keyup(function(e){
      //   e.stopPropagation()
      //   if ($(this).val() != '') {
      //     $(this).parents('.pages-search').find(".item-pop-list").addClass('active')
      //     searchPopList.$uplist(searchList())
      //   }
      //   else {
      //     searchPopList.$uplist([]).$upclass('')
      //   }
      // })
      //自定义表单提示语
      $('.like-form .form_control').focus(function(e){
        e.stopPropagation()
        $(this).next('.ss-form-tips').removeClass('warning').text('')
      }).blur(function(e){
        e.stopPropagation()
        $(this).next('.ss-form-tips').addClass('warning').text('请输入正确的内容')
      })
      $('#tt').focus(function (e) {
        e.stopPropagation()
        console.log('============ abc');
        formWrap.removeWarn('tt')                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
      }).blur(function (e) {
        e.stopPropagation()
        const val = $(this).val()
        !val ? formWrap.addWarn('tt', '请输入', {class: 'error'}) : ''
      })
      formWrap.values({'tt': '111'})
    }
  )
  return <Pages/>
}
export default pages()