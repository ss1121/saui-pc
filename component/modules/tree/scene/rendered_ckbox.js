let selected = []
let clickedCheckedId = []

module.exports = function(dom, intent, ctx, opts){
  const config = ctx.config
  let _selected = []
  let collectItems = []
  clickedCheckedId = []

  const select = opts.select || '.tree-checkbox'
  let result = opts.data || ctx.data || []
  let cb = opts.cb
  if (!select) return 

  function pushSelected(status) {
    // clickedCheckedId = []
    $(dom).find('.tree-checkbox').each((ii, ckb) => {
      if (ckb.checked) {
        const index = $(ckb).attr('data-index')
        clickedCheckedId.push(index)
      }
    })
    selected = collectItems
  }

  $(dom).find(select).once('click', function(e){
    e.stopPropagation()
    collectItems = []

    const checkStatus = this.checked
    const idf = this.id.replace('ckbox-', '')
    const selfData = _.find(result, function(o) { return o.idf == idf; });
    const parent = selfData.parent
    let sons = ctx.getGroups(this.id.replace('ckbox-', ''))
    let parents = ctx.getParents(idf)

    // if (checkStatus) pushSelected(this)
    collectItems.push(this)

    if (sons.length) {
      sons = sons.map( son=>{
        const item = result[son]
        if (item.idf != idf) {
          const ckname = '#ckbox-'+item.idf
          if ($(ckname).length) {
            collectItems.push($(ckname)[0])
            // if (checkStatus) pushSelected( $(ckname)[0] ) 
            $(ckname)[0].checked = checkStatus
          }
        }
      })
    }
    
    if (parents.length) {
      parents.map(item => {
        const _idf = item.content.idf
        const p = '#ckbox-' + _idf
        if ($(p).length) collectItems.push($(p)[0])
      })
      if (checkStatus) {
        parents.map( item=>{
          const _idf = item.content.idf
          const p = '#ckbox-'+_idf
          if ($(p).length) {
            // pushSelected($(p)[0])
            $(p)[0].checked = true
          }
        })
      } else {
        let parentChecked = false
        parents.map( item=>{
          const _idf = item.content.idf
          const p = '#ckbox-'+_idf
          const sons = ctx.getGroups(_idf)
          if (sons && sons.length) {
            parentChecked = false
            sons.map( index=>{
              let _parentChecked = false
              const son = result[index]
              if (_idf!=son.idf) {
                _parentChecked = $('#ckbox-'+son.idf)[0].checked
                if (_parentChecked) parentChecked = true
              }
            })
            if (!parentChecked) {
              if ($(p).length) {
                $(p)[0].checked = false 
              }
            }
          }
        })
      }
    }

    pushSelected(checkStatus)
  })

  return {
    getSelected: function (params) {
      return selected
    },
    getChecked: function (params) {
      return clickedCheckedId
    },
    selected: selected,
    checked: clickedCheckedId
  }
}