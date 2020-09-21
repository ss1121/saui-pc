// import 'aotoo-react-router'
require('common/js/libs/router')
import item from 'component/modules/item'
import list from 'component/modules/list'
import { adapterfilterRouterData, adapterIdNav } from "./adapterrouter";

const indexData = require('./indexData')
//页面
import button from './button'
import color from './color'
import font from './font'
import load from './load'
import modal from './modal'
import tip from './tip'
import icon from './icon'

//数据录入
import form from './dataEntering/form'
import uploader from './dataEntering/uploader'
import dropdown from './dataEntering/dropdown'

//数据展示 
import tag from './data/tag'
import table from './data/table'
import datetimepicker from './data/datetimePicker'
//navigation
import tabs from './navigation/tabs'
import steps from './navigation/steps'


//与业务挂钩页面 business
import defaults from './business/defaults'
import login from './business/login'
import pricestock from './business/pricestock'


const tmpRouter = {
  button: button,
  color: color,
  font: font,
  load: load,
  modal: modal,
  tip: tip,
  icon: icon,
  
  form: form,
  uploader: uploader,
  dropdown: dropdown,

  tag: tag,
  table: table,
  datetimepicker: datetimepicker,
  
  tabs: tabs,
  steps: steps,

  defaults: defaults,
  login: login,
  pricestock: pricestock,
}
const getHash = location.hash.slice(1)
let eventHover = false      //通过这个参数来判断，用点击事件展开

// let queryObj = queryString(window.location.href);

// window.localStorage.setItem('ANNOUNCEMENT_' + window.location.origin, queryObj['id'] || '');

const router = Aotoo.router({
  props: {
    // animate: false,
    scrollMenu: false,         //开启 srcoll
    showMenu: true,
    data: adapterIdNav(adapterfilterRouterData(indexData), tmpRouter),
    // treeHeader: <a href='#' className='item-logo'><img src='/images/saui-logo.png' /><b>SAUI</b></a>,
    // treeFooter: (
    //   <div className='admin-header'>
    //     <a href='javascript:;' className='icon-nav click-switch'></a>
    //     <p>lgh 欢迎您</p>
    //   </div>
    // ),
    select: getHash || 'font',
    // mulitple: true
    // routerClass: 'active',
  }
})
router.rendered = function(dom) {
  //通过hash，来给routerMenus item-icon添加类
  const path = location.hash.slice(1)
  let $obj = $('.routerMenus li[data-path=' + path + ']');
  // if ($obj.length) {
  //   if (eventHover) {
  //     $obj.parents('.property-ul').prev().addClass('select select-none')
  //   }
  //   else {
  //     $obj.parents('.property-ul').prev().addClass('select-none')
  //   }
  // }

  // $(dom).find('.routerMenus>.hlist>.item').hover(function(e) {
  //   e.stopPropagation()
  //   if ($(this).hasClass('select-none')) $(this).removeClass('select-none')
  //   $(this).find('.caption').addClass('select')
  // }, function() {
  //   $(this).find('.caption').removeClass('select')
  // })
  // $(dom).find('.routerMenus .caption').on('click', function(e) {
  //   e.stopPropagation()
  //   if ($(this).hasClass('select-none')) $(this).removeClass('select-none')
  //   $(this).toggleClass('select')
  // })
  $(dom).find('.routerMenus li:not("item")').on('click', function(e) {
    e.stopPropagation()
    const toWhere = $(this).attr('data-path')
    if (toWhere) router.goto(toWhere)
    // const xx = $('.mulitple .select').offset().top
    console.log($('.routerMenus .select'), router)
    // window.scrollTo(0, target_top)
  })
}

const routerHeader = item({
  data: {
    title: <div className='item-logo'><img src='./images/ui/saui-logo.png' className=''/><span className='item-logo-title'>SAUI</span></div>,
    body: [
      {
        k: '欢迎页',
        // v: 参考 tabs demo,
        itemClass: 'flex-row al-item-center flex-1 size'
      },
      {
        k: <p className='mlr-default'><span>lgh</span> 欢迎您</p>,
        v: <a href='javascript:;'>退出</a>,
        itemClass: 'flex-row al-item-center'
      }
    ],
    // bodyClass: 'admin-header-body',
    itemClass: 'admin-header'
  }
})
routerHeader.rendered = function (dom) {
  console.log(dom)
}

router.render('root')
Aotoo.render(routerHeader.render(), 'root-header')


// const RouterHeader = Aotoo.wrap(
//   <div className='admin-header'>
//     <a href='#' className='item-logo'><img src='./images/saui-logo.png'/><span className='item-logo-title'>Saui</span></a>
//     <div className='admin-content'>
//       {/* <div className='admin-left'>
//         <a href='javascript:;' className='icon-nav click-switch'></a>
//       </div> */}
//       <div className='admin-right'>
//         <a href='javascript:;' className='icon-question badge-absuolut'><i className='badge-num'>2</i></a>
//         <p className='icon-select'><span>lgh</span> 欢迎您</p>
//       </div>
//     </div>
//   </div>
//   ,function (dom) {
//     //点击顶部左边的三横杆
//     $(dom).find('.click-switch').click(function(e) {
//       e.stopPropagation()
//       if ($(this).parents('.admin-header').hasClass('active')) {
//         eventHover = false
//         $(this).parents('.admin-header').removeClass('active')
//         $(this).parents('.wrap').find('.routerGroup').removeClass('active')
//       }
//       else {
//         eventHover = true
//         $(this).parents('.admin-header').addClass('active')
//         $(this).parents('.wrap').find('.routerGroup').addClass('active')
//         $('.routerMenus .caption.active').addClass('active-none')
//       }
//     })
//   }
// )