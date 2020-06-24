import 'component/modules/customScroll'

class ScrollTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data,
      checked: this.props.checked,
      itemHeightClass: this.props.itemHeightClass,
      scrollHeightClass: this.props.scrollHeightClass,
    }
  }
  render(){
    let { head } = this.props;
    let { data, checked, itemHeightClass, scrollHeightClass } = this.state;
    let headList = head;
    headList.unshift({
      title: (
        <div className="c-check item-li-wrap row-flex-center">
          <input type="checkbox" className="lsb-ck scrollTable-checkedAll" />
          <span className="fkp-checkbox-box"></span>
        </div>
      )
    })
    let header = Aotoo.list({
      data: head,
      listClass: 'scrollTable-header'
    })
    let tableList = [];
    data.map((item,i) => {
      let dataItem = [item]
      if (item.checkbox != false) dataItem.unshift({
        title: (
          <div className="c-check item-li-wrap row-flex-center">
            <input className="scrollTable-checkbox lsb-ck" defaultChecked={item.checked} disabled={item.disabled} type="checkbox" data-index={i} />
            <span className="fkp-checkbox-box"></span>
          </div>
        )
      })
      tableList.push(Aotoo.list({data: dataItem, listClass: 'scrollTable-tableItem'}))
    })
    let table = Aotoo.list({
      data: tableList,
      itemClass: itemHeightClass,
      listClass: 'scrollTable-table ' + (scrollHeightClass || '')
    })
    let { head: cHead, data: cData } = checked
    let checkedHead = Aotoo.list({data: cHead, listClass: 'scrollTable-header'})
    // let checkedList = Aotoo.list({data: cData, listClass: 'scrollTable-checked-list'}) //这个list有bug,所以用下面的方式生成
    let checkedList = []
    cData.map((item,i)=>{
      checkedList.push(<li className={"item " + (itemHeightClass || '')} key={_.uniqueId('scrollTable-checked-item')}>{item.title}</li>)
    })
    return (
      <div className="scrollTable-wrapper">
        <div className="scrollTable-wrap">
          { header }
          { table }
        </div>
        <div className="scrollTable-wrap">
          { checkedHead }
          <ul className={"scrollTable-checked-list " + scrollHeightClass || ''}>{ checkedList }</ul>
        </div>
      </div>
    )
  }
}
const Actions = {
  UPDATE: function (oState, opts){
    let curState = this.curState;
    if(opts.data) curState.data = opts.data
    if(opts.checked) curState.checked = opts.checked
    return curState
  },
  CHECKALL: function (oState, check){
    let curState = this.curState;
    let data = curState.data
    if(check){
      data.map((item)=>{
        if(!item.checked && !item.disabled) curState.checked.data.push(item);
      })
      curState.checked.data = _.uniqBy(curState.checked.data, 'uniqkey');
    }else{
      data.map((item)=>{
        let ii = _.findIndex(curState.checked.data, { uniqkey: item.uniqkey });
        if(ii >= 0) curState.checked.data.splice(ii, 1)
      })
    }
    return curState
  },
  CHECKITEM: function (oState, opts){
    let curState = this.curState;
    let { index,checked } = opts
    if(checked){
      curState.checked.data.push(curState.data[index])
    }else{
      let ii = _.findIndex(curState.checked.data, { uniqkey: curState.data[index].uniqkey })
      curState.checked.data.splice(ii, 1)
    }
    return curState
  }
}
function index(opts){
  const instance = Aotoo(ScrollTable, Actions)
  instance.extend({
    getData: function (){
      return instance.curState ? instance.curState.checked.data : opts.checked.data
    }
  })
  instance.setProps(opts)
  let scrollTop = 0;
  let checklistTop = 0;
  instance.on('rendered', function(options){
    const {dom, _opts, ctx} = options
    let cAll = $(dom).find('.scrollTable-checkedAll')
    let cBox = $(dom).find('.scrollTable-checkbox:enabled')

    cAll.once('change', function (){
      let checked = $(this).prop('checked');
      if(checked){
        cBox.prop('checked', 'checked');
      }else{
        cBox.each((i,item) => {
          if(! $(item).attr('disabled')) $(item).prop('checked', false);
        })
      }
      instance.$checkall(checked);
    })
    cBox.once('change', function (){
      let index = $(this).attr('data-index');
      let checked = $(this).prop('checked');
      let ckNum = 0
      cBox.each((i,item) => {
        let ck = $(item).prop('checked')
        if(ck){
          ckNum++
        }
      });
      if(checked){
        if(ckNum == cBox.length) cAll.prop('checked', 'checked')
      }else{
        cAll.prop('checked', false)
      }
      scrollTop = $(dom).find('.scrollTable-table').scrollTop()
      checklistTop = $(dom).find('.scrollTable-checked-list').scrollTop()
      instance.$checkitem({index: Number(index), checked});
    })
    setTimeout(()=>{
      let table = $(dom).find('.scrollTable-table');
      let tableItem = table.children();
      let th = 0
      tableItem.each((i,item) => {
        th += $(item).outerHeight();
      })
      if(th > table.height()){
        table.customscroll({scrollTop: scrollTop, childHeight: th})
        table.customscroll('show', 'visibility')
        table.customscroll('scrollTop', scrollTop)
      }
      let checkList = $(dom).find('.scrollTable-checked-list');
      let checkItem = checkList.children();
      let ch = 0;
      checkItem.each((i, item) => {
        ch += $(item).outerHeight()
      })
      if(ch > table.height()){
        checkList.customscroll({scrollTop: checklistTop, childHeight: ch})
        checkList.customscroll('show', 'visibility')
      }
    },1000)
  })
  return instance
}

export default function scrollTable(options){
  let dft = {
    checked: {
      data: []
    }
  }
  dft = _.merge(dft, options)
  return index(dft)
}