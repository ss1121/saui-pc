Aotoo.inject.js([
  'window.HOST_TYPE=2',
  'https://api.map.baidu.com/getscript?v=2.0&ak=GbZ9L4SoO5GGdE1ZzayWCbFhtVxELNBV&s=1&services=&t='+new Date().Format('yyyyMMddhhmmss')
  // '//maps.google.cn/maps/api/js?key=AIzaSyAphZhi7uxHZUMqKehFHd-qceRRPA4skV4&libraries=places'
], waitForInject)

const waitForQueue = []
let injectTimmer
let injectFailed = true

function waitForInject(callback) {
  if (Aotoo.isClient) {
    if (typeof callback === 'function') {
      waitForQueue.push(callback)
    }
    
    if (typeof BMap != 'undefined' || (typeof google != 'undefined' && typeof google.map != 'undefined')) {
      clearTimeout(injectTimmer)
      if (injectFailed) {
        injectFailed = false
        setTimeout(() => {
          if (waitForQueue && waitForQueue.length) {
            const method = waitForQueue.shift()
            method()
            if (waitForQueue && waitForQueue.length) {
              waitForInject()
            }
          }
        }, 100);
      } else {
        if (waitForQueue && waitForQueue.length) {
          const method = waitForQueue.shift()
          method()
          if (waitForQueue && waitForQueue.length) {
            waitForInject()
          }
        }
      }
    } else {
      injectTimmer = setTimeout(() => {
        waitForInject()
      }, 200);
    }
  }
}

class Maps extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mapWidth: this.props.mapWidth,
      mapHeight: this.props.mapHeight
    }
  }
  render (){
    return (
      <div className="map-wrapper" style={{width: this.state.mapWidth, height: this.state.mapHeight}}>
        <div id="map_content" style={{width: '100%', height: '100%'}}></div>
      </div>
    )
  }
}
const Actions = {
  UPDATE: function (ostate, data){
    let curState = this.curState
    curState.data = data;
    return curState
  }
}

function getCoordinates(example, opts){
  let { lng, lat, scale } = opts
  $.ajax({
    type:'get',
    dataType: "jsonp",
    url:`//api.map.baidu.com/geoconv/v1/?coords=${ lng },${ lat }&from=3&to=5&ak=GbZ9L4SoO5GGdE1ZzayWCbFhtVxELNBV&s=1`,
    async: false,
  }).then((res)=>{
    if(res && res.status == 0){
      example.map.centerAndZoom(new BMap.Point(res.result[0].x, res.result[0].y), scale);
    }
  })
}

function Overlay(example, data, func){
  function ComplexCustomOverlay(point, text, color, zIndex, method){
    this._point = point;
    this._text = text;
    this._color = color
    this.zIndex = zIndex
    this._method = method
  }
  ComplexCustomOverlay.prototype = new BMap.Overlay();
  ComplexCustomOverlay.prototype.initialize = function(map){
    this._map = map;
    var div = this._div = document.createElement("div");
    $(div).html(this._text).css({
      position: "absolute",
      zIndex: this.zIndex,
      backgroundColor: '#fff',
      color: this._color,
      padding: '6px 8px',
      whiteSpace: 'nowrap',
      MozUserSelect: 'none',
      fontSize: 12,
      fontWeight: 'bold',
      boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.35)',
      cursor: 'pointer'
    }) 
    var arrow = this._arrow = document.createElement("div");
    $(arrow).css({
      position: 'absolute',
      border: '6px solid #fff',
      transform: 'rotate(45deg)',
    })
    let that = this
    $(div).once('mouseenter', function (){
      $(this).css({color: '#ff7e11', zIndex: 2});
    }).once('mouseleave', function (){
      $(this).css({color: that._color, 'zIndex': ''});
    })
    div.appendChild(arrow);
    var method = this._method;
    if(method){
      $(div).once('mousedown', function (down){
        let x = down.pageX, y = down.pageY;
        $(div).once('mouseup', function (up){
          let x2 = up.pageX, y2 = up.pageY, dragsort = false;
          if(x2 > x + 2 || x2 < x - 2 || y2 > y + 2 || y2 < y - 2){
            dragsort = true;
          }
          if(!dragsort){
            method(up)
          }
        })
      })
      // $(div).once('click', method)
    }
    example.map.getPanes().labelPane.appendChild(div);
    
    return div;
  }
  ComplexCustomOverlay.prototype.draw = function(){
    var map = this._map;
    var pixel = map.pointToOverlayPixel(this._point);
    let width = $(this._div).outerWidth()
    let height = $(this._div).outerHeight()
    $(this._div).css({
      left: pixel.x - width / 2,
      top: pixel.y - 38
    })
    $(this._arrow).css({
      left: width / 2 - 6,
      top: height - 6
    })
  }
  data.map(item => {
    var myCompOverlay = new ComplexCustomOverlay(new BMap.Point(item.lng,item.lat), item.title, item.color || '', item.zIndex || 1, item.method || undefined);
    example.map.addOverlay(myCompOverlay);
  })
}

