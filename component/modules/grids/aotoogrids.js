class Grids extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      data: this.props.data||[]
    }
  }

  render(){
    const listClass = this.props.listClass
    const itemClass = this.props.itemClass
    return Aotoo.list({
      data: this.state.data,
      listClass,
      itemClass
    })
  }
}

const Actions = {
  REPLACE: function(ostate, param) {
    let state = this.curState
    if (Aotoo.isObject(param)) {
      if (param.index) {
        state.data[param.index] = param.content||param.data
      } else {
        state.data = param.data||state.data
      }
      return state
    }
  }
}

const defts = {
  props: {
    data: [''],
    itemMethod: '',
    listMethod: '',
    rendered: '',
    itemClass: 'grids-item',
    listClass: 'grids'
  }
}

module.exports = function(params) {
  const props = Aotoo.merge({}, defts.props, params)
  const grids = Aotoo(Grids, Actions)
  grids.setProps(props)
  grids.replace = grids.$replace
  return grids
}