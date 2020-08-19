function pages() {
  const data = [
    { title: '默认色值', idf: 'btn1', itemClass: 'demo-grid' },
    { title: <span>品牌色 <i>.color-primary</i></span>, parent: 'btn1', itemClass: 'ss-col demo-bg-primary' },

    { title: '辅助色', idf: 'btn2', itemClass: 'demo-grid' },
    { title: <span>PRIMARY <i>.color-aux-primary</i></span>, parent: 'btn2', itemClass: 'ss-col demo-bg-aux-primary' },
    { title: <span>SUCCESS <i>.color-aux-success</i></span>, parent: 'btn2', itemClass: 'ss-col demo-bg-aux-success' },
    { title: <span>WARNING <i>.color-aux-warning</i></span>, parent: 'btn2', itemClass: 'ss-col demo-bg-aux-warning' },
    { title: <span>FAIL <i>.color-aux-fail</i></span>, parent: 'btn2', itemClass: 'ss-col demo-bg-aux-fail' },
  
    { title: '文字色', idf: 'btn3', itemClass: 'demo-grid' },
    { title: <span>REGULAR 主色 <i>.color-text-title</i></span>, parent: 'btn3', itemClass: 'ss-col demo-bg-text-title' },
    { title: <span>PRIMARY 副色 <i>.color-text</i></span>, parent: 'btn3', itemClass: 'ss-col demo-bg-text' },

    { title: <span>边框色 </span>, parent: 'btn5', itemClass: 'ss-col demo-bg-border-secondary' },
    { title: <span>input边线 </span>, parent: 'btn5', itemClass: 'ss-col demo-bg-border-input' },

    { title: '背景色', idf: 'btn4', itemClass: 'demo-grid' },
    { title: <span>默认 <i>.bg-color</i></span>, parent: 'btn4', itemClass: 'ss-col demo-bg-color' },
    { title: <span>特殊 <i>.bg-color-special</i></span>, parent: 'btn4', itemClass: 'ss-col demo-bg-color-special' },
  ]

  const tree = Aotoo.tree({
    data: data
  })

  const Pages = Aotoo.wrap(
    <div className='adminDiv' id='color'>
      <h2 className='item-title-lg'>色彩</h2>
      {tree}
    </div>
  )
  return <Pages/>
}
export default pages()
