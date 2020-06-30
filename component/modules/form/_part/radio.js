// <Radio data={name: [], id: [], title: [], rtitle:[], cb: fn} />

function getArrayItem(item) {
  return item && Array.isArray(item) ? item : typeof item == 'string' ? [item] : ''
}

function isArray(data) {
  return data && Array.isArray(data)
}

function isString(data) {
  return typeof data == 'string'
}

function rcbox(pdata, opts) {
  let superID,
    titles = [],
    values = [].concat(pdata.value),
    descs = [],
    names = []
    

  const itemClass = pdata.attr.itemClass ? pdata.attr.itemClass : ''
  // const labelClass = pdata.type ==='radio' ? 'radioItem '+itemClass : 'checkboxItem '+itemClass
  const labelClass = pdata.type === 'radio' ? 'radioItem' : 'checkboxItem'
  const _cls = pdata.type === 'radio' ? 'fkp-radio-box' : 'fkp-checkbox-box';
  const len = values.length

  // superID or names
  if (isArray(pdata.name)) {
    if (pdata.name.length == len) {
      names = pdata.name
      ids = names
    }
    superID = P.name[0]
  } else {
    superID = pdata.name
  }

  const fill = values.map((val, ii) => {
    let disabled = pdata.disabled
    let checked = false
    if (!val) val = '0'
    if (typeof val == 'number') val = val.toString()
    
    if (val &&
      (val.indexOf('!-') === 0 || val.indexOf('-!') === 0)
    ) {
      checked = true
      disabled = true
      val = val.substring(2)
    }
    
    if (val.charAt(0) == '-') {
      checked = true
      val = val.substring(1)
    }

    if (val.charAt(0) == '!') {
      disabled = true
      val = val.substring(1)
    }

    // title
    const _title = pdata.title || pdata.attr.title
    if (isArray(_title)) {
      if (_title.length == len) titles = _title
      else {
        titles.push(_title[ii] || '')
      }
    } else {
      ii == 0 ? titles.push(_title) : titles.push('')
    }

    // desc
    const _desc = pdata.desc || pdata.attr.desc
    if (isArray(_desc)) {
      if (_desc.length == len) descs = _desc
      else {
        descs.push(_desc[ii] || '')
      }
    } else {
      ii == 0 ? descs.push(_desc) : descs.push('')
    }

    const resault = {
      title: titles.length ? titles[ii] : '',
      name: names.length ? names[ii] : superID,
      id: names.length ? names[ii] + '-' + ii : superID + '-' + ii,
      value: val,
      desc: descs.length ? descs[ii] : ''
    }

    return (
      <label key={'rcbox' + ii} className={labelClass}>
        {resault.title ? <span className="fkp-title">{resault.title}</span> : ''}
        <div className='fkp-content'>
          {
            checked
              ? disabled 
                ? <input disabled={true} ref={'#' + resault.id} defaultChecked type={pdata.type} name={resault.name} id={resault.id} defaultValue={resault.value} />
                : <input ref={'#' + resault.id} defaultChecked type={pdata.type} name={resault.name} id={resault.id} defaultValue={resault.value} />
              : disabled
                ? <input disabled={true} ref={'#' + resault.id} type={pdata.type} name={resault.name} id={resault.id} defaultValue={resault.value} />
                : <input ref={'#' + resault.id} type={pdata.type} name={resault.name} id={resault.id} defaultValue={resault.value} />
          }
          <span className={_cls} />
          {resault.desc ? <span className="fkp-desc">{resault.desc}</span> : ''}
        </div>
      </label>
    )
  })

  pdata.attr.title = pdata.profile.title || ''
  pdata.attr.desc = pdata.profile.desc || ''

  let groupClass = pdata.type === 'radio' ? 'radioGroup' : 'checkboxGroup'
  if (itemClass) groupClass += (' ' + itemClass + 'Group')
  return {
    title: pdata.attr.title,
    fill: fill,
    desc: pdata.attr.desc,
    groupClass: groupClass,
    superID: superID
  }
}

module.exports = rcbox;
