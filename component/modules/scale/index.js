function insertDom(id, cb){
  if(!document.getElementById(id)){
    $('body').append('<div id="'+id+'"><div class="scale-close">&times;</div><div class="scale-body"></div></div>')
  }
  if (typeof cb == 'function') {
    cb()
  }
}

class Scale extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data || []
    }
  }
  render() {
    let scaleList = []
    this.state.data.map( (item,i) => {
      scaleList.push({
        title: 
        <div className="scale-item">
          {item.title ? <div className='scale-title'>{item.title}</div> : ''}
          {item.src ? <div className="scale-img">
            { !this.props.isImg ? <div className="scale-thumbnail" style={{backgroundImage: "url("+item.src+")"}}></div> : <img className="scale-thumbnail" src={item.src} />}
            <i className="iconfont icon-enlarge"></i>
          </div> : ''}
          {item.desc ? <div className='scale-desc'>{item.desc}</div> : ''}
        </div>,
        itemClass: item.itemClass || ''
      })
    })
    return (
      this.list({
        data: scaleList,
        listClass: 'scale-list2 ' + (this.props.listClass || ''),
        itemClass: 'scale-imgs ' + (this.props.itemClass || '')
      })
    )
  }
}
const Actions = {

}

function scale(opt){
  const instance = Aotoo(Scale, Actions)
  instance.extend({
    
  })
  instance.setProps(opt)
  instance.on('rendered', function(options){
    insertDom('Scale')
    const {dom, _opts, ctx} = options
    $(dom).find('.scale-img').once('click',function (){
      const index = $(this).parents('.scale-imgs').index()
      opt.data[index];
      $('body').addClass('fo').find('#Scale').addClass('scale-show').find('.scale-body').html('<img src="'+(opt.data[index].bSrc || opt.data[index].src)+'" />')

    })
    $('body').find('.scale-body').once('click',function (e){
      e.stopPropagation()
    })
    $('body').find('#Scale, .scale-close').once('click',function (){
      $('body').removeClass('fo').find('#Scale').removeClass('scale-show')
    })
  })
  return instance
}

export default function _scale(opts) {
  Aotoo.inject.css([
    `/css/m/scale`
  ])
  let dft = {
    
  }
  dft = _.merge(dft, opts)
  return scale(dft)
}