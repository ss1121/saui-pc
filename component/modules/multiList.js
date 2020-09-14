
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
      listClass: this.props.listClass || '',
      itemClass: this.props.itemClass || '',
      cid: null,
      cidx: 0,
      storeIdx: [],
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
    const storeIdx = this._storeIdx(cidx, id)
    return data.map((item, ii) => {
      if (cidx >= ii) {
        
        item = _.filter(item, o => {
          if (cidx == ii && id) {
            //获取下一级的数据
            if (o.parentId === id) {
              return o
            }
          }
          else {
            //other 上n层数据
            if (!storeIdx[ii].id || o.parentId === storeIdx[ii].id) {
              o.itemClass = ' '   // clicked 单选，点击状态，非赋值
              o.id === id ? o.itemClass += ' clicked' : ''
              if (o.isSelectedPoi === 1 && _.findIndex(checked, k => k.id === o.id) >= 0) {
                o.itemClass += ' active'
                console.log('============ abc')
              }
              return o 
            }
          }
        })
        return (
          <ul key={ii} className={data.length == (ii + 1) ? 'item last ' : 'item ' + this.state.itemClass} data-idx={ii} >
            {
              item.map((itemx, jj) => {
                let itc = itemx.isSelectedPoi === 1 ? itemx.itemClass ? 'item-li check' + itemx.itemClass : 'item-li check' : itemx.itemClass ? 'item-li' + itemx.itemClass : 'item-li'
                return (
                  <li key={_.uniqueId('d-item-item')} className={itc} data-id={itemx.id} data-parentId={itemx.parentId}>{itemx.navTitle}</li>
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
  CHANGE(ostate, param) {
    const curState = this.curState
    curState.cid = param.id
    curState.checked = param.checked
    curState.cidx = param.cidx + 1
    return curState
  },
  SETVALUES(ostate, data) {
    const curState = this.curState
    curState.checked = data
    return curState
  }
}


export default function(params) {
  const instance = Aotoo(MultiDropDown, Actions)
  let dft = {
    checked: [],        //[{id: 28131}, {id: 28132}]
    max: 4
  }
  let opts = Object.assign(dft, params)
  instance.setProps(opts)
  instance.rendered = function(dom) {
    $(dom).off('click').on('click', '.item-li', function(e) {
      e.stopPropagation()
      const id = parseInt($(this).attr('data-id'))
      const cidx = parseInt($(this).parents('.item').attr('data-idx'))
      if ($(this).hasClass('check')) {
        if (opts.checked.length < opts.max) {
          if ($(this).hasClass('active')){
            const ii = _.findIndex(opts.checked, o => o.id === id)
            opts.checked.splice(ii, 1)
          }
          else {
            opts.checked.push({id: id, title: $(this).text()})
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
      }
      instance.$change({id: id, cidx: cidx, checked: opts.checked})
    })
  }
  return instance
}

// class SingleItem extends React.Component {
//   render() {
//     return <li onClick={this.props.onClick} className='item-li' data-id={this.props.id} data-level={this.props.customLevel}>{this.props.navTitle}</li>
//   }
// }