class StarsX extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      length: this.props.length || 5,
      select: this.props.select || 0
    }
  }
  // componentDidMount(){
    
  // }
  render(){
    let star = []
    for(let i=0,l=this.state.length;i<l;i++){
      star.push({title:<i></i>,attr:{index:i}})
    }
    return (
      <div className="starsx">
        {this.list({
          data:star,
          listClass:'stars'
        })}
      </div>
    )
  }
}
const Actions = {
  INTERVAL: function(ostate, opts){
    let curState = this.curState
    curState.interval = opts
    return curState
  }
}
function starsx(opts){
  const instance = Aotoo(StarsX, Actions,{
    props: {
      itemDefaultMethod: function(dom){
        $(dom).find('li').hover(function (){
          let l = $(this).index()
          for(let i=0;i<=l;i++){
            $(dom).find('li').eq(i).addClass('star-solid')
          }
        },function (){
          $(dom).find('li').removeClass('star-solid')
        }).click(function (){
          $(dom).find('li').removeClass('star-full')
          let l = $(this).index()
          for(let i=0;i<=l;i++){
            $(dom).find('li').eq(i).addClass('star-full')
          }
          sessionStorage.star = l+1
        })
      }
    }
  })
  return instance
}

export default function Starsx(options){
  let dft = {
    length: 5
  }
  dft = _.merge(dft, options)
  return starsx(dft)
}

export function pure(props){
  return Starsx(props)
}