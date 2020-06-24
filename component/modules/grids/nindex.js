/**
 * 列表
 */
class GridsBase extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      data: this.props.data||[]
    }
  }

  render(){
    const itemClassName = this.props.itemClass
    const listClassName = this.props.listClass
    
    const list = this.state.data.map( (item, ii)=>{
      const _key = _.uniqueId('grids_')
      return <li className={"grids_item "+(itemClassName||'')} key={_key}>{item}</li>
    })
    return (
      <div className={"grids_wrap "+(listClassName ? listClassName+'_parent':'')}>
        <ul className={"grids_list "+(listClassName||'')}>
          {list}
        </ul>
      </div>
    )
  }
}

const Actions = {
  REPLACE: function(state, props){   // state = ostate, props=传进来的参数
    if (!props) return
    if (typeof props == 'string' || typeof props == 'number' || React.isValidElement(props)){
      state.data[0] = props
    }
    if (props.index) {
      state.data[props.index] = props.content
    }
    return state
  }
}


function myGrids(opts){
  if (opts.props) {
    opts.props.data = opts.data||[]
  } else {
    opts.props = {
      data: opts.data||[]
    }
  }
  const Gridx = Aotoo(GridsBase, Actions, opts)
  Gridx.extend({
    replace: function(partment){
      this.$replace(partment)
    }
  })
  return Gridx
}

export function grids(opts){
  let noop = function(){}
  let dft = {
    data: [],
    theme: 'grids',
    autoinject: true,
    props: false,
    container: false
  }
  if (typeof opts == 'object') dft = _.merge(dft, opts)
  return myGrids(dft)
}

export function pure(props){
  return grids(props)
}
