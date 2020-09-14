import {form} from 'component/client'
import drop from 'component/modules/drop_pop'
import enterTag from 'component/modules/enterTag'
import dropdownList from 'component/modules/dropdownList'
import multiList from 'component/modules/multiList'
import {multiListData} from './data'

/**搜索 */
  let search = null
  const searchPopList0 = dropdownList({
    isHideChecked: true,
    max: 1,
    isRadio: true,
    itemClick: function(val) {
      if (val.length <= 1) {
        search.setValue(val)
        search.hide()
      }
    }
  })
  search = drop({
    inputVals: true,
    popContent: searchPopList0.inst.render(),
    keyupFunc: function(val) {
      searchPopList0.inst.$uplist(searchPopList0.adapterPoi(multiListData.data.slice(0, 20)))
      // searchPopList.$uplist([{title: '找不到： abc', itemClass: 'nofind'}])
      // searchPopList.$uplist([{title: '暂无任何目的城市', itemClass: 'nodata'}])
    }
  })
/**搜索 end*/
/**关联POI */
  let dpop = null
  const searchPopList = dropdownList({
    isHideChecked: true,
    max: 4,
    checked: [{id: 27958, title: '广州'}],
    itemClick: function(val) {
      if (val.length <= 4) {
        dpop.setValue(val)
        dpop.clearInput('.xx')
      }
    }
  })
  dpop = drop({
    dropdownClass: 'xx',
    value: [{id: 27958, title: '广州'}],
    popContent: searchPopList.inst.render(),
    keyupFunc: function(val) {
      console.log('返回输入的值:', val)
      searchPopList.inst.$uplist(searchPopList.adapterPoi(multiListData.data.slice(0, 20)))
      // searchPopList.$uplist([{title: '找不到： abc', itemClass: 'nofind'}])
      // searchPopList.$uplist([{title: '暂无任何目的城市', itemClass: 'nodata'}])
    }
  })
/**关联POI end*/
/**热门话题 */
  let dpop2 = null
  const searchPopList2 = dropdownList({
    data: multiListData.data.slice(0, 20),
    max: 4,
    isCheckedStatus: true,
    listClass: 'checkRight',
    itemClick: function(val) {
      if (val.length <= 4) {
        dpop2.setValue(val)
        dpop.clearInput('.xx')
      }
    }
  })
  dpop2 = drop({
    popContent: searchPopList2.inst.render(),
    dropdownClass: 'xx',
    delVals: function(val){
      //删除上面的选中值，pop层里的层级组件要跟着更新
      searchPopList2.inst.$uplist(searchPopList2.adapterPoi(multiListData.data.slice(0, 20), val))
    },
    updateInitFunc: function(val) {
      //选中值之后，再弹出pop会有选中效果
    },
    keyupFunc: function(val) {
      searchPopList2.inst.$uplist(searchPopList2.adapterPoi(multiListData.data))
      // searchPopList2.inst.$update({data: searchPopList2.adapterPoi(multiListData.data), listClass: 'list-multi'})
    }
  })
/**热门话题 end*/

/**目的地控件 */
  let dpop3 = null
  const levels = multiList({
    data: multiListData.data,
    itemClick: function(val) {
      if (val.length <= 4) dpop3.setValue(val)
    }
  })
  dpop3 = drop({
    isInput: false,
    popContent: levels.render(),
    dropdownClass: 'pop-noscroll-width',
    delVals: function(val){
      //删除上面的选中值，pop层里的层级组件要跟着更新
      levels.setValue(val)
    }
  })
/**目的地控件 end*/
/**回车生成标签*/
const enterTagInst = enterTag({value: [{title: '我是回车生成的大爷'}]})
/**回车生成标签 end*/
function pages() {
  const drop = form({
    data: [
      {
        title: '搜索',
        input: {
          id: 'search',
          type: 'span',
          value: search.render(),
          itemClass: 'fkp-content-flex1'
        }
      },
      {
        title: '关联POI',
        input: {
          id: 'poi',
          type: 'span',
          value: dpop.render(),
          itemClass: 'fkp-content-flex1'
        }
      },
      {
        title: '热门话题',
        input: {
          id: 'ht',
          type: 'span',
          value: dpop2.render(),
          itemClass: 'fkp-content-flex1'
        }
      },
      {
        title: '目的地控件',
        input: {
          id: 'mdd',
          type: 'span',
          value: dpop3.render(),
          itemClass: 'fkp-content-flex1'
        }
      },
      {
        title: '回车生成标签',
        input: {
          id: 'hc',
          type: 'span',
          value: enterTagInst.render(),
          itemClass: 'fkp-content-flex1'
        }
      },
    ]
  })

  const Pages = Aotoo.wrap(
    <div className='adminDiv' id='uploader'>
      <h2 className='item-title-lg'>下拉控件</h2>
      {drop.render()}
    </div>
  )
  return <Pages/>
} 
export default pages()
