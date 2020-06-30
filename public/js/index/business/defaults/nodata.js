//没有数据时显示
const noDataConfig = (param) => {
  const img = param.img || '/images/saui-logo.png'
  const title = param.title
  const desc = param.desc || ''    //正常是传数据，如果不显示传false
  const showBtn = param.showBtn || false
  const btnText = param.btnText || '返回上一页'

  const Wrap = Aotoo.wrap(
    <div className='nodata'>
      <div className='item-pic'><img src={img} /></div>
      <p className='item-title'>{title}</p>
      {desc != '' ? <span className='item-desc'>{desc}</span> : ''}
      {showBtn ? <a href='javascript:;' className='ss-button btn-default item-btn click-nodata-btn'>{btnText}</a> : ''}
    </div>
  )
  return <Wrap />
} 
module.exports = {
  noDataConfig
}