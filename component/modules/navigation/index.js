class Navigation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data || [],
    }
  }
  render(){
    let { data } = this.state
    let navTree = [];
    data.map(item => {
      if(!item.parent && !item.idf) navTree.push(item)
      if(!item.parent && item.idf){
        item.title = <div className="nav-dropdown">{item.title}</div>
        navTree.push(item)
      }
      if(item.parent){
        item.itemClass = "navigation-child"
        navTree.push(item)
      }
    })
    return (
      <div className="navigation-wrapper">
        {
          Aotoo.tree({
            data: navTree,
            listClass: 'navigation-list',
            itemClass: 'navigation-item'
          })
        }
      </div>
    )
  }
}
const Actions = {

}
function index(opts){
  const instance = Aotoo(Navigation, Actions)
  instance.extend({

  })
  instance.on('rendered', function(options){
    const {dom, _opts, ctx} = options
    $(dom).find('.navigation-item').hover(
      function (e){
        $(this).find('.nav-dropdown').addClass('open')
        let start = $(dom).find('.navigation-item').eq(0).position().left;
        let left = $(this).position().left;
        let childLength = 0,paddingLeft = 0;
        $(this).find('.navigation-child').each((i,item)=>{
          childLength += $(item).outerWidth(true)
        })
        if(left + childLength > start + $(dom).find('.navigation-list').width()){
          paddingLeft = start + $(dom).find('.navigation-list').width() - childLength
        }else{
          paddingLeft = left
        }
        $(this).find('.property-ul').css({paddingLeft})
      },
      function (e){
        $(this).find('.nav-dropdown').removeClass('open')
      }
    )
  })
  instance.setProps(opts)
  return instance
}
export default function navigation(opts){
  let dft = {
    
  }
  dft = _.merge(dft, opts)
  return index(dft)
}