import {tabsWrap, tabsWrap2,tabsWrap3, LikeTabs} from "./tabs";

function pages() {
  const data = [
    { title: '一、tabs组件', idf: 'zjtabs', itemClass: 'mb-defalut'},
    { title: tabsWrap.render(), parent: 'zjtabs', itemClass: 'm-default'},
    { title: tabsWrap2.render(), parent: 'zjtabs', itemClass: 'm-default'},
    { title: tabsWrap3.render(), parent: 'zjtabs', itemClass: 'm-default'},

    { title: '二、仿tabs-list组件', idf: 'zjlist', itemClass: 'mb-defalut'},
    { title: <LikeTabs/>, parent: 'zjlist', itemClass: 'm-default'},

    { title: '三、扩展tabs，适用于目的地控件', idf: 'mdd'},
    { title: '请参考form-目的地', parent: 'mdd', itemClass: 'size-sm color-grey m-default' },
  ]

  const tree = Aotoo.tree({
    data: data
  })

  const Pages = Aotoo.wrap(
    <div className='adminDiv' id='tabs'>
      <h2 className='item-title-lg'>Tabs 标签页</h2>
      {tree}
    </div>
  )
  return <Pages/>
}
export default pages()