import {boostrapTable} from './boostrap'
import {likeTable} from './list'
const _datas = require("./data.js")

function pages() {
 
  const tree = Aotoo.tree({
    data: [
      { title: 'BoostrapTable', idf: 'table1', itemClass: 'item-list' },
      { title: boostrapTable(_datas.rows).render(), parent: 'table1' },

      { title: '自定义表格，用来纯展示。', idf: 'table2', itemClass: 'item-list-2' },
      { title: likeTable(_datas.rows).render(), parent: 'table2' },
    ]
  })
  const Pages = Aotoo.wrap(
    <div className='adminDiv' id='tag'>
      <h2 className='item-title-lg'>表格</h2>
      {tree}
    </div>
  )
  return <Pages/>
}
export default pages()
