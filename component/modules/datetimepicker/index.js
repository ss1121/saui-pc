const weeks = ['日', '一', '二', '三', '四', '五', '六']
function days(opts){
  let { data, type, startDate, endDate, vStartDate, dislodge, calendarType, scope } = opts;
  let mon = new Date(vStartDate)
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
  let dayArr = [];
  for (let i = 0,l = 42; i < l; i++) {
    let theday = new Date(Date.parse(thispageStart) + i * 24 * 3600 * 1000);
    let addFestivalName = theday.Featival(),showDay = '',character = ''
    if(addFestivalName.length > 0){
      showDay += addFestivalName[0].desc
      character = ' character'
    }else{
      if(theday.Format('yyyy-MM-dd') == today.Format('yyyy-MM-dd')){
        showDay = '今天'
        character = ' character'
      }else{
        showDay = theday.Format('d')
      }
    }
    if(theday.getMonth() != mm) showDay = ''
    let curDate = [];
    data.map(item => {
      curDate.push(new Date(item.value).Format('yyyy-MM-dd'))
    })
    let current = ''
    if(theday.Format('yyyy-MM-dd') == curDate[0]){
      current = ' datetimepicker-calendar-current'
    }
    if(type == 'double'){
      if(theday.Format('yyyy-MM-dd') == curDate[1]){
        current = ' datetimepicker-calendar-current'
      }
    }
    let disabled = ''
    let sd,ed;
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
      if(data[0].value != '' && calendarType != 'start'){
        let sDate = new Date(data[0].value)
        let scopeDate;
        if(scope){
          scopeDate = sDate.getTime() + scope * 24 * 3600 * 1000
        }else{
          scopeDate = ed.getTime()
        }
        if(theday.getTime() < sDate.getTime() || theday.getTime() > ed.getTime() || theday.getTime() > scopeDate ){
          disabled = ' datetimepicker-calendar-disabled'
        }
      }else{
        if(theday.getTime() < sd.getTime() || theday.getTime() > ed.getTime()){
          disabled = ' datetimepicker-calendar-disabled'
        }
      }
    }
    dayArr.push({
      title: (showDay != '' ? <div className="datetimepicker-calendar-date">{showDay}</div> : ''), 
      attr:{date:theday.Format('yyyy-MM-dd')},
      itemClass: 'datetimepicker-calendar-day' + current + character + disabled
    })
  }
  return Aotoo.list({
    data: dayArr,
    listClass: 'datetimepicker-calendar',
  })
}

function month(opts){
  let { data, type, startDate, endDate, vStartDate, dislodge, calendarType } = opts;
  let monthList = [];
  let vsd = new Date(vStartDate);
  let today = new Date();
  for(let i = 0, l = 12; i < l; i++){
    let vMon = new Date(vsd.getFullYear(), i, 1);
    let tMon = new Date(today.getFullYear(), today.getMonth(), 1);
    let disabled = false;
    if(dislodge == 'after' && vMon.getTime() > tMon.getTime()){
      disabled = true;
    }
    monthList.push(
      {title: <button className="datetimepicker-month-btn" data-date={vMon.Format('yyyy-MM')} disabled={disabled}>{vMon.FormatZh('M月')}</button>}
    )
  }
  return Aotoo.list({
    data: monthList,
    itemClass: 'datetimepicker-month',
    listClass: 'datetimepicker-month-list'
  })
}

function bodys(opts){
  let { type, vStartDate } = opts
  let vsd = new Date(vStartDate)
  let body = [];
  let len = type == 'double' ? 2 : 1 
  for(let i = 0;i<len; i++){
    opts.vStartDate = new Date(vsd.getFullYear(), vsd.getMonth() + i, 1);
    body.push( 
      <div className="datetimepicker-calendar-body">
        {
          type != 'month' ?
          Aotoo.list({
            data: weeks,
            listClass: 'datetimepicker-calendar-weeks'
          })
          : ''
        }
        { type != 'month' ? days(opts) : month(opts) }
      </div>
    )
  }
  return body
}

