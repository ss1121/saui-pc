function insertDom(loadId, cb){
  if(!document.getElementById(loadId)){
    $('body').append('<div id="'+loadId+'"></div>')
  }
  if (typeof cb == 'function') {
    cb()
  }
}

class Loading extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false
    }
  }
  render() {
    return (
      <div className={'loadingx-wrap' + (!this.state.show ? ' loadingx-hide' : '') + (this.props.mask ? ' loadingx-mask' : '')}>
        <div className='loadingx-body'>
          <div className='loadingx'>
            <div className='loadingx-circle'></div>
            <div className='loadingx-logo'></div>
          </div>
          <div className='loadingx-txt'>{this.props.txt}</div>
        </div>
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
  }
}

function load(opt){
  const instance = Aotoo(Loading, Actions)
  // instance.extend({
    
  // })
  instance.setProps(opt)
  instance.$show = function (params) {
    var xxx = $('#' + opt.id + ' .loadingx-wrap').hasClass('loadingx-hide')
    if (xxx) {
      $('#' + opt.id + ' .loadingx-wrap').removeClass('loadingx-hide')
    }
  }

  instance.$hide = function (params) {
    var xxx = $('#' + opt.id + ' .loadingx-wrap').hasClass('loadingx-hide')
    if (!xxx) {
      $('#' + opt.id + ' .loadingx-wrap').addClass('loadingx-hide')
    }
  }
  
  insertDom(opt.id, function(params) {
    setTimeout(() => {
      instance.render(opt.id)
    }, 200);
  })
  return instance
}

export default function loading(opts) {
  let dft = {
    txt: '加载中...'
  }
  dft = _.merge(dft, opts)
  return load(dft)
}

export function pure(props) {
  return loading(props)
}
