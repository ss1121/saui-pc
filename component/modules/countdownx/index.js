class Countdown extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      startTime: this.props.startTime,
      endTime: this.props.endTime,
      time: '',
      itemClass: this.props.itemClass,
      listClass: this.props.listClass || 'countdownx'
    }
  }
  render(){
    let { time, itemClass, listClass } = this.state
    return (
      <div className={ listClass }>
        <div className={ itemClass }>{ time }</div>
      </div>
    )
  }
}
const Actions = {
  CALC: function (ostate, time){
    let curState = this.curState;
    let date = new Date(time);
    let dateTime = ''
    if(time != 0){
      if(time > (60 * 60 * 1000)){
        let hh = date.getHours() - 8;
        dateTime = ( hh < 10 ? '0' + hh : hh)+ ':' + date.Format('mm:ss');
      }else{
        dateTime = date.Format('mm:ss');
      }
    }else{
      dateTime = '00:00';
    }
    curState.time = dateTime;
    return curState;
  },
  RESET: function (ostate,minute){
    let curState = this.curState;
    let { startTime, endTime } = curState
    curState.startTime = endTime;
    curState.endTime = new Date(endTime.getTime() + (minute * 60 * 1000));
    return curState;
  },
  UPDATE: function (ostate,opts){
    let curState = this.curState;
    let { startTime, endTime } = opts
    curState.startTime = startTime;
    curState.endTime = endTime;
    return curState;
  }
}

function index(opts){
  const instance = Aotoo(Countdown, Actions)
  instance.loaded = false;
  instance.ifstart = false;
  instance.extend({
    restart: function (minute){
      this.loaded = false;
      this.ifstart = false;
      this.$reset(minute)
    },
    update: function (start,end){
      this.loaded = false;
      this.ifstart = false;
      this.$update({
        startTime: start,
        endTime: end
      })
    }
  })
  instance.on('rendered', function (options){
    const {dom, _opts, ctx} = options
    function run(){
      instance.loaded = true;
      let { startTime, endTime } = instance.curState ? instance.curState : opts
      let today = new Date()
      if(today.getTime() > startTime.getTime()){
        if(today.getTime() < endTime.getTime()){
          if(opts.startMethod && !instance.ifstart){
            opts.startMethod()
            instance.ifstart = true
          }
          instance.$calc(endTime.getTime() - today.getTime())
          setTimeout(function (){
            run()
          },1000)
        }else{
          if(opts.endMethod){
            opts.endMethod()
          }
          instance.$calc(0)
        }
      }else{
        instance.$calc(endTime.getTime() - startTime.getTime())
        setTimeout(function (){
          run()
        },1000)
      }
    }
    if(!instance.loaded){
      run()
    }
  })
  instance.setProps(opts)
  return instance
}
export default function countdown(options){
  let today = new Date()
  let dft = {
    startTime: new Date(today.Format('yyyy-MM-dd') + ' 10:00:00'),
    endTime: new Date(today.Format('yyyy-MM-dd') + ' 10:10:00')
  }
  dft = _.merge(dft, options)  
  return index(dft)
}