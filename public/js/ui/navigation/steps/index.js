import list from 'component/modules/list'
import {form} from 'component/client'

// import {tabsWrap, tabsWrap2,tabsWrap3, LikeTabs} from "./tabs";


const adapterForm = (id, values) => {
  const data = [
    {
      input: {
        id: 'del_'+id,
        type: 'span',
        value: '删除',
        itemClass: 'item-del',
        attr: {id: id}
      }
    },
    {
      title: '标题',
      input: {
        id: 'name_'+ id,
        type: 'text',
        placeholder: '请输入',
      },
      required: true,
    },
    {
      title: '详细说明',
      input: {
        type: 'textarea', 
        id: 'textarea_'+ id, 
        placeholder: '请输入',
        maxLength: '200',
        desc: <p className="textarea-count">(<span className="countName">0</span>/200)</p>
      }
    },
  ]
  return form({
    data: data, 
    // listClass: 'demo-steps-form'
  })
}

function pages() {
  const stepsInst = []
  let idx = 0

  const stepsLikeData = (id, values) => {
    id = id || 0
    values = values || []
    stepsInst[id] = adapterForm(id, values)
    return [
      {title: <div className='demo-steps-form ml-14'>{stepsInst[id].render()}</div>}
    ]
  }

  const stepsLike = list({
    data: stepsLikeData(),
    footer: <p className='ss-item last'><a href='javascript:;' className='ss-button btn-default plain click-addBtn ml-14'>新增表单</a></p>,
    listClass: 'steps-list-column-dot',
    itemClass: 'ss-item'
  })

  stepsLike.on('rendered', function(options){
    const {dom, _opts, ctx} = options
    let loopTimmer
    $(dom).find('.item-del').off('click').on('click',function(e){
      e.stopPropagation()
      const id = parseInt($(this)[0].className.substr(-1))
      idx = idx - 1
      console.log(idx)
      ctx.$delete(id)
    })
    $(dom).find('.click-addBtn').off('click').on('click',function(e){
      e.stopPropagation()
      idx = idx + 1
      ctx.$append(stepsLikeData(idx))
      clearTimeout(loopTimmer)
      loopTimmer = setTimeout(() => {
        stepsInst.map((item, ii) => {
          item.values({[`name_${ii}`]: item.values('name_'+ii)})
          item.values({[`textarea_${ii}`]: item.values('textarea_'+ii)})
        })
      }, 500);
    })
  })


  const Pages = Aotoo.wrap(
    <div className='adminDiv' id='tabs'>
      <h2 className='item-title-lg'>Steps 步骤条</h2>
      {stepsLike.render()}
    </div>
  )
  return <Pages/>
}
export default pages()