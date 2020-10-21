import {objtypeof, inject} from 'libs'
import PopClass from 'component/class/poper'

// Aotoo.inject.css([
//   '/css/t/animate.css',
//   '/css/m/msgtips.css'
// ])

class Tips extends PopClass {
  constructor(){
    super([...arguments])
    this.timmer = null
  }

  msgItem(stat){
    var tip = document.createElement('div');
    // var bgcolor = 'background-color:#4ba2f9;';
    let bgcolor = 'active';
    if (objtypeof(stat) == 'object') {
      switch (stat.type) {
        case 'warning':
        //   bgcolor ='background-color:#f0ad4e;';
          bgcolor ='warning';
          break;
        case 'error':
        //   bgcolor ='background-color:rgb(211, 13, 21);';
          bgcolor ='error';
          break;
        case 'success':
        //   bgcolor ='background-color: #40bc6c;';
          bgcolor ='success';
          break;
        default:
          if (stat.toast) {
            //     bgcolor ='background-color: #bbbbbb;';
            bgcolor ='default';
          }

      }
    }
    // tip.style.cssText = bgcolor;
    // let cls = 'tips-item bounceInRight animated'
    let cls = 'tips-item bounceIn animated'
    if (stat && stat.toast) {
      cls = 'tips-item fadeIn animated'
    }
    // tip.className = cls
    tip.className = bgcolor.concat(' ',cls)
    return tip;
  }

  //消息实例容器，可定制
  msgBox(stat){
    let boxContainer
    let boxContainerId = 'msgcontainer'
    let cls = 'tips-container'
    if (stat && stat.toast) {
      cls += ' tips-toast'
      boxContainerId = 'msgcontainer-toast'
    }
    if (stat && stat.notification) {
      cls += ' tips-notification'
      boxContainerId = 'msgcontainer-notification'
    }
    if (!document.getElementById(boxContainerId)) {
      let box = document.createElement('div')
      box.className = cls
      box.id = boxContainerId
      let body = document.getElementsByTagName('body')
      body[0].appendChild(box)
      boxContainer = box
    } else {
      boxContainer = document.getElementById(boxContainerId)
    }
    return boxContainer
    // $('#msgcontainer').length ? '' : $('body').append('<div class="tips-container" id="msgcontainer"></div>');
    // return $('#msgcontainer')[0];
  }

  close(item, container, stat){
    if (stat === true) {
      $(item).addClass('fadeOut')    //flipOutX
      this.timmer = setTimeout(function () {
        $(item).remove()
        if($(container).find('.tips-item').length==0) $(container).remove();
      }, 1300)
    } else {
      this.timmer = setTimeout(function(){
        $(item).addClass('fadeOut')
        setTimeout(function(){
          $(item).remove()
          if($(container).find('.tips-item').length==0) $(container).remove();
        }, 1000)
      }, 2000)
    }
  }

  // 执行动画
  anim(item, container, stat){
    if (stat && stat.onlyone) {
      clearTimeout(this.timmer)
      var nodelist = container.childNodes;
      for (var i = nodelist.length-1; i >= 0; i--) {
        container.removeChild(nodelist[i])
      }
    }
    container.appendChild(item);
    if (objtypeof(stat) == 'object' && stat.sticky) {
      $(item).click(()=>{
        this.close(item, container, true)
      })
    }
    else {
      this.close(item, container, stat)
    }
  }
}

var msgtipInstance
export default function tips(msg, stat={}, cb){
  var dft = { type: 'default', onlyone: true }
  stat = _.extend(dft, stat)
  if (msgtipInstance) {
    return msgtipInstance.run(msg, stat, cb)
  } else {
    msgtipInstance = new Tips()
    return msgtipInstance.run(msg, stat, cb)
  }
}

tips.warning = function(msg, stat){
  var dft = {type: 'warning'}
  dft = _.extend(dft, stat)
  tips(msg, dft)
}

tips.error = function(msg, stat){
  var dft = {type: 'error'}
  dft = _.extend(dft, stat)
  tips(msg, dft)
}

tips.success = function(msg, stat){
  var dft = {type: 'success'}
  dft = _.extend(dft, stat)
  tips(msg, dft)
}

tips.toast = function(msg, stat){
  var dft = {toast: true}
  if (typeof stat=='string') {
    dft.type = stat
  } else {
    dft = _.extend(dft, stat)
  }
  tips(msg, dft)
}

tips.notification = function(msg, stat){
  var dft = {notification: true}
  if (typeof stat=='string') {
    dft.type = stat
  } else {
    dft = _.extend(dft, stat)
  }
  tips(msg, dft)
}

tips.sticky = function(msg, stat){
  var dft = {sticky: true}
  if (typeof stat=='string') {
    dft.type = stat
  } else {
    dft = _.extend(dft, stat)
  }
  tips(msg, dft)
}
