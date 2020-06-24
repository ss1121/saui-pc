import '../customScroll'

class Timelist extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      startTime: this.props.startTime,
      endTime: this.props.endTime,
      interval: this.props.interval,
      value: this.props.value,
      disabled: this.props.disabled,
      warning: this.props.warning,
      warningText: this.props.warningText,
      error: this.props.error,
      errorText: this.props.errorText,
    }
  }
  render(){
    let { startTime, endTime, interval, value, disabled, warning, error, warningText, errorText } = this.state;
    let hoursList = [], minusList = [];
    let st = startTime.split(':');
    let et = endTime.split(':');
    let val = value ? value.split(':') : [];
    if(val.length != 0){
      val[0] = val[0] < st[0] ? st[0] : val[0];
      val[1] = val[0] == et[0] && val[1] > et[1] ? et[1] : val[1];
    }
    for(let i = st[0],l=et[0]; i<=l; i++){
      let num = (0 | i)
      if(num > 23) break;
      hoursList.push({title: num < 10 ? '0' + num : num, itemClass: val[0] && num == (0 | val[0]) ? 'timelist-active' : ''});
    }
    for(let i = 0,l = 59; i < l; i += interval){
      let num = (0 | i)
      if(val[0] == et[0] && num > et[1]) break;
      minusList.push({title: num < 10 ? '0' + num : num, itemClass: val[1] && num == (0 | val[1]) ? 'timelist-active' : ''});
    }
    return (
      <div className="timelist-wrapper">
        <lebel className="timelist-label">
          <input className={"timelist-value" + (warning || error ? ' time-error-input': '')} disabled={ disabled } value={ val.length > 0 ? val[0] + ':' + val[1] : '' } readOnly type="text" />
          <i className="timelist-icon"></i>
          <span className="timelist-clear"></span>
        </lebel>
        <div className="timelist-list">
          <div className="timelist-flex">
            { Aotoo.list({ data: hoursList, listClass: 'timelist-hourslist' }) }
            { Aotoo.list({ data: minusList, listClass: 'timelist-minuslist' }) }
          </div>
        </div>
        <div className="timelist-tips">
          { warning ? <div className="timelist-warning">{ warningText }</div> : null}
          { error ? <div className="timelist-error">{ errorText }</div> : null}
        </div>
      </div>
    )
  }
}
const Actions = {
  SETTIME: function (oState, opts){
    let curState = this.curState;
    let { startTime, endTime, time, interval } = opts
    curState.startTime = startTime || curState.startTime;
    curState.endTime = endTime || curState.endTime;
    curState.value = time || curState.value;
    curState.interval = interval || curState.interval;
    return curState
  },
  DISABLED: function (oState, bol){
    let curState = this.curState;
    if(typeof bol == 'boolean'){
      curState.disabled = bol
    }
    return curState
  },
  WARNING: function (oState, txt){
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
  ERROR: function (oState, txt){
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
}
function index(opts){
  const instance = Aotoo(Timelist, Actions)
  instance.extend({
    
  })
  instance.on('rendered', function(options){
    const {dom, _opts, ctx} = options
    let input = $(dom).find('.timelist-value');
    let hoursList = $(dom).find('.timelist-hourslist');
    let minusList = $(dom).find('.timelist-minuslist');
    let icon = $(dom).find('.timelist-icon');
    let clearBtn = $(dom).find('.timelist-clear');
    let hoursActive = hoursList.find('.timelist-active');
    let minusActive = minusList.find('.timelist-active');
    let param = instance.curState ? instance.curState : opts
    input.once('click', function (){
      if(param.disabled) return;
      $(dom).find('.timelist-list').css('visibility', 'visible');
      icon.hide();
      clearBtn.show();
      instance.$warning(false);
      instance.$error(false);
      let hoursScroll = hoursActive.length > 0 ? hoursActive.position().top : 0;
      let hChildHeight = hoursList.children().length * hoursList.children().height();
      if(hoursList.children().length > 6){
        hoursList.customscroll({scrollTop: hoursScroll, childHeight: hChildHeight});
        hoursList.customscroll('show', 'visibility')
      }
      let minusScroll = minusActive.length > 0 ? minusActive.position().top : 0;
      let mChildHeight = minusList.children().length * minusList.children().height();
      if(minusList.children().length > 6){
        minusList.customscroll({scrollTop: minusScroll, childHeight: mChildHeight});
        minusList.customscroll('show', 'visibility')
      }
    })
    function hideList(){
      $(dom).find('.timelist-list').css('visibility', '');
      icon.show();
      clearBtn.hide();
      if(hoursList.children().length > 6) hoursList.customscroll('hide', 'visibility');
      if(minusList.children().length > 6) minusList.customscroll('hide', 'visibility');
    }
    hoursList.find('.item').once('click', function (){
      let value = input.val().split(':');
      let endTime = param.endTime.split(':')
      let hours = $(this).text();
      if(hours == endTime[0] && value[1] > endTime[1]) value[1] = endTime[1]
      instance.$settime({time: $(this).text() + ':' + (value[1] || '00')});
    })
    minusList.find('.item').once('click', function (){
      let startTime = param.startTime.split(':');
      let value = input.val().split(':');
      instance.$settime({time: (value[0] || startTime[0]) + ':' + $(this).text()});
      hideList()
    })
    clearBtn.once('click', function (){
      instance.$settime({time: ''})
      hideList()
    })
    window.bindDocument([$(dom)[0]], function (){
      hideList()
    })
  })
  instance.setProps(opts)
  return instance
}

export default function timelist(options){
  let dft = {
    startTime: '00:00',
    endTime: '23:59',
    interval: 1,
    value: new Date().Format('hh:mm'),
    disabled: false,
    warning: false,
    warningText: '',
    error: false,
    errorText: '',
  }
  dft = _.merge(dft, options)
  return index(dft)
}