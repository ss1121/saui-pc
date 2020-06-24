const isClient = (() => typeof window !== 'undefined')()

function reallyReturn(wrap, isreact){
  let reactElement
  if (React.isValidElement(wrap)) reactElement = wrap
  else if (wrap.render) {
    reactElement = isClient ? wrap : wrap.render()
  }

  if (reactElement) {
    // 服务端
    if (!isClient) {
      if (isreact) return reactElement
      return [  ReactDomServer.renderToString(reactElement) ]
    }
    // 浏览器端
    else {
      if (isreact) return reactElement.render()
      return reactElement
    }
  }
}

export function item(props, isreact){
  return Aotoo.item(props)
  // let Item = require('./widgets/itemView/f_div')
  // const Component = <Item {...props} />
  // return reallyReturn(Component, isreact)
}

export function list(props, isreact){
  return Aotoo.list(props)
  // let List = require('./widgets/listView')
  // const Component = <List {...props} />
  // return reallyReturn(Component, isreact)
}

export function input(props, isreact){
  const _rct = require('./modules/form/inputs')
  if (_rct.pure) {
    const Component = _rct.pure(props)
    // const Component = _rct.pure(props).render()
    return reallyReturn(Component, isreact)
  }
}


export function form(props, isreact){
  return input(props, isreact)
}

export function grids(props, isreact){
  const _rct = require('./modules/grids')
  if (_rct.pure) {
    const Component = _rct.pure(props)
    return reallyReturn(Component, isreact)
  }
}

// export function baselist(props, isreact){
//   const _rct = require('./modules/list/base_list')
//   if (_rct.pure) {
//     const Component = _rct.pure(props)
//     return reallyReturn(Component, isreact)
//   }
// }

// export function iscroll(props, isreact){
//   const _rct = require('./modules/list/iscroll_list')
//   if (_rct.pure) {
//     const Component = _rct.pure(props)
//     return reallyReturn(Component, isreact)
//   }
// }

// export function loadlist(props, isreact){
//   const _rct = require('./modules/list/load_list')
//   if (_rct.pure) {
//     const Component = _rct.pure(props)
//     // const Component = _rct.pure(props).render()
//     return reallyReturn(Component, isreact)
//   }
// }

// export function pagilist(props, isreact){
//   const _rct = require('./modules/list/pagi_list')
//   if (_rct.pure) {
//     const Component = _rct.pure(props)
//     // const Component = _rct.pure(props).render()
//     return reallyReturn(Component, isreact)
//   }
// }

export function pagination(props, isreact){
  const _rct = require('./modules/pagination')
  if (_rct.pure) {
    const Component = _rct.pure(props)
    // const Component = _rct.pure(props).render()
    return reallyReturn(Component, isreact)
  }
}

export function tabs(props, isreact){
  const _rct = require('./modules/tabs')
  if (_rct.pure) {
    const Component = _rct.pure(props)
    // const Component = _rct.pure(props).render()
    return reallyReturn(Component, isreact)
  }
}

export function htabs(props, isreact) {
  const _rct = require('./modules/tabs')
  if (_rct.htabs) {
    const Component = _rct.htabs(props)
    return reallyReturn(Component, isreact)
  }
}

export function tree(props, isreact){
  const _rct = require('./modules/tree')
  if (_rct.pure) {
    const Component = _rct.pure(props)
    return reallyReturn(Component, isreact)
  }
}

export function dropdown(props, isreact){
  const _rct = require('./modules/dropdown')
  if (_rct.pure) {
    const Component = _rct.pure(props)
    return reallyReturn(Component, isreact)
  }
}

export function treex(props, isreact){
  const _rct = require('./modules/tree/treex')
  if (_rct.pure) {
    const Component = _rct.pure(props)
    return reallyReturn(Component, isreact)
  }
}
