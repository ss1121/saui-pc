
class Wrap extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      content: this.props.content
    }
  }
  render(){
    return <div>{ this.state.content }</div>
  }
}
const Actions = {
  UPDATE: function (ostate, content){
    let curState = this.curState;
    curState.content = content;
    return curState
  }
}
function index(opts){
  const instance = Aotoo(Wrap, Actions)
  instance.on('rendered', function(options){
    const {dom, _opts, ctx} = options
  })
  instance.setProps(opts)
  return instance
}

export default function wrap(options){
  let dft = {
    content: ''
  }
  dft = _.merge(dft, options)
  return index(dft)
}