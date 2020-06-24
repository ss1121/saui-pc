import {smd} from 'libs'
Aotoo.inject.css([
    '/css/t/boostrap_datepick.css',
    // '/css/t/jx_datepicker.css'
  ])
  .js([
    '/js/t/boostrap_datepick.js',
    // '/js/t/jx_datepicker.js'
  ], waitForInject)

const waitForQueue = []
let injectTimmer
let injectFailed = true

function waitForInject(callback) {
  if (Aotoo.isClient) {
    // const len = $('.datetimepicker').length
    // if (len>2) {
    //   $('.datetimepicker').each((ii, item)=>{
    //     if (ii<len-2) {
    //       item.remove()
    //     }
    //   })
    // }
    
    if (typeof callback === 'function') {
      waitForQueue.push(callback)
    }
  
    if ($.fn.datetimepicker) {
      clearTimeout(injectTimmer)
      if (injectFailed) {
        injectFailed = false
        setTimeout(() => {
          if (waitForQueue && waitForQueue.length) {
            const method = waitForQueue.shift()
            method()
            if (waitForQueue && waitForQueue.length) {
              waitForInject()
            }
          }
        }, 100);
      } else {
        if (waitForQueue && waitForQueue.length) {
          const method = waitForQueue.shift()
          method()
          if (waitForQueue && waitForQueue.length) {
            waitForInject()
          }
        }
      }
    } else {
      injectTimmer = setTimeout(() => {
        waitForInject()
      }, 200);
    }
  }
}
import '../../datetimepicker/jq'
const list = Aotoo.list
const tree = Aotoo.tree
const itemHlc = Aotoo.wrap
const rcbox = require('../_part/radio')

const $text_type = ['text', 'password', 'select', 'tel', 'date', 'span', 'textarea'],
  $phold_type = ['text', 'password'],
  $radio_check = ['radio', 'checkbox'],
  $button_type = ['button', 'submit'],
  A = Array,
  O = Object

const inputAttributs = {
  placeholder: '',
  name: '',
  autoComplete: 'on',
  id: '',
  disabled: '',
  value: '',
  type: 'text',
  readOnly: '',
  maxLength: '',
  form: '',
  size: '',
  attrs: {},
  attr: {},
}

function createAllocation(data) {
  let allocation = {}
  data.forEach((item, ii) => allocation = _.merge(allocation, getItemAllocation(item, ii)) )
  return allocation
}

function getTypeName(item) {
  if ($radio_check.indexOf(item.type) > -1) {
    return typeof item.name == 'string' ?
      item.id || item.name :
      A.isArray(item.name) ?
      item.name[0] :
      ''
  } else {
    return item.id || item.name
  }
}

// 生成配置文件，并挂在到state上
function getItemAllocation(data, index){
  if (typeof data == 'string') return
  let dft = {    // props
    _index: index,
    id: '',
    name: '',
    type: 'text',
    value: '',
    placeholder: '',
    autoComplete: ''
  }

  let dftAttr = {   // attrs
    value: '',
    title: '',
    desc: '',
    itemClass: 'inputItem',
    disabled: '',
    required: '',
    readOnly: '',
    maxlength: '',
    form: '',
    size: '',
    show: true,
    text: ''
    // union: {}
  }

  let profile = {}
  O.keys(data).forEach( item => {
    if (item != 'input') profile[item] = data[item]
    if (item == 'itemClass') {
      profile[item] = data[item] ? 'inputItem ' + data[item] : 'inputItem'
    }
  })

  // 第一次设置attr，可能包含了union
  // dft.attr = profile
  dft.profile = profile

  // 第二次设置attr，不能包含union，union不能在input里面设定
  function resetAttr(item, isary){
    let _props = item.props||item
    let attr = {}
    O.keys(dftAttr).forEach( attribut => {
      if (attribut == 'itemClass') {
        attr[attribut] = _props[attribut]
        ? 'inputItem '+ _props[attribut]
        : 'inputItem'
      } else {
        attr[attribut] = isary
        ? _props[attribut] || ''
        : _props[attribut] || ''
        // : _props[attribut] || profile[attribut]
      }
      // delete _props[attribut]
    })
    // return {..._props, attr}
    const res = {attr, ..._props}
    if (res.itemClass) {
      if (res.itemClass.indexOf('inputItem') == -1) {
        res.itemClass = 'inputItem '+ res.itemClass
      }
    } else {
      res.itemClass = 'inputItem'
    }

    if (res.attrs) {
      res.attr = _.merge({}, res.attr, res.attrs)
      delete res.attrs
    }
    return res
  }

  let assets = []
  let inputs = data.input
  A.isArray(inputs)
  ? assets = inputs.map( item => _.merge({}, dft, resetAttr(item, true)) )
  : assets.push( _.merge({}, dft, resetAttr(inputs)) )
  // map id to state.allocation
  let allocation = {}
  assets.forEach( item => {
    const _name = getTypeName(item)
    if (_name) allocation[_name] = item
  })

  return allocation
}


