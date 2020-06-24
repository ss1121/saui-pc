class CountBase extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      num: this.props.initnum || 0,
      maxnum: this.props.maxnum,
    }
  }
  render(){
    let num = this.state.num
    return(
      <div className='count'>
        <span className='count-remove'>-</span>
        <input type='text' value={num}/>
        <span className='count-add'>+</span>
        <i className='count-tip'></i>
      </div>
    )
  }
}

const Actions = {
  ADD: function(state,props){
    let num = this.curState.num
    const maxnum = this.curState.maxnum
    if(num < this.curState.maxnum){
      num++
      this.curState.num = num
    }
    return this.curState
  },
  REMOVE: function(state,props){
    let num = this.curState.num
    if(num > state.num){
      num--
      this.curState.num = num
    }
    return this.curState
  }
}

function App(config) {
  const appInst = Aotoo(CountBase, Actions)
  appInst.extend({
    add(){
      this.$add()
    },
    remove(){
      this.$remove()
    }
  })
  return appInst
}

export default function count(opts){
  let noop = function(){}
  let dft = {
    theme: 'count',
    clsname: '',
    props: false,
    itemMethod: ''
  }
  if (typeof opts == 'object') dft = _.merge(dft, opts)
  return App(dft)
}

export function pure(props){
  return count(props)
}
