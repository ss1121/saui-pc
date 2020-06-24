class DropdownX extends React.Component {
  render(){
    const ddData = this.props.data.map( item => {
      item.parent = 'top'
      return item
    })

    const firstItem = (()=>{
      const fItem = this.props.placeholder || ddData[this.props.select]['title']
      return (typeof fItem == 'string' || typeof fItem == 'number') 
      ? <span className="caption">{defaultTitile}</span>
      : fItem
    })()

    ddData.unshift({
      title: firstItem,
      idf: top
    })

    const dropdownPart = Aotoo.tree({
      data: this.props.data,
      itemClass: this.props.itemClass,
      listClass: this.props.listClass
    })

    return (
      <div className={(this.props.listClass||'dropdown')+'_wrap'}>
        {this.props.header}
        {dropdownPart}
        {this.props.footer}
      </div>
    )
  }
}

function ddappOnRendered(params) {
  const appInst = this
  const itemFun = appInst.config.props.itemMethod
  let { dom } = param
  dom.firstroot = true
  dom.itemroot = true

  const _ctx = {
    select: dom,
    toggle() {
      $(dom).toggleClass('selected')
    },
    text(val) {
      const captiondom = $(dom).find('.caption')[0]
      if (val) {
        captiondom.innerHTML = val
      }
      return captiondom.innerHTML
    },
    value: function (val) {
      appInst.value = val
      dom.setAttribute('data-dropdown-value', val)
    }
  }

  $(dom).once('click', function (e) {
    $(this).toggleClass('selected')
  })

  $(dom).find('li').each((ii, item) => {
    if ($(item).hasClass('itemroot')) {
      item.itemroot = true
    }
    appInst.items.push(item)
    if (typeof itemFun == 'function') {
      itemFun.call(_ctx, item)
    }
  })
}

function _select(page, itemDom, data) {
  $(this.items).removeClass('selected')
  if (itemDom && $(itemDom).hasClass('itemroot')) {
    $(itemDom).find('.caption:first').toggleClass('fold')
    $(itemDom).find('ul:first').toggleClass('none')
  } else {
    $(itemDom).addClass('selected')
  }
}


/**
 * 
 * @param {Object} config 
 */
function ddApp(config) {
  let appInst = Aotoo(DropdownX, {}, config)
  appInst.items = []
  appInst.extend({
    select(page, itemDom, data){
      if (appInst.hasMounted()) {
        const index = page || 0
        itemDom = itemDom || this.items[index]
        _select(index, itemDom, data).bind(this)
      }
    }
  })
  appInst.on('rendered', ddappOnRendered.bind(appInst))
  return appInst
}

export function dropdown(opts){
  var noop = false
  , dft = {
    data: [],
    select: 0,
    header: '',
    footer: '',
    container: '',
    globalName: _.uniqueId('Dropdowns_'),   // TabsModule
    theme: 'dd', // = /css/m/tabs
    cls: 'dropdownGroupY',
    itemClass: 'dropdown-menu',
    listClass: 'dropdown-menu-body',
    itemMethod: noop,
    listMethod: noop,
    fold: true,
    evt: 'click',
    placeholder: '',
  }
  dft = _.extend(dft, opts)
  dft.props = {...dft}
  return ddApp(dft)
}