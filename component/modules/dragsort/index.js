class Dragsort extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data
    }
  }
  render() {
    let that = this
    //生成组件
    let dragData = [];
    that.state.data.map((item,i)=>{
      dragData.push({title:<div className="dragsort-border"><div className="dragsort-item">{item.title}</div></div>,attr: item.attr || ''})
    })
    return Aotoo.list({
      data: dragData,
      listClass: 'dragsort-list ' + (this.props.listClass || ''),
      itemClass: 'dsItem ' + (this.props.itemClass || ''),
    })
  }
}
const Actions = {
  EXCHANGE:function (ostate,obj){
    let curState = this.curState
    let item = curState.data[obj[0]]
    let target = curState.data[obj[1]]
    curState.data[obj[0]] = target
    curState.data[obj[1]] = item
    return curState
  },
  UPDATE: function (ostate,data){
    let curState = this.curState
    curState.data[data.index] = data.data
    return curState
  },
  DELETE: function (ostate,index){
    let curState = this.curState
    curState.data.splice(index,1)
    return curState
  },
  PUSH: function (ostate,data){
    let curState = this.curState
    curState.data.push(data)
    return curState
  }
}
//碰撞检测
function colTest(item1,item2){
  let t1 = $(item1).offset().top;
  let r1 = $(item1).outerWidth() + $(item1).offset().left;
  let b1 = $(item1).outerHeight() + $(item1).offset().top;
  let l1 = $(item1).offset().left;

  let t2 = $(item2).offset().top;
  let r2 = $(item2).outerWidth() + $(item2).offset().left;
  let b2 = $(item2).outerHeight() + $(item2).offset().top;
  let l2 = $(item2).offset().left;

  if(t1>b2||r1<l2||b1<t2||l1>r2){
    return false;
  }else{
    return true;
  }
}
//勾股定理求距离
function getDis(item1,item2){
  let a = $(item1).offset().left- $(item2).offset().left;
  let b = $(item1).offset().top-$(item2).offset().top;
  return Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
}
//找到距离最近的
function findItem(dom,item){
  let minDis = 999999999;
  let minIndex = -1;
  let arr = $(dom).children()
  arr.each((i)=>{
    if(item == arr[i]) return true
    if(colTest(item,arr[i])){
      let dis = getDis(item,arr[i]);
      if(dis<minDis){
        minDis = dis;
        minIndex = i;
      }
    }
  })
  if(minIndex==-1){
    return null;
  }else{
    return arr[minIndex];
  }
}
function itemposition(pos1,pos2){
  return {
    left: -(pos2.left - pos1.left),
    top: -(pos2.top - pos1.top)
  }
}
function index(opts){
  const instance = Aotoo(Dragsort,Actions)
  //组件props
  instance.setProps(opts)
  instance.extend({
    update: function (data,index){
      this.$update({
        data: data,
        index: index
      })
    },
    delete: function (index){
      this.$delete(index)
    }
  })
  instance.on('rendered', function(options){
    const {dom, _opts, ctx} = options
    let item = $(dom).find('.dsItem')

    $(dom).find('.dragsort-item').once('mousedown',function (e){
      let { pageX, pageY, offsetX, offsetY } = e
      let that = $(this)
      let parent = $(this).parents('.dsItem')
      let border = $(this).parents('.dragsort-border')
      let isMove = false;
      if(opts.mousedown) opts.mousedown(e)
      if(item.size() > 1){
        $(document).once('mousemove',function (e){
          if(e.pageX > (pageX + 3) || e.pageX < (pageY - 3) || e.pageY > (pageY + 3) || e.pageY < (pageY - 5)){
            that.css({
              left: e.pageX - parent.offset().left - offsetX,
              top: e.pageY - parent.offset().top - offsetY,
              cursor: 'move',
              zIndex: 3
            });
            border.css({border: '1px dashed #ccc'})
            let target = findItem(dom,that)
            if(target){
              $(target).find('.dragsort-border').addClass('active');
              $(target).siblings().find('.dragsort-border').removeClass('active');
            }else{
              $(dom).find('.dragsort-border').removeClass('active')
            }
            isMove = true;
            if(opts.mousemove) opts.mousemove(e,that)
          }
        })
      }
      $(document).once('mouseup',function (e){
        $(document).off('mousemove mouseup');
        let target = findItem(dom,that);
        if(target && target != parent[0]){
          let parentOffset = parent.offset();
          let targetOffset = $(target).offset();
          let thatIndex = parent.index();
          let targetIndex = $(target).index();
          $(that).animate(itemposition(targetOffset,parentOffset),300,function (){
            $(that).css({cursor: '',zIndex: ''})
            border.css({border: ''})
          })
          $(target).find('.dragsort-item').animate(itemposition(parentOffset,targetOffset),300,function (){
            $(target).find('.dragsort-border').removeClass('active').find('.dragsort-item').css({zIndex: ''})
            instance.$exchange([thatIndex,targetIndex])
            $(that).css({left: 0,top: 0})
            $(target).find('.dragsort-item').css({left: 0,top: 0})
            if(opts.mouseup) opts.mouseup(e,that,isMove,[thatIndex,targetIndex])
          })
        }else{
          $(that).animate({left: 0,top: 0},300,function (){
            border.css({border: ''})
            $(that).css({cursor: '',zIndex: ''})
          })
          if(opts.mouseup) opts.mouseup(e,that,isMove,[])
        }
      })
    })
  })
  
  return instance
}

export default function dragsort(opts) {
  let dft = {
    data: [],
    exchange: false,
  }
  dft = _.merge(dft, opts)
  return index(dft)
}