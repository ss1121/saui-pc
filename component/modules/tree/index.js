export function tree(opts){
  var noop = false
  , dft = {
    data: [],
    select: 0,
    header: '',
    footer: '',
    container: '',
    globalName: _.uniqueId('Trees_'),   // TabsModule
    theme: 'tree', // = /css/m/tabs
    cls: 'treeGroupY',
    itemClass: 'tree-menu',
    listClass: 'tree-menu-body',
    itemMethod: noop,
    listMethod: noop,
    fold: true,
    evt: 'click'
  }
  dft = _.extend(dft, opts)
  return Aotoo.tree(dft)
}

export function htree(opts) {
  opts.cls = opts.cls || 'treeGroupX'
  return tree(opts)
}

export function pure(props){
  return tree(props)
}
