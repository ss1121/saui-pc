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
  UPLIST: function (ostate, data) {
    let curState = this.curState;
    curState.data = data
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
    // curState.data.splice(id, 1)
    let newData = []
    curState.data.forEach((item, ii) => {
      if (ii !== id) {
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