import { modalConfig } from './modalConfig'
function pages() {
  const data = [
    { title: '提示性弹出框', idf: 'modal1', itemClass: 'item-list'},
    { title: '正常', parent: 'modal1', itemClass: 'ss-button btn-default click-modal-normal'},
  
    { title: '预览性弹出框/后台功能性弹出框', idf: 'modal2', itemClass: 'item-list'},
    { title: '正常', parent: 'modal2', itemClass: 'ss-button btn-default click-modal-options'},
  ]

  const tree = Aotoo.tree({
    data: data
  })

  const Pages = Aotoo.wrap(
    <div className='adminDiv' id='modal'>
      <h2 className='item-title-lg'>弹出层</h2>
      {tree}
    </div>
    ,function(dom) {
      //modal层
      $(dom).find('.click-modal-normal').click(function(e) {
        e.stopPropagation()
        modalConfig({
          title: '提示标题语18px  #333333',
          body: '这是最常用的弹出框样式，主要包括标题，文字内容以及按钮，文字大小14px，#666666 行高20px。'
        })
      })
      $(dom).find('.click-modal-options').click(function(e) {
        e.stopPropagation()
        modalConfig({
          title: '提示标题语18px  #333333',
          body: '这是一个操作性弹出层。',
          type: 'options'
        })
      })
    }
  )
  return <Pages/>
}
export default pages()