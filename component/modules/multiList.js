
import list from 'component/modules/list'

const adapterData = (data) => {
  let arr = []
  let _new = _.groupBy(data,function(obj){
    return obj["customLevel"];
  })
  for (let i in _new) {
    arr.push(_new[i])
  }
  return arr
}

class MultiDropDown extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // data: newData(this.props.data),
      data: adapterData(this.props.data),
      listClass: this.props.listClass,
      itemClass: this.props.itemClass,
      cid: this.props.cid,
      cidx: this.props.cidx,
      storeIdx: this.props.storeIdx,
      checked: this.props.checked
    }
  }
  _storeIdx(cidx, id) {
    //存储n层数据中的关联，为了遍历时找到上下层，
    const storeIdx = this.state.storeIdx
    const sidx = _.findIndex(storeIdx, o => o.cidx == cidx)     //是否点击过id
    if (sidx < 0) {
      storeIdx.push({
        cidx: cidx,
        id: id, 
      })
    } 
    else {
      storeIdx[sidx] = {
        cidx: cidx,
        id: id,
      }
    }
    return storeIdx
  }
  _dealWithData(){
    const state    = this.state
    const data     = state.data
    const id       = state.cid
    const cidx     = state.cidx
    const checked  = state.checked    //是否有选中值
    const clicked  = state.clicked    //存储点击记录
    const storeIdx = this._storeIdx(cidx, id)
    return data.map((item, ii) => {
      if (cidx >= ii) {
        item = _.filter(item, o => {
          o.itemClass = ''
          o.iconClass = ''
          if (cidx == ii && id) {
            //获取下一级的数据
            if (o.parentId === id) {
              if (o.isSelectedPoi === 1 && _.findIndex(checked, k => k.id === o.id) >= 0) {
                o.iconClass += ' active'
              }
              return o
            }
          }
          else {
            //other 上n层数据
            if (!storeIdx[ii].id || o.parentId === storeIdx[ii].id) {
              if (o.isSelectedPoi === 1 && _.findIndex(checked, k => k.id === o.id) >= 0) {
                o.iconClass += ' active'
              }
              if ( _.findIndex(clicked, k => k.id === o.id) >= 0) {
                o.itemClass += ' clicked'
              }
              return o 
            }
          }
        })
        return (
          <ul key={ii} className={data.length == (ii + 1) ? 'item last ' : 'item ' + this.state.itemClass} data-idx={ii} >
            {
              item.map((itemx, jj) => {
                let itc =  itemx.itemClass ? 'item-li' + itemx.itemClass : 'item-li'
                let ic  =  itemx.iconClass ? 'item-icon' + itemx.iconClass : 'item-icon'
                // let itc =  ? itemx.itemClass ? 'item-li check' + itemx.itemClass : 'item-li check' : itemx.itemClass ? 'item-li' + itemx.itemClass : 'item-li'
                return (
                  <li key={_.uniqueId('d-item-item')} className={itc} data-id={itemx.id} data-parentId={itemx.parentId}>
                    {
                      itemx.isSelectedPoi === 1 ? 
                        <span className={ic}></span>
                      : ''
                    }
                    {itemx.navTitle}
                  </li>
                )
              })
            }
          </ul>
        )
      }
    })
  }
  render() {
    const fills = this._dealWithData()
    return <div className={'list-level ' + this.state.listClass}>{fills}</div>
  }
}

const Actions = {
  RESET(ostate, data) {
    return ostate
  },
  UPDATE(ostate, param) {
    let curState = this.curState
    if (typeof param === 'object' && param.length > 0) {
      curState.data = adapterData(param)
    }
    else {
      curState.data = adapterData(param.data)
      param.listClass ? curState.listClass = param.listClass : ''
    }
    return curState
  },
  CHANGE(ostate, param) {
    const curState = this.curState
    curState.cid = param.id
    curState.cidx = param.cidx + 1
    curState.clicked = param.clicked
    return curState
  },
  CHANGEVAL(ostate, param) {
    const curState = this.curState
    curState.checked = param.checked
    return curState
  },
  SETVALUE(ostate, data) {
    const curState = this.curState
    curState.checked = data
    return curState
  }
}


export default function(params) {
  const instance = Aotoo(MultiDropDown, Actions)
  let dft = {
    checked: [],        //[{id: 28131}, {id: 28132}]
    max: 4,
    storeClickedLevel: [],      //用来记录点击过的层级，
    listClass: '',
    itemClass: '',
    cid: null,
    cidx: 0,
    storeIdx: []
  }
  let opts = Object.assign(dft, params)
  instance.setProps(opts)
  instance.rendered = function(dom) {
    $(dom).off('click').on('click', '.item-li, .item-icon', function(e) {
      e.stopPropagation()
      if (e.target.className === 'item-li') {
        const id = parseInt($(this).attr('data-id'))
        const cidx = parseInt($(this).parents('.item').attr('data-idx'))
        if ($(this).siblings().hasClass('clicked')){
          const ii = _.findIndex(opts.storeClickedLevel, o => o.cidx === cidx)
          if (ii > -1 ) {
            opts.storeClickedLevel.splice(ii, 1)
            opts.storeClickedLevel.push({id: id, cidx: cidx})
          }
        }
        else {
          opts.storeClickedLevel.push({id: id, cidx: cidx})
        }
        instance.$change({id: id, cidx: cidx, clicked: opts.storeClickedLevel})
      }
      else if (e.target.className === 'item-icon' || e.target.className === 'item-icon active') {
        const id = parseInt($(this).parent('.item-li').attr('data-id'))
        const val = $(this).parent().text()
        if (opts.checked.length < opts.max) {
          if ($(this).hasClass('active')){
            const ii = _.findIndex(opts.checked, o => o.id === id)
            opts.checked.splice(ii, 1)
          }
          else {
            opts.checked.push({id: id, title: val})
          }
          typeof params.itemClick === 'function' ? params.itemClick.call(this, opts.checked) : ''
        }
        else {
          if ($(this).hasClass('active')){
            const ii = _.findIndex(opts.checked, o => o.id === id)
            opts.checked.splice(ii, 1)
            typeof params.itemClick === 'function' ? params.itemClick.call(this, opts.checked) : ''
          }
        }
        instance.$changeval({checked: opts.checked})
      }
    })
  }
  return instance
}

// class SingleItem extends React.Component {
//   render() {
//     return <li onClick={this.props.onClick} className='item-li' data-id={this.props.id} data-level={this.props.customLevel}>{this.props.navTitle}</li>
//   }
// }