import list from 'component/modules/list'

const tagList = (params) => {
  let output = []
  let dfg = {
    data: [],
    showCloseIcon: false,           //是否标题带删除标签
    lrCut: false,                    //是否显示左右切换
    itemClass: 'item-li',
    listClass: 'likeTabsMenus'
  }
  const otps = _.merge(dfg, params)

  otps.data.map( (item, ii) => {
    output.push({
      title: otps.showCloseIcon ? <span>{item.title}<i className='item-icon icon-del-primary'></i></span> : item.title,
      attr: {id: item.id || ii, idx: ii},
    })
  })
  const inst = list({
    data: output,
    listClass: otps.listClass,
    itemClass: otps.itemClass,
    footer: otps.lrCut ? <div className='item-btns disN'><a href='javascript:;' className='icon-arrow-left click-left disabled'></a><a href='javascript:;' className='icon-arrow-right click-right'></a></div> : ''
  })
  inst.rendered = function (dom) {
    let outerWidth = $(dom).width()     // 计算外层宽度
    $(dom).width(outerWidth)

    if (otps.showCloseIcon) {
      $(dom).find('.item-icon').on('click', function(e) {
        const idx = $(this).parents('.item-li').attr('data-idx')
        console.log(idx, inst)
        inst.$delete(idx)
      })
    }
    if (otps.lrCut) {
      
      let newListWidth = 0                  // 计算实际的list宽度
      let num = 0                           // 计算能切换几次
      let cidx = 0                          // 当前位置
      let ml = 0
      $(dom).find('.item').each(function(){
        newListWidth += $(this).outerWidth(true)
      })
      console.log('=========== aa', newListWidth)
      if (newListWidth > outerWidth) {
        $(dom).find('.hlist').width(newListWidth)
        $(dom).find('.item-btns').removeClass('disN')
        num = Math.floor(newListWidth / outerWidth)
      }

      $(dom).find('.click-right').off('click').on('click', function(e) {
        e.stopPropagation()
        if (!$(this).hasClass('disabled')) {
          cidx = cidx + 1
          ml = newListWidth > (cidx + 1) * outerWidth ? cidx * outerWidth : ml - (ml + outerWidth - newListWidth)
          $(this).prev().removeClass('disabled')
          $(this).parent().prev('.hlist').css({marginLeft: -ml})
          if (cidx == num) {
            $(this).addClass('disabled')
          }
        }
      })

      $(dom).find('.click-left').off('click').on('click', function(e) {
        e.stopPropagation()
        if (!$(this).hasClass('disabled')) {
          cidx = cidx - 1
          ml = ml > outerWidth ? ml - outerWidth : 0
          $(this).parent().prev('.hlist').css({marginLeft: -(cidx * outerWidth)})
          $(this).next().removeClass('disabled')
          if (cidx == 0) {
            $(this).addClass('disabled')
          }
        }
      })
    }
  }
  return inst
}
module.exports = {
  tagList
}