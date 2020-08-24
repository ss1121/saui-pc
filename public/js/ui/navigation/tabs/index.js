import {tabsWrap, tabsWrap2,tabsWrap3, LikeTabs} from "./tabs";
import {tagList} from 'commonjs/adapter/list/taglist'

const taglistData = [
  {title:'攻略列表1', id: '1'},
  {title:'攻略列表2', id: '2'},
  {title:'攻略列表3', id: '3'},
  {title:'攻略列表4', id: '4'},
  {title:'攻略列表5', id: '5'},
  {title:'攻略列表6', id: '6'},
  {title:'攻略列表7', id: '7'},
]
const tList = tagList({
  data: taglistData,
  showCloseIcon: true, 
  lrCut: true,
  listClass: 'tag-nav-list'
})

function pages() {
  const data = [
    { title: '一、tabs组件', idf: 'zjtabs', itemClass: 'mb-defalut'},
    { title: tabsWrap.render(), parent: 'zjtabs', itemClass: 'm-default'},
    { title: tabsWrap2.render(), parent: 'zjtabs', itemClass: 'm-default'},
    { title: tabsWrap3.render(), parent: 'zjtabs', itemClass: 'm-default'},

    { title: '二、仿tabs-list组件', idf: 'zjlist', itemClass: 'mb-defalut'},
    { title: <LikeTabs/>, parent: 'zjlist', itemClass: 'm-default'},
    { title: tList.render(), parent: 'zjlist', itemClass: 'm-default'},

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