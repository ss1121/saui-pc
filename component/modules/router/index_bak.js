// popstate的bug，在ios上popstate首次进入就被执行了
// android 和 iphone上页面刷新就会直接执行popstate，这是一个浏览器的bug
// 参考 http://stackoverflow.com/questions/6421769/popstate-on-pages-load-in-chrome

const Popstate = SAX('Popstate');
(function() {
  var anchorHash = false
  var anchorHref

  document.addEventListener('click', function (e) {
    var target = e.target
    if (target.nodeName == 'A') {
      anchorHash = false
      anchorHref = target.href
      anchorHash = target.href.indexOf('#') > -1 ? true : false
    }
  }, false)

  var blockPopstateEvent = document.readyState != "complete";
  window.addEventListener("load", function() {
    setTimeout(function(){ blockPopstateEvent = false; }, 0)
  }, false)
  window.addEventListener("popstate", function(evt) {
    if (blockPopstateEvent && document.readyState=="complete") {
      evt.preventDefault()
      evt.stopImmediatePropagation()
    } else {
      if (anchorHash) {
        /* do something */
      } else {
        Popstate.emit('__goback');
      }
      anchorHref = ''
      anchorHash = false
      // Popstate.trigger({})
    }
  }, false)
}())


const BaseRouter = require('./_component/_router')
import BaseClass from 'component/class/base'
import {urlparse, inject} from 'libs'

inject().css('/css/t/animate.css')
// inject().css(`
//   .outHeight{
//     height: 0;
//   }
// `)

// 替换 animate.css 提升效率
// 有效 fadein
// inject().css(`
//   .routerBoxes{
//     opacity: 0;
//     position: relative;
//     transition: all 0.3s linear;
//     -webkit-transition: all 0.3s linear;
//   }
//   .routerBoxes.fade-in{
//     opacity: 100;
//     position: relative;
//   }
//   .routerBoxes.fade-out{
//     transition: all 0.1s linear;
//     -webkit-transition: all 0.1s linear;
//     opacity: 0;
//     height: 0;
//   }
// `)

// 无效 faderight
// inject().css(`
//   .routerGroup{
//     position: relative;
//   }
//   .routerBoxes{
//     // opacity: 0;
//     position: relative;
//     -webkit-transform: translate3d(100%, 0, 0);
//     transform: translate3d(100%, 0, 0);
//   }
//
//   .animating{
//     transition: all 0.3s linear;
//     -webkit-transition: all 0.3s linear;
//   }
//
//   .routerBoxes.fade-in{
//     transition: all 0.1s linear;
//     -webkit-transition: all 0.1s linear;
//     opacity: 100;
//     -webkit-transform: translate3d(0, 0, 0);
//     transform: translate3d(0, 0, 0);
//   }
//   .routerBoxes.fade-out{
//     transition: all 0.1s linear;
//     -webkit-transition: all 0.1s linear;
//     opacity: 0;
//     height: 0;
//     -webkit-transform: translate3d(0, 0, 0);
//     transform: translate3d(0, 0, 0);
//   }
//
//   .routerBoxes.fade-in-right{
//     transition: all 0.3s linear;
//     -webkit-transition: all 0.3s linear;
//     -webkit-transform: translate3d(0, 0, 0);
//     transform: translate3d(0, 0, 0);
//   }
//
//   .routerBoxes.fade-out-right{
//     transition: all 0.3s linear;
//     -webkit-transition: all 0.3s linear;
//     -webkit-transform: translate3d(100%, 0, 0);
//     transform: translate3d(100%, 0, 0);
//     height: 0;
//   }
// `)



// function tabsDid(dom, select, itemFun){
//   let that = this
//   const config = this.config
//   that.items = []
//   let menusBody = $(dom).find('.tabs-menu-body')
//   menusBody.find('li').each(function(ii, item){
//     that.items.push(item)
//     if ($(item).hasClass('itemroot')) {
//       if (config.fold) $(item).find('.itemCategory ul').addClass('none')
//     }
//     if (typeof itemFun == 'function') {
//       itemFun.call(that, item, ii)
//     }
//   })
// }

