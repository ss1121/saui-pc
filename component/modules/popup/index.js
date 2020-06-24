import {objtypeof, inject} from 'libs'
function isValidRctElement(msg){
  if (typeof React != 'undefined' && React.isValidElement(msg)) return true
}
function popclick(e){
  const _this = e.data.ctx
  if (_this) {
    _this.colsePopup()
  }
}
class Popup {
  constructor(ele,ops){
    this.element = ele
    this.options = ops
    this.addPopup()
  }
  addPopup (){
    this.colsePopup()
    var pop = document.createElement('div');
    pop.className = 'popup'
    var parent = $(this.options.position)
    var _this = this
    
    parent.css({position:'relative'})
    parent.append(pop);
    $('.popup').css({
      position:'absolute',
      top: this.options.pageY ? (this.options.pageY - parent.offset().top + 10) : (this.options.top || 'auto') ,
      right: this.options.right || 'auto',
      bottom: this.options.bottom || 'auto',
      left: this.options.pageX ? (this.options.pageX - parent.offset().left + 10) : (this.options.left || 'auto') ,
      zIndex:1000
    })
    if(typeof this.element == 'string'){
      parent.append(this.element);
    }
    if(isValidRctElement(this.element)){
      React.render(this.element,pop)
    }
    $('.popup').click(function (e){
      e.stopPropagation()
    })
    $('.popup').hover(
      function (e){ e.stopPropagation() },
      function (e){ e.stopPropagation() }
    )
    $(document).on('click', {ctx: _this}, popclick)
  }
  colsePopup (){
    $('.popup').remove()
    $(document).off('click', popclick)
  }
}

// var msgModalInstance
export default function popup(element,options){
    var popupElement = new Popup(element,options)
    return popupElement
}
