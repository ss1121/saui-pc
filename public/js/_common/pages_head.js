import item from 'component/modules/item'
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

const routerHeader = item({
  data: {
    title: <div className='item-logo'><img src='./images/logo2.png' className=''/></div>,
    body: [
      {
        k: '欢迎页',
        v: tList.render(),
        // v: 参考 tabs demo,
        itemClass: 'flex-row al-item-center flex-1 size'
      },
      {
        k: <p className='mlr-default'><span>lgh</span> 欢迎您</p>,
        v: <a href='javascript:;' className='link'>退出</a>,
        itemClass: 'flex-row al-item-center'
      }
    ],
    // bodyClass: 'admin-header-body',
    itemClass: 'admin-header'
  }
})
routerHeader.rendered = function (dom) {
  console.log(dom, 'dd')
}
Aotoo.render(routerHeader.render(), 'headerx')
