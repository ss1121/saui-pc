import list from 'component/modules/list'

export default function (params) {
  let dft = {
    data: [],             
    max: 10,                    //最大能选中值的数量
    checked: [],                //选中的值
    isCheckedStatus: false,     //true时，选中值需要有状态，打勾  且再点击一次能取消选中值。类似多选  false时，选中值需要隐藏
    isHideChecked: false,        //是否隐藏选中过的值
    isRadio: false              //是否单选 
  }
  let opts = Object.assign(dft, params)
  //关联poi方法
  const adapterPoi = (data, checked) => {
    data = data || ['abc', 'bcs', 'bsam', 'ssss']
    let checkedIds = checked || opts.checked
    return data.map((item, ii) => {
      //data-name 是用来展示右边的所属城级
      const level = item.customLevel == 1 ? '省份' :  item.customLevel == 2 ? '城市' : '区县'
      const itemClass = opts.isCheckedStatus ? _.findIndex(checkedIds, o => o.id === item.id) >= 0 ? 'item-li active' : 'item-li' : _.findIndex(checkedIds, o => o.id === item.id) >= 0 && opts.isHideChecked ? 'disN' : 'item-li'
      return {
        title: item.navTitleLinks,
        attr: {name: level, ids: item.id, title: item.navTitle},
        itemClass: itemClass
      }
    })
  }
  //弹出层内容-列表
  const listInst = list({data: opts.data.length > 0 ? adapterPoi(opts.data) : [{title: '请输入'}], listClass: 'pop-list ' + opts.listClass || ''})
  listInst.rendered = function(dom) {
    $(dom).off().on('click', '.item-li', function(e) {
      e.stopPropagation()
      const id = parseInt($(this).attr('data-ids'))
      const title = $(this).attr('data-title')
      const idx = _.findIndex(opts.checked, item => {return item.id === id})
      if (opts.checked.length > 0) {
        if (opts.checked.length < opts.max) {
          //通过findindex来判断是否选中过，从而来判断是否来选中还是取消
          if (idx >= 0 && opts.isCheckedStatus) {
            opts.checked.splice(idx, 1)
            $(this).removeClass('active')
          }
          else {
            $(this).addClass('active')
            opts.checked.push({id: id, title: title})
          }
        }
        else {
          if (idx >= 0 && opts.isCheckedStatus) {
            opts.checked.splice(idx, 1)
            $(this).removeClass('active')
          }
        }
      } 
      else {
        if (idx < 0){
          $(this).addClass('active')
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
    adapterPoi: adapterPoi,
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