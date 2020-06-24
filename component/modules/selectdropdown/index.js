function Options(opt, dd, index){
  let { data } = opt.param
  let optionList = ''
  if(!Array.isArray(dd)){
    data.map((item, i) => {
      let arrow = '';
      let attr = '';
      if(item.attr){
        for(let i in item.attr){
          attr += (attr == '' ? '' : ' ') +  'data-' + i + '="'+ item.attr[i] + '"'
        }
      }
      if(!item.child || item.child.length < 1){
        data.map(item2 => {
          if(item.idf && item2.parent && item.idf == item2.parent){
            arrow = 'arrow'
          }
        })
        if((!item.parent && !dd) || (item.parent == dd)) optionList += `<li class="selectdropdown-item ${ arrow } ${ item.class || '' }" ${ item.idf ? `data-idf="${ item.idf }"` : '' } ${ attr }>${ item.value }</li>`
      }
      if(!dd && item.child && item.child.length > 0){
        arrow = 'arrow'
        optionList += `<li class="selectdropdown-item ${ arrow } ${ item.class || '' }" data-index="${ item.index || i }">${ item.value }</li>`
      }
    })
  }else{
    dd.map((item, i) => {
      let arrow = '';
      if(item.child && item.child.length > 0){
        arrow = 'arrow'
      }
      optionList += `<li class="selectdropdown-item ${ arrow } ${ item.class || '' }" data-index="${ index + '-' + i }">${ item.value }</li>`
    })
  }

  return `
    <ul class="selectdropdown-list">
      ${ optionList }
    </ul>
  `
}
function findObj(data, index){
  if(!Array.isArray(index)){
    return false;
  }
  let obj;
  for(let i=0,l=index.length;i<l; i++){
    if(obj == undefined){
      obj = data[index[i]]
    }else{
      obj = obj.child[index[i]]
    }
  }
  return obj
}

let Selectordropdown = function (element, index, opts){
  let that = this;
  this.element = $(element);
  this.index = index;
  this.param = opts;
  let template = `<div class="selectdropdown-wrapper disN">${ Options(this) }</div>`;
  let clear = `<button class="selectdropdown-clear disN"></button>`
  this.Options = $(template).appendTo('body')
  this.clearbtn = $(clear).appendTo('body')
  this.switch = false;
  this.element.on('focus', function (){
    that.show()
  }).on('blur', function (){
    if(!that.switch) that.hide()
  }).on('click', function (e){
    e.stopPropagation()
  })
  $(document).on('click',function (){
    that.hide();
  })
  this.Options.hover(function (){
    that.switch = true;
  },function (){
    that.switch = false;
  }).on('click', function (e){
    e.stopPropagation()
  })
  this.Options.on('click', '.selectdropdown-item', function (){
    let idf = $(this).attr('data-idf');
    let value = $(this).html();
    let dIndex = $(this).attr('data-index');
    let index = dIndex ? dIndex.split('-') : undefined;
    let pIndex = $(this).parents('.selectdropdown-list').index()
    let obj;
    $(this).addClass('active').siblings().removeClass('active')
    if(!index){
      let child = [];
      that.param.data.map((item,i) => {
        if((idf && item.idf == idf) || (!idf && item.value == value)){
          obj = item
        }
        if(idf && item.parent == idf){
          child.push(item)
        }
      })
      that.Options.find('.selectdropdown-list').each((i,item) => {
        if(i > pIndex){
          $(item).remove()
        }
      })
      if(child.length > 0){
        that.Options.append( Options(that, idf) )
      }else{
        that.element.val(obj.selectValue || obj.value).trigger('checkData', obj)
        that.hide()
      }
    }else{
        let obj = findObj(that.param.data, index)
      if(obj.child && obj.child.length > 0){
        that.Options.find('.selectdropdown-list').each((i,item) => {
          if(i > pIndex){
            $(item).remove()
          }
        })
        that.Options.append( Options(that, obj.child, dIndex) )
      }else{
        that.element.val(obj.selectValue || obj.value).trigger('checkData', obj)
        that.hide()
      }
    }
  })
  this.clearbtn.hover(function (){
    that.switch = true;
  },function (){
    that.switch = false;
  }).on('click', function (e){
    e.stopPropagation()
    that.clear();
    that.element.trigger('clearSelect')
  })
}
Selectordropdown.prototype = {
  constructor: Selectordropdown,
  _events: [],
  show: function (){
    let offset = this.element.offset()
    let OptionsTop = offset.top + this.element.outerHeight()
    this.Options.removeClass('disN').css({
      top: OptionsTop, 
      left: offset.left,
      zIndex: 10000
    })
    this.clearbtn.removeClass('disN').css({
      top: offset.top + this.element.height() / 2 - this.clearbtn.height() / 2,
      left: offset.left + this.element.outerWidth() - 7 - this.clearbtn.width(),
      zIndex: 10001
    })
  },
  hide: function (){
    this.Options.addClass('disN')
    this.clearbtn.addClass('disN')
  },
  clear: function (){
    this.element.val('')
    this.Options.addClass('disN').find('.selectdropdown-item').removeClass('active');
    this.Options.find('.selectdropdown-list').each((i,item)=>{
      if(i){
        $(item).remove()
      }
    })
    this.clearbtn.addClass('disN')
  },
  reset: function (data){
    this.element.val(data.value);
    if(data.idf){
      this.Options.find('.selectdropdown-item[data-idf="'+data.idf+'"]').addClass('active').siblings().removeClass('active');
    }else if(data.index){
      this.Options.find('.selectdropdown-item[data-index="'+data.index+'"]').addClass('active').siblings().removeClass('active');
    }
  }
}
const selectdropdown = function (opt){
  let args = Array.apply(null, arguments);
  args.shift();
  let internal_return;
  this.each((i, item)=>{
    let $that = $(item),
      data = $that.data('selectdropdown'),
      options = typeof opt === 'object' && opt;
    if (!data) {
      $that.data('selectdropdown', (data = new Selectordropdown(item, i, $.extend({}, $.fn.selectdropdown.defaults, options))));
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
  $.fn.selectdropdown = selectdropdown
  $.fn.selectdropdown.defaults = {
  };
}