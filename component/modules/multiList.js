/**
 * 适用于所有层级数据放在同一级里，
 */
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
      checked: this.props.checked,
      max: this.props.max
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
          let isChecked = _.findIndex(checked, k => k.id === o.id)
          if (cidx == ii && id) {
            //获取下一级的数据
            if (o.parentId === id) {
              // const xx = _.findIndex(data[ii + 1], x => x.parentId === o.id) xx < 0 ?  o.itemClass += ' abc' : ''
              if (o.isSelectedPoi === 1) {
                if (isChecked >= 0) {
                  o.iconClass += ' active'
                }
                else {
                  if (checked.length >= this.state.max) {
                    o.itemClass += ' disabled'
                  }
                }
              }
              return o
            }
          }
          else {
            //other 上n层数据
            if (!storeIdx[ii].id || o.parentId === storeIdx[ii].id) {
              if (o.isSelectedPoi === 1) {
                if (isChecked >= 0) {
                  o.iconClass += ' active'
                }
                else {
                  if (checked.length >= this.state.max) {
                    o.itemClass += ' disabled'
                  }
                }
              }
              if ( _.findIndex(clicked, k => k.id === o.id) >= 0) {
                o.itemClass += ' clicked'
              }
              return o 
            }
          }
        })
        return (
          item.length > 0 ?
          <ul key={ii} className={data.length == (ii + 1) ? 'item last ' : 'item ' + this.state.itemClass} data-idx={ii} >
            {
              item.map((itemx, jj) => {
                let itc =  itemx.hasChild === 1 ? ' has-child' : ''
                return (
                  <li key={_.uniqueId('d-item-item')} className={'item-li' + itc + itemx.itemClass} data-id={itemx.id} data-parentId={itemx.parentId} data-poiId={itemx.poiId}>
                    {
                      itemx.isSelectedPoi === 1 ? 
                        <span className={'item-icon'+ itemx.iconClass}></span>
                      : ''
                    }
                    {itemx.navTitle}
                  </li>
                )
              })
            }
          </ul>
          : ''
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
    $(dom).off('click').on('click', '.item-li', function(e) {
      e.stopPropagation()
      const id = parseInt($(this).attr('data-id'))
      const cidx = parseInt($(this).parents('.item').attr('data-idx'))
      if ($(this).siblings().hasClass('clicked')){
        const ii = _.findIndex(opts.storeClickedLevel, o => o.cidx === cidx)
        if (ii > -1 ) {
          opts.storeClickedLevel.splice(ii)
          opts.storeClickedLevel.push({id: id, cidx: cidx})
        }
      }
      else {
        opts.storeClickedLevel.push({id: id, cidx: cidx})
      }
      instance.$change({id: id, cidx: cidx, clicked: opts.storeClickedLevel})
    })
    .on('click', '.item-icon', function(e) {
      e.stopPropagation()
      const id = parseInt($(this).parent('.item-li').attr('data-id'))
      const poiId = parseInt($(this).parent('.item-li').attr('data-poiId'))
      const val = $(this).parent().text()
      let checkVal = instance.curState.checked ? instance.curState.checked : opts.checked
      if (checkVal.length < opts.max) {
        if ($(this).hasClass('active')){
          const ii = _.findIndex(checkVal, o => o.id === id)
          checkVal.splice(ii, 1)
        }
        else {
          checkVal.push({id: id, title: val, poiId: poiId})
        }
        
        typeof params.itemClick === 'function' ? params.itemClick.call(this, checkVal) : ''
      }
      else {
        if ($(this).hasClass('active')){
          const ii = _.findIndex(checkVal, o => o.id === id)
          checkVal.splice(ii, 1)
          typeof params.itemClick === 'function' ? params.itemClick.call(this, checkVal) : ''
        }
      }
      opts.checked = checkVal
      instance.$changeval({checked: opts.checked})
    })
  }
  return instance
}