function pages() {
  const data = [
    { title: ' ', idf: 'btn1', itemClass: 'item-list' },
    { title: '默认', parent: 'btn1', itemClass: 'ss-tag tag-default' },
    { title: '默认', parent: 'btn1', itemClass: 'ss-tag tag-primary' },
    { title: '默认', parent: 'btn1', itemClass: 'ss-tag tag-minor' },
    { title: '默认', parent: 'btn1', itemClass: 'ss-tag tag-grey' },

    { title: ' ', idf: 'btn2', itemClass: 'item-list' },
    { title: '默认', parent: 'btn2', itemClass: 'ss-tag plain tag-default' },
    { title: '默认', parent: 'btn2', itemClass: 'ss-tag plain tag-primary' },
    { title: '默认', parent: 'btn2', itemClass: 'ss-tag plain tag-minor' },

    { title: ' ', idf: 'btn3', itemClass: 'item-list' },
    { title: <div className='ss-tag tag-default'><span className='item-title'>移除标签</span><i className='icon-del-primary'></i></div>, parent: 'btn3'},

    { title: ' ', idf: 'btn4', itemClass: 'item-list tag-list-wz' },
    { title: <div className='ss-tag noborder larger'><span className='item-title'>文字标签</span><i className='icon-del-primary'></i></div>, parent: 'btn4'},
    { title: <div className='ss-tag noborder larger'><span className='item-title'>文字标签2</span><i className='icon-del-primary'></i></div>, parent: 'btn4'},

    { title: '悬浮标题', idf: 'btn5', itemClass: 'item-list' },
    { title: <div className='demo-display'><span className='ss-tag tag-grey ab-l sc-r'>封面</span></div>, parent: 'btn5'},
    { title: <div className='demo-display'><span className='ss-tag tag-default ab-l sc-r'>免费视频</span></div>, parent: 'btn5'},

    { title: '块状提示', idf: 'btn6', itemClass: 'item-list' },
    { 
      title: (
        <div className='display-tips'><h5 className='size color-title ss-relative'>封面 <i className='icon-del-primary ss-absolute-tr'></i></h5><p className='size-sm'>免费视频免费视频免费视频免费视频免费视频</p></div>
      ),
      parent: 'btn6'
    },
  ]

  const tree = Aotoo.tree({
    data: data
  })

  const Pages = Aotoo.wrap(
    <div className='adminDiv' id='tag'>
      <h2 className='item-title-lg'>标签</h2>
      {tree}
    </div>
  )
  return <Pages/>
}
export default pages()