const accessAttrs = ['value', 'id', 'name', 'text']
function mkAttributs(p){
  let attrs = {}
  if (inputAttributs['attr']) {
    inputAttributs['attrs'] = _.merge({}, inputAttributs['attr'])
    delete inputAttributs['attr']
  }
  for (var attr in inputAttributs) {
    if (attr == 'value') {
      let pval = p[attr]
      if (typeof pval == 'number') pval = pval.toString()
      attrs['defaultValue'] = pval
    }else if (attr == 'attrs') {
      var $attrs = p['attrs']||p['attr']
      if ($attrs) {
        for (var $atr in $attrs) {
          if ( p.type=='select' && $atr == 'text' && (p['text']||$attrs['text'])) {
            let textVal = p['text'] || $attrs['text']
            if (typeof textVal == 'number') textVal = textVal.toString()
            attrs['defaultValue'] = textVal
            attrs[('data-' + $atr)] = textVal
          // } else if (accessAttrs.indexOf($atr) > -1 && ($attrs[$atr] || $attrs[$atr] == 0)) {
          } else if ($attrs[$atr] || $attrs[$atr] == 0) {
            let attrVal = $attrs[$atr]
            if (typeof attrVal == 'number') attrVal = attrVal.toString()
            if (attrVal) {
              attrs[('data-' + $atr)] = attrVal
            }
          }
        }
      }
      // attrs['data-'] = p[attr]
    } else {
      attrs[attr] = p[attr]
    }
  }
  return attrs
}

// =================================
// =================================
// =================================
// =================================

/*
 * 生成select的表单
 * item 配置
*/

function __select(P){
  const attrs = mkAttributs(P)
  let options
  if (P.options) {
    // const _data = tree(P.options)
    options = tree({
      data: P.options,
      itemClass: 'fkp-dd-option',
    })
  }
  return (
    <span className="fkp-dd">
      <input ref={'#'+P.id} type='text' className="form_control fkp-dd-input" {...attrs} />
      <div ref={'+'+P.id} className='fkp-dd-list'>
        {options}
      </div>
    </span>
  )
}

function mk_select(P){
  return __select(P)
}

function mk_datepicker(P){
  let attrs = mkAttributs(P)
  attrs.type = 'text'
  return (
    <label className="form-datepicker">
      <input ref={'#'+P.id} type='text' className="form_control" {...attrs} />
    </label>
  )
}

function mk_span(P){
  const attrs = mkAttributs(P)
  return (
    <span className="form-span" id={P.id}>
      {P.value}
    </span>
  )
}

function mk_textarea(P){
  const attrs = mkAttributs(P)
  return (
    <div className="htextarea">
      <textarea ref={'#'+(P.id||P.name)} {...attrs} className="form-textarea" defaultValue={P.value}/>
    </div>
  )
}

// 'text', 'password', 'select', 'tel'
function whatTypeElement(P){
  const attrs = mkAttributs(P)
  if (_.indexOf($text_type, P.type)>-1){
    if (P.type === 'select') return mk_select(P)
    if (P.type == 'date') return mk_datepicker(P)
    if (P.type == 'span') return mk_span(P)
    if (P.type == 'textarea') return mk_textarea(P)
    if (_.indexOf($phold_type, P.type)>-1){
      return (
        <input
          ref={'#'+(P.id||P.name)}
          className='form_control'
          {...attrs}
        />
      )
    }

    return (
      <input
        ref={'#'+(P.id||P.name)}
        className='form_control'
        {...attrs}
      />
    )
  }

  if (_.indexOf($button_type, P.type)>-1){
    return (
      <input
        ref={'#'+(P.id||P.name)}
        className='btn'
        {...attrs}
      />
    )
  }
}

