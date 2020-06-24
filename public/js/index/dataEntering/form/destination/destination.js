class TabsDiaination extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.props.props
  }
  componentWillMount() {
    this.prepaireData(this.state.data)
  }
  prepaireData(data){
    const props = this.state
    let menuData = [], contentData = []
    data.forEach( (item, ii) => {
      // 准备菜单数据
      menuData.push({
        attr: {idx: ii},
        title: item.title,
        itemClass: ii == props.select ? 'active' : '',
      })

      // 准备内容数据
      contentData.push({
        attr: {idx: ii},
        title: item.content
      })
    })
    props.menuData = menuData
    props.contentData = contentData
  }
  menus() {
    return this.list({
      data: this.state.menuData,
      listClass: this.state.treeHeader || this.state.treeFooter ? '' : this.state.menusClass ,
      // header: this.state.treeHeader,
      // footer: this.state.treeFooter
    })
  }
  content() {
    const idx = this.state.select
    return this.item({
      data: this.state.upContent ? this.state.contentData : this.state.contentData[idx],
      itemClass: 'tabsBoxes'
    })
  }
  render() {
    return (
      <div className={'tabsGroup ' + this.state.listClass}>
        <div className='tabsMenus'>
          {this.state.treeHeader ? this.state.treeHeader : ''}
          {this.state.hasMenusBtn ?
           <div ref="tabsMenus" style={{width: this.state.menusWidth +'px'}} className={'list-wrap ' + this.state.menusClass}>
             {this.menus()}
           </div>
          : this.menus()}
          {this.state.hasMenusBtn && this.state.treeFooter ? this.state.treeFooter : ''}
          </div>
        {this.content()}
      </div>
    )
  }
}

const Action =  {
  SELECT: function(ostate, opts={}){
    let state = this.curState
    if (typeof opts=='string' || typeof opts=='number') {
      opts = {select: opts}
    }
    state.select = opts.select
    return state
  },
  UPCONTENT: function(ostate, data={}){
    let curState = this.curState;
    const select = data.select
    const contentData = data.data
    curState.contentData = contentData
    return curState;
  }
}

function tabsx(params) {
  let dftx = {
    props: {
      data: [],
      listClass: '',
      menusClass: '',
      select: 0,
      treeFooter: <div className='tabs-btn-cut ss-hidden'><a className='ss-item item-left icon-arrow-left disabled' href='javascript:;'></a><a className='ss-item item-right icon-arrow-right' href='javascript:;'></a></div>,
      treeHeader: false,      //与其它组件统一
      upContent: false,
      menuData: [],     //组件内部用
      contentData: [],    //组件内部用

      cb: undefined,          //方法 是否更新content数据，与.saxer.on('updateContent',function()）配合
      
      //菜单部分
      menusWidth: 'auto',
      hasMenusBtn: false,    //控制左右切换menus 'auto,是不定长度如何都会出现，lenght是根据长度超过最大宽度就显示
      iscrollConfig: { scrollX: true, scrollY: false,  mouseWheel: false, click: false, bounce: false, tap: true, preventDefault: false, disableMouse: true, disablePointer: true},
    }
  }

  
  let opts = Object.assign({}, dftx.props, params.props)
  const instance = Aotoo(TabsDiaination, Action, opts)

  instance.on('rendered', function(options){
    const {dom, _opts, ctx} = options
    //是否显示左右切换的按钮
    let curSelect = ctx.curState && parseInt(ctx.curState.select) || opts.props.select
    $(dom).find('.tabsMenus .item').click(function(e) {
      e.stopPropagation()
      const idx = $(this).attr('data-idx')
      //如果存在，不执行事件
      if (!$(this).hasClass('active')) {
        $(this).addClass('active').siblings().removeClass('active')
        //判断是否点击标题时，需要更新content数据
        if (opts.props.upContent) {
          instance.saxer.emit('updateContent', {idx: idx})
        }
        else {
          instance.$select({
            select: idx
          })
        }
        curSelect = idx
        // opts.props.hasMenusBtn ? destnationBtnFunc({select: idx, type: 'auto', dom: dom, ctx: ctx}) : ''
      }
    })
    console.log(curSelect)
    opts.props.hasMenusBtn ? destnationBtnFunc({select: curSelect, type: 'auto', dom: dom, ctx: ctx}) : ''

    // if (typeof opts.props.cb === 'function') opts.props.cb.call(this, dom, instance)
    // if (typeof opts.props.cbCutBtn === 'function') opts.props.cbCutBtn.call(this, dom, instance)
  })
  instance.on('__beforeRendered', function (optsx) {
    const {dom, refs, context} = optsx
    if (typeof window != 'undefined' && opts.hasMenusBtn) {
      var $iscroll = require('component/modules/iscroll-probe')
      context.scrollMenu = new $iscroll(refs.tabsMenus, opts.iscrollConfig)
    }
  })
  instance.setProps(opts)
  return instance
}

