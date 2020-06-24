/**
 * 列表
 */
class Stars extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      length: this.props.length||5,
      select: this.props.select|| 0,
      clsname: this.props.clsname
    }
  }

  render(){
    let starData = []
    for (let ii=1; ii<this.state.length+1; ii++) {
      if (this.state.select && (ii<= this.state.select) ) {
        starData.push({
          title: <i className='rate-full' key={'Stars_'+ii} />,
          attr: {index: ii}
        })
      } else {
        starData.push({
          title: <i key={'Stars_'+ii} />,
          attr: {index: ii}
        })
      }
    }

    const itMethod = typeof this.props.starsMethod == 'function' ? this.props.starsMethod : ''

    const lis = starData.map( (item, jj) => {
      const Tmp = Aotoo.wrap(
        <li data-index={item.attr.index}> {item.title} </li>
        , function(dom){
          $(dom).click(function(){
            const index = $(this).attr('data-index')
            if (itMethod) itMethod(index)
          })
        }
      )
      return <Tmp key={"starsli_"+jj} />
    })

    return (
      <ul className={"rate " + (this.state.clsname ? this.state.clsname: '')}>
        {lis}
      </ul>
    )
  }
}

const Actions = {
  GRADE: function(state, props){
    state.select = props.select
    return state
  }
}

function appStars(config) {
  const appInst = Aotoo(Stars, Actions, config)
  appInst.extend({
    grade(index){
      this.$grade({select: index})
    }
  })
}

export default function stars(opts){
  let noop = function(){}
  let dft = {
    length: 5,
    select: 0,
    theme: 'rate',
    clsname: '',
    autoinject: true,
    container: false,
    itemClass: '',
    itemMethod: ''
  }
  if (typeof opts == 'object') dft = _.merge(dft, opts)
  dft.props = {
    length: dft.length,
    select: dft.select,
    clsname: dft.clsname,
    starsMethod: dft.itemMethod
  }
  return new App(dft)
}

export function pure(props){
  return stars(props)
}
