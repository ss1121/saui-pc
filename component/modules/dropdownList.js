import list from 'component/modules/list'

export default function (params) {
  //默认适配方法，关联poi方法，可传入
  const adapterPoi = (data, checked, type) => {
    data = data || ['abc', 'bcs', 'bsam', 'ssss']
    let checkedIds = checked || opts.checked
    opts.checked = checkedIds
    return data.map((item, ii) => {
      //data-name 是用来展示右边的所属城级
      // const level = item.customLevel == 1 ? '省份' :  item.customLevel == 2 ? '城市' : '区县'
      const itemClass = opts.isShowRight ? _.findIndex(checkedIds, o => o.id === item.poiId) >= 0 ? 'item-li active' : 'item-li' : _.findIndex(checkedIds, o => o.id === item.poiId) >= 0 && opts.isHideChecked ? 'disN' : 'item-li'
      return {
        title: <p dangerouslySetInnerHTML={{__html: item.navTitleLinks}} />,
        attr: {name: '', ids: item.poiId, title:item.navTitle},
        itemClass: itemClass
      }
    })
  }
  //关联攻略方法
  // const adapterGl = (data, checked) => {
  //   data = data || []
  //   let checkedIds = checked || opts.checked
  //   return data.map((item, ii) => {
  //     //data-name 是用来展示右边的所属城级
  //     const itemClass = 'item-li'
  //     return {
  //       title: item.productName,
  //       dot: [{
  //         title: item.strategyNumber,
  //         itemClass: 'color-info size12'
  //       }],
  //       attr: {ids: item.id, title: item.productName},
  //       itemClass: itemClass
  //     }
  //   })
  // }
  let dft = {
    data: [],             
    listClass: '',
    max: 10,                    //最大能选中值的数量
    checked: [],                //选中的值
    isShowRight: false,         //true时，选中值需要有状态，打勾  且再点击一次能取消选中值。类似多选  false时，选中值需要隐藏
    isHideChecked: false,       //是否隐藏选中过的值
    isRadio: true,             //是否隐藏选中过的值
    adapter: adapterPoi
  }
  let opts = Object.assign(dft, params)
  //弹出层内容-列表
  const listInst = list({data: opts.data.length > 0 ? opts.adapter(opts.data) : [{title: '请输入'}], listClass: 'pop-list ' + opts.listClass})
  listInst.rendered = function(dom) {
    $(dom).off().on('click', '.item-li', function(e) {
      e.stopPropagation()
      opts.checked = listInst.saxer.get('value') ? listInst.saxer.get('value') : opts.checked 
      const id = $(this).attr('data-ids')
      const title = $(this).attr('data-title')
      const idx = _.findIndex(opts.checked, item => {return item.id === id})
      if (opts.checked.length >= 0 && !opts.isRadio) {
        if (opts.checked.length < opts.max) {
          //通过findindex来判断是否选中过，从而来判断是否来选中还是取消
          if (idx >= 0) {
            opts.checked.splice(idx, 1)
            opts.checked.push({id: id, title: title})
            // $(this).removeClass('active')
          }
          else {
            // $(this).addClass('active')
            opts.checked.push({id: id, title: title})
          }
        }
      } 
      else {
        if (idx < 0){
          // $(this).addClass('active')
          opts.checked.push({id: id, title: title})
        }
      }
      
      typeof params.itemClick === 'function' ? params.itemClick.call(this, opts.checked) : ''
      if (opts.isRadio) {
        opts.checked = []
      }
    })
  }
  return {
    inst: listInst,
    adapterPoi: opts.adapter,
    // adapterGl: adapterGl
    // adpaterMulti: adpaterMulti,
  }
}


  //显示多层数据方法  适用tree结构
  //1可选，2不可选
  // const adpaterMulti = (data, key) => {
  //   let output = []
  //   // const res = !key ? _.filter(data, o => o.customLevel === 1) : _.filter(data, o => o.parentId === key)
  //   data.map(item => {
  //     const xx = item.customLevel !== 1 ? {parent: item.parentId} : ''
  //     output.push({
  //       // title: <span className='item-title'>{item.navTitle}</span>,
  //       title: item.navTitle,
  //       idf: item.id,
  //       ...xx
  //     })
  //   })
  //   return adapterTree(output)
  // }