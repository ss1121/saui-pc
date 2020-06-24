module.exports = function(config){
  /*
    config = {
      data: [],
      edits: [],   // 需编辑部分
      banner: < />  
      idf: idf
    }
  */
  let rtn = []
  const _data = _.cloneDeep(config.data||[])
  const edits = true
  const idf = config.idf
  const banner = config.banner
  
  _data.map( (item, ii)=>{
    const val = item.idf ? item.idf.indexOf('-')>-1 ? item.idf.split('-')[1] : item.idf : 1000
    const _ckbox = item.checked
      ? <input type="checkbox" className="privilegex-check" id={'ckbox-'+item.idf} name="privilegex" defaultChecked defaultValue={val} />
      : typeof item.checked == 'undefined' ? '' : <input type="checkbox" id={'ckbox-'+item.idf} name="privilegex" className="privilegex-check" defaultValue={val} />
    const ckbox = edits ? _ckbox : ''

    let isEidted = false
    if (edits) {
      if (edits == true || edits == 'all') {
        isEidted = true
        item.title = (
          <span className="span-title">
            {ckbox}
            {item.title}
          </span>
        )
      } 

      if (_.isArray(edits) && edits.indexOf(ii)>-1) {
        isEidted = true
        item.title = (
          <span className="span-title">
            {ckbox}
            {item.title}
          </span>
        )
      }
    }

    if (item.checked) {
      rtn.push(item)
    } else {
      isEidted ? rtn.push(item) : rtn.push('')
    }
  })
  return rtn
}