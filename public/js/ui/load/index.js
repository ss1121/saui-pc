import loading from "./loading";
function pages() {
  const data = [
    { title: '样式一', itemClass: 'ss-button btn-default mlr-default click-load-1'},
    { title: '样式二', itemClass: 'ss-button btn-default mlr-default click-load-2'},
    { title: '样式三', itemClass: 'ss-button btn-default mlr-default click-load-3'},
  ]

  const tree = Aotoo.tree({
    data: data
  })

  const loadx = loading({title: '请稍候，正在为您实时查询'})

  const Pages = Aotoo.wrap(
    <div className='admimDiv'  id='load'>
      <h2 className='item-title-lg'>加载效果</h2>
      {tree}
      {loadx.render()}
    </div>
    ,function(dom) {
      loadx.$update({title: '', type: 'loading-full', show: true})
      setTimeout(() => {
        loadx.$hide()
      }, 2000);

      $(dom).find('.click-load-1').click(function(e) {
        e.stopPropagation()
        loadx.$reset()        //如果页面有多个加载，可通过reset重置
        loadx.$show()
        setTimeout(() => {
          loadx.$hide()
        }, 2000);
      })
      $(dom).find('.click-load-2').click(function(e) {
        e.stopPropagation()
        loadx.$reset()        //如果页面有多个加载，可通过reset重置
        loadx.$update({title: '加载中......',type: 'lr', show: true})
        setTimeout(() => {
          loadx.$hide()
        }, 2000);
      })
      $(dom).find('.click-load-3').click(function(e) {
        e.stopPropagation()
        loadx.$reset()        //如果页面有多个加载，可通过reset重置
        loadx.$update({title: '', size: 'small', show: true})
        setTimeout(() => {
          loadx.$hide()
        }, 2000);
      })
    }
  )
  return <Pages/>
}
export default pages()