function getTypeName(item){
  if ($radio_check.indexOf(item.type)>-1) {
    return typeof item.name == 'string'
    ? item.id||item.name
    : A.isArray(item.name)
      ? item.name[0]
      : ''
  } else {
    return item.id||item.name
  }
}

function mk_elements(item, ii, ctx){
  const inputs = item.input
  // const allocation = createAllocation(ctx.state.data)

  // 必须为boolean项的比较
  const state = { show: item.show === false ? false : true }
  let _name

  if (Array.isArray(inputs)) {
    const elements = inputs.map( (ele, jj) => {
      _name = getTypeName(ele)
      const $key = ele.id || ele.name || 'grpinput_'+ii+'_'+jj
      if (_name) {
        return mk_element(_name, { key: $key, index: ii }, ctx)
      }
    })

    const mClass = item.multiplyClass ? 'inputMultiply '+item.multiplyClass : 'inputMultiply'
    const clsName = state.show ? mClass : mClass+' disN'
    return (
      <div key={'multi_'+ii} className={clsName}>
        {elements}
      </div>
    )
  }

  _name = getTypeName(inputs)
  if (_name) {
    return mk_element(item, ii, ctx)
  }
}

/*
 * mk_element
 * 分析配置文件，并输出结构
 *
 */
let tmp_P = {}
function mk_element(item, _i, ctx) {
  const saxer = ctx.saxer
  const allocation = saxer.data('allocation')
  let _title,
      _desc,
      _class,
      _union,
      lableObj,
      P,
      index = _i,
      key

  if (typeof _i == 'object') {
    index = _i.index
    _i = _i.key
  }
  
  P = typeof item == 'string'
  ? allocation[item]
  // : getItemAllocation(item, index)[getTypeName(item.input)]
  : allocation[getTypeName(item.input)]

  let state = { show: true }
  if (P) {
    state.show = P.profile.show === false ? false : true
  }
  _title = P.profile.title || P.attr.title || ''
  _desc = P.profile.desc || P.attr.desc || P.desc || ''
  _class = P.attr.itemClass || P.itemClass
  _union = P.union || P.profile.union || P.attr.union
  // if (_union && !tmp_P[P.id]) {
  if (_union) {
    tmp_P[P.id] = 'true'
    _union.target = {
      id: P.id,
      name: P.name,
      type: P.type
    }
    saxer.data('intent').push(_union)
  }

  // radio
  return $radio_check.indexOf(P.type) > -1
  ? ( ()=>{
    const resault = rcbox(P)
    const clsName = state.show ? resault.groupClass : resault.groupClass + ' disN'
    return (
      <div ref={resault.superID} key={"lable" + _i} className={clsName}>
        {P.profile.required ? <span className="fkp-input-required" /> : ''}
        {resault.title ? <span className="fkp-title">{resault.title}</span> : ''}
        <div className='fkp-content'>
          {resault.fill}
          <span className="fkp-input-error" />
          {resault.desc ? <span className="fkp-desc">{resault.desc}</span> : ''}
        </div>
      </div>
    )
  })()

  : ( ()=>{
    const myClsName = _class + ' for-' + (P.id||P.name||'')
    const clsName = state.show ? myClsName : myClsName + ' disN'
    return (
      <lable ref={(P.id||P.name)} key={"lable"+_i} className={clsName}>
        {P.profile.required ? <span className="fkp-input-required" /> : ''}
        {_title ? <span className="fkp-title">{_title}</span> : ''}
        <div className='fkp-content'>
          {ctx::whatTypeElement(P)}
          <span className="fkp-input-error" />
          {_desc ? <span className="fkp-desc">{_desc}</span> : ''}
        </div>
      </lable>
    )
  })()
}

class Input extends React.Component {
  constructor(props){
    super(props)
    const that = this
    this.state = {
      data: this.props.data || []
    }
    this._preRender = this._preRender.bind(this)
  }

  _preRender(){
    return this.state.data.map((item, ii) => typeof item == 'string' 
      ? <div key={'split' + ii} className="split" dangerouslySetInnerHTML={{ __html: smd(item) }}></div>
      : mk_elements(item, ii, this) )
  }

  render(){
    const allocation = createAllocation(this.state.data)
    this.saxer.set('allocation', allocation)
    this.emit('setallocation', allocation)
    this.saxer.set('intent', [])
    // this.saxer.data({allocation})
    let fill = this._preRender()
    let _cls = 'inputGroup'
    if (this.props.listClass) _cls = 'inputGroup '+this.props.listClass
    return (
      <div className={_cls}>
        {this.state.fill||fill}
      </div>
    )
  }
}

