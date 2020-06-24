import 'component/modules/customScroll'

function days(opts){
  let { data, type, startDate, endDate, vStartDate, currentMonth, dislodge, dateScope } = opts;
  let mon = new Date(currentMonth)
  let yy = mon.getFullYear();
  let mm = mon.getMonth()
  let day = new Date(yy, mm, 1);
  let today = new Date();
  today = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)
  let ed = new Date(endDate)
  ed = new Date(ed.getFullYear(), ed.getMonth(), ed.getDate(), 0, 0, 0)
  let week = day.getDay() + 1;
  if (week == 0) week = 7;
  let thispageStart = new Date(Date.parse(day) - (week - 1) * 24 * 3600 * 1000);
  let daylist = ''
  for (let i = 0,l = 42; i < l; i++) {
    let theday = new Date(Date.parse(thispageStart) + i * 24 * 3600 * 1000);
    let addFestivalName = theday.Featival(),showDay = '',character = ''
    if(addFestivalName.length > 0){
      showDay = addFestivalName[0].desc
      character = ' character'
    }else{
      if(theday.Format('yyyy-MM-dd') == today.Format('yyyy-MM-dd')){
        character = ' character'
        showDay = '今天'
      }else{
        showDay = theday.Format('d')
      }
    }
    if(theday.getMonth() != mm) showDay = ''
    let vsd = new Date(vStartDate)
    vsd = new Date(vsd.getFullYear(), vsd.getMonth(), vsd.getDate())
    let current = theday.Format('yyyy-MM-dd') == vsd.Format('yyyy-MM-dd') ? ' datetimepicker-calendar-current' : ''
    let disabled = ''
    let sd,ed;
    let scope = ''
    if(!isNaN(new Date(startDate).getTime())){
      sd = new Date(startDate)
      sd = new Date(sd.getFullYear(),sd.getMonth(),sd.getDate())
    };
    if(!isNaN(new Date(endDate).getTime())){ 
      ed = new Date(endDate)
      ed = new Date(ed.getFullYear(),ed.getMonth(),ed.getDate())
    };
    if(type != 'double'){
      if(sd){
        if( theday.getTime() < sd.getTime() ){
          disabled = ' datetimepicker-calendar-disabled'
        }
      }else{
        if(dislodge == 'before' && theday.getTime() < today.getTime()){
          disabled = ' datetimepicker-calendar-disabled'
        }
      }
      if(ed){
        if(theday.getTime() > ed.getTime()){
          disabled = ' datetimepicker-calendar-disabled'
        }
      }else{
        if(dislodge == 'after' && theday.getTime() > today.getTime()){
          disabled = ' datetimepicker-calendar-disabled'
        }
      }
    }else{
      if(theday.getTime() < sd.getTime() || theday.getTime() > ed.getTime()){
        disabled = ' datetimepicker-calendar-disabled'
      }
    }
    if(dateScope != ''){
      let ds = new Date(dateScope)
      ds = new Date(ds.getFullYear(), ds.getMonth(), ds.getDate(), 0, 0, 0);
      if(ds.getTime() == theday.getTime()){
        scope = ' scopeDate'
      }
      if(vsd.getTime() == theday.getTime()){
        scope = ' scopeDate'
      }

      if(ds.getTime() < vsd.getTime()){
        if(ds.getTime() == theday.getTime()){
          scope += ' scope-l-bg';
        }
        if(vsd.getTime() == theday.getTime()){
          scope += ' scope-r-bg';
        }
        if(theday.getTime() > ds.getTime() && theday.getTime() < vsd.getTime()){
          scope = ' scope'
        }
      }
      if(ds.getTime() > vsd.getTime()){
        
        if(theday.getTime() > vsd.getTime() && theday.getTime() < ds.getTime()){
          scope = ' scope'
        }
      }
    }
    daylist += `
      <li class="${'datetimepicker-calendar-day' + current + character + disabled + scope}" data-date=${theday.Format('yyyy-MM-dd')}>
        ${showDay != '' ? `<div class="datetimepicker-calendar-date">${showDay}</div>` : ''}
      </li>
    `
  }
  return daylist
}
function month(opts){
  let { currentMonth, dislodge } = opts;
  let monthList = '';
  let currMon = new Date(currentMonth);
  let today = new Date();
  for(let i = 0, l = 12; i < l; i++){
    let cMon = new Date(currMon.getFullYear() || today.getFullYear(), i, 1);
    let tMon = new Date(today.getFullYear(), today.getMonth(), 1);
    let disabled = '';
    if(dislodge == 'after' && cMon.getTime() > tMon.getTime()){
      disabled = 'disabled';
    }
    monthList+= `<li class="datetimepicker-month"><button class="datetimepicker-month-btn" data-date=${ cMon.Format('yyyy-MM' )} ${ disabled }>${ cMon.FormatZh('M月' )}</button></li>`
  }
  return `
    <ul class="datetimepicker-month-list">
      ${ monthList }
    <ul>
  `
}
function bodys(opts){
  let { type, currentMonth, startDate } = opts
  let curr = new Date(currentMonth)
  let body = '';
  let len = type == 'double' ? 2 : 1 
  let week = `
    <ul class="datetimepicker-calendar-weeks">
      <li class="item">日</li>
      <li class="item">一</li>
      <li class="item">二</li>
      <li class="item">三</li>
      <li class="item">四</li>
      <li class="item">五</li>
      <li class="item">六</li>
    </ul>
  `
  for(let i = 0;i<len; i++){
    let calendarOpts = {...opts}
    calendarOpts.currentMonth = new Date(curr.getFullYear(), curr.getMonth() + i, 1).Format('yyyy-MM-dd');
    body += `
      <div class="datetimepicker-calendar-item">
        ${ type != "month" ? week : '' }
        <ul class="datetimepicker-calendar">
          ${ type != 'month' ? days({...calendarOpts}) : month({...calendarOpts}) }
        </ul>
      </div>
    `
  }
  return body
}
function picker(element, opts){
  let {type, startDate, endDate, currentMonth, dislodge, disabledSelect } = opts
  let select, doubleHeader, optionYear = '', optionMonth = [];
  let today = new Date()
  if(type == 'double') disabledSelect = false;
  let curr = new Date(currentMonth);
  curr = new Date(curr.getFullYear(),curr.getMonth(), 1);
  let sd = new Date(startDate)
  sd = new Date(sd.getFullYear(), sd.getMonth(), sd.getDate())
  let ed = new Date(endDate)
  ed = new Date(ed.getFullYear(), ed.getMonth(), ed.getDate())
  let sdYear = sd.getFullYear();
  let edYear = ed.getFullYear()
  let l = edYear - sdYear || 1
  for(let i = 0; ;i++){
    if(dislodge == 'before' && sdYear + i < today.getFullYear()){
      continue;
    }else if(dislodge == 'after' && sdYear + i > today.getFullYear()){
      break;
    }
    if(sdYear + i > edYear){
      break;
    }
    optionYear += `<li class="datetimepicker-select-item ${ sdYear + i == curr.getFullYear() ? 'selected' : '' }"  data-value="${ sdYear + i }">${ sdYear + i }</li>`
  }
  for(let i = 1,l = 12; i <= l; i++){
    let disabled = '';
    if(sd){
      if(curr.getFullYear() == sdYear && i < sd.getMonth() + 1){
        disabled = 'disabled';
      }
    }else{
      if(dislodge == 'before'){
        if(curr.getFullYear() == today.getFullYear() && i < today.getMonth() + 1){
          disabled = 'disabled';
        }
      }else{
        if(curr.getFullYear() == sd.getFullYear() && i < sd.getMonth() + 1){
          disabled = 'disabled';
        }
      }
    }
    if(ed){
      if(curr.getFullYear() == edYear && i > ed.getMonth() + 1){
        disabled = 'disabled';
      }
    }else{
      if(dislodge == 'after'){
        if(curr.getFullYear() == today.getFullYear() && i > today.getMonth() + 1){
          disabled = 'disabled';
        }
      }else{
        if(curr.getFullYear() == ed.getFullYear() && i > ed.getMonth() + 1){
          disabled = 'disabled';
        }
      }
    }
    optionMonth += `<li class="datetimepicker-select-item ${ i == curr.getMonth() + 1 ? 'selected' : '' } ${ disabled }" data-value="${ i }">${ i }</li>`
  }
  select = `
  <div class="datetimepicker-select-header">
    <div class="datetimepicker-select ${ l <= 1 ? 'disabled' : '' }">
      <label class="datetimepicker-select-label" data-type="year"><input class="datetimepicker-select-input" type="text" value="${ curr.getFullYear() }" readOnly /></label>
      <ul class="datetimepicker-select-list">
        ${ optionYear }
      </ul>
    </div>
    ${ type == 'default' ? 
      `<div class="datetimepicker-select">
        <label class="datetimepicker-select-label" data-type="month"><input class="datetimepicker-select-input" type="text" value="${ curr.getMonth() + 1 }" readOnly /></label>
        <ul class="datetimepicker-select-list">
          ${ optionMonth }
        </ul>
      </div>`
      : '' }
    </div>
  `
  let start = curr.Format('yyyy年MM月');
  let end = new Date(curr.getFullYear(), curr.getMonth() + 1, 1).Format('yyyy年MM月')
  doubleHeader = `
    <div class="datetimepicker-double-header ${disabledSelect ? ' disabledSelect' : ''}">
      <div class="datetimepicker-double-month">${ start }</div>
      ${ !disabledSelect ? `<div class="datetimepicker-double-month">${ end }</div>` : ''}
    </div>
  `
  let prevDisabled = '',nextDisabled = '';
  if(curr.getFullYear() == sd.getFullYear() && curr.getMonth() <= sd.getMonth()){
    prevDisabled = 'disabled'
  }
  if(curr.getFullYear() == ed.getFullYear() && curr.getMonth() >= ed.getMonth()){
    nextDisabled = 'disabled'
  }
  return `
    <div class="datetimepicker-calendar-header">
      <button class="datetimepicker-calendar-button datetimepicker-calendar-prev" ${ prevDisabled }></button>
      ${ type != 'double' ? !disabledSelect ? select: doubleHeader : doubleHeader }
      <button class="datetimepicker-calendar-button datetimepicker-calendar-next" ${ nextDisabled }></button>
    </div>
    <ul class="datetimepicker-calendar-bodys">
      ${ bodys(opts) }
    </ul>
  `
}
function timelist(element, opts){
  let { vStartDate, dislodge } = opts;
  let vsd
  if(vStartDate) vsd = new Date(vStartDate)
  let hoursList = '',minusList = ''
  for(let i=0,l=60;i<l;i++){
    if(i<24){
      hoursList += `<li class="datetimepicker-time-item ${ vsd && vsd.getHours() == i ? 'active' : ''}" data-type="hours" data-value="${ i < 10 ? '0' + i : i }">${ i < 10 ? '0' + i : i }</li>`
    }
    minusList += `<li class="datetimepicker-time-item ${ vsd && vsd.getMinutes() == i ? 'active' : ''}" data-type="minus" data-value="${ i < 10 ? '0' + i : i }">${ i < 10 ? '0' + i : i }</li>`
  }

  return `
    <div class="datetimepicker-time-header">
      <button class="datetimepicker-time-btn return"></button>
      <div class="datetimepicker-time-date">${ vsd ? vsd.Format('yyyy-MM-dd') : '' }</div>
      <button class="datetimepicker-time-btn visH"></button>
    </div>
    <div class="datetimepicker-time-body">
      <ul class="datetimepicker-hours">
        ${ hoursList }
      </ul>
      <ul class="datetimepicker-minus">
        ${ minusList }
      </ul>
    </div>
  `
}
let Datepicker = function (element, opts){
  let that = this;
  this.element = $(element);
  this.param = opts
  this.param.vStartDate = this.element.val()
  let { type, startDate, endDate, currentMonth, dislodge } = this.param
  let sd, sdMon, ed, edMon; 
  if(!isNaN(new Date(startDate).getTime())) sd = new Date(startDate);
  if(!isNaN(new Date(endDate).getTime())) ed = new Date(endDate);
  let today = new Date();
  if(type != 'double'){
    if(dislodge == 'before'){
      sdMon = new Date( (sd ? sd.getFullYear() : today.getFullYear()), sd ? sd.getMonth() : today.getMonth(), sd ? sd.getDate() : today.getDate());
      edMon = new Date( (ed ? ed.getFullYear() : today.getFullYear() + 50), ed ? ed.getMonth() : today.getMonth(), sd ? sd.getDate() : today.getDate());
    }else if(dislodge == 'after'){
      sdMon = new Date( (sd ? sd.getFullYear() : today.getFullYear() - 100), sd ? sd.getMonth() : today.getMonth(), sd ? sd.getDate() : today.getDate());
      edMon = new Date( (ed ? ed.getFullYear() : today.getFullYear()), ed ? ed.getMonth() : today.getMonth(), sd ? sd.getDate() : today.getDate());
    }else{
      sdMon = new Date( (sd ? sd.getFullYear() : today.getFullYear() - 100), sd ? sd.getMonth() : today.getMonth(), sd ? sd.getDate() : today.getDate());
      edMon = new Date( (ed ? ed.getFullYear() : today.getFullYear() + 50), ed ? ed.getMonth() : today.getMonth(), sd ? sd.getDate() : today.getDate());
    }
  }else{
    sdMon = new Date(sd.getFullYear(), sd.getMonth(), sd.getDate());
    edMon = new Date(ed.getFullYear(), ed.getMonth() - 1, ed.getDate());
  }
  if(typeof startDate == 'undefined') this.param.startDate = sdMon.Format('yyyy-MM-dd')
  if(typeof endDate == 'undefined') this.param.endDate = edMon.Format('yyyy-MM-dd')
  if(typeof currentMonth == 'undefined') this.param.currentMonth = new Date(today.getFullYear(), sd ? sd.getMonth() : today.getMonth(), 1).Format('yyyy-MM-dd');
  let template = `<div class="datepicker-wrapper"></div>`
  this.template = $(template).appendTo('body')
  this.picker = $(`<div class="datetimepicker-calendar-wrapper datetimepicker-calendar-${ type }"></div>`).appendTo(this.template)
  this.picker.html(picker(this.element, this.param))
  let $dom = [this.element[0],this.picker[0]]
  if(this.param.timelist){
    this.timelist = $(`<div class="datetimepicker-time-list"></div>`).appendTo(this.template)
    this.timelist.html(timelist(this.element, this.param))
    $dom.push(this.timelist[0])
  }
  this.element.on('click', function (){
    that.show() 
  })

  window.bindDocument($dom, function (){
    that.hide()
  })
  this.template.on('click', '.datetimepicker-calendar-button, .datetimepicker-calendar-day, .datetimepicker-month-btn, .datetimepicker-select-label, .datetimepicker-select-item, .datetimepicker-time-item, .datetimepicker-time-btn', function(e){
    let num = 0;
    if(that.param.type){
      if(that.param.type != 'double'){
        num = 1;
      }else{
        num = 2;
      }
    }
    let today = new Date()
    if($(this).hasClass('datetimepicker-calendar-prev')){
      e.stopPropagation()
      that.prev(num)
    }
    if($(this).hasClass('datetimepicker-calendar-next')){
      e.stopPropagation()
      that.next(num)
    }
    if($(this).hasClass('datetimepicker-calendar-day')){
      e.stopPropagation()
      if($(this).hasClass('datetimepicker-calendar-disabled')) return false;
      let value = $(this).attr('data-date')
      value = value + (that.param.timelist ? today.Format(' hh:mm') : '')
      that.checkDay(value)
      that.element.trigger('changeDate', value)
    }
    if($(this).hasClass('datetimepicker-month-btn')){
      e.stopPropagation()
      if($(this).hasClass('datetimepicker-calendar-disabled')) return false;
      let value = $(this).attr('data-date')
      that.checkDay(value)
      that.element.trigger('changeDate', value)
    }
    if($(this).hasClass('return')){
      that.show()
    }
    if($(this).hasClass('datetimepicker-select-label')){
      let $that = $(this)
      let disabled = $that.hasClass('disabled')
      let type = $that.attr('data-type')
      if(!disabled){
        let value = $(this).find('.datetimepicker-select-input').val()
        let scrollTop = 0
        if(type == 'year'){
          scrollTop = $that.parent().find('.datetimepicker-select-item[data-value="'+ value +'"]').position().top
          let childHeight = Math.ceil($that.parent().find('.datetimepicker-select-list').children().length / 2) * $that.parent().find('.datetimepicker-select-list').children().outerHeight()
          $that.parent().find('.datetimepicker-select-list').customscroll({scrollTop, childHeight})
          $that.parent().find('.datetimepicker-select-list').customscroll('show', 'visibility')
          window.bindDocument([$that.parent()[0]], function (){
            $that.parent().find('.datetimepicker-select-list').customscroll('hide', 'visibility')
          })
        }else{
          $that.parent().find('.datetimepicker-select-list').css('visibility', 'visible')
          window.bindDocument([$that[0]], function (){
            $that.parent().find('.datetimepicker-select-list').css('visibility', '')
          })
        }
      }
    }
    if($(this).hasClass('datetimepicker-select-item')){
      e.stopPropagation()
      if($(this).hasClass('disabled')){
        return false;
      }
      let $select = $(this).parents('.datetimepicker-select');
      let type = $select.attr('data-type')
      let value = $(this).attr('data-value')
      if(type == 'year'){
        that.changeYear(value)
      }else{
        that.changeMonth(value)
      }
      $select.find('.datetimepicker-select-list').css('visibility', '')
    }
    if($(this).hasClass('datetimepicker-time-item')){
      e.stopPropagation()
      let type = $(this).attr('data-type');
      let value = $(this).attr('data-value');
      if(type == 'hours'){
        that.checkHour(value)
      }else{
        that.checkMinus(value)
      }
    }
  })
  this.template.on('mouseenter', '.datetimepicker-calendar-day', function (){
    let { startDate, dateScope } = that.param;
    let date = $(this).attr('data-date')
    if($(this).hasClass('datetimepicker-calendar-disabled') || $(this).hasClass('scopeDate') || $(this).hasClass('scope-l-bg') || $(this).hasClass('scope') || $(this).hasClass('scope-r-bg')) return false;
    if(startDate && dateScope){
      $(that.template).find('.datetimepicker-calendar-day').removeClass('scopeDate-hover scope-l-bg-hover scope-hover scope-r-bg-hover')
      $(that.template).find('.datetimepicker-calendar-day').each(function (i,item){
        let itemDate = $(item).attr('data-date');
        if(itemDate == dateScope){
          $(item).addClass('scopeDate-hover scope-l-bg-hover');
        }
        if(itemDate >= startDate && itemDate < date){
          $(item).addClass('scope-hover');
        }
        if(itemDate == date){
          $(item).addClass('scopeDate-hover scope-r-bg-hover');
        }
      })
    }
  })
  this.template.on('mouseleave', '.datetimepicker-calendar-day', function (){
    $(that.template).find('.datetimepicker-calendar-day').removeClass('scopeDate-hover scope-l-bg-hover scope-hover scope-r-bg-hover')
  })
}
Datepicker.prototype = {
  constructor: Datepicker,
  _events: [],
  show: function (){
    let offset = this.element.offset()
    offset.top += this.element.outerHeight(true)
    this.template.show().css({...offset, zIndex: 20000})
    this.picker.show();
    if(this.param.timelist) this.timelist.hide();
    this.element.trigger('show')
  },
  hide: function (){
    this.template.hide()
    this.element.trigger('hide')
  },
  prev: function (num){
    let { type, startDate, currentMonth } = this.param
    let currMon = new Date(currentMonth)
    if(type){
      if(type != 'month'){
        this.param.currentMonth = new Date(currMon.getFullYear(), currMon.getMonth() - num, currMon.getDate()).Format('yyyy-MM-dd')
      }else{
        this.param.currentMonth = new Date(currMon.getFullYear() - num, currMon.getMonth(), currMon.getDate()).Format('yyyy-MM-dd')
      }
    }
    this.picker.html(picker(this.element, this.param))
  },
  next: function (num){
    let { type, startDate, currentMonth } = this.param
    let currMon = new Date(currentMonth)
    if(type){
      if(type != 'month'){
        this.param.currentMonth = new Date(currMon.getFullYear(), currMon.getMonth() + num, currMon.getDate()).Format('yyyy-MM-dd')
      }else{
        this.param.currentMonth = new Date(currMon.getFullYear() + num, currMon.getMonth(), currMon.getDate()).Format('yyyy-MM-dd')
      }
    }
    this.picker.html(picker(this.element, this.param))
  },
  changeTimePicker: function (rt){
    if(rt){
      this.picker.show()
      if(this.param.timelist) this.timelist.hide()
    }else{
      this.picker.hide()
      if(this.param.timelist) this.timelist.show()
      let hoursList = this.timelist.find('.datetimepicker-hours')
      let minusList = this.timelist.find('.datetimepicker-minus')
      let hTop = hoursList.find('.active').position().top
      let mTop = minusList.find('.active').position().top
      hoursList.scrollTop(hTop)
      minusList.scrollTop(mTop)
    }
  },
  changeYear: function (value){
    let { startDate, endDate, currentMonth } = this.param
    let sd = new Date(startDate);
    let ed = new Date(endDate);
    let currMon = new Date(currentMonth)
    this.param.currentMonth = new Date( value, currMon.getMonth(), currMon.getDate() ).Format('yyyy-MM-dd')
    this.picker.html(picker(this.element, this.param))
  },
  changeMonth: function (value){
    let { type, startDate, currentMonth } = this.param
    let currMon = new Date(currentMonth)
    this.param.currentMonth = new Date( currMon.getFullYear(), value - 1, currMon.getDate() ).Format('yyyy-MM-dd')
    this.picker.html(picker(this.element, this.param))
  },
  checkDay: function (value){
    this.param.vStartDate = value
    this.element.val(this.param.vStartDate)
    if(!this.param.timelist || (this.param.timelist && this.param.type != 'default')){
      this.hide()
    }
    this.picker.html(picker(this.element, this.param))
    if(this.param.timelist && this.param.type == 'default'){
      this.timelist.html(timelist(this.element, this.param))
      this.changeTimePicker()
    }
  },
  checkHour: function (value){
    let vStartDate = this.param.vStartDate;
    let vsd = new Date(vStartDate);
    this.param.vStartDate = vsd.Format('yyyy-MM-dd ' + value + ':mm')
    this.element.val(this.param.vStartDate);
    if(this.param.timelist) this.timelist.html(timelist(this.element, this.param))
    this.changeTimePicker()
  },
  checkMinus: function (value){
    let vStartDate = this.param.vStartDate;
    let vsd = new Date(vStartDate);
    this.param.vStartDate = vsd.Format('yyyy-MM-dd hh:' + value)
    this.element.val(this.param.vStartDate);
    if(this.param.timelist) this.timelist.html(timelist(this.element, this.param))
    this.changeTimePicker()
    this.hide()
  },
  setStartDate: function (date){
    if(date == ''){
      let { type, dislodge } = this.param
      let today = new Date();
      if(type != 'double'){
        if(dislodge == 'before'){
          this.param.startDate = new Date( today.getFullYear(), today.getMonth(), today.getDate());
        }else{
          this.param.startDate = new Date( today.getFullYear() - 100, today.getMonth(), today.getDate());
        }
      }else{
        return false
      }
    }else{
      date = new Date(date)
      if(isNaN(date.getTime())){
        console.error('传入的startDate是非法日期')
        return false;
      }
      this.param.startDate = date.Format('yyyy-MM-dd')
      this.param.currentMonth = date.Format('yyyy-MM') + '-01'
    }
    this.picker.html(picker(this.element, this.param))
  },
  setEndDate: function (date){
    if(date == ''){
      let { type, dislodge } = this.param
      let today = new Date();
      if(type != 'double'){
        if(dislodge == 'before'){
          this.param.endDate = new Date( today.getFullYear(), today.getMonth(), today.getDate());
        }else{
          this.param.endDate = new Date( today.getFullYear() + 50, today.getMonth(), today.getDate());
        }
      }else{
        return false
      }
    }else{
      date = new Date(date)
      if(isNaN(date.getTime())){
        console.error('传入的endDate是非法日期')
        return false;
      }
      this.param.endDate = date.Format('yyyy-MM-dd')
    }
    this.picker.html(picker(this.element, this.param))
  },
  setCurrentDate: function (date){
    if(date == ''){
      this.element.val('')
      return
    }
    date = new Date(date)
    if(isNaN(date.getTime())){
      console.error('传入的currentDate是非法日期')
      return false;
    }
    this.param.vStartDate = date.Format('yyyy-MM-dd')
    this.element.val(date.Format('yyyy-MM-dd'))
    this.param.currentMonth = date.Format('yyyy-MM') + '-01'
    this.picker.html(picker(this.element, this.param))
  },
  setDateScope: function (date){
    let dd = new Date(date)
    dd = new Date(dd.getFullYear(), dd.getMonth(), dd.getDate())
    this.param.dateScope = !isNaN(dd.getTime()) ? dd.Format('yyyy-MM-dd') : '';
    this.picker.html(picker(this.element, this.param))
  }
}
$.fn.datepicker = function (opt){
  let args = Array.apply(null, arguments);
  args.shift();
  let internal_return;
  this.each((i, item)=>{
    let $that = $(item),
        data = $that.data('datepicker'),
        options = typeof opt === 'object' && opt;
    if (!data) {
      $that.data('datepicker', (data = new Datepicker(item, $.extend({}, $.fn.datepicker.defaults, options))));
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
$.fn.datepicker.defaults = {
  dateScope: ''
};