class Slide extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      wrapClass: this.props.wrapClass,
      wrapStyle: this.props.wrapStyle,
      listClass: this.props.listClass,
      itemClass: this.props.itemClass,
      list: this.props.list,
      opts: this.props.opts
    }
    
  }
  render(){
    const that = this
    const Slide = (
      <div className={"swiper-container " + that.state.wrapClass} style={that.state.wrapStyle} id={that.props.wrapId}>
        {
          Aotoo.list({
            data: that.state.list,
            itemClass: 'swiper-slide ' + that.state.itemClass,
            listClass: 'swiper-wrapper ' + that.state.listClass
          })
        }
        {that.state.opts.pageButton && that.state.list.length > 1 ? <div className="swiper-button-prev"></div> : ''}
        {that.state.opts.pageButton && that.state.list.length > 1 ? <div className="swiper-button-next"></div> : ''}
        {that.state.opts.scroll ? <div className="swiper-scrollbar"></div> : ''}
        {that.state.opts.paging ? <div className="swiper-pagination"></div> : ''}
      </div>
    )
    return Slide
  }
}
let wrapIndex = 0;
function index(props){
  wrapIndex++;
  props.wrapId = `swiper_instance_${wrapIndex}`
  const instance = Aotoo(Slide)
  instance.setProps(props)
  instance.on('rendered', function(options){
    const {dom, _opts, ctx} = options
    let timer;
    let slideNumber = $(dom).find('.swiper-slide').length
    let opts = props.opts
    if(opts.pageButton){
      if(slideNumber > 1){
        opts.prevButton = '.swiper-button-prev'
        opts.nextButton = '.swiper-button-next'
      }
    }
    if(opts.scroll){
      opts.scrollbar = '.swiper-scrollbar'
    }
    if(opts.paging){
      opts.pagination = '.swiper-pagination'
    }
    Aotoo.inject.js('/js/t/swiper3.js', function(){
      timer = setInterval(()=>{
        if(typeof Swiper != 'undefined'){
          instance.swiper = new Swiper('#'+props.wrapId, opts)
          clearInterval(timer)
          afterSwiper()
        }
      },20)
    })
    function afterSwiper(){
      if(opts.mouseStopAutoplay){
        $(dom).hover(
          function (){
            instance.swiper.stopAutoplay();
          },
          function (){
            instance.swiper.startAutoplay();
          }
        )
      }
    }
  })
  if(props.exportSwiper){
    return instance
  }
  return instance.render()
}
// var msgModalInstance
export default function slide(opts){
  // Aotoo.inject.css('/css/t/swiper3.css')
  let dft = {
    wrapClass: '',
    wrapStyle: {},
    listClass: '',
    itemClass: '',
    exportSwiper: false, //true则返回instance实例，并将swiper实例挂载为instance.swiper（因为需要兼容旧的逻辑）
    list: [],
    opts: {}
  }
  dft = _.merge(dft, opts)
  return index(dft)
  // return new Slide(dft)
}