function destnationBtnFunc(params) {
  //目前有两种，一种是判断hasMenusBtn存不存在来判断是否显示切换按钮，另一种是通过判断数据的长度有没有超过弹出层的宽度来判断是否显示切换按钮
  const {select, type, dom, ctx} = params

  const iScrollInst = ctx.scrollMenu        //menus->scroll实例
  // setTimeout(() => {
  //   iScrollInst.refresh()
  // }, 0);

  const btnWidth = $(dom).find('.tabs-btn-cut').outerWidth(true)
  const menusWidth = $(dom).find('.tabsMenus').width()
  const innerWrapWidth  = menusWidth - btnWidth
  let idx = 0

  let tabsMenusWidth = 2
  $(dom).find('.tabsMenus .item').each(function() {
    let item = $(this).outerWidth(true)
    tabsMenusWidth += item
  })
  $(dom).find('.tabsMenus .hlist').css({width: tabsMenusWidth})      //遍历获取li的宽度，赋值给ul
  const num = Math.ceil(tabsMenusWidth / (menusWidth - btnWidth) )      //tabsMenus分为几块
  const initailLeft = select > 0 ? $(".tabsMenus .item:nth-child("+select+")").offset().left : 0
  if (initailLeft > menusWidth) {
    console.log('我也不知道')
    const initialSelect = Math.ceil(initailLeft / menusWidth)
    const moveX = (initialSelect - 1) * innerWrapWidth
    console.log(moveX, initialSelect, innerWrapWidth)
    iScrollInst.scrollTo(-moveX, 0)
    $(dom).find('.item-left').removeClass('disabled')
    if (initialSelect >= num) {
      idx = initialSelect - 1
      $(dom).find('.item-right').addClass('disabled')
    }
  }

  if (type == 'length') {
    if (tabsMenusWidth < menusWidth) {
      $(dom).find('.tabs-btn-cut').addClass('disN')
    }
  }
  if (tabsMenusWidth > menusWidth) {      //判断实际宽度有没有超出固定宽度
    $(dom).find('.tabs-btn-cut').removeClass('ss-hidden')
    if (num > 1) {
      
      $(dom).find('.item-right').click(function(e){
        e.stopPropagation()
        if (!$(this).hasClass('disabled')) {
          if (idx < num) {
            idx = idx + 1
            const moveX = idx * innerWrapWidth > tabsMenusWidth ? tabsMenusWidth: idx * innerWrapWidth
            iScrollInst.scrollTo( -moveX, 0)       //scrollBy是基于当前的元素为赶点， srcollTo是基于第一个
          }
          if (idx == num - 1) {
            $(this).addClass('disabled').siblings().removeClass('disabled')
          }
        }
      })
      $(dom).find('.item-left').click(function(e){
        e.stopPropagation()
        if (!$(this).hasClass('disabled')) {
          if (idx > 0) {
            idx = idx - 1
            const moveX = idx * innerWrapWidth < 0 ? 0 : idx * innerWrapWidth
            iScrollInst.scrollTo(-moveX, 0)
          }
          if (idx == 0) {
            $(this).addClass('disabled').siblings().removeClass('disabled')
          }
        }
      })
    }
  }
  else {
    $(dom).find('.tabs-btn-cut').addClass('disN')
  }
}

export default function (options) {
  return tabsx(options)
}

// 业务调用时
// cb: function(dom, inst) {
//   //通过params传回来的idx,来判断点击的栏目是哪一个
//   // inst.saxer.on('updateContent', function(params) {
//   //   const idx = params.idx
//   //   inst.$upcontent({data: {title: 'xxxx'}, select: idx})
//   // })
// }