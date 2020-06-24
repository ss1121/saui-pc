import 'aotoo-react-router'
const Popstate = SAX('Popstate');

module.exports = function (config={}) {
  config.showMenu = true
  const router = Aotoo.router({ props: config })
  const __render = router.render.bind(router)
  if (config.container) {
    router.render = function() {
      return __render(config.container)
    }
  }
  router.on('rendered', function(params) {
    setTimeout(()=>{ Popstate.emit('afterRoute') }, 0)
    const {dom} = params
    $(dom).find('.routerMenus li').each((index, item)=>{
      const path = $(item).attr('data-path')
      if (path){
        $(item).on('click', function(e) {
          // e.stopPropagation()
          router.goto(path)
        })
      }
    })
  })
  return router
}