import {inject} from 'libs'
const Input = require('../_part/input')
import BaseClass from 'component/class/base'

const $text_type = ['text', 'password', 'select', 'tel', 'date', 'span']
    , $phold_type = ['text', 'password']
    , $radio_check = ['radio','checkbox']
    , $button_type = ['button','submit']
    , A = Array
    , O = Object

// 生成dom映射数据 {domID: dom's allocation}
// {username: {id, type, value, attr:{title, desc, required}}, union:{id, callback, target} }
function createAllocation(data){
  let allocation = {}
  data.forEach( (item, ii) => {
    // allocation = this::createStore(allocation, getItemAllocation(item, ii))
    allocation = _.merge(allocation, getItemAllocation(item, ii) )
  })
  return allocation
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

// 生成配置文件，并挂在到state上
function getItemAllocation(data, index){
  if (typeof data == 'string') return
  const dft = {    // props
    _index: index,
    id: '',
    name: '',
    type: 'text',
    value: '',
    placeholder: ''
  }

  const dftAttr = {   // attrs
    title: '',
    desc: '',
    itemClass: 'inputItem',
    disabled: '',
    required: '',
    readOnly: '',
    maxlength: '',
    form: '',
    size: '',
    show: true
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
    return {..._props, attr}
  }

  let assets = []
  const inputs = data.input
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


function defMenthod(ctx){
  return function(dom, intent){
    inject().css('/css/t/boostrap_datepick.css')
    .js('/js/t/boostrap_datepick.js', ()=>{
        const dft = ctx.config
        ctx.ipt = dom
        let elements = this.refs
        ctx.elements = function(id, lable){
          if (id == 'all') return elements
          if (id.charAt(0) == '#' || id.charAt(0) == '+') return elements[id]
          return lable ? elements[id] : elements['#'+id]||elements[id]
        }
        ctx.getElements = function(id){
          if (!id) return elements
          return elements[id]
        }
        require('../_part/select')(ctx, intent)  // 引入select
        if (typeof dft.callback == 'function') dft.callback.call(dom, ctx)

        ctx.actions.roll('datapicker')

        ctx.emit('injected')
    })

    // inject().css('/css/t/boostrap_datepick.css')
    // .js('/js/t/boostrap_datepick.js', ()=>{
    //   _.delay(()=>{
    //     ctx.actions.roll('datapicker')
    //   }, 200)
    // })

    // const dft = ctx.config
    // ctx.ipt = dom
    // let elements = this.refs
    // ctx.elements = function(id, lable){
    //   if (id == 'all') return elements
    //   if (id.charAt(0) == '#' || id.charAt(0) == '+') return elements[id]
    //   return lable ? elements[id] : elements['#'+id]
    // }
    // ctx.getElements = function(id){
    //   if (!id) return elements
    //   return elements[id]
    // }
    // require('../_part/select')(ctx, intent)  // 引入select
    // if (typeof dft.callback == 'function') dft.callback.call(dom, ctx)
  }
}


class FormInput extends BaseClass{
  constructor(config){
    super(config)
    this.form = {}
    this.elements
    this.timmer
    this.allocation = this::createAllocation(config.data)

    this.values = this::this.values
    this.review = this::this.review
    this.append = this::this.append
    this.warning = this::this.warning
    this.addWarn = this::this.addWarn
    this.addTips = this::this.addTips
    this.removeWarn = this::this.removeWarn
  }

  append(data){
    this.actions.roll('APPEND', data)
  }

  review(id, fun){
    // this.actions.roll('REVIEW', {renew: fun})
    this.actions.roll('REVIEW', {renew: {id: id, fun: fun}})
  }

  componentWill(){
    const dft = this.config
    let Inputs = Input(dft.globalName)
    this.eles = (
      <Inputs
        allocation={this.allocation}
        getItemAllocation={getItemAllocation}
        globalName={dft.globalName}
        listClass={dft.listClass}
        data={dft.data}
        itemMethod={dft.itemMethod}
        itemDefaultMethod={defMenthod(this)}/>
    )
  }

  // 获取所有元素的即时值  asm（assignment-->判断是否是赋值过程）
  values(data, asm){
    if (!data) return this.form
    if (typeof data == 'string') return this.form[data]
    if (typeof data == 'object') {
      // setTimeout(()=>{
        let allocation = this.allocation
        , elements = this.elements
        , form = this.form
        Object.keys(data).forEach( item => {
          if(!asm){
            if (allocation[item].type == 'checkbox' || allocation[item].type == 'radio') {
              let _val = []
              let checkedVal = []
              allocation[item].value.forEach((val, ii) => {
                const rcbox = elements(item+'-'+ii)
                if (rcbox.checked) {
                  const $val = rcbox.value.toString().replace('-', '')
                  _val.push('-'+$val)
                  checkedVal.push($val)
                } else {
                  _val.push(rcbox.value)
                }
              });
              form[item] = checkedVal
              allocation[item].value = _val
            } else {
              this.form[item] = data[item]
              elements(item).value = data[item]
              allocation[item].value = data[item]
            }
          }else{
            if(allocation[item].type == 'text'){
              this.form[item] = data[item]
              elements(item).value = data[item]
              allocation[item].value = data[item]
            }else if(allocation[item].type == 'select'){
              form[item] = ''
              elements(item).value = ''
              allocation[item].value = ''
            }else if(allocation[item].type == 'checkbox' || allocation[item].type == 'radio'){
              let _val = []
              if (data[item].length) {
                data[item].map( (_checkbox, ii)=> {
                  // const xxx = elements(item+'-'+(parseInt(cb)-1))
                  // const xxx = elements(item+'-'+parseInt(_checkbox))
                  const xxx = elements(item+'-'+parseInt(ii))
                  if (typeof _checkbox == 'number') {
                    if (_checkbox < 0) {
                      xxx.checked = true
                      _val.push(xxx.value)
                    }
                  }
                })
              } else {
                allocation[item].title.map( (_ckbox, jj) => {
                  const xxx = elements(item+'-'+jj)
                  xxx.checked = false
                })
              }
              form[item] = _val
              allocation[item].value = _val
            }
          }
        })
      // }, 50)
    }
  }

  addWarn(id, message, opts){
    let dftClsName = 'warning'
    let dftItemClsName = 'itemError'
    if (opts && typeof opts == 'object'){
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
          const errDom = $(lable).find('.fkp-input-error').addClass(dftClsName)[0]
          React.render(message, errDom)
        } else {
          $(lable).find('.fkp-input-error').addClass(dftClsName).html(message)
        }
      } else {
        $(theInput).addClass(dftItemClsName)
      }
    }
  }

  addTips(id, message){
    const theInput = this.elements(id)
    if (theInput) {
      const lable = this.elements(id, 'lable')
      if (message) {
        if (React.isValidElement(message)) {
          const errDom = $(lable).find('.fkp-input-error')[0]
          React.render(message, errDom)
        } else {
          $(lable).find('.fkp-input-error').addClass('warning').html(message)
        }
      }
    }
  }

  removeWarn(id, message){
    const theInput = this.elements(id)
    if (theInput) {
      const lable = this.elements(id, 'lable')
      if (message) {
        $(theInput).removeClass('itemError')
        if (React.isValidElement(message)) {
          const errDom = $(lable).find('.fkp-input-error')
          React.render(message, errDom)
        } else {
          $(lable).find('.fkp-input-error').removeClass('warning').removeClass('error').addClass('success').html(message)
        }
      } else {
        $(theInput).removeClass('itemError').next().removeClass('warning').removeClass('error').addClass('success')
        $(lable).find('.fkp-input-error').removeClass('warning').removeClass('error').addClass('success').empty()
      }
    }
  }

  warning(id, clear){
    this.addWarn(id, clear)
  }
}


export default function formInput(opts, callback){
  let noop = function(){}
  let dft = {
    data: [],
    container: '',
    listClass: '',
    rendered: '',
    globalName: _.uniqueId('Input_'),
    // theme: 'form',
    itemMethod: noop,
    callback: callback
  }
  dft = _.extend(dft, opts)
  if (typeof callback == 'function') {
    dft.callback = callback
  }
  return new FormInput(dft)
}

export function pure(props, cb){
  return formInput(props, cb)
}