function renderedInject(example, cfg){
  return function(options){
    const {dom, opts, ctx} = options
    waitForInject(()=>{
      if(!example.loaded){
        const _inst = cfg.mapType == 1 ? new BMap.Map("map_content", { enableMapClick: false }) : new map.Map(document.getElementById('map_content'))
        example.map = _inst;
        example.loaded = true;
        example.emit('loaded', { map: _inst })
      }
      if(cfg.mapType == 1){
        let config = example.curState || cfg
        if(config.data.length <= 0) return false
        let { lng, lat, scale } = config.data[0]
        example.map.centerAndZoom(new BMap.Point(lng, lat), scale);

        function ZoomControl(){
          // 默认停靠位置和偏移量
          this.defaultAnchor = BMAP_ANCHOR_TOP_LEFT;
          this.defaultOffset = new BMap.Size(10, 10);
        }
      
        // 通过JavaScript的prototype属性继承于BMap.Control
        ZoomControl.prototype = new BMap.Control();
      
        // 自定义控件必须实现自己的initialize方法,并且将控件的DOM元素返回
        // 在本方法中创建个div元素作为控件的容器,并将其添加到地图容器中
        ZoomControl.prototype.initialize = function(map){
          // 创建一个DOM元素
          var div = document.createElement("div");
          // 添加文字说明
          $(div).addClass('map-scale')
          $(div).html(`
            <button class="map-plus"></button>
            <button class="map-minus"></button>
          `)
          $(div).find('button').once('click', function (){
            let num
            if($(this).hasClass('map-plus')){
              num = 1
            }else{
              num = -1
            }
            example.map.setZoom(example.map.getZoom() + num);
          })
          // 添加DOM元素到地图中
          example.map.getContainer().appendChild(div);
          // 将DOM元素返回
          return div;
        }
        // 创建控件
        var myZoomCtrl = new ZoomControl();
        // 添加到地图当中
        example.map.addControl(myZoomCtrl);
        Overlay(example, config.data)
      }
    })
  }
}
function index(opts){
  const instance = Aotoo(Maps, Actions, opts)
  instance.extend({
    centerAndZoomIn: function (opt){
      let config = this.curState || opts
      this.map.clearOverlays()
      config.data.map(item => {
        item.zIndex = 1
        if(item.id == opt.id){
          item.color = opt.color
          item.zIndex = 2
          this.map.panTo(new BMap.Point(item.lng, item.lat));
          this.map.setZoom(item.scale)
        }
      })
      Overlay(this, config.data)
    },
    centerAndZoomOut: function(_id){
      let config = this.curState || opts
      this.map.clearOverlays()
      config.data.map(item => {
        if(item.id == _id){
          item.color = ''
          item.zIndex = 1
        }
      })
      Overlay(this, config.data)
    }
  })
  instance.map = instance.map || undefined
  instance.waitForQueue = []
  instance.loaded = false
  instance.injectTimmer = undefined
  instance.injectFailed = true
  instance.setProps(opts)
  instance.on('rendered', renderedInject(instance, opts))
  return instance
}

export default function _map(opts){
  let dft = {
    mapType: 1
  }
  dft = _.merge(dft, opts)
  return index(dft)
}