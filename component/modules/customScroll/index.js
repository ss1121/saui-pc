function calcScrollTop(eHeight, scTop, mHeight, scHeight){
  //eHeight: 内容容器高度;
  //scTop: 滚动值;
  //mHeight: 滚动条容器高度;
  //scHeight: 滚动条高度;
  return (mHeight - scHeight) * (scTop / eHeight)
}
let Customscroll = function (element, opts){
  let that = this;
  this.element = $(element);
  this.param = opts;
  this.scroll = $(`
    <div class="customscroll-wrap">
      <div class="customscroll-scroll"></div>
    </div>
  `)
  let { scrollTop, childHeight } = this.param;
  let elementHeight = this.element.outerHeight()
  // childHeight -= elementHeight
  let scrollHeight = (elementHeight - 6) * (elementHeight / childHeight)
  this.scroll.css({
    position: 'absolute',
    top: this.element.position().top + 3,
    left: this.element.outerWidth() - 9,
    width: 6,
    maxHeight: elementHeight - 6,
    zIndex: 3
  })
  let max = elementHeight - 6 - scrollHeight
  let initTop = calcScrollTop(childHeight - elementHeight, scrollTop, elementHeight - 6, scrollHeight);

  this.scroll.find('.customscroll-scroll').css({
    position: 'absolute',
    top: initTop < 0 ? 0 : initTop > max ? max : initTop,
    width: 6,
    maxHeight: scrollHeight,
    borderRadius: 3,
    background: 'rgba(153, 153, 153, .35)',
    cursor: 'pointer',
  })
  // this.element.wrap(this.wrap)
  this.element.after(this.scroll)
  this.element.scrollTop(scrollTop || 0)
  this.element.on('mousewheel', function (e){
    e = e||window.event;
    //阻止冒泡
    if (e.stopPropagation) {
        e.stopPropagation();
    } else{
        e.cancelBubble = true;
    };
    if (e.preventDefault) {
        e.preventDefault();
    } else{
        e.returnValue = false;
    };
    let $this = $(this)
    $this.scrollTop($this.scrollTop() + e.originalEvent.deltaY)
    let scrollBox = that.scroll.find('.customscroll-scroll')
    let top = calcScrollTop(childHeight - elementHeight, $this.scrollTop(), elementHeight - 6, scrollBox.height())
    scrollBox.css({
      top: top > that.scroll.height() - scrollHeight ? that.scroll.height() - scrollHeight : top
    })
  })
  that.scroll.find('.customscroll-scroll').once('mousedown', function (e1){
    e1.stopPropagation()
    let { pageY: startY } = e1
    let $that = $(this)
    let startTop = $that.position().top
    $(document).once('mousemove', function (e2){
      let { pageY } = e2
      let maxScroll = that.scroll.height() - scrollHeight;
      let contentScroll = childHeight / maxScroll * (startTop + (pageY - startY))
      that.element.scrollTop(contentScroll)
      let scroll = startTop + (pageY - startY)
      let $thatScroll = scroll < 0 ? 0 : scroll > maxScroll ? maxScroll : scroll
      $that.css({
        top: $thatScroll
      })
    })
    $(document).once('mouseup', function(){
      $(document).off('mousemove')
    })
  })
  that.scroll.once('click', function (e){
    e.stopPropagation()
  })
}

Customscroll.prototype = {
  constructor: Customscroll,
  _events: [],
  show: function (type){
    if(type != 'visibility'){
      this.element.show()
      this.scroll.show()
    }else{
      this.element.css('visibility','visible').scrollTop(this.param.scrollTop)
      let { scrollTop, childHeight } = this.param
      let elementHeight = this.element.outerHeight()
      let scrollHeight = this.scroll.height() * (elementHeight / childHeight)
      let max = this.scroll.height() - scrollHeight
      let top = calcScrollTop(childHeight - elementHeight, scrollTop, this.scroll.height(), scrollHeight)
      this.scroll.css('visibility','visible').find('.customscroll-scroll').css({
        top: top < 0 ? 0 : top > max ? max : top
      })
    }
  },
  hide: function (type){
    if(type != 'visibility'){
      this.element.hide()
      this.scroll.hide()
    }else{
      this.element.css('visibility','hidden')
      this.scroll.css('visibility','hidden')
    }
  },
  scrollTop: function (num){
    this.element.scrollTop(num)
    // this.scroll.find('.customscroll-scroll').css()
  }
}
const customscroll = function (opt){
  let args = Array.apply(null, arguments);
  args.shift();
  let internal_return;
  this.each((i, item)=>{
    let $that = $(item),
        data = $that.data('customscroll'),
        options = typeof opt === 'object' && opt;
    if (!data) {
      $that.data('customscroll', (data = new Customscroll(item, $.extend({}, $.fn.customscroll.defaults, options))));
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
  $.fn.customscroll = customscroll
  $.fn.customscroll.defaults = {
  };
}