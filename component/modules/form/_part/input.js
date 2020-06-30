import itemHlc from 'component/mixins/itemhlc'
import store from 'component/mixins/storehlc'
import tree from 'component/util/tree'
import {list} from 'component'
import {smd} from 'libs'

const A = Array, O = Object
const rcbox = require('./radio')
// let saxer, context

const $text_type = ['text', 'password', 'select', 'tel', 'date', 'span', 'textarea']
  , $phold_type = ['text', 'password']
  , $radio_check = ['radio','checkbox']
  , $button_type = ['button','submit']

const inputAttributs ={
  placeholder: '',
  name: '',
  id: '',
  disabled: '',
  value: '',
  type: 'text',
  readOnly: '',
  maxLength: '',
  form: '',
  size: '',
  attrs: {}
}

function mkAttributs(p){
  let attrs = {}
  for (var attr in inputAttributs) {
    if (attr == 'value') {
      attrs['defaultValue'] = p[attr]
    }else if (attr == 'attrs') {
      var $attrs = p[attr]
      if ($attrs) {
        for (var $atr in $attrs) {
          attrs[('data-'+$atr)] = $attrs[$atr]
        }
      }
      // attrs['data-'] = p[attr]
    } else {
      attrs[attr] = p[attr]
    }
  }
  return attrs
}

/*
 * 生成select的表单
 * item 配置
*/

function __select(P){
  const attrs = mkAttributs(P)
  let options
  if (P.options) {
    const _data = tree(P.options)
    options = list({
      data: _data,
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
    <textarea ref={'#'+(P.id||P.name)} {...attrs} className="iconfont form-textarea" defaultValue={P.value}/>
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
  let _name

  // context = this
  if (Array.isArray(inputs)) {
    const elements = inputs.map( (ele, jj) => {
      _name = getTypeName(ele)
      // const $key = ele.id || ele.name || _.uniqueId('grpinput_')
      const $key = ele.id || ele.name || 'grpinput_'+ii+'_'+jj
      if (_name) return mk_element(_name, { key: $key, index: ii }, ctx)
    })

    const state = {
      show: item.show === false ? false : true
    }

    const mClass = item.multiplyClass ? 'inputMultiply '+item.multiplyClass : 'inputMultiply'
    const clsName = state.show ? mClass : mClass+' disN'
    return (
      <div key={'multi_'+ii} className={clsName}>
        {elements}
      </div>
    )
  }

  _name = getTypeName(inputs)
  if (_name) return mk_element(item, ii, ctx)
}

/*
 * mk_element
 * 分析配置文件，并输出结构
 *
 */
let tmp_P = {}
function mk_element(item, _i, ctx){
  const saxer = ctx.saxer
  const allocation = saxer.data.allocation
  let _title,
      _desc,
      _class,
      _union,
      labelObj,
      P,
      index = _i,
      key

  if (typeof _i == 'object') {
    index = _i.index
    _i = _i.key
  }
  P = typeof item == 'string'
  ? allocation[item]
  : ctx.props.getItemAllocation(item, index)[getTypeName(item.input)]
  // : allocation[getTypeName(item.input)]

  let state = { show: true }
  if (P) {
    state.show = P.profile.show === false ? false : true
  }

  _title = P.profile.title || P.attr.title || ''
  _desc = P.profile.desc || P.attr.desc || ''
  _class = P.attr.itemClass
  _union = P.union || P.profile.union || P.attr.union
  // if (_union && !tmp_P[P.id]) {
  if (_union) {
    tmp_P[P.id] = 'true'
    _union.target = {
      id: P.id,
      name: P.name,
      type: P.type
    }
    saxer.data.intent.push(_union)
  }

  // radio
  return $radio_check.indexOf(P.type) > -1
  ? ( ()=>{
    const resault = rcbox(P)
    const clsName = state.show ? resault.groupClass : resault.groupClass + ' disN'
    return (
      <div ref={resault.superID} key={"label" + _i} className={clsName}>
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
      <label ref={(P.id||P.name)} key={"label"+_i} className={clsName}>
        {P.profile.required ? <span className="fkp-input-required" /> : ''}
        {_title ? <span className="fkp-title">{_title}</span> : ''}
        <div className='fkp-content'>
          {ctx::whatTypeElement(P)}
          {<span className="fkp-input-error" />}
          {_desc ? <span className="fkp-desc">{_desc}</span> : ''}
        </div>
      </label>
    )
  })()
}



class Input extends React.Component {
  constructor(props){
    super(props)
    this.intent = []

    const data = this.props.data||[]
    this.state = {
      data: data
    }

    this.saxer = SAX(this.props.globalName)
    this.saxer.append({
      intent: [],
      allocation: this.props.allocation
    })

    this._preRender = this::this._preRender
    // mk_elements = this::mk_elements
    // mk_element = this::mk_element
  }

  _preRender(){
    const that = this
    return this.state.data.map( (item, i) => {
      if( typeof item == 'string') return <div key={'split'+i} className="split" dangerouslySetInnerHTML={{__html: smd(item)}}></div>
      return mk_elements(item, i, that)
    })
  }

  render(){
    // saxer = SAX(this.props.globalName)    // ???????
    const saxer = this.saxer
    saxer.data.intent=[]
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

function storeIt(key){
	if (typeof key == 'string') { storeAction(key) }
	return store(key, itemHlc(Input))
}

function storeAction(key){
  SAX.set(key, {}, {
    APPEND: function(data){
      let sdata = Array.from(this.state.data)
      sdata = sdata.concat(data)
      this.setState({ data: sdata })
    },

    UPDATESELECT: function(record){
      if (!record) return
      const {index, options} = record
      // let sdata = Array.from(this.state.data)
      // sdata[index].input['options'] = options
      // this.setState({ data: sdata })


      let state = _.cloneDeep(this.state)
      state.data[index].input['options'] = options
      this.setState(state)
    },

    REVIEW: function(item){
      // const renew = item.renew
      // let state = _.cloneDeep(this.state)
      // const _state = renew(state)
      // this.setState(_state)

      const renew = item.renew
      const id = renew.id
      const fun  = renew.fun
      let state = _.cloneDeep(this.state)

      const index = _.findIndex(state.data, function(o) { return (o.input.id == id||o.input.name == id); });
      const type = state.data[index].input.type
      if (type == 'select') {
        state.data[index].input['options'] = fun()
        this.setState(state)
      }
    }
  })
}

module.exports = storeIt;
