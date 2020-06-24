class Ruler extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  render() {
    const width = this.props.width //组件宽度
    const height = this.props.height //组件高度
    const scale = this.props.scale //组件当前值
    const max = this.props.max //组件最大值
    const animate = this.props.animate //组件动画属性
    const section = this.props.section //刻度分段
    const gradient = this.props.gradient //渐变
    /*组件刻度位置计算*/
    let boxShadow = ''
    /*组件刻度位置计算*/

    let numberList = [];//组件刻度值
    for(let i = 0,l=section + 1;i<l;i++){
      //生成组件刻度值
      let num = Math.round(max / section * i)
      let numStr = num.toString()
      let numlength = numStr.length
      if(num == 0){
        numberList.push(<span key={i}>{numStr}</span>)
      }else{
        numberList.push(<span key={i} style={{left: width / section * i - (numlength < 2 ? 4 : numlength == 3 ? 12 : 8)}}>{numStr}</span>)
      }
      if(gradient){
        if(i< l - 2){
          if(i < l - 3){
            boxShadow += (width / section * i - 1 < 0 ? 0 : width / section * i - 1) + 'px 0 0 0 #fff,'
          }else{
            boxShadow += (width / section * i - 1 < 0 ? 0 : width / section * i - 1) + 'px 0 0 0 #fff'
          }
        }
      }else{
        if(i < l - 1){
          boxShadow += (width / section * i - 1 < 0 ? 0 : width / section * i - 1) + 'px 0 0 0 #a90303,'
        }else{
          boxShadow += (width - 1) + 'px 0 0 0 #a90303'
        }
      }
    }
    console.log(boxShadow)
    //生成组件
    return (
      <div className={"ruler-container" + (gradient ? " ruler-gradient" : "")} style={{ width: width }}>
        <div className="ruler-wrap" style={{ width: width,height: height }}>
          <div className={"ruler-scale" + (animate ? " ruler-animate" : "")} style={{width: (animate ? 0 : scale * (width / max))}}>
            <div className="ruler-color" style={{ width: width,height: height }}></div>
            <div className="ruler-shadow" style={{ height: gradient ? height : '', boxShadow: boxShadow}}></div>
          </div>
        </div>
        <div className="ruler-number">
          { numberList }
        </div>
      </div>
    )
  }
}
const Actions = {

}

function index(id,val,width,height,max,section,animate,gradient){
  const instance = Aotoo(Ruler,Actions)
  //组件props
  instance.setProps({
    scale: val,
    width: width,
    height: height,
    max: max,
    section: section,
    animate: animate,
    gradient: gradient
  })
  instance.on('rendered', function(options){
    const {dom, _opts, ctx} = options
    if(animate){
      setTimeout(() => {
        $(dom).find('.ruler-animate').css({width: val * (width / max)})
      },100)
    }
  })
  // instance.render(id)
  // Aotoo.render(instance.render(), id)
  
  return instance.render()
}

export default function ruler(opts,val,width,height,max,section,animate,gradient) {
  Aotoo.inject.css([
    '/css/m/ruler'
  ])
  let id,v,w,h,m,s,a,g
  //适配传入参数以及默认值
  if(typeof opts == 'object'){
    id = opts.id
    v = opts.val || 0
    w = opts.width || 200
    h = opts.height || 6
    m = opts.max || 50
    s = opts.section || 5
    a = opts.animate || false
    g = opts.gradient || false
  }else if(typeof opts == 'string'){
    id = opts
    v = val || 0
    w = width || 200
    h = height || 6
    m = max || 50
    s = section || 5
    a = animate || false
    g = gradient || false
  }
  return index(id,v,w,h,m,s,a,g)
}