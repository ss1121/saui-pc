class TimePicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data || [
        {
          interval: 1,
          hour: '00',
          minute: '00'
        }
      ],
      warning: this.props.warning,
      warningText: this.props.warningText,
      error: this.props.error,
      errorText: this.props.errorText,
      separator: this.props.separator || '-',
      disabled: this.props.disabled || false,
    }
  }
  render(){
    let timePicker = [];
    let { warning, error, warningText, errorText, disabled } = this.state
    this.state.data.map( (item,index,data) => {
      let hour = [],minute = [];
      for(let i=0,l=24;i<l;i++){
        hour.push({
          title: i < 10 ? '0' + i : i,
          itemClass: data[index].hour == i ? 'time-active' : ''
        })
      }
      for(let i=0,l=60;i<l;i+=data[index].interval){
        minute.push({
          title: i < 10 ? '0' + i : i,
          itemClass: data[index].minute == i ? 'time-active' : ''
        })
      }
      if(data.length > 1 && index > 0){
        timePicker.push({title: this.state.separator, itemClass:"time-separator" })
      }
      timePicker.push({
        title: <div className="timepicker">
          <input className={"time-value oTimeValue form_control" + (warning || error ? ' time-error-input' : '')} type="text" disabled={disabled ? 'disabled' : ''} placeholder="选择时间" value={ data[index].minute != '' ? (data[index].hour || '00') + ':' + (data[index].minute || '00') : '' } readOnly />
          <span className="time-icon"></span>
          <span className="time-clear">&times;</span>
          <div className="fkp-dd-list" >
            { this.list({ data: hour, listClass: 'hour-list' }) }
            { this.list({ data: minute, listClass: 'minute-list' }) }
          </div>
        </div>,
        attr: {
          index: index
        },
        itemClass: 'time-picker'
      })
    })
    return (
      <div className="timepicker-wrapper">
        {
          this.list(
            {
              data: timePicker,
              listClass: 'timepicker-wrap'
            }
          )
        }
        <div className="timepicker-tips">
          { warning ? <div className="timepicker-warning">{ warningText }</div> : null}
          { error ? <div className="timepicker-error">{ errorText }</div> : null}
        </div>
      </div>
    )
  }
}
const Actions = {
  SETVALUE: function (ostate,opts){
    let curState = this.curState
    curState.data[opts.index] = _.merge(curState.data[opts.index], opts.opts)
    return curState
  },
  WARNING: function (ostate, txt){
    let curState = this.curState
    if(typeof txt == 'string'){
      curState.warning = true;
      curState.error = false;
      curState.warningText = txt
    }
    if(typeof txt == 'boolean'){
      curState.warning = txt;
    }
    return curState
  },
  ERROR: function (ostate, txt){
    let curState = this.curState
    if(typeof txt == 'string'){
      curState.warning = false;
      curState.error = true;
      curState.errorText = txt
    }
    if(typeof txt == 'boolean'){
      curState.error = txt;
    }
    return curState
  },
  UPDATE: function (ostate, opts){
    let curState = this.curState
    for(let item in opts){
      curState[item] = opts[item]
    }
    return curState
  }
}
function tp(opts){
  const instance = Aotoo(TimePicker, Actions)
  let hour = 0
  // instance.$interval(opts)
  instance.extend({
    warning: function (txt){
      this.$warning(txt);
    },
    error: function (txt){
      this.$error(txt);
    },
    hide: function (all){
      $('.fkp-dd-list').hide()
      $('.time-icon').show()
      $('.time-clear').hide()
      if(all){
        this.$warning(false);
        this.$error(false);
        $('.oTimeValue').css('border-color','')
      }
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
    $(dom).find('.time-picker').once('click',function (e){
      e.stopPropagation();
      let disabled = instance.curState ? instance.curState.disabled : opts.disabled
      if(!disabled){
        instance.$warning(false);
        instance.$error(false);
        $('.oTimeValue').css('border-color','#ccc')
        const thisShow = $(this).find('.fkp-dd-list').css('display')
        if(thisShow !== 'none'){
          selectHide('body')
        }else{
          selectHide('body')
          $(this).find('.fkp-dd-list').show().siblings('.time-icon').hide().siblings('.time-clear').show()
        }
      }
    })
    $(dom).find('.hour-list .item').once('click',function (e){
      e.stopPropagation();
      let that = this
      const ind = $(that).parents('.time-picker').data('index');
      instance.$setvalue({
        index: ind,
        opts: {
          hour: $(that).html()
        }
      })
      setTimeout(function (){
        let { hour, minute } = instance.curState.data[ind]
        if(minute){
          if(opts.change){
            opts.change(hour + ':' + (minute || '00'))
          }
          $(that).parents('.fkp-dd-list').toggle().siblings('.time-icon').toggle().siblings('.time-clear').toggle()
        }
      },100)
    })
    $(dom).find('.minute-list .item').once('click',function (e){
      e.stopPropagation();
      let that = this
      const ind = $(that).parents('.time-picker').data('index');
      instance.$setvalue({
        index: ind,
        opts: {
          minute: $(that).html()
        }
      })
      setTimeout(function (){
        let { hour, minute } = instance.curState.data[ind]
        if(opts.change){
          opts.change((hour || '00') + ':' + minute)
        }
        $(that).parents('.fkp-dd-list').toggle().siblings('.time-icon').toggle().siblings('.time-clear').toggle()
      },100)
    })
    $(dom).find('.time-clear').once('click',function (){
      const ind = $(this).parents('.time-picker').data('index');
      instance.$setvalue({
        index: ind,
        opts: {
          hour: '',
          minute: ''
        }
      })
      if(opts.clearMethod){
        opts.clearMethod()
      }
    })
    $('body').once('click',function (){
      selectHide(this)
    })
  })
  return instance
}

export default function timepicker(options){
  let dft = {
    data: [],
    warning: false,
    warningText: '',
    error: false,
    errorText: '',
  }
  dft = _.merge(dft, options)
  return tp(dft)
}

export function pure(props){
  return timepicker(props)
}