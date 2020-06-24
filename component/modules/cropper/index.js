class Cropper extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      src: this.props.src,
      previewCfg: this.props.previewCfg
    }
  }
  render(){
    let { src, previewCfg } = this.state
    let preview = [];
    previewCfg.map((item,i) => {
      preview.push(
        <li className="cropper-preview-item" key={'cropperPreview_' + i}>
          <div className="cropper-preview" style={{...item.size}}></div>
          {/* <p className="crropper-text">{item.size.width}X{item.size.height}像素</p> */}
        </li>
      )
    })
    let cropwrap = (
      <div className="cropper-wrapper">
        <div className="cropper-container">
          <img className="cropImg" src={ src } />
        </div>
        <div className="cropper-right">
          <p className="crropper-text">拖拽或缩放虚线框，<br />生成自己满意的图片</p>
          <ul className="cropper-preview-list">
            { preview }
          </ul>
        </div>
      </div>
    )
    return cropwrap
  }
}
const Actions = {
  SETIMG: function (ostate,src){
    let curState = this.curState;
    curState.src = src;
    return curState;
  }
}
// 初始化第三方库的实例
function init3DSLib(example, config, dom, opts, ctx){
  // example
  let cropImg = $(dom).find('.cropImg')
  if(example.curState){
    let crop = cropImg.cropper(config.config)
  }
  example.extend({
    getData: function (){
      return cropImg.cropper('getData')
    },
    crop: function (){
      let data=cropImg.cropper('getCroppedCanvas',{ minWidth: config.width, minHeight: config.height, fillColor: '#fff' });
      let type="image/jpeg"//图片/文件类型
      return data.toDataURL(type);
    },
    validCrop: function(cb){
      if (typeof cb == 'function') {
        const imgCropData = cropImg.cropper('getData', true)
        return cb.call(cropImg, imgCropData)
      }
    },
    reupload: function (src){
      cropImg.cropper('destroy').attr('src', src).cropper(config.config);
    }
  })
}
// 循环检测 cropper是否存在
function loopDetection(example, config, dom, opts, ctx){
  clearTimeout(example.loopTimmer)
  example.loopTimmer = setTimeout(function() {
    if (typeof $.fn.cropper !== 'undefined') {
      init3DSLib(example, config, dom, opts, ctx)
    } else {
      loopDetection(example, config, dom, opts, ctx)
    }
  }, 50);
}
function renderedInject(example, config){
  return function(options){
    const {dom, opts, ctx} = options
    try {
      Aotoo.inject.js('/js/t/cropper/cropper', function(){
        loopDetection(example, config, dom, opts, ctx)
      })
    } catch (error) {
      console.error('component/cropper->renderInject error');
      console.log(error);
    }
  }
}
function index(opts){
  const instance = Aotoo(Cropper, Actions)
  
  instance.loaded = false   // swiper.js 未完成载入
  instance.loopTimmer = undefined
  instance.on('rendered', renderedInject(instance, opts))
  instance.setProps(opts)
  return instance
}

export default function cropper(options){
  Aotoo.inject.css('/css/t/cropper/cropper.min')
  // 参考说明网址: https://blog.csdn.net/weixin_38023551/article/details/78792400
  let dft = {
    src: '',
    width: 80,
    height: 80,
    previewCfg:[
      {
        size: {
          width: 120,
          height: 120
        },
        class: ''
      }
    ],
    config: {
      autoCropArea: 1,
      aspectRatio: 1 / 1,
      rotatable: false,
      minContainerWidth: 80,
      minContainerHeight: 80,
      minCanvasWidth: 80,
      minCanvasHeight: 80,
      minCropBoxWidth: 80,
      minCropBoxHeight: 80,
      // checkImageOrigin: false,
      preview: '.cropper-preview',
      zoomOnWheel: false,
      zoomOnTouch: false
    },
    crop: function() {}
  }
  dft = _.merge(dft, options)
  return index(dft)
}