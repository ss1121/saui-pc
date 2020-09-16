class DropPop extends React.Component {
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
    const disableds = state.isInput === false ? true : !state.inputVals && state.value && state.value.length >= state.max ? true : false
    const popClass = state.show ? 'dropdown-pop active' : 'dropdown-pop'
    return (
      <div id={_.uniqueId('dropdown')} className={'dropdown ' + this.state.dropdownClass}>
        <div className='dropdown-head-input'>
          {!state.inputVals ? this.mapGetVals(state.value) : ''}
          {
            !state.inputVals ?
              <input type='text' className='form_control' maxLength='200' disabled={disableds} placeholder={!disableds ? state.placeholder : ''}/>
            : <input type='text' className='form_control' maxLength='200' disabled={disableds} placeholder={state.placeholder} key={state.value} defaultValue={state.value} />
          }
          {state.inputVals && state.value != '' ? <i className='item-close'></i> : ''}
        </div>
        <div className={popClass}>{state.popContent}</div>
      </div>
    )
  }
}
const Action = {
  RESET(ostate) {
    return ostate
  },
  SHOW(ostate) {
    let curState = this.curState
    curState.show = true
    return curState
  },
  HIDE(ostate) {
    let curState = this.curState
    curState.show = false
    return curState
  },
  DELETEVALUES(ostate, param){
    //删除
    let curState = this.curState
    if (curState.value.length > 0) {
      const idx = _.findIndex(curState.value, item=>{return item.id === param.id})
      curState.value.splice(idx, 1)
    }
    if (typeof param.cb == 'function') {
      setTimeout(() => { param.cb(curState.value) }, 100);
    }
    return curState
  },
  SETVALUES(ostate, data){
    //添加
    let curState = this.curState
    if (curState.inputVals) {
      curState.value = typeof data === 'object' && data.length > 0 ? data[0].title : data
    }
    else {
      curState.value = data
    }
    return curState
  }
}

function drop (params) {
  let dft = {
    type: 'keyup',
    inputVals: false,            //为true时，选中的值赋在input value
    show: false,
    placeholder: '请选择',
    max: 4,
    popContent: '请输入关键字查询',
    isInput: true,               //是否允许输入
    onlyInput: false,             //只允许输入弹出
    keyupFunc: null,            //function 通过keyup，与业务配合，比如每输入一下，请求一次接口
    updateInitFunc: null,       //function 默认点击pop有数据，需要对数据作处理
    value: [],                  //赋值 [{title: '广州', id: 1554}]
    dropdownClass: '',
  }
  let opts = Object.assign(dft, params)
  const instance = Aotoo(DropPop, Action, opts)
  let status = true     //只允许执行一次 rendered
  instance.extend({
    hide: function (){
      this.$hide()
      $('.dropdown-pop').hasClass('active') ? $('.dropdown-pop').removeClass('active') : ''
    },
    getValue: function (){
      let curState = this.curState
      let val = curState && curState.value ? curState.value : opts.value
      return val
    },
    setValue: function(val) {
      let curState = this.curState
      // val = states ? _.concat(curState.value, val) : val
      this.$setvalues(val)
    },
    clearInput: function(dom) {
      $(dom).find('.form_control').val('')
    }
  })
  instance.on('rendered', function(options) {
    if (status) {
      const {dom, _opts, ctx} = options
      let isInput = opts.isInput
      let timeoutId = 0
      //点击输入框 弹出pop
      $(dom).off('click', '.dropdown-head-input, .dropdown-pop, .item-close').on('click', '.dropdown-head-input, .dropdown-pop, .item-close', function(e){
        e.stopPropagation()
        if (e.currentTarget.className == 'dropdown-head-input') {
          //点击input 弹出弹出层
          if (!opts.onlyInput) {
            ctx.hide()
            ctx.$show()
            typeof opts.updateInitFunc === 'function' ? opts.updateInitFunc.call(this) : ''
          }
        }
        else if (e.currentTarget.className == 'item-close') {
          //点击删除
          const id = parseInt($(this).parent().attr('data-id'))
          const that = this
          ctx.$deletevalues({
            id: id,
            cb: function(val) {
              typeof opts.delVals === 'function' ? opts.delVals.call(that, val) : ''
            }
          })
          
        }
        //dropdown-pop 阻止点击弹出层内容关闭弹出层
      })
      //允许输入
      if (isInput) {
        $(dom).find('.form_control').keyup(function(e){
          // e.stopPropagation()
          if ($(this).prop("disabled") !== true) {
            if ((ctx.curState && !ctx.curState.show) || opts.onlyInput) {
              ctx.hide()
              ctx.$show()
            }
            const vals = $(this).val()
            if (vals != '') {
              clearTimeout(timeoutId);
              timeoutId = setTimeout(function () {
                typeof opts.keyupFunc === 'function' ? opts.keyupFunc.call(this, vals) : ''
              }, 500)
            }
            else {
              ctx.hide()
            }
          }
        })
      }
      //点击其它关闭pop
      $(document).click(function () {
        if (!ctx.curState || (ctx.curState && ctx.curState.show)) {
          !opts.inputVals ? $(dom).find('.form_control').val('') : ''
          ctx.hide()
        }
      })
      status = false
    }
  })
  instance.setProps(opts)
  return instance
}
export default function (opts) {
  return drop(opts)
} 