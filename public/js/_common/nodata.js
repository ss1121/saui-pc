//没有数据时显示
const noDataConfig = (param) => {
  const img = param.img || '/images/no-content.png'
  const title = param.title || false
  const desc = param.desc || false    //正常是传数据，如果不显示传false
  const showBtn = param.showBtn || false
  const btnText = param.btnText || '返回上一页'
  const itemClass = param.itemClass || ''
  const isJsx = typeof param.isJsx === 'boolean' ? param.isJsx : true


  let Wrap = null
  if (isJsx) {
    Wrap = Aotoo.wrap(
      <div className={'nodata ' + itemClass}>
        <div className='item-pic'><img src={img} /></div>
        {title ? <p className='item-title'>{title}</p> : ''}
        {desc ? <span className='item-desc'>{desc}</span> : ''}
        {showBtn ? typeof btnText === 'string' ? <a href='javascript:;' className='ss-button btn-default item-btn click-nodata-btn'>{btnText}</a> : btnText : ''}
      </div>
    )
    return <Wrap />
  }
  else {
    return (
      `
        <div class='nodata ${itemClass}' >
          <div class='item-pic'><img src=${img} /></div>
          ${title ? `<p class='item-title'>${title}</p>` : ''}
          ${desc ? `<span class='item-desc'>${desc}</span>` : ''}
          ${showBtn ? `<a href='javascript:;' class='ss-button btn-default item-btn click-nodata-btn'>${btnText}</a>` : ''}
        </div>
      `
    )
  }
  
} 
module.exports = {
  noDataConfig
}