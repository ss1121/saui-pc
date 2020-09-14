/*
#   List组件
#   方法：
#       uplist更新list列表
#       upclass更新list类名
*/

class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data,
      footer: this.props.footer,
      listClass: this.props.listClass,
      itemClass: this.props.itemClass,
    }
  }
  render() {
    return this.list({
      data: this.state.data,
      footer: this.state.footer,
      listClass: this.state.listClass,
      itemClass: this.state.itemClass,
    })

    // return (
    //   <div className={'list-wrap '+this.state.listClass} >
    //     <div className="hlist">
    //       {
    //         (()=>{
    //           return this.state.data.map((it, ii)=>{
    //             let xxx = Aotoo.item({data: it, itemClass: this.state.itemClass})
    //             let yyy = React.cloneElement(xxx, {key: 'fox' + ii})
    //             return yyy
    //           })
    //         })()
    //       }
    //     </div>
    //     {Aotoo.item({data: this.props.footer})}
    //   </div>
    // )
  }
}
const Actions = {
  RESET: function (ostate, param){
    return ostate
  },
  UPDATE: function(ostate, param) {
    let curState = this.curState;
    if (typeof param === 'object' && param.length >= 0) {
      curState.data = data
    }
    else {
      param.data ? curState.data = param.data : ''
      param.listClass ? curState.listClass = param.listClass : ''
      param.itemClass ? curState.itemClass = param.itemClass : ''
    }
    param.data && param.data.length > 0 ? curState.data = curState.data.map(item =>{
      _id(item)
      return item
    }) : ''
    return curState;
  },
  UPLIST: function (ostate, data) {
    let curState = this.curState;
    curState.data = data
    curState.data = curState.data.map(item =>{
      _id(item)
      return item
    })
    return curState;
  },
  UPCLASS: function (ostate, className) {
    let curState = this.curState;
    curState.listClass = className
    return curState;
  },
  APPEND: function (ostate, opts) {
    let curState = this.curState
    if (Array.isArray(opts) || (typeof opts == 'object' && opts.length)) {
      curState.data = curState.data.concat(opts)
    } else {
      curState.data.push(opts)
    }
    return curState
  },
  DELETE: function (ostate, id, ctx) {
    let that = this
    let curState = this.curState
    let newData = []
    curState.data.forEach((item, ii) => {
      if (item.attr.idx !== id) {
        newData.push(item)
      }
    })
    curState.data = newData
    return curState
  }
}

function list(opts) {
  const instance = Aotoo(List, Actions)
  let _props = opts
  instance.setProps(_props)
  return instance
}

export default function (options) {
  return list(options)
}