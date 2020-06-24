let Popup = function (element, opts){
  let that = this;
  that.element = $(element);
  that.param = opts;
  if(!that.param.wrapClass) that.param.wrapClass = ''
  if(!that.param.wrapCss) that.param.wrapCss = {}
  that.wrapper = $(`<div class="popup-wrapper ${that.param.wrapClass}">${ that.param.content || '' }</div>`).appendTo('body');
  that.wrapper.css({
    position: 'absolute',
    'display': 'none',
    ...that.param.wrapCss
  });
  let timer;
  that.activeName = '';
  if(that.param.type == 'hover' || that.param.type == undefined){
    that.element.once('mouseenter', function (e){
      if(that.param.hoverPopup) clearTimeout(timer);
      that.show();
    }).once('mouseleave', function (e){
      if(!that.param.hoverPopup){
        that.hide()
      }else{
        timer = setTimeout(() => {
          that.hide()
        }, 20)
      }
    })
    if(that.param.hoverPopup){
      that.wrapper.once('mouseenter', function (e){
        clearTimeout(timer);
      }).once('mouseleave', function (e){
        timer = setTimeout(() => {
          that.hide()
        }, 20)
      })
    }
  }else if(that.param.type == 'click'){
    let show = true;
    that.element.once('click', function (e){
      if(typeof that.param.method == 'function'){
        that.param.method(e,show)
      }
      if(show){
        that.show();
        show = false;
      }else{
        that.hide()
        show = true;
      }
    })
    window.bindDocument([that.element[0], that.wrapper[0]], function (){
      that.hide();
      show = true;
    })
  }
}
Popup.prototype = {
  constructor: Popup,
  _events: [],
  show: function (){
    let that = this;
    $('.popup-wrapper').hide();
    that.wrapper.css('display','inline-table');
    let direct = that.param.direct
    let winWidth = $('body').width();
    let winHeight = $('body').height();
    let elePosition = that.element.offset();
    let eleWidth = that.element.outerWidth()
    let eleHeight = that.element.outerHeight()
    let wrapWidth = that.wrapper.outerWidth();
    let wrapHeight = that.wrapper.outerHeight();
    let pos;
    if(direct){
      pos = {
        top: {
          left: elePosition.left,
          top: elePosition.top - wrapHeight
        },
        right: {
          left: elePosition.left + eleWidth,
          top: elePosition.top
        },
        bottom: {
          left: elePosition.left,
          top: elePosition.top + eleHeight
        },
        left: {
          left: elePosition.left - wrapWidth,
          top: elePosition.top
        }
      }
    }
    let wrapTop;
    if(elePosition.top + eleHeight + wrapHeight > winHeight){
      wrapTop = elePosition.top - wrapHeight
      that.activeName = 'pop-title-arrow active arrow-bottom'
    }else{
      wrapTop = elePosition.top + eleHeight
      that.activeName = 'pop-title-arrow active'
    }
    let hoverClass = that.param.hoverClass
    if(hoverClass) that.activeName += (hoverClass ? ' ' + hoverClass : '')
    that.element.addClass(that.activeName);
    let df = {
      left: elePosition.left + wrapWidth > winWidth ? elePosition.left - wrapWidth + eleWidth : elePosition.left,
      top: wrapTop
    }
    that.wrapper.css(direct ? pos[direct] : df)
  },
  hide: function (){
    let that = this
    that.element.removeClass(that.activeName)
    that.wrapper.css('display','none')
  },
  update: function (dom){
    this.wrapper.html(dom)
  }
}
const popup = function (opt){
  let args = Array.apply(null, arguments);
  args.shift();
  let internal_return;
  this.each((i, item)=>{
    let $that = $(item),
        data = $that.data('popup'),
        options = typeof opt === 'object' && opt;
    if (!data) {
      $that.data('popup', (data = new Popup(item, $.extend({}, $.fn.popup.defaults, options))));
    }
    if (typeof opt === 'string' && typeof data[opt] === 'function') {
      internal_return = data[opt].apply(data, args);
      if (internal_return !== undefined) {
        return false;
      }
    }
  })
  if (internal_return !== undefined)
    return internal_return;
  else
    return this;
}
if(typeof window !== 'undefined'){
  $.fn.popup = popup
  $.fn.popup.defaults = {};
}