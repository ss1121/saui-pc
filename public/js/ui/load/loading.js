//loading
class Loading extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.props
  }
  render() {
    return (
      <div className={!this.state.show ? 'disN' : ('loading-wrap ' + this.state.type)}>
        <div className={'loading-body ' + this.state.size}>
          <div className='loading-circle'></div>
          <div className='loading-logo'></div>
        </div>
        {this.state.title != '' ? <p className='loading-txt'>{this.state.title}</p> : ''}
      </div>
    )
  }
}

const Action = {
  RESET(ostate) {
    return ostate
  },
  Hide(ostate) {
    let curState = this.curState
    curState.show = false
    return curState
  },
  SHOW(ostate) {
    let curState = this.curState
    curState.show = true
    return curState
  },
  UPDATE(ostate, data) {
    let curState = this.curState
    curState = data
    return curState
  }
}
function loading(params) {
  let dft = {
    title: '加载中......',    //title为空是不显示标题
    type: 'tb',   //lr 左右结构 tb上下结构
    size: 'normal',   //normal普通大小 small是小loading
    show: false
  }
  let opts = Object.assign(dft, params)
  const instance = Aotoo(Loading, Action, opts)
  instance.setProps(opts)
  return instance
}
export default function (options) {
  return loading(options)
}
