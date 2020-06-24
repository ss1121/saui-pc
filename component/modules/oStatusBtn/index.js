class OStatusBtn extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      class: this.props.class || '',
      content: this.props.content || '',
      loading: false,
      disabled: this.props.disabled || false
    }
  }
  render(){
    return (<button id={this.props.id} className={'statusBtn statusBtn-'+this.props.status + ' ' + (this.state.class ? this.state.class : '') + (this.props.radius ? ' statusBtn-radius' : '')} disabled={this.state.disabled}>{this.state.loading ? <div className="iconfont icon-loading"></div> : this.props.content}</button>)
  }
}
const Actions = {
  LOADING: function (ostate){
    let curState = this.curState
    curState.loading = !curState.loading
    curState.disabled = !curState.disabled
    return curState
  }
}
function index(opts){
  const instance = Aotoo(OStatusBtn, Actions)
  instance.setProps(opts)
  instance.extend({
    loading: function (){
      let that = this
      setTimeout(function (){
        that.$loading()
      },200)
    }
  })
  instance.on('rendered', function(options){
    const {dom, _opts, ctx} = options
    if(opts.method){
      opts.method.map(item =>{
        $(dom).once(item.event,function (){
          item.fn(instance);
        })
      })
    }
  })
  return instance
}

export default function oStatusBtn(options){
  let dft = {
    id: '',
    class: '',
    content: '',
    radius: false,
    disabled: false
  }
  dft = _.merge(dft, options)
  return index(dft)
}