//回车生成标签
class EnterTag extends React.Component {
  constructor(props){
    super(props)
    this.state = this.props
  }
  mapGetVals = (data) => {
    if (typeof data === 'object' && data.length > 0) {
      return data.map(item => {
        return <span key={_.uniqueId('dp')} data-id={item.id} className='valus-close'>{item.title}<i className='item-close'></i></span>
      })
    }
  }
  render() {
    const state = this.state
    let disabled = false
    let place = state.placeholde
    if (state.value && state.value.length >= state.max) {
      disabled = true
      place = ''
    }
    return (
      <div id={_.uniqueId('entertag')} className={'entertag ' + this.state.containerClass}>
        {!state.inputVals && state.value ? <div className='item-tag-list'>{this.mapGetVals(state.value)}</div> : ''}
        {
          <input type='text' className='form_control' maxLength='200' disabled={disabled} placeholder={place} />
        }
        {state.inputVals ? <i className='item-close'></i> : ''}
      </div>
    )
  }
}
const Action = {
  DELETEVALUES(ostate, param){
    //删除
    let curState = this.curState
    if (curState.value.length > 0) {
      const idx = _.findIndex(curState.value, item=>{return item.title === param.title})
      curState.value.splice(idx, 1)
    }
    return curState
  },
  SETVALUES(ostate, data){
    //添加
    let curState = this.curState
    curState.value.push(data)
    return curState
  }
}

export default function (params) {
  let dft = {
    placeholder: '请选择',
    max: 4,
    value: [],                //赋值 [{title: '广州'}]
    containerClass: ''
  }
  let opts = Object.assign(dft, params)
  const instance = Aotoo(EnterTag, Action, opts)
  let status = true     //只允许执行一次 rendered
  instance.on('rendered', function(options) {
    if (status) {
      const {dom, _opts, ctx} = options
      let isInput = opts.isInput
      let timeoutId = 0
      //点击输入框 弹出pop
      $(dom).off('click').on('click', '.item-close', function(e){
        e.stopPropagation()
        if (e.currentTarget.className == 'item-close') {
          //点击删除
          const vals = $(this).parent().text()
          const that = this
          ctx.$deletevalues({
            title: vals
          })
          
        }
      })
      $(dom).find('.form_control').keyup(function(e){
        e.stopPropagation()
        var theEvent = e || window.event;    
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;  
        if (code === 13) {
          const vals = $(this).val()
          // if(!vals) return
          ctx.$setvalues({title: vals})
          $(this).val('')
          const odata = ctx.getValue()
          if (_.findIndex(odata, o => o.title === vals) >= 0) {
            ctx.$deletevalues({
              title: vals
            })
          }
        }
      })
      status = false
    }
  })
  instance.extend({
    getValue: function (){
      let curState = this.curState
      let val = curState && curState.value ? curState.value : opts.value
      return val
    }
  })
  instance.setProps(opts)
  return instance
}