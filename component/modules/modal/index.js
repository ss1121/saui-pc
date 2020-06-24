import {objtypeof} from 'libs'
import PopClass from 'component/class/poper'

Aotoo.inject.css('/css/t/animate.css')

function DocmentView(){
  var doch = window.innerHeight||document.documentElement.offsetHeight||document.body.clientHieght;
  var docw = window.innerWidth||document.documentElement.offsetWidth||document.body.clientWidth;
  var docST = document.documentElement.scrollTop||document.body.scrollTop;
  var docSL = document.documentElement.scrollLeft||document.body.scrollLeft;
  return {width:docw,height:doch,scrollTop:docST,scrollLeft:docSL};
}

class Modal extends PopClass {
  constructor(){
    super([...arguments])
  }

  msgItem(stat){
    var tip = document.createElement('div');
    tip.className = 'modal-item'
    tip.id = 'modal-item'
    return tip;
  }

  //消息实例容器，可定制
  msgBox(stat){
    let docRect = DocmentView();
    let scrollleft = docRect.scrollLeft;
    let scrolltop = docRect.scrollTop;
    let clientwidth = docRect.width;
    let clientheight = docRect.height;

    let pWidth = 'modal-p50'
    let mClass = ''
    if (stat && objtypeof(stat)=='object') {
      pWidth = stat.pW ? stat.pW : stat.width ? '' : pWidth
    }
    var modal = '<div class="modal-bg" id="middle" ' + (stat.width ? 'style="min-width:' + stat.width + '"' : "") + '><div class="modal-container '+pWidth+' fadeIn animated-fastest" ' + (stat.width ? 'style="width:' + stat.width + '"' : "") + ' id="modal-container"></div></div>'
    $('#modal-container').length ? '' : $('body').append(modal).addClass('modal-open');
    return [$('.modal-bg')[0], $('#modal-container')[0] ]
  }

  // close(item, container, stat){
  close(){
    const item = this.item
    const container = this.container
    const stat = this.stat
    $(container[1]).addClass('slideOutUp')
    if(typeof stat.closeMethod == 'function'){
      stat.closeMethod()
    }
    setTimeout(()=>{
      $('body').removeClass('modal-open')
      $(container[0]).remove()
    },500)
  }

  // 执行动画
  anim(item, container, stat){
    container[1].innerHeight = ''
    
    // container[1].appendChild(item);

    let element = container[1]
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
    container[1].appendChild(item);

    $(container[0]).click((e)=>{
      if(stat.bgClose == true){
        if (e.target.className == 'modal-bg') {
          this.close(item, container)
        } else {
          // e.stopPropagation()
        }
      }
    })
    if(stat.closeBtn){
      $(stat.closeBtn).click((e)=>{
        this.close(item, container)
      })
    }
  }
}

var msgModalInstance
export default function modal(msg,stat,cb){
  var noop = false
  let dft = {
    pW: '',
    closeBtn: '',               //传进入的类名，关闭弹出层
    bgClose: true               //是否启用点击背景关闭弹出层
  }
  stat = _.extend(dft, stat)
  if (msgModalInstance) {
    return msgModalInstance.run(msg, stat, cb)
  } else {
    msgModalInstance = new Modal()
    return msgModalInstance.run(msg, stat, cb)
  }
}


modal.p10 = function(msg,stat,cb){
  var dft = {pW: 'modal-p10'}
  if (objtypeof(stat) == 'object') {
    dft = _.extend(dft, stat)
  }
  modal(msg,dft,cb)
}

modal.p20 = function(msg,stat,cb){
  var dft = {pW: 'modal-p20'}
  if (objtypeof(stat) == 'object') {
    dft = _.extend(dft, stat)
  }
  modal(msg,dft,cb)
}

modal.p30 = function(msg,stat,cb){
  var dft = {pW: 'modal-p30'}
  if (objtypeof(stat) == 'object') {
    dft = _.extend(dft, stat)
  }
  modal(msg,dft,cb)
}
modal.p40 = function(msg,stat,cb){
  var dft = {pW: 'modal-p40'}
  if (objtypeof(stat) == 'object') {
    dft = _.extend(dft, stat)
  }
  modal(msg,dft,cb)
}
modal.p50 = function(msg,stat,cb){
  var dft = {pW: 'modal-p50'}
  if (objtypeof(stat) == 'object') {
    dft = _.extend(dft, stat)
  }
  modal(msg,dft,cb)
}
modal.p60 = function(msg,stat,cb){
  var dft = {pW: 'modal-p60'}
  if (objtypeof(stat) == 'object') {
    dft = _.extend(dft, stat)
  }
  modal(msg,dft,cb)
}
modal.p70 = function(msg,stat,cb){
  var dft = {pW: 'modal-p70'}
  if (objtypeof(stat) == 'object') {
    dft = _.extend(dft, stat)
  }
  modal(msg,dft,cb)
}
modal.p80 = function(msg,stat,cb){
  var dft = {pW: 'modal-p80'}
  if (objtypeof(stat) == 'object') {
    dft = _.extend(dft, stat)
  }
  modal(msg,dft,cb)
}
modal.p90 = function(msg,stat,cb){
  var dft = {pW: 'modal-p90'}
  if (objtypeof(stat) == 'object') {
    dft = _.extend(dft, stat)
  }
  modal(msg,dft,cb)
}