function menuMethod(){
  const that = this
  return function(dom){
    const self = this
    let _path = $(dom).attr('data-path')
    $(dom).click( function(e){
      e.stopPropagation()
      $(this).parents('.hlist').find('li').removeClass('activeroot').removeClass('active')
      if ($(dom).hasClass('itemroot')) {
        $(dom).addClass('activeroot')
        $(dom).find('.caption:first').toggleClass('fold')
        $(dom).find('ul:first').toggleClass('none')
      } else {
        $(this).addClass('active').siblings().removeClass('active')
      }
      that.actions.roll('GOTO', {key: _path})
    })
    // if (typeof this.config.itemMethod == 'function') this.config.itemMethod.call(this, dom)
  }
}

function $rendered(){
  const that = this
  return function(dom){
    that.menuSelect = function(path){
      $(dom).find('li').each(function(){
        if($(this).data('path')  == path){
          $(this).addClass('active')
        }
      })
    }
    const theRendered = that.config.rendered || that.rendered
    if (typeof theRendered == 'function') {
      const xxx = {
        menuSelect: that.menuSelect
      }
      theRendered.call(xxx, dom)
    }
  }
}

function getIndex(where, ctrl){
  let key, data = {}, index
  if (typeof where == 'object') {
    key = where.key
    data = where.data || {}
  } else {
    if (typeof where == 'string') key = where
  }
  if (typeof key == 'string') {
    const wheresKey = ctrl.get().wheres[key]
    // index = tapsapp.get().wheres[key]['index'] || 0
    if (wheresKey) {
      index = wheresKey['index']
    }
    if (index || index == 0) {
      return { index, data, key }
    }
  }
}


class App extends BaseClass {
  constructor(config) {
    super(config)
    this.change = function(){}
    this.goback = this::this.goback
    menuMethod = this::menuMethod
    $rendered = this::$rendered
    // Popstate.setActions(this.goback)
    var that = this
    Popstate.on('__goback', function(params) {
      return that.goback()
    })
  }

  componentWill(){
    const dft = this.config
    const myRouter = BaseRouter(this.config.globalName)
    const Router = myRouter.Instance   // = this.createList(this.config.globalName)
    this.control = myRouter.control
    this.eles = <Router
      opts={this.config}
      menuMethod={menuMethod()}
      listMethod={this.config.listMethod}
      rendered={$rendered()}
      ctx={this}
    />
  }

  append(item){
    const config = this.config
    if (this.stat == 'finish' && config.globalName) {
      this.actions.roll('APPEND_ITEM', item)
    }
  }

  // select(page, dom, data){
  //   const config = this.config
  //   const index=page||0
  //
  //   const _select = (page, dom, data) => {
  //     $(this.items).removeClass('selected')
  //     if (dom && $(dom).hasClass('itemroot')) {
  //       $(dom).find('.caption:first').toggleClass('fold')
  //       $(dom).find('ul:first').toggleClass('none')
  //     } else {
  //       this.change(page, dom, data)
  //       $(this.items[(index||0)]).addClass('selected')
  //       if (this.stat == 'finish' && config.globalName) {
  //         this.actions.roll('SELECT', {_index: index, data: data})
  //       }
  //     }
  //   }
  //
  //   _select(page, dom, data)
  // }

  goback(key, data){
    let backState
    if (typeof key == 'string') {
      backState = this.actions.roll('BACK', {key: key, data: data})
    } else if (typeof key == 'function') {
      backState = this.actions.roll('BACK')
      key(backState)
    } else {
      backState = this.actions.roll('BACK')
    }
  }

  goto(key, data){
    if (typeof key == 'string'){
      const config = this.config
      if (this.stat == 'finish' && config.globalName) {
        this.actions.roll('GOTO', {key: key, data: data})
      }
    }
  }

  where(key){
    return getIndex(key, this.control)
  }
}

export default function router(opts){
  var noop = false
  , dft = {
    data: [],
    rootUrl: location.href.split('#')[0],
    flag: true,
    select: 0,
    menu: true,
    scrollMenu: false,
    header: '',
    footer: '',
    treeHeader: '',
    treeFooter: '',
    container: '',
    globalName: _.uniqueId('Tabs_'),   // TabsModule
    // theme: 'router', // = /css/m/tabs
    routerClass: '',
    itemMethod: noop,
    listMethod: noop,
    rendered: noop,
    listClass: '',
    mulitple: false,
    animate: 'right'  // 参考 https://daneden.github.io/animate.css/ 样式
  }
  dft = _.extend(dft, opts)
  return new App(dft)
}

export function pure(props){
  return router(props)
}
