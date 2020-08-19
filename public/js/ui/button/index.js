function pages() {
  const data = [
    { title: ' ', idf: 'btn1', itemClass: 'item-list' },
    { title: '默认', parent: 'btn1', itemClass: 'ss-button btn-default' },
    // { title: '默认', parent: 'btn1', itemClass: 'ss-button btn-primary' },
    { title: '默认', parent: 'btn1', itemClass: 'ss-button btn-minor' },
    { title: '禁止', parent: 'btn1', itemClass: 'ss-button disabled' },

    { title: ' ', idf: 'btn2', itemClass: 'item-list' },
    { title: '圆角', parent: 'btn2', itemClass: 'ss-button round btn-default plain' },
    // { title: '圆角', parent: 'btn2', itemClass: 'ss-button round btn-primary plain' },
    { title: '圆角', parent: 'btn2', itemClass: 'ss-button round btn-minor plain' },
    { title: '圆角', parent: 'btn2', itemClass: 'ss-button round btn-grey plain' },

    { title: ' ', idf: 'btn3', itemClass: 'item-list' },
    { title: '大按钮', parent: 'btn3', itemClass: 'ss-button btn-minor larger' },
    { title: '默认', parent: 'btn3', itemClass: 'ss-button btn-default' },
    { title: '小按钮', parent: 'btn3', itemClass: 'ss-button btn-default small' },

    { title: ' ', idf: 'btn4', itemClass: 'item-list' },
    { title: <div className='ss-button btn-default'><i className='icon-loading'></i><span>图标按钮</span></div>, parent: 'btn4'},
    { title: <div className='ss-button btn-default'><i className='icon-loading'></i></div>, parent: 'btn4' },

    { title: '文字链', idf: 'btn5', itemClass: 'item-list' },
    { title: <a className='ss-link'><i className='icon-loading ss-icon-right'></i><span>默认链接</span></a>, parent: 'btn5' },
    { title: '文字链接', parent: 'btn5', itemClass: 'ss-link-primary' },
    { title: <a className='ss-link ss-hover-underline'>下划线</a>, parent: 'btn5' },
  ]

  const tree = Aotoo.tree({
    data: data
  })

  const Pages = Aotoo.wrap(
    <div className='adminDiv' id='button'>
      <h2 className='item-title-lg'>按钮</h2>
      {tree}
    </div>
  )
  return <Pages/>
}
export default pages()