Input.defaultProps = {
  data: []
}

// ctx.form[item.id] = val
// thisInput.setAttribute('data-value', val)
// thisInput.value = val

function reviewSelect(state, renew, ctx) {
  const {id, fun} = renew
  state.data.forEach(o => {
    const input = o.input
    if (input) {
      if (Array.isArray(input)) {
        o.input = input.map(item=>reviewInputItem(item, renew, o, ctx))
      } else {
        o.input = reviewInputItem(input, renew, o, ctx)
      }
    }
  })
  return state
}

function reviewInputItem(input, renew, o, ctx){
  const {id, fun} = renew
  if ((input.id == id || input.name == id) && input.type == 'select' && typeof fun == 'function') {
    const res = fun()
    input.itemClass = input.itemClass ? 'inputItem '+ input.itemClass : 'inputItem'
    if (_.isArray(res)) {
      input.options = res  
    } else {
      input.value = res.value || input.value ||''
      if (!input.value) delete input.value
      if (input.value) {
        if (input.attr) {
          input.attr['value'] = input.value
        } else {
          input.attr = {value: input.value}
        }
      }
      input.text = res.text || input.text || ''
      if (!input.text) delete input.text
      if (input.text) {
        if (input.attr) input.attr['text'] = input.text
        else {
          input.attr = {text: input.text}
        }
        delete input.text
      }
      input.options = _.isArray(res.options) ? res.options : input.options
    }
  }
  let res = ctx.emit('reviewInputItem', {id, input})
  if (res && _.isPlainObject(res)) {
    return res
  }
  return input
}

// function reviewSelect(state, renew) {
//   const {id, fun} = renew
//   const mapdata = state.data.map(o => {
//     // let input = o.input || o
//     let input = o.input
//     if (Array.isArray(input)) {
//       // const res = reviewSelect({data: input}, renew)
//       // input = res.data
//       input = input.map(item=>{
//         if ((item.id == id || item.name == id) && item.type == 'select' && typeof fun == 'function') {
//           item.options = fun()
//         }
//         return item
//       })
//     } else {
//       if ((input.id == id || input.name == id) && input.type == 'select' && typeof fun == 'function') {
//         input.options = fun()
//       }
//     }
//     return o
//   })
//   console.log(mapdata)
//   state.data = mapdata
//   return state
// }


const Actions = {
  APPEND: function(ostate, param){
    let state = this.curState
    state.data = state.data.concat(param)
    return state
  },

  UPDATESELECT: function(ostate, record){
    if (record) {
      const { index, options } = record
      let state = this.curState
      state.data[index].input['options'] = options
      return state
    }
  },

  UPDATE: function (ostate, option, ctx) {
    let state = this.curState
    if (Array.isArray(option)) {
      state.data = option
    } else {
      const {index, data} = option
      state.data[index].input = data
    }
    ctx.on('setallocation', function(param){
      ctx.allocation = param
    })
    return state
  },

  EMPTY: function(ostate, opts, ctx){
    let state = this.curState
    if (Array.isArray(opts)) {
      state.data.forEach(o => {
        const input = o.input
        if (Array.isArray(input)) {
          o.input = input.map(item=>{
            if (opts.indexOf((item.id||item.name))>-1) {
              item.value = ''
              if (item.type == 'select'){
                if (item.attr) {
                  if (item.attr.value) delete item.attr.value
                  if (item.attr.text) delete item.attr.text
                }
              }
            }
            return item
          })
        } else {
          if (opts.indexOf((input.id||input.name))>-1) {
            input.value = ''
            if (input.type == 'select'){
              if (input.attr) {
                delete input.attr.value
                delete input.attr.text
              }
            }
          }
        }
      })
      return state
    }
  },

  REVIEW: function(ostate, item, ctx){
    const renew = item.renew
    const {id, fun} = renew
    let state = this.curState
    return reviewSelect(state, renew, ctx)

    // const index = _.findIndex(state.data, o => (o.input.id == id || o.input.name == id) )
    // if (index > -1) {
    //   const type = state.data[index].input.type
    //   if (type == 'select') {
    //     state.data[index].input['options'] = fun()
    //   }
    // }
    // return state
  }
}

