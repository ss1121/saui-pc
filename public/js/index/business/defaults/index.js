import { noDataConfig } from './nodata'
function pages() {
  const data = [
    { title: noDataConfig({title: '很抱歉，没有找到符合您条件的酒店', desc: '您可以尝试更换搜索条件，如目的地/酒店名称', showBtn: true, }) },
  ]

  const tree = Aotoo.tree({
    data: data
  })

  const Pages = Aotoo.wrap(
    <div className='adminDiv' id='defaults'>
      <h2 className='item-title-lg'>缺省页</h2>
      {tree}
    </div>
  )
  return <Pages/>
}
export default pages()