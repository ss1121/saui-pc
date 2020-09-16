function insertDom(id, cb){
  if(!document.getElementById(id)){
    $('body').append('<div id="'+id+'"><div class="scale-close"></div><div class="scale-body"></div></div>')
    $('.scale-close').once('click',function (){
      $('#'+id).css('visibility','hidden')
    })
  }
  if (typeof cb == 'function') {
    cb()
  }
}

class Scale extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: props.data
    }
  }
  render(){
    let that = this;
    let imgList = []
    that.state.data.map(item => {
      imgList.push(<img className="scale-img" src={item.src} draggable="false" />)
    })
    return (
      <div id="Scale-swiper" className="swiper-container Scale-swiper">
        {
          Aotoo.list({
            data: imgList,
            itemClass: 'swiper-slide',
            listClass: 'swiper-wrapper'
          })
        }
        { imgList.length > 1 ? <div className="swiper-button-prev"></div> : '' }
        { imgList.length > 1 ? <div className="swiper-button-next"></div> : '' }
        { imgList.length > 1 ? <div className="swiper-pagination"></div> : '' }
      </div>
    )
  }
}
const Actions = {
  PUSH: function (ostate,data){
    let curState = this.curState;
    data.map(item => {
      curState.data.push(item)
    })
    return curState
  },
  UPDATE: function (ostate,data){
    let curState = this.curState;
    curState.data = data;
    return curState;
  }
}
function init3DSLib(Swiper, example, cfg, dom, opts, ctx){
  // if(!example.loaded){
    let size = $(dom).find('.swiper-slide').length > 1
    if(size){
      example.swiper = null;
      let isMove = false;
      let pagination = {
        el: '.swiper-pagination',
      }
      let navigation = {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      }
      let startCoord;
      const swp = new Swiper('#Scale-swiper',{
        loop: true,//无限模式
        speed: 1000, //切换动画的速度
        navigation: navigation,
        pagination: pagination,
        noSwipingSelector: '.swiper-button-prev,swiper-button-next',
        paginationClickable: true,//分页是否可以点击
        on:{
          touchStart: function (even){
            startCoord = {
              x: even.pageX,
              y: even.pageY
            }
            isMove = false;
          },
          touchMove: function (even){
            if(
                even.pageX > (startCoord.x + 3) || 
                even.pageX < (startCoord.x - 3) || 
                even.pageY > (startCoord.y + 3) || 
                even.pageY < (startCoord.y - 3)
              ){
              isMove = true;
            }
          },
          touchEnd: function (even){
            let target = $(even.target)
            let scaleImg = target.hasClass('scale-img');
            let prev = target.hasClass('swiper-button-prev')
            let next = target.hasClass('swiper-button-next')
            let paging = target.hasClass('swiper-pagination-bullet')
            if(!isMove){
              if(!scaleImg && !prev && !next && !paging){
                console.log('aaaaaaa')
                $('#Scale').css('visibility','hidden')
              }
            }
          }
        }
      })
      example.swiper = swp
      example.loaded = true;
      example.emit('loaded', { uploader: swp })
    }else{
      $('.scale-body').once('click',function (e){
        let target = $(e.target)
        let scaleImg = target.hasClass('scale-img');
        if(!scaleImg){
          $('#Scale').css('visibility','hidden')
        }
      })
    }
  // }
}

function loopDetection(example, cfg, dom, opts, ctx){
  clearTimeout(example.loopTimmer)
  example.loopTimmer = setTimeout(function() {
    if (typeof Swiper != 'undefined') {
      setTimeout(()=>{
        init3DSLib(Swiper, example, cfg, dom, opts, ctx)
      },100)
    } else {
      loopDetection(example, cfg, dom, opts, ctx)
    }
  }, 50);
}

function renderedInject(example, cfg){
  return function(options){
    const {dom, opts, ctx} = options
    try {
      Aotoo.inject.js('/js/t/swiper4.js', function(){
        loopDetection(example, cfg, dom, opts, ctx)
      })
    } catch (error) {
      console.error('component/scalex->renderInject error');
      console.log(error);
    }
  }
}

function index(opts){
  const instance = Aotoo(Scale, Actions)

  instance.extend({
    show:function (index){
      index = 0 | index;
      $('#Scale').css('visibility','visible')
      let size = $('.swiper-slide').length > 1
      if(size){
        if(this.swiper.updateSlides) this.swiper.updateSlides();
        if(this.swiper.pagination.update) this.swiper.pagination.update();
        if(this.swiper.navigation.update) this.swiper.navigation.update();
        this.swiper.slideTo(index + 1,0);
      }
    },
    update: function (data){
      this.$update(data)
    },
    push: function (data){
      this.$push(data)
    }
  })
  instance.loaded = false;
  instance.swiper = instance.swiper || undefined
  instance.loopTimmer = undefined
  instance.on('rendered', renderedInject(instance, opts))
  instance.setProps(opts)
  insertDom('Scale',function (){
    setTimeout(()=>{
      instance.render($('.scale-body')[0])
    },200)
  })
  return instance
}
export default function calendar(options){
  // Aotoo.inject.css([
  //   `/css/m/scalex`
  // ])
  let dft = {
    data: []
  }
  dft = _.merge(dft, options)  
  return index(dft)
}