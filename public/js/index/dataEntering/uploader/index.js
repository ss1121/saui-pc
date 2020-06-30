import { modalConfig } from '../../modal/modalConfig'
import {upld, upld2} from './upload'

function pages() {
  const tree = Aotoo.tree({
    data: [
      { title: '图片上传', idf: 'btn1', itemClass: 'item-list' },
      { title: upld.render(), parent: 'btn1', itemClass: '' },

      { title: '文件上传', idf: 'btn2', itemClass: 'item-list' },
      { title: upld2.render(), parent: 'btn2', itemClass: '' },
    ],
    footer: <hr data-content='点击查看代码' className='demo-code-line click-lookCode'/>
  })

  const Pages = Aotoo.wrap(
    <div className='adminDiv' id='uploader'>
      <h2 className='item-title-lg'>上传</h2>
      {tree}
    </div>
    , function(dom) {
      //modal层
      $(dom).find('.click-lookCode').click(function(e) {
        e.stopPropagation()
        modalConfig({
          title: '扫码，查看代码',
          body: <img style={{width: '100%'}} src='/images/saui2.jpg'/>,
          type: 'options',
          showFooter: false
        })
      })
    }
  )
  return <Pages/>
}
export default pages()
