function insertDom(opts, loadId, cb){
  let { position, full } = opts
  if(!document.getElementById(loadId)){
    let load = $('<div id="'+loadId+'" class="loading-wrapper"></div>').appendTo(!full ? position : 'body')
  }
  if (typeof cb == 'function') {
    cb()
  }
}

class Loading extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      full: this.props.full,
      flex: this.props.flex,
      txt: this.props.txt,
      style: this.props.style,
      mask: this.props.mask
    }
  }
  render() {
    let { show, flex, full, mask, style, txt } = this.state
    return (
      <div className={'loading-wrap' + (!show ? ' disN' : '') + (flex ? ' loading-flex' : '') + (full ? ' loading-full': '')} style={ full ? mask : {}}>
        <div className='loading-body' style={ style }>
          <div className='loading-circle'></div>
          <div className='loading-logo'></div>
        </div>
        { txt ? <div className='loading-txt'>{ txt }</div> : '' }
      </div>
    )
  }
}
const Actions = {
  SHOW: function (ostate){
    let curState = this.curState
    curState.show = !curState.show;
    return curState
  },
  HIDE: function (ostate){
    let curState = this.curState
    curState.show = !curState.show;
    return curState
  },
  TOGGLE: function (ostate){
    let curState = this.curState
    curState.show = !curState.show;
    return curState
  },
  UPDATE: function (ostate, opts){
    let curState = this.curState
    curState = _.merge(curState, opts);
    return curState
  }
}

function index(opt){
  let loadId = _.uniqueId('loading_')
  const instance = Aotoo(Loading, Actions)
  instance.on('rendered', function(options){
    const {dom, _opts, ctx} = options
    
  })
  instance.setProps(opt)
  insertDom(opt, loadId, function(params) {
    setTimeout(() => {
      instance.render(loadId)
    }, 200);
  })
  return instance
}

export default function loading(opts) {
  let dft = {
    style: {
      width: 32,
      height: 32,
    },
    txt: ''
  }
  dft = _.merge(dft, opts)
  return index(dft)
}