function inputRendered(param) {
  const {dom} = param
  let intent = this.data('intent')
  this.ipt = dom
  injectFailed = true
  waitForInject(() => {
    require('../_part/selectx')(this, intent) // 引入select
    if (Aotoo.isFunction(this.xInst.props.callback)) {
      this.xInst.props.callback.call(dom, this)
    }
  })
}

function FormInputX(config) {
  let inputInstance = Aotoo(Input, Actions, config)
  const allocation = createAllocation(config.props.data)
  inputInstance.data({allocation, intent: []})
  inputInstance.off('rendered')
  inputInstance.on('rendered', inputRendered.bind(inputInstance))
  inputInstance.extend({
    ipt: undefined,
    form: {},
    allocation,
    elements(id, label){
      if (this.hasMounted()) {
        let elements = this.xInst.refs
        if (id == 'all') return elements
        if (id.charAt(0) == '#' || id.charAt(0) == '+') return elements[id]
        return label ? elements[id] : elements['#' + id] || elements[id]
      }
    },
    getElements(id) {
      return this.elements(id)
    },

    append(params) {
      this.$append(params)
    },

    review(id, fun) {
      this.$review({
        renew: {
          id: id,
          fun: fun
        }
      })
    },

    empty(id){
      const eptIds = []
      if (Array.isArray(id)) {
        id.forEach(key=>{
          if (typeof key == 'string') {
            this.form[key] = undefined
            eptIds.push(key)
            const thisInput = this.getElements(key)
            if (thisInput && thisInput.removeAttribute) {
              // this.form[id] = ''//undefined
              thisInput.removeAttribute('data-value')
              thisInput.removeAttribute('data-text')
              thisInput.value = ''
            }
          }
        })
        if (eptIds.length) {
          this.$empty(eptIds)
        }
      } else {
        if (typeof id == 'string') {
          this.form[id] = undefined
          const thisInput = this.getElements(id)
          if (thisInput && thisInput.removeAttribute) {
            // this.form[id] = ''//undefined
            thisInput.removeAttribute('data-value')
            thisInput.removeAttribute('data-text')
            thisInput.value = ''
          }
          this.$empty([id])
        }
      }
    },

    values(data, asm) {
      if (!data) return this.form
      if (typeof data == 'string') {
        let _val = this.form[data]
        if (!_val) {
          let obj = $('#'+data)
          if (obj.length) {
            return obj.val()
          }
        }
        return this.form[data]
      }
      if (typeof data == 'object') {
        let allocation = this.data('allocation'),
          elements = this.elements,
          form = this.form
        Object.keys(data).forEach(item => {
          if (allocation[item]) {
            if (!asm) {
              if (allocation[item].type == 'checkbox' || allocation[item].type == 'radio') {
                let _val = []
                let checkedVal = []
                let dataValue = data[item]
                const itemType = allocation[item].type
                const isCheckbox = itemType == 'checkbox'
  
                if (dataValue && (Array.isArray(dataValue) || typeof dataValue == 'string' || typeof dataValue == 'number')) {
                  if (Array.isArray(dataValue)) {
                    dataValue = dataValue.map( v => v.toString())
                  } else {
                    dataValue = [dataValue.toString()]
                  }
                } else {
                  dataValue = undefined
                }
  
                if (dataValue) {
                  allocation[item].value.forEach((val, ii) => {
                    const rcbox = elements(item + '-' + ii)
                    const domValue = rcbox.value.toString().replace('-', '')
                    if (dataValue.indexOf(domValue) > -1) {
                      rcbox.checked = 'checked'
                      if (isCheckbox) {
                        checkedVal = checkedVal ? checkedVal.concat(domValue) : [domValue]
                      } else {
                        checkedVal = [domValue]
                      }
                      _val.push('-'+domValue)
                    } else {
                      _val.push(domValue)
                    }
                  });
                } else {
                  allocation[item].value.forEach((val, ii) => {
                    const rcbox = elements(item + '-' + ii)
                    if (rcbox.checked) {
                      const $val = rcbox.value.toString().replace('-', '')
                      _val.push('-' + $val)
                      checkedVal.push($val)
                    } else {
                      _val.push(rcbox.value)
                    }
                  });
                }
                form[item] = checkedVal
                allocation[item].value = _val
              } else {
                if (allocation[item].type == 'select') {
                  let dataItem = data[item]
                  let selectText = dataItem
                  let selectValue = dataItem
                  if (typeof dataItem == 'object') {
                    selectText = dataItem['text'] || dataItem['value'] || '';
                    selectValue = dataItem['value']
                  }
                  this.form[item] = selectValue
                  elements(item).value = selectText
                  elements(item)['data-text'] = selectText
                  elements(item)['data-value'] = selectValue
                  allocation[item].value = selectText
                  allocation[item].attr = allocation[item].attr || {value: selectValue}
                  allocation[item].attr['text'] = selectText
                  // this.form[item] = data[item]
                  // elements(item).value = data[item]
                  // allocation[item].value = data[item]
                } else {
                  this.form[item] = data[item]
                  elements(item).value = data[item]
                  allocation[item].value = data[item]
                }
              }
            } else {
              if (allocation[item].type == 'text') {
                this.form[item] = data[item]
                elements(item).value = data[item]
                allocation[item].value = data[item]
              } else if (allocation[item].type == 'select') {
                form[item] = ''
                elements(item).value = ''
                allocation[item].value = ''
              } else if (allocation[item].type == 'checkbox' || allocation[item].type == 'radio') {
                let _val = []
                if (data[item].length) {
                  data[item].map((_checkbox, ii) => {
                    // const xxx = elements(item+'-'+(parseInt(cb)-1))
                    // const xxx = elements(item+'-'+parseInt(_checkbox))
                    const xxx = elements(item + '-' + parseInt(ii))
                    if (typeof _checkbox == 'number') {
                      if (_checkbox < 0) {
                        xxx.checked = true
                        _val.push(xxx.value)
                      }
                    }
                  })
                } else {
                  allocation[item].title.map((_ckbox, jj) => {
                    const xxx = elements(item + '-' + jj)
                    xxx.checked = false
                  })
                }
                form[item] = _val
                allocation[item].value = _val
              }
            }
          }
        })
        this.data({allocation})
      }
    },

    addWarn(id, message, opts) {
      let dftClsName = 'warning'
      let dftItemClsName = 'itemError'
      if (opts && typeof opts == 'object') {
        if (opts.className) {
          dftClsName = opts.className
          dftItemClsName = 'itemError ' + opts.className + "_itemError"
        }
      }
      const theInput = this.elements(id)
      if (theInput) {
        const lable = this.elements(id, 'lable')
        if (message) {
          $(theInput).addClass(dftItemClsName)
          if (React.isValidElement(message)) {
            const errDom = $(lable).find('>.fkp-content >.fkp-input-error').addClass(dftClsName)[0]
            React.render(message, errDom)
          } else {
            $(lable).find('>.fkp-content >.fkp-input-error').addClass(dftClsName).html(message)
          }
        } else {
          $(theInput).addClass(dftItemClsName)
        }
      }
    },

    addTips(id, message) {
      const theInput = this.elements(id)
      if (theInput) {
        const lable = this.elements(id, 'lable')
        if (message) {
          if (React.isValidElement(message)) {
            const errDom = $(lable).find('>.fkp-content >.fkp-input-error')[0]
            React.render(message, errDom)
          } else {
            $(lable).find('>.fkp-content >.fkp-input-error').addClass('warning').html(message)
          }
        }
      }
    },

    removeWarn(id, message) {
      const theInput = this.elements(id)
      if (theInput) {
        const lable = this.elements(id, 'lable')
        if (message) {
          $(theInput).removeClass('itemError')
          if (React.isValidElement(message)) {
            const errDom = $(lable).find('>.fkp-content >.fkp-input-error')
            React.render(message, errDom)
          } else {
            $(lable).find('>.fkp-content >.fkp-input-error').removeClass('warning').removeClass('error').addClass('success').html(message)
          }
        } else {
          $(theInput).removeClass('itemError').next().removeClass('warning').removeClass('error').addClass('success')
          $(lable).find('>.fkp-content >.fkp-input-error').removeClass('warning').removeClass('error').addClass('success').empty()
        }
      }
    },

    warning(id, clear) {
      this.addWarn(id, clear)
    }
  })

  return inputInstance
}

export default function myInputs(opts, callback) {
  let dft = {
    data: [],
    container: undefined,
    listClass: undefined,
    rendered: undefined,
    props: {}
  }

  dft = _.extend(dft, opts)
  
  dft.props = {
    data: dft.props.data || dft.data,
    listClass: dft.props.listClass || dft.listClass,
    callback: dft.props.rendered || dft.props.itemMethod || dft.rendered || dft.itemMethod || callback
  }
  
  return FormInputX(dft)
}

export function pure(opts, callback) {
  return myInputs(opts, callback)
}