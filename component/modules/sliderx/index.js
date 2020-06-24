class Slider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data,
    }
  }
  render(){
    let sliderList = []
    let data = this.state.data
    data.map((item) => {
      sliderList.push({
        title: item,
      })
    })
    let { pagination, navigation, scrollbar } = this.props.config
    return (
      <div id={ this.props.swiperId } className={"swiper-container " + (this.props.wrapClass || '')}>
        {
          this.list({
            data: sliderList,
            itemClass: 'swiper-slide ' + (this.props.itemClass || ''),
            listClass: 'swiper-wrapper ' + (this.props.listClass || ''),
          })
        }
        { navigation ? <div className="swiper-button-prev"></div> : null }
        { navigation ? <div className="swiper-button-next"></div> : null }
        { pagination ? <div className="swiper-pagination"></div> : null }
        { scrollbar ? <div className="swiper-scrollbar"></div> : null }
      </div>
    )
  }
}
const Actions = {

}
function getConfigs(cfg){
  let config = cfg
  if(typeof config.pagination == 'boolean' && config.pagination){
    config.pagination = {
      el: '.swiper-pagination',
    }
  }else if(typeof config.pagination == 'object'){
    config.pagination.el = '.swiper-pagination'
  }
  if(typeof config.navigation == 'boolean' && config.navigation){
    config.navigation = {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  }else if(typeof config.navigation == 'object'){
    config.navigation.nextEl = '.swiper-button-next'
    config.navigation.prevEl = '.swiper-button-prev'
  }
  if(typeof config.scrollbar == 'boolean' && config.scrollbar){
    config.scrollbar = {
      el: '.swiper-scrollbar'
    }
  }else if(typeof config.scrollbar == 'object'){
    config.scrollbar.el = '.swiper-scrollbar'
  }
  return config
}
function renderMethod(example, cfg, dom, opts, ctx){

}
function init3DSLib(swp, example, cfg, dom, opts, ctx){
  if(!example.loaded){
    let cfgs = getConfigs(cfg.config)
    const _inst = new swp('#'+cfg.swiperId, cfgs)
    example.swiper = _inst
    example.loaded = true
    example.emit('loaded', { swiper: _inst })
  }
  renderMethod(example, cfg, dom, opts, ctx)
}
// 循环检测 Swiper 是否存在
function loopDetection(example, cfg, dom, opts, ctx){
  clearTimeout(example.loopTimmer)
  example.loopTimmer = setTimeout(function() {
    if (typeof Swiper !== 'undefined') {
      init3DSLib(Swiper, example, cfg, dom, opts, ctx)
    } else {
      loopDetection(example, cfg, dom, opts, ctx)
    }
  }, 50);
}
function renderedInject(example, cfg){
  return function(options){
    const {dom, opts, ctx} = options
    try {
      Aotoo.inject.css('/css/t/swiper4', function(){
        Aotoo.inject.js('/js/t/swiper4.min', function(){
          loopDetection(example, cfg, dom, opts, ctx)
        })
      })
    } catch (error) {
      console.error('component/sliderx->renderInject error');
      console.log(error);
    }
  }
}
function index(opts){
  const instance = Aotoo(Slider, Actions)
  let swiperId = _.uniqueId('swiper-')
  opts.swiperId = swiperId
  instance.extend({

  })
  instance.loaded = false   // swiper.js 未完成载入
  instance.swiper = instance.swiper || undefined
  instance.loopTimmer = undefined
  instance.on('rendered', renderedInject(instance, opts))
  instance.setProps(opts)
  return instance
}
export default function upload(options){
  let dft = {
    data: [],
    config: {

    }
  }
  dft = _.merge(dft, options)
  return index(dft)
}