import { adapterfilterRouterData, adapterIdNav } from "./util";

function ouput(params) {
  const data = params.data
  const tmpRouter = params.tmpRouter

  const getHash = location.hash.slice(1)
  let eventHover = false      //通过这个参数来判断，用点击事件展开
  
  // let queryObj = queryString(window.location.href);
  // window.localStorage.setItem('ANNOUNCEMENT_' + window.location.origin, queryObj['id'] || '');
  
  const router = Aotoo.router({
    props: {
      scrollMenu: true,         //开启 srcoll
      showMenu: true,
      data: adapterIdNav(adapterfilterRouterData(data), tmpRouter, true),
      select: getHash || 'font',
      routerClass: 'active'
    }
  })
  router.rendered = function(dom) {
    //通过hash，来给routerMenus item-icon添加类
    const path = location.hash.slice(1)
    $('.routerMenus li').each(function(){
      const cpath = $(this).attr('data-path')
      if (cpath == path) {
        $(this).parents('.property-ul').prev().addClass('select-none')
      }
    })
    $(dom).find('.routerMenus>.hlist>.item').hover(function(e) {
      e.stopPropagation()
      if ($(this).hasClass('select-none')) $(this).removeClass('select-none')
      $(this).find('.caption').addClass('select')
    }, function() {
      $(this).find('.caption').removeClass('select')
    })
    $(dom).find('.routerMenus li:not("item")').on('click', function(e) {
      e.stopPropagation()
      const toWhere = $(this).attr('data-path')
      if (toWhere) router.goto(toWhere)
    })
  }
  return router
}

module.exports = ouput