import { Z_DEFAULT_STRATEGY } from "zlib";

class TimePicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data,
      startWarning: false,
      endWarning: false,
      startError: false,
      endError: false,
      warningText: '',
      errorText: '',
    }
  }
  render(){
    let timePicker = [];
    let startHour = [],startMinute = [],endHour = [],endMinute = [];
    let data = this.state.data;
    let startTime = data.startTime.split(':')
    let endTime = data.endTime.split(':')
    let startWarning = this.state.startWarning;
    let endWarning = this.state.endWarning;
    let startError = this.state.startError;
    let endError = this.state.endError;
    for(let i=0,l=31;i<l;i++){
      if(i<24){
        startHour.push({
          title: i < 10 ? '0' + i : i,
          itemClass: startTime[0] == i ? 'time-active' : '',
          attr:{ hour: i, tomorrow: 0 }
        })
      }
      if(i >= (0 | startTime[0])){
        if(data.startTime != (i < 10 ? '0' + i : i > 24 ? (i - 24 < 10 ? '0' + (i - 24) : i - 24) : i) + ':30'){
          endHour.push({
            title: (i > 24 ? '次日' : '') + (i < 10 ? '0' + i : i > 24 ? (i - 24 < 10 ? '0' + (i - 24) : i - 24) : i),
            itemClass: endTime[0] == (i > 24 ? '次日' + (i - 24 < 10 ? '0' + (i - 24) : i - 24) : i) ? 'time-active' : '',
            attr:{ hour: (i > 24 ? i - 24 : i), tomorrow: (i > 24 ? 1 : 0) }
          })
        }
      }
    }
    for(let i=0,l=60;i<l;i+=data.interval){
      startMinute.push({
        title: i < 10 ? '0' + i : i,
        itemClass: startTime[1] == i ? 'time-active' : ''
      })
      let disabled = false;
      if(startTime[0] == endTime[0] && startTime[1] == '00' && i == startTime[1]){
        disabled = true;
      }
      endMinute.push({
        title: i < 10 ? '0' + i : i,
        itemClass: (endTime[1] == i ? 'time-active' : '') + (disabled ? ' time-disabled' : '')
      })
    }
    timePicker = (<div className="timepicker">
        <div className="time-start">
          <input className={"time-value" + ((startWarning || startError) ? ' time-value-error' : '')} type="text" placeholder="选择时间" value={ data.startTime } readOnly />
          <span className="time-icon"></span>
          <span className="time-clear"></span>
          <div className="fkp-dd-list" >
            { this.list({ data: startHour, listClass: 'hour-list' }) }
            { this.list({ data: startMinute, listClass: 'minute-list' }) }
          </div>
          { startWarning ? <div className="time-warning modu-wraning">{ this.state.warningText }</div> : '' }
          { startError ? <div className="time-error modu-error">{ this.state.errorText }</div> : ''}
        </div>
        <div className="time-separator">{this.props.separator}</div>
        <div className="time-end">
          <input className={"time-value" + ((endWarning || endError) ? ' time-value-error' : '')} type="text" placeholder="选择时间" value={ data.endTime } readOnly />
          <span className="time-icon"></span>
          <span className="time-clear"></span>
          <div className="fkp-dd-list" >
            { this.list({ data: endHour, listClass: 'hour-list' }) }
            { this.list({ data: endMinute, listClass: 'minute-list' }) }
          </div>
          { endWarning ? <div className="time-warning modu-wraning">{ this.state.warningText }</div> : '' }
          { endError ? <div className="time-error modu-error">{ this.state.errorText }</div> : ''}
        </div>
      </div>)
    return timePicker
  }
}
const Actions = {
  SETVALUE: function (ostate,opts){
    let curState = this.curState
    if(opts.type == 'start'){
      let time = curState.data.startTime.split(':');
      curState.data.startTime = (opts.timeType == 'hour' ? (opts.val + ':' + (time[1] || '00')) : ((time[0] || '00') + ':' + opts.val))
    }else{
      let time = curState.data.endTime.split(':')
      curState.data.endTime = (opts.timeType == 'hour' ? (opts.val + ':' + (time[1] || '00')) : ((time[0] || '00') + ':' + opts.val))
    }
    let sTime = curState.data.startTime.split(':');
    let eTime = curState.data.endTime.split(':');
    if(sTime[0] > eTime[0]){
      curState.data.endTime = ''
    }
    if(sTime[0] == eTime[0] && sTime[1] == eTime[1]){
      curState.data.endTime = eTime[0] + ':30'
    }
    if(curState.data.startTime == curState.data.endTime && sTime[1] == '30'){
      let t = (0 | eTime[0])
      curState.data.endTime = (t + 1 > 24 ? '次日' + (t + 1 - 24 < 10 ? '0' + (t + 1 - 24) : t + 1 - 24) : t + 1 < 10 ? '0' + (t + 1) : t + 1)  + ':00'
    }
    return curState
  },
  UPDATE: function (ostate,opts){
    let curState = this.curState
    curState.data.startTime = opts.startTime;
    curState.data.endTime = opts.endTime;
    return curState
  },
  CLEAR: function (ostate,opts){
    let curState = this.curState
    if(opts.type == 'start'){
      curState.data.startTime = ''
    }else{
      curState.data.endTime = ''
    }
    return curState
  },
  WARNING: function (ostate,text){
    let curState = this.curState
    if(curState.data.startTime == ''){
      curState.startWarning = true;
      curState.warningText = text;
    }
    if(curState.data.endTime == ''){
      curState.endWarning = true;
      curState.warningText = text;
    }
    return curState
  },
  ERROR: function (ostate,text){
    let curState = this.curState
    if(curState.data.startTime == ''){
      curState.startError = true;
      curState.errorText = text;
    }
    if(curState.data.endTime == ''){
      curState.endError = true;
      curState.errorText = text;
    }
    return curState
  },
  CLEARTIPS:function (ostate,type){
    let curState = this.curState
    if(type == 'start'){
      curState.startWarning = false;
      curState.startError = false;
    }else if(type == 'end'){
      curState.endWarning = false;
      curState.endError = false;
    }else{
      curState.startWarning = false;
      curState.startError = false;
      curState.endWarning = false;
      curState.endError = false;
    }
    return curState
  }
}
function tp(opts){
  const instance = Aotoo(TimePicker, Actions)
  instance.extend({
    getData: function (){
      let state = this.liveState
      return state.data
    },
    warning: function (text){
      this.$warning(text)
    },
    error: function (text){
      this.$error(text)
    }
  })
  instance.setProps(opts)
  instance.on('rendered', function(options){
    const {dom, _opts, ctx} = options
    function selectHide(obj){
      $(obj).find('.fkp-dd-list').hide()
      $(obj).find('.time-icon').show()
      $(obj).find('.time-clear').hide()
    }
    $(dom).find('.time-start,.time-end').once('click',function (e){
      e.stopPropagation();
      const thisShow = $(this).find('.fkp-dd-list').css('display')
      instance.$cleartips($(this)[0].className.split('-')[1])
      if(thisShow !== 'none'){
        selectHide('body')
      }else{
        selectHide('body')
        $(this).find('.fkp-dd-list').show().siblings('.time-icon').hide().siblings('.time-clear').show()
        $(this).find('.hour-list').scrollTop(0)
        $(this).find('.minute-list').scrollTop(0)
        let time = $(this).find('.time-value').val().split(':');
        let hourTop = 0,minuteTop = 0;
        $(this).find('.hour-list .item').each(function (i,item){
          if($(item).html() == time[0]){
            hourTop += $(item).position().top
          }
        })
        $(this).find('.minute-list .item').each(function (i,item){
          if($(item).html() == time[0]){
            minuteTop += $(item).position().top
          }
        })
        $(this).find('.hour-list').scrollTop(hourTop)
        $(this).find('.minute-list').scrollTop(minuteTop)
      }
    })
    $(dom).find('.hour-list .item').once('click',function (e){
      e.stopPropagation();
      const type = $(this).parent().parent().parent()[0].className
      instance.$setvalue({
        type: type.split('-')[1],//开始或结束类型
        timeType: 'hour',//时间类型,时或分
        val: $(this).html()
      })
    })
    $(dom).find('.minute-list .item').once('click',function (e){
      e.stopPropagation();
      const type = $(this).parent().parent().parent()[0].className
      instance.$setvalue({
        type: type.split('-')[1],//开始或结束类型
        timeType: 'minute',//时间类型,时或分
        val: $(this).html()
      })
      $(this).parents('.fkp-dd-list').toggle().siblings('.time-icon').toggle().siblings('.time-clear').toggle()
    })
    $(dom).find('.time-clear').once('click',function (){
      const type = $(this).parent()[0].className
      instance.$clear({
        type: type.split('-')[1]
      })
      
    })
    $('body').once('click',function (){
      selectHide(this)
    })
  })
  return instance
}

export default function timepicker(options){
  let dft = {
    data: {
      interval: 1,
      startTime: '09:00',
      endTime: '17:00',
    }
  }
  dft = _.merge(dft, options)
  return tp(dft)
}