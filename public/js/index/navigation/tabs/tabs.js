import list from 'component/modules/list'
import item from 'component/modules/item'

const tabsData = [
  {
    title: '标签一',
    attr: {idx: 'a1'},
    content: <div className='mb-default'>我是标签一的内容</div>
  },
  {
    title: '标签二',
    attr: {idx: 'a2'},
    content: <div className='mb-default'>我是标签二的内容</div>
  },
  {
    title: '标签三',
    attr: {idx: 'a3'},
    content: <div>我是标签三的内容</div>
  }
]

const tabsWrap = Aotoo.tabs({
  props: {
    tabClass: 'tabsGroup-tab mb20',
    data: tabsData,
  }
})
const tabsWrap2 = Aotoo.tabs({
  props: {
    tabClass: 'tabsGroup-card',
    data: tabsData,
  }
})
const tabsWrap3 = Aotoo.tabs({
  props: {
    tabClass: 'tabsGroup-normal',
    treeFooter: <div className='ss-button btn-default'>立即购买</div>,
    data: tabsData,
    mulitple: true,
  }
})

tabsWrap.rendered = function (dom) {
  $('.tabsGroup-card .item').click(function (e) {
    let index = $(this).attr('data-treeid')
    $(this).addClass('select').siblings().removeClass('select')
    tabsWrap.$select({
      select: index
    })
  })
}
tabsWrap2.rendered = function (dom) {
  $('.tabsGroup-border .item').click(function (e) {
    let index = $(this).attr('data-treeid')
    $(this).addClass('select').siblings().removeClass('select')
    tabsWrap2.$select({
      select: index
    })
  })
}
tabsWrap3.rendered = function (dom) {
  $('.tabsGroup-normal .item').click(function (e) {
    let index = $(this).attr('data-treeid')
    $(this).addClass('select').siblings().removeClass('select')
    tabsWrap3.$select({
      select: index
    })
  })
}


//仿tabs
const headlist = list({
  data: tabsData,
  listClass: 'likeTabsMenus'
})
const body = item({
  data: {title: 'abc'},
  itemClass: 'likeTabsContent border-default padding-default'
})
const LikeTabs = Aotoo.wrap(
  <div className= 'likeTabs'>
    {headlist.render()}
    {body.render()}
  </div>
  ,function (dom) {
    setTimeout(() => {
      //第一种更新数据 
      // headlist.$uplist([{title: '选项1', attr: {idx: 'a1'}, itemClass: 'select'}, {title: '选项2', attr: {idx: 'a2'}}, {title: '选项3', attr: {idx: 'a3'}}])
      //第二种直接加class
      $('.likeTabsMenus .item').first().addClass('active')
    }, 10);
    $('.likeTabsMenus .item').click(function (e) {
      if (!$(this).hasClass('active')) {
        $(this).addClass('active').siblings().removeClass('active')
        const idx = $(this).attr('data-idx')
        if (idx == 'a1') {
          body.$upitem({title: '切换a1.....'})
        }
        else if (idx == 'a2') {
          body.$upitem({title: '切换a2.....'})
        }
        else {
          body.$upitem({title: '切换a3.....'})
        }
      }
    })
  }
)
module.exports = {
  tabsWrap,
  tabsWrap2,
  tabsWrap3,
  LikeTabs
}