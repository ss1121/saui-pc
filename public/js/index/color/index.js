function pages() {
  const data = [
    { title: '默认色值', idf: 'btn1', itemClass: 'demo-grid' },
    { title: <span>品牌色</span>, parent: 'btn1', itemClass: 'ss-col demo-bg-primary' },
    { title: <span>SUCCESS</span>, parent: 'btn1', itemClass: 'ss-col demo-bg-success' },
    { title: <span>FAIL</span>, parent: 'btn1', itemClass: 'ss-col demo-bg-fail' },
    { title: <span>INFO</span>, parent: 'btn1', itemClass: 'ss-col demo-bg-info' },

    { title: '辅助色', idf: 'btn2', itemClass: 'demo-grid' },
    { title: <span>默认</span>, parent: 'btn2', itemClass: 'ss-col demo-bg-aux-primary' },
    { title: <span>默认</span>, parent: 'btn2', itemClass: 'ss-col demo-bg-aux-warning' },
    { title: <span>默认</span>, parent: 'btn2', itemClass: 'ss-col demo-bg-aux-info' },
  
    { title: '文字色', idf: 'btn3', itemClass: 'demo-grid' },
    { title: <span>PRIMARY</span>, parent: 'btn3', itemClass: 'ss-col demo-bg-text' },
    { title: <span>REGULAR</span>, parent: 'btn3', itemClass: 'ss-col demo-bg-text-regular' },
    { title: <span>INFO</span>, parent: 'btn3', itemClass: 'ss-col demo-bg-text-info' },
    { title: <span>DISABLED</span>, parent: 'btn3', itemClass: 'ss-col demo-bg-text-disabled' },
    { title: <span>PLACEHOLDER</span>, parent: 'btn3', itemClass: 'ss-col demo-bg-text-placeholder' },

    { title: '背景色', idf: 'btn4', itemClass: 'demo-grid' },
    { title: <span>默认</span>, parent: 'btn4', itemClass: 'ss-col demo-bg-color' },

    { title: '线条色', idf: 'btn5', itemClass: 'demo-grid' },
    { title: <span>下划线</span>, parent: 'btn5', itemClass: 'ss-col demo-bg-border' },
    { title: <span>边框色</span>, parent: 'btn5', itemClass: 'ss-col demo-bg-border-secondary' },
    { title: <span>input边线</span>, parent: 'btn5', itemClass: 'ss-col demo-bg-border-input' },
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
