function pages(params) {
  const Welcome = Aotoo.wrap(
    <div className='pages-welcome'>
      <div className='item-bg'>
        <div className='item-content'>
          <h2 className='item-title'>唐先生,欢迎您回来</h2>
          <p className='item-desc'>上次登录时间：2020-06-15 13:27</p>
        </div>
      </div>
    </div>
  )
  return <Welcome/>
}


export default pages()