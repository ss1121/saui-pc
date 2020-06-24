import 'component/modules/popup/jq'

class DragsortTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data
    }
  }
  render() {
    let { head, nullTxt } = this.props;
    let { data } = this.state
    let header = Aotoo.list({
      data: head.data,
      listClass: 'dragsortTable-header ' + (head.listClass || '')
    })
    let bodys = [];
    if(data.length >= 1){
      data.map((item,index) => {
        let rows = []
        item.map((it, ii) => {
          if(!_.isArray(it)){
            if(ii == 0){
              rows.push({title: <div className="dragsortTable-dragsort"><span className="dragsortTable-tips"><i className="iconfont icon-dragsort"></i></span><span className="dragsortTable-more">更多</span>{ it.title }</div>})
            }else{
              rows.push(it)
            }
          }else{
            let childArr = [];
            it.map((child,cIndex) => {
              childArr.push({
                title: <div className="dragsortTable-child"><div className="dragsortTable-child-rows"><span className="dragsortTable-dragsort"><span className="dragsortTable-tips"><i className="iconfont icon-dragsort"></i></span></span><span>{ child.title }</span></div></div>,
                attr: {index: index + '-' + ii + '-' + cIndex}
              })
            })
            rows.push({title: Aotoo.list({data: childArr, listClass: "dragsortTable-children-table disN"}), itemClass: 'dragsortTable-w50'})
          }
        })
        bodys.push({title: <div className="dragsortTable-parent" data-more="hide">{ Aotoo.list({data: rows, listClass: 'dragsortTable-rows'}) }</div>, attr: {index}})
      })
    }else{
      bodys.push(<div className="dragsortTable-null">{ nullTxt || '暂无数据' }</div>)
    }
    return (
      <div className="dragsortTable-wrapper">
        { header }
        {
          Aotoo.list({
            data: bodys,
            listClass: 'dragsortTable-body',
          })
        }
      </div>
    )
  }
}
const Actions = {
  EXCHANGE: function (oState, obj){
    let curState = this.curState;
    if(obj[0].length == 1){
      let itIndex = Number(obj[0][0])
      let tgIndex = Number(obj[1][0])
      let item = curState.data[itIndex]
      if(itIndex < tgIndex){
        curState.data.splice(tgIndex + 1, 0, item)
        curState.data.splice(itIndex, 1)
      }
      if(itIndex > tgIndex){
        curState.data.splice(tgIndex, 0, item)
        curState.data.splice(itIndex + 1, 1)
      }
    }
    if(obj[0].length == 3){
      let itIndex = obj[0];
      let tgIndex = obj[1];
      let item = curState.data[itIndex[0]][itIndex[1]][itIndex[2]];
      if(Number(itIndex[2]) < Number(tgIndex[2])){
        curState.data[tgIndex[0]][tgIndex[1]].splice(Number(tgIndex[2]) + 1, 0, item);
        curState.data[itIndex[0]][itIndex[1]].splice(Number(itIndex[2]), 1);
      }
      if(Number(itIndex[2]) > Number(tgIndex[2])){
        curState.data[tgIndex[0]][tgIndex[1]].splice(Number(tgIndex[2]), 0, item);
        curState.data[tgIndex[0]][tgIndex[1]].splice(Number(itIndex[2]) + 1, 1);
      }
    }
    return curState
  },
  UPDATE: function (oState, opts){
    let curState = this.curState;
    curState.data = opts.data || curState.data;
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
    top: -(pos2.top - pos1.top)
  }
}
function index(opts){
  const instance = Aotoo(DragsortTable,Actions)
  //组件props
  instance.setProps(opts)
  instance.extend({
    getData: function (){
      let data = this.curState ? this.curState.data : opts.data
      return data;
    }
  })
  instance.on('rendered', function(options){
    const {dom, _opts, ctx} = options
    $(dom).find('.dragsortTable-dragsort').once('mousedown', function (e){
      let { pageY, offsetY } = e
      $(dom).find('.dragsortTable-tips').popup('hide')
      let that = $(this);
      let parent,table,row;
      if($(this).parents('.dragsortTable-child').length > 0){
        parent = $(this).parents('.dragsortTable-child');
        table = $(this).parents('.dragsortTable-children-table');
        row = '.dragsortTable-child';
      }else{
        parent = $(this).parents('.dragsortTable-parent');
        table = $(this).parents('.dragsortTable-body');
        row = '.dragsortTable-parent';
      }
      let isMove = false;
      let winH = $(window).height();
      $(document).once('mousemove', function (e){
        if(e.pageY > (pageY + 3) || e.pageY < (pageY - 3)){
          $(dom).find('.dragsortTable-tips').popup('hide')
          if(parent.hasClass('dragsortTable-parent')){
            $(dom).find('.dragsortTable-parent').attr('data-more', 'hide').find('.dragsortTable-children-table').addClass('disN');
            $(dom).find('.dragsortTable-more').html('更多');
          }
          let pWidth = parent.outerWidth();
          let pHeight = parent.outerHeight();
          let container = parent.parent();
          container.css({
            width: pWidth,
            height: pHeight + 1
          })
          parent.css({
            position: 'absolute',
            width: pWidth,
            height: pHeight,
            top: e.pageY - container.offset().top - pHeight / 2,
            border: '1px solid #e5e5e5',
            cursor: 'move',
            zIndex: 3
          });
          let scItem;
          that.parents().each((i,item)=>{
            let overflow = $(item).css('overflow');
            let overflowY = $(item).css('overflow-y');
            if(overflow == 'auto' || overflowY == 'auto' || overflow == 'scroll' || overflowY == 'scroll'){
              scItem = item;
              return false;
            }
          })
          let scItemScroll = $(scItem || window).scrollTop()
          if(e.pageY < 30){
            $(scItem || window).scrollTop(scItemScroll - 10);
          }
          if(e.pageY >= winH - 30){
            if(scItemScroll <= $(dom).outerHeight() - winH){
              $(scItem || window).scrollTop(scItemScroll + 10);
            }
          }
          isMove = true;
        }
      })
      $(document).once('mouseup', function (){
        $(document).off('mousemove mouseup');
        $(dom).find('.dragsortTable-tips').popup('hide')
        if(isMove){
          let target = findItem(table,that);
          if(target && target != parent[0]){
            let containerOffSet = parent.parent().offset();
            let targetOffset = $(target).offset();
            let thatIndex = parent.parent().attr('data-index').split('-');
            let targetIndex = $(target).attr('data-index').split('-');
            parent.animate(itemposition(targetOffset, containerOffSet),300, function (){
              parent.css({
                position: '',
                top: '',
                width: '',
                height: '',
                border: '',
                cursor: '',
                zIndex: ''
              })
            })
            let pIndex = parent.parent().index();
            let tIndex = $(target).index();
            let tItem = parent.parent().parent().find('>.item');
            if(pIndex < tIndex){
              for(let i = pIndex + 1,l=tIndex; i <= l;i ++){
                let tWidth = tItem.eq(i).outerWidth()
                let tHeight = tItem.eq(i).outerHeight()
                tItem.eq(i).css({
                  width: tWidth,
                  height: tHeight
                }).find(row).css({
                  position: 'absolute',
                  width: tWidth,
                  height: tHeight,
                }).animate({top: -tHeight},300, function(){
                  tItem.eq(i).css({
                    width: '',
                    height: ''
                  }).find(row).css({
                    position: '',
                    width: '',
                    height: '',
                    top: ''
                  })
                  if(i == l){
                    instance.$exchange([thatIndex,targetIndex])
                  }
                })
              }
            }
            if(pIndex > tIndex){
              for(let i = pIndex - 1,l=tIndex; i>=l;i--){
                let tWidth = tItem.eq(i).outerWidth()
                let tHeight = tItem.eq(i).outerHeight()
                tItem.eq(i).css({
                  width: tWidth,
                  height: tHeight
                }).find(row).css({
                  position: 'absolute',
                  width: tWidth,
                  height: tHeight,
                }).animate({top: tHeight},300, function(){
                  tItem.eq(i).css({
                    width: '',
                    height: ''
                  }).find(row).css({
                    position: '',
                    width: '',
                    height: '',
                    top: ''
                  })
                  if(i == l){
                    instance.$exchange([thatIndex,targetIndex])
                  }
                })
              }
            }
          }else{
            parent.animate({top: 0},300,function (){
              parent.css({
                position: '',
                top: '',
                width: '',
                height: '',
                border: '',
                cursor: '',
                zIndex: ''
              })
            })
          }
        }else{
          if(parent.hasClass('dragsortTable-parent')){
            let moreType = parent.attr('data-more')
            if(moreType == 'hide'){
              parent.parent().css({width: '', height: ''})
              parent.find('.dragsortTable-more').html('收起')
              parent.attr('data-more', 'show').find('.dragsortTable-children-table').removeClass('disN');
            }else{
              parent.attr('data-more', 'hide').find('.dragsortTable-children-table').addClass('disN');
              parent.find('.dragsortTable-more').html('更多')
            }
          }
        }
      })
    })
    $(dom).find('.dragsortTable-tips').popup({
      content: '上下拖拽图标，更改展示顺序',
      // hoverPopup: true,
    })
  })
  return instance
}

export default function dragsortTable(opts) {
  let dft = {
    head: [],
    data: [],
  }
  dft = _.merge(dft, opts)
  return index(dft)
}