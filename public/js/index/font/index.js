// function index () {
  

  const Pages = Aotoo.wrap(
    <div className='adminDiv' id='font'>
      <h2 className='item-title-lg'>字体</h2>
      <ul className='font-list'>
        <li><label>中文字体</label><span>微软雅黑 Regular / Bold</span></li>
        <li><label>英文字体</label><span>Arail</span></li>
        <li><label className='size-title-lg'>最大字号<small>特殊以设计稿为准</small></label><span>24px</span></li>
        <li><label className='size-lg'>页面大标题<small>用于特殊栏目标题、特殊页面产品名称</small></label><span>20px</span></li>
        <li><label className='size-title'>小标题<small>用于产品名称，栏目标题，列表标题，提示主语</small></label><span>18px</span></li>
        <li><label className='size-title-sm'>重要文案<small>适用于重要文字信息，特殊标签页</small></label><span>16px</span></li>
        <li><label>正文<small>适用于副导航、普通按钮、文字正文、书写内容等</small></label><span>14px</span></li>
        <li><label className='size-sm'>最小字号<small>适用于注解文字、类别名称、表头等</small></label><span>12px</span></li>
      </ul>
    </div>
  )
  export default <Pages/>
// }
// export default function(router) {
//   return {
//     main: function () {
//       console.log('我是font页面')
//       return index()
//     },
//     enter: function (data) {
//       console.log('我是font页面xxx')
//       return this.main()
//     },
//     leave: function () {
//       console.log('======= 3333');
//     }
//   }
// }