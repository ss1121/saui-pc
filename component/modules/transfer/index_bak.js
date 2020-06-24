import List from 'component/widgets/listView'
import baseX from 'component/class/basex'

function filterGroup(data){
  let groups = []
  let groupItem = {}
  for (let ii=0; ii<data.length; ii++) {
    ( jj =>{
      let item = data[jj]
      item['index'] = jj.toString()
      item['attr'] = {}
      item['attr']['index'] = jj.toString()

      if (item.disable) {
        item['itemClass'] = 'disable'
        item['attr']['disable'] = 'disable'
      }

      if (item.idf) {
        groups.push(item)
        groupItem[item.idf] ? '' : groupItem[item.idf] = []
      }

      if (item.parent) {
        groupItem[item.parent]
        ? groupItem[item.parent].push(item)
        : groupItem[item.parent] = [item]
      }
    })(ii)
  }

  if (groups.length) {
    return {
      groups,
      groupItem
    }
  }
}

class Transfer extends React.Component {
  constructor(props){
    super(props)
    this.preRender = this::this.preRender
    this.state = {
      data: this.props.data||[]
    }
  }

  // componentDidMount() {
  //   // const doms = this.refs
  //   // const dom = React.findDOMNode(this)
  //   // if (typeof this.props.rendered == 'function') {
  //   //   const tfMethod = this.props.rendered
  //   //   tfMethod(dom, doms)
  //   // }
  // }

  preRender(){
    const tfData = filterGroup(this.state.data)
    if (tfData) {
      const groups = tfData.groups
      const tfItems = tfData.groupItem
      let vmss = []
      let header = this.props.header
      let footer = this.props.footer
      
      if (header) {
        if (!Array.isArray(header)) header = [header, '']
      }

      if (footer) {
        if (!Array.isArray(footer)) footer = [footer, '']
      }
      
      groups.map( (item, ii)=>{
        const listData = tfItems[item.idf]
        let clsName = 'transfer transfer_'+ii
        if (ii==0) clsName = 'transfer activeTransfer transfer_'+ii
        const headerDom = header ? <div className="transfor-header">{header[ii]}</div> : ''
        const footerDom = footer ? <div className="transfor-footer">{footer[ii]}</div> : ''
        const vmlist = (
          <div ref={"transfer_"+ii} key={'transfer_'+ii} className={clsName}>
            {headerDom}
            <List data={listData} itemMethod={this.props.itemMethod}/>
            {footerDom}
          </div>
        )
        if (item.title) vmss.push(<div key={'tfgap_'+ii} ref={'tfgap'+ii} className={"transfer_gap transfer_gap_"+ii}>{item.title}</div>)
        vmss.push(vmlist)
      })
      return vmss
    }
  }

  render(){
    const vmlist = this.preRender()
    const opt = this.props
    const transferClass = !opt.transferClass ? 'transferWrap' : 'transferWrap ' + opt.transferClass
    return (
      <div className={transferClass}>
        {vmlist}
      </div>
    )
  }
}

function toggleGroup(state, props, filterData){
  let curState = state
  const _index = _.findIndex(curState.data, {index: props.index})
  if (_index>-1) {
    let oriItem = curState.data[_index]
    for (var jj=0; jj<filterData.groups.length; jj++) {
      if (oriItem.parent != filterData.groups[jj].idf) {
        if (!oriItem.disable) oriItem.parent = filterData.groups[jj].idf
        break;
      }
    }
    curState.data[_index] = oriItem
    return curState
  }
}

function toggleSelected(ctx, index, dom){
  if (!dom.getAttribute('data-disable')) {
    $(dom).toggleClass('selected')
    if ( $(dom).hasClass('selected') ) {
      ctx.selected.push(index)
    } else {
      ctx.selected = _.dropWhile(ctx.selected, function(o){return o==index})
    }
  }
}

const Actions = {
  TOGGLE: function(state, props){
    let curState = this.curState
    const filterData = filterGroup(curState.data)
    if (typeof props == 'object') {
      if (props.index) {
        return toggleGroup(curState, props, filterData)
      }
    }

    if (Array.isArray(props)) {
      props.map( (item)=>{
        if (item) {
          let tmp = {}
          tmp['index'] = item
          curState = toggleGroup(curState, tmp, filterData)
        }
      })
      return curState
    }
  }
}

function _rendered(ctx, cb){
  return function(dom, intent){
    ctx.dom = dom
    ctx.doms = this.refs
    const lists = $(dom).find('.transfer')
    $(dom).find('.item').click(function(){
      const index = this.getAttribute('data-index')
      toggleSelected(ctx, index, this)
      if (ctx.config.autoTransfer) {
        ctx.toggle({index: index})
      }
    })

    $(lists).click(function(e){
      const clsName = this.className
      const curName = /(transfer_[\d])/.exec(clsName)
      if (!$(this).hasClass('activeTransfer')) {
        $(this).siblings().removeClass('activeTransfer')
        $(this).addClass('activeTransfer')
        $(dom).find('.item').removeClass('selected')
        ctx.groupSelected = curName[1]
        ctx.selected = []
      }
    })

    if (typeof cb == 'function') {
      cb.call(ctx, dom, ctx.doms)
    }
  }
}

class App extends baseX {
  constructor(config){
    super(config)
    this.selected=[]
    this.groupSelected = 'transfer_0'
    config.rendered = _rendered(this, config.rendered)
    this.combinex(Transfer, Actions)
    this.config.props = {
      data: config.data,
      listClass: config.listClass,
      transferClass: config.transferClass,
      header: config.header,
      footer: config.footer
      // itemMethod: _itemFun(this)
    }
  }

  // 选中项传送到另一边
  toggle(select){
    let selectid = {}
    if (typeof select == 'string' || typeof select == 'number') {
      selectid = {index: select}
    }
    if (!select) {
      if (this.selected.length) {
        select = this.selected
      }
    }
    this.dispatch('TOGGLE', select)
    this.selected=[]
  }

  // 把一边的所有子项传送到另一边，除了disable状态
  toSide(){
    const dom = this.doms[this.groupSelected]
    this.selected = []
    $(dom).find('.item').each((ii, item)=>{
      const index = item.getAttribute('data-index')
      this.selected.push(index)
    })
    this.toggle()
  }

  // 把所有左边的子项传送到右边，除了disable状态
  toRight(){
    this.groupSelected = 'transfer_0'
    this.toSide()
  }

  // 把所有右边的子项传送到左边，除了disable状态
  toLeft(){
    this.groupSelected = 'transfer_1'
    this.toSide()
  }
}

/*
 [
  {title: '', idf: 'aaa', index: 0},
  {title: 'abcfd', parent: 'aaa', index: 1},
  {title: 'bcasd', parent: 'aaa', index: 2},
  {title: 'aacwq', parent: 'aaa', index: 2},

  {title: <button>123</button>, idf: 'bbb', index: 3},
  {title: 'yyufs', parent: 'bbb', index: 4},
  {title: 'xfdsw', parent: 'bbb', index: 5},
  {title: 'xxxdsehh', parent: 'bbb', index: 5},
  ]
*/

export default function transfer(opts){
  var noop = false
    , dft = {
        data: [],
        props: false,
        theme: 'transfer',
        autoinject: true,
        autoTransfer: true,
        container: false,
        header: <span>我是span</span>,
        footer: '',
        itemClass: '',
        listClass: '',
        transferClass: '',
        itemMethod: '',
        listMethod: '',
        rendered: ''
      };

  dft = _.merge(dft, opts)
  return new App(dft)
}

export function pure(props){
  return transfer(props)
}
