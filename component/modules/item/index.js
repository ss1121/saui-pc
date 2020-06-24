/*
#   item组件
#   方法：
#       uplist更新list列表
#       upclass更新list类名
*/

class Item extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data,
      listClass: this.props.listClass,
      itemClass: this.props.itemClass,
    }
  }
  render() {
    return this.item({
      data: this.state.data,
      itemClass: this.state.itemClass,
    })
  }
}
const Actions = {
  UPITEM: function (ostate, data) {
    let curState = this.curState;
    curState.data = data
    return curState;
  },
  UPCLASS: function (ostate, className) {
    let curState = this.curState;
    curState.itemClass = className
    return curState;
  },
  APPEND: function (ostate, opts) {
    let curState = this.curState
    if (opts.length > 0) {
      curState.data = curState.data.concat(opts)
    } else {
      curState.data.push(opts)
    }
    return curState
  },
}

function item(opts) {
  const instance = Aotoo(Item, Actions)
  let _props = opts
  instance.setProps(_props)
  return instance
}

export default function (options) {
  return item(options)
}