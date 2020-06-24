import adapterDest from "./destination/adapterDest";
import list from 'component/modules/list'

module.exports = function(config) {
  let dft = {
    data: [],
    select: 0,
  }
  let opts = Object.assign(dft, config.tabsConfig)

  const listx = list({
    data: []
  })

  const Wrap = Aotoo.wrap(
    <div>
      <label className='ss-dest-form'><input type='text' className='form_control click-input' placeholder='请选择目的地' /></label>
      <div className='ss-pop-normal'>
        {adapterDest(opts, config.mddConfig)}
      </div>
      {listx.render()}
    </div>
    , function(dom) {
      $(document).click(function () {
        $(".ss-pop-normal").removeClass('active');
      });
      $(dom).find('.click-input').click(function(e){
        e.stopPropagation()
        $(dom).find('.ss-pop-normal').addClass('active')
      })
      .keyup(function (e) {
        e.stopPropagation()
        //输入内容....
        const val = $(this).val()
        $(".ss-pop-normal").removeClass('active');
        listx.$uplist([{ title: "bsam" }, { title: "bsam3" }]).$upclass('xx')
      })
      $(dom).find('.ss-pop-normal').click(function(e) {
        e.stopPropagation()
      })
      
    }
  )
  return <Wrap/>
}