class Datetimepicker extends React.Component {
  constructor(props) {
    super(props)
    let today = new Date();
    this.state = {
      data: this.props.data,
      config: this.props.config,
      vStartDate:  this.props.vStartDate || today.Format('yyyy-MM-dd'),
      calendarType: '',
      error: {},
    }
    this.changeYear = this :: this.changeYear
    this.changeMonth = this :: this.changeMonth
  }
  changeYear(e){

  }
  changeMonth(e){

  }
  render(){
    const that = this
    let { data, config, vStartDate, calendarType, error } = this.state
    let { separator, startDate, endDate, type, dislodge, scope } = config
    //input生成
    let today = new Date();
    let inputs = []
    data.map((item,i)=>{
      if(type != 'double'){
        item.attr.cType = type
      }else{
        if(i == 0){
          item.attr.cType = 'start'
        }
        if(i == 1){
          item.attr.cType = 'end'
        }
      }
      let cType = item.attr.cType
      let err;
      if(error[cType]){
        err = error[cType]
      }
      let InputAttr = {}
      Object.keys(item.attr).forEach(key=>{
        InputAttr[`data-${key.replace('data-','')}`] = item.attr[key]
      })
      let Input = <input id={ item.id || '' } className={ 'datetimepicker-input ' + (item.class || '') + (err ? ' datetimepicker-input-error-border' : '') } type='text' disabled={ item.disabled } placeholder={ item.placeholder } readOnly={ item.readOnly } value={ item.value } />
      Input = React.cloneElement(Input, InputAttr);
      inputs.push({title: <label className="datetimepicker-input-wrap">{Input}{ err ? <span className={"datetimepicker-input-error " + (error.class || '')}>{ err }</span> : ''}</label>, attr: {index: i}})
      if(i != data.length - 1 && config.separator ){
        inputs.push({title: <div className="datetimepicker-separator" key={_.uniqueId('separator_' + i +'_')}>{ separator }</div>})
      }
    })
    let sd,ed;
    if(!isNaN(new Date(startDate).getTime())) sd = new Date(startDate);
    if(!isNaN(new Date(endDate).getTime())) ed = new Date(endDate);
    let vsd = new Date(vStartDate);
    let optionYear = [],optionMonth = [];
    //月份生成
    if(type != 'double'){
      //默认单月份头部
      let sdYear,edYear;
      if(sd){
        sdYear = sd.getFullYear()
      }else{
        sdYear = today.getFullYear() - 100
      }
      if(ed){
        edYear = ed.getFullYear()
      }else{
        edYear = today.getFullYear() + 50
      }
      let l = edYear - sdYear || 1
      for(let i = 0; ; i++){
        if(dislodge == 'before' && sdYear + i < today.getFullYear()){
          continue;
        }else if(dislodge == 'after' && sdYear + i > today.getFullYear()){
          break;
        }
        if(sdYear + i > edYear){
          break;
        }
        optionYear.push(<option value={sdYear + i} key={_.uniqueId('optionYear' + sdYear + i + '_')}>{sdYear + i}</option>)
      }
      for(let i = 1,l = 12; i <= l; i++){
        let disabled = false;
        if(sd){
          if(vsd.getFullYear() == sd.getFullYear() && i < sd.getMonth() + 1){
            disabled = true;
          }
        }else{
          if(dislodge == 'before' && vsd.getFullYear() == today.getFullYear() && i < today.getMonth() + 1){
            disabled = true;
          }
        }
        if(ed){
          if(vsd.getFullYear() == ed.getFullYear() && i > ed.getMonth() + 1){
            disabled = true;
          }
        }else{
          if(dislodge == 'after' && vsd.getFullYear() == today.getFullYear() && i > today.getMonth() + 1){
            disabled = true;
          }
        }
        optionMonth.push(<option value={i} key={_.uniqueId('optionMonth' + i + '_')} disabled={ disabled }>{i}</option>)
      }
    }
    let select = (
      <div className="datetimepicker-select-header">
        <select className="datetimepicker-select datetimepicker-select-year" value={vsd.getFullYear()} onChange= { that.changeYear }>
          { optionYear }
        </select>
        { type == 'default' ? <select className="datetimepicker-select datetimepicker-select-month" value={vsd.getMonth() + 1} onChange= { that.changeMonth }>
          { optionMonth }
        </select>  : '' }
      </div>
    )
    let start = vsd.Format('yyyy年MM月');
    let end = new Date(vsd.getFullYear(), vsd.getMonth() + 1, 1).Format('yyyy年MM月')
    let doubleHeader = (
      <div className="datetimepicker-double-header">
        <div className="datetimepicker-double-month">{ start }</div>
        <div className="datetimepicker-double-month">{ end }</div>
      </div>
    )
    let bodyOpts = {
      data,
      type, 
      startDate, 
      endDate, 
      vStartDate, 
      dislodge,
      calendarType,
      scope
    }
    let prevDisabled = false, nextDisabled = false;
    let curMon = new Date(vsd.getFullYear(), vsd.getMonth(), 1);
    let startMon;
    let endMon;
    if(type != 'double'){
      if(dislodge == 'before'){
        startMon = new Date( (sd ? sd.getFullYear() : today.getFullYear()), (sd ? sd.getMonth() : today.getMonth()), 1);
        endMon = new Date( (ed ? ed.getFullYear() : today.getFullYear() + 50), (ed ? ed.getMonth() : today.getMonth()), 1);
      }else if(dislodge == 'after'){
        startMon = new Date( (sd ? sd.getFullYear() : today.getFullYear() - 50), (sd ? sd.getMonth() : today.getMonth()), 1);
        endMon = new Date( (ed ? ed.getFullYear() : today.getFullYear()), (ed ? ed.getMonth() : today.getMonth()), 1);
      }else{
        startMon = new Date( (sd ? sd.getFullYear() : today.getFullYear() - 50), (sd ? sd.getMonth() : today.getMonth()), 1);
        endMon = new Date( (ed ? ed.getFullYear() : today.getFullYear() + 50), (ed ? ed.getMonth() : today.getMonth()), 1);
      }
    }else{
      startMon = new Date(sd.getFullYear(), sd.getMonth(), 1);
      endMon = new Date(ed.getFullYear(), ed.getMonth() - 1, 1);
    }
    if(curMon.getTime() <= startMon.getTime()){
      prevDisabled = true;
    }
    if(curMon.getTime() >= endMon.getTime()){
      nextDisabled = true;
    }
    return (
      <div className="datetimepicker-wrapper">
        <div className="datetimepicker-inputs">
          { 
            that.list({
              data: inputs,
              listClass: 'datetimepicker-inputs-list',
              itemClass: 'datetimepicker-inputs-item'
            })
          }
        </div>
        <div className={"datetimepicker-calendar-wrapper datetimepicker-calendar-" + type}>
          <div className="datetimepicker-calendar-header">
            <button className="datetimepicker-calendar-prev" disabled={prevDisabled}></button>
            { type != 'double' ? select : doubleHeader}
            <button className="datetimepicker-calendar-next" disabled={nextDisabled}></button>
          </div>
          {
            that.list({
              data: bodys(bodyOpts),
              itemClass: 'datetimepicker-calendar-item',
              listClass: 'datetimepicker-calendar-bodys'
            })
          }
        </div>
      </div>
    )
  }
}
const Actions = {
  CHANGE: function (ostate, opts){
    let curState = this.curState;
    let {vStartDate} = curState;
    let {value,type} = opts;
    let vsd = new Date(vStartDate);
    if(type == 'year'){
      vStartDate = new Date(value, vsd.getMonth(), 1);
    }
    if(type == 'month'){
      vStartDate = new Date(vsd.getFullYear(), (0 | value) - 1, 1);
    }
    curState.vStartDate = vStartDate;
    return curState
  },
  CHECKED: function (ostate, opts){
    let curState = this.curState;
    let { config } = curState
    let { type } = config;
    let { value, cType } = opts
    let date = new Date(value)
    if(type != 'double'){
      curState.data[0].value = value
    }else{
      if(cType == 'start'){
        curState.data[0].value = value
        if(!curState.data[1].disabled){
          curState.calendarType = 'end'
        }
        if(curState.data[1].value != ''){
          let startDate = new Date(curState.data[0].value)
          let endDate = new Date(curState.data[1].value)
          if( startDate.getTime() < endDate.getTime() - config.scope * 24 * 3600 * 1000 ){
            curState.data[1].value = new Date(startDate.getTime() + 1 * 24 * 3600 * 1000).Format('yyyy-MM-dd')
          }
          if(date.getTime() > endDate.getTime()){
            curState.data[1].value = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).Format('yyyy-MM-dd')
          }
        }
      }else{
        curState.data[1].value = value
      }
    }
    return curState;
  },
  CHANGETYPE: function (ostate, opts){
    let curState = this.curState;
    let { cType } = opts
    if(typeof cType != 'undefined'){
      curState.calendarType = cType
    }
    curState.error = false
    return curState
  },
  PREV: function (ostate){
    let curState = this.curState;
    let { config, vStartDate } = curState
    let { type } = config;
    let vsd = new Date(vStartDate)
    if( type == 'default' ){
      curState.vStartDate = new Date(vsd.getFullYear(), vsd.getMonth() - 1, 1);
    }else if(type == 'double'){
      curState.vStartDate = new Date(vsd.getFullYear(), vsd.getMonth() - 2, 1);
    }else if(type == 'month'){
      curState.vStartDate = new Date(vsd.getFullYear() - 1, vsd.getMonth(), 1);
    }
    return curState
  },
  NEXT: function (ostate){
    let curState = this.curState;
    let { config, vStartDate } = curState
    let { type } = config;
    let vsd = new Date(vStartDate)
    if( type == 'default' ){
      curState.vStartDate = new Date(vsd.getFullYear(), vsd.getMonth() + 1, 1);
    }else if(type == 'double'){
      curState.vStartDate = new Date(vsd.getFullYear(), vsd.getMonth() + 2, 1);
    }else if(type == 'month'){
      curState.vStartDate = new Date(vsd.getFullYear() + 1, vsd.getMonth(), 1);
    }
    return curState
  },
  UPDATE: function (ostate, opts){
    let curState = this.curState;
    curState = _.merge(curState, opts)
    if(opts.config && opts.config.startDate) curState.vStartDate = opts.config.startDate
    return curState;
  },
  ERROR: function (ostate, error){
    let curState = this.curState;
    curState.error = error
    return curState;
  }
}
function index (opts){
  const instance = Aotoo(Datetimepicker, Actions, opts)
  if(opts.data && opts.data.length > 0){
    opts.data.map(item => {
      item.key = _.uniqueId('Input_')
    })
  }
  instance.extend({
    getData: function (){
      let data = this.curState ? this.curState.data : opts.props.data;
      return data
    }
  })
  let type = opts.props.config.type;
  let dp,daySwitch, focusSwitch = false;
  instance.on('rendered', function(options){
    const {dom, _opts, ctx} = options
    setTimeout(() => {
      daySwitch = true
    }, 500);
    $('.datetimepicker-calendar-wrapper').hover(function(){
      focusSwitch = true;
    },function (){
      focusSwitch = false;
    })
    $(dom).find('.datetimepicker-calendar-prev').once('click', function (e){
      instance.$prev()
    })
    $(dom).find('.datetimepicker-calendar-next').once('click', function (e){
      instance.$next()
    })
    $(dom).find('.datetimepicker-input').once('click', function (e){
      $(dom).find('.datetimepicker-input').removeClass('focus')
      $(this).addClass('focus');
      focusSwitch = true;
      if(type != 'double'){
        $(dom).addClass('datetimepicker-zIndex')
        $(dom).find('.datetimepicker-calendar-wrapper').show()
      }else{
        if(dp && dp === this){
          $(dom).addClass('datetimepicker-zIndex')
          $(dom).find('.datetimepicker-calendar-wrapper').show()
        }else{
          $(dom).addClass('datetimepicker-zIndex')
          $(dom).find('.datetimepicker-calendar-wrapper').show();
        }
      }
      let cType = $(this).attr('data-ctype')
      dp = this
      instance.$changetype({ cType })
    })
    $(dom).find('.datetimepicker-select-year').once('change', function (e){
      instance.$change({
        value: $(this).val(),
        type: 'year'
      })
    })
    $(dom).find('.datetimepicker-select-month').once('change', function (e){
      instance.$change({
        value: $(this).val(),
        type: 'month'
      })
    })
    $(dom).find('.datetimepicker-calendar-day').once('click', function (){
      if(!daySwitch) {
        return
      }
      let curDate = $(this).attr('data-date')
      let cType = $(dp).attr('data-ctype');
      let disabled = $(this).hasClass('datetimepicker-calendar-disabled')
      if(disabled){ 
        return false
      }
      daySwitch = false
      let data = instance.curState ? instance.curState.data : opts.props.data
      let inputData = data[0].attr;
      instance.emit('changeDate', {
        value: curDate,
        data: inputData,
        relative: instance.config.relative || {}
      })
      instance.$checked({
        value: curDate,
        cType
      })
      setTimeout(()=>{
        if(type != 'double'){
          $(dom).find('.datetimepicker-calendar-wrapper').hide();
          $(dom).find('.datetimepicker-input').removeClass('focus')
        }else{
          let endInput = $(dom).find('.datetimepicker-input[data-ctype="end"]')[0]
          if(cType == 'start' && !$(endInput).attr('disabled')){
            $(dom).find('.datetimepicker-input').removeClass('focus')
            dp = endInput
            endInput.focus()
          }else{
            $(dom).find('.datetimepicker-calendar-wrapper').hide();
            $(dom).find('.datetimepicker-input').removeClass('focus')
            inputData = data[1].attr
          }
        }
      },100)
    })
    $(dom).find('.datetimepicker-month-btn').once('click', function (){
      let curDate = $(this).attr('data-date')
      instance.$checked(curDate)
      $(dom).find('.datetimepicker-calendar-wrapper').hide();
      $(dom).find('.datetimepicker-input').removeClass('focus')
    })
    window.bindDocument($(dom)[0], function (){
      $(dom).find('.datetimepicker-calendar-wrapper').hide()
      $(dom).removeClass('datetimepicker-zIndex')
      $(dom).find('.datetimepicker-input').removeClass('focus')
    })
  })
  return instance
}

export default function datetimepicker(opts){
  let dft = {
    relative: {},
    props: {}
  }
  dft = _.merge(dft, opts)
  return index(dft)
}