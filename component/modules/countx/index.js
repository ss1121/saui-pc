class Count extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      data: this.props.data,
      plus: this.props.plus,
      minus: this.props.minus,
    }
  }
  render(){
    let that = this
    let countList = [];
    let { data } = this.state
    let { listClass } = this.props
    data.map((item) => {
      let { title, icon, value, itemClass, tips, warning, error } = item
      countList.push({
        title: (
          <div className="countx-content">
            <span className="countx-title">{ title }</span>
            {icon ? <span className="countx-icon">{icon}</span> : '' }
            <span>{ typeof value == 'number' ? value : 0 }</span>
            <div className='countx-btn'>
              <p className="countx-plus">+</p>
              <p className="countx-minus">-</p>
            </div>
            {tips?<div className="countx-tips" style={{display: 'none'}}>{ tips }</div>:''}
            { warning ? <div className="countx-warning">{ warning }</div> : '' }
            { error ? <div className="countx-error">{ error }</div> : '' }
          </div>
        ),
        itemClass: 'countx-list-item ' + (itemClass ? itemClass : '')
      })
    })
    return (
      <div className='countx-wrapper'>
        { this.list({
          data: countList,
          listClass: 'countx-list ' + (listClass ? listClass : '')
        }) }
      </div>
    )
  }
}

const Actions = {
  PLUS: function (ostate, opts){
    let curState = this.curState;
    let { index } = opts
    let data = curState.data[index]
    let disabled = data.disabled;
    if(!disabled){
      data.value = typeof data.value == 'number' ? data.value : 0;
      data.value += (typeof data.amount == 'number' ? data.amount : 1);
      if(typeof data.max == 'number'){
        data.value = data.value <= data.max ? data.value : data.max;
      }
      if(typeof curState.plus == 'function'){
        curState.plus(data, curState.data, index)
      }
      data.error = undefined;
      data.warning = undefined;
      return curState
    }
  },
  MINUS: function (ostate, opts){
    let curState = this.curState;
    let { index } = opts
    let data = curState.data[index]
    let disabled = data.disabled;
    if(!disabled){
      data.value = typeof data.value == 'number' ? data.value : 0
      data.value -= (typeof data.amount == 'number' ? data.amount : 1)
      if(typeof data.min == 'number'){
        data.value = data.value >= data.min ? data.value : data.min;
      }
      if(typeof curState.minus == 'function'){
        curState.minus(data, curState.data, index)
      }
      data.error = undefined;
      data.warning = undefined;
      return curState
    }
  },
  SHOW: function (ostate,bol){
    let curState = this.curState;
    curState.tipsShow = bol;
    return curState;
  },
  UPDATE: function (ostate,data){
    let curState = this.curState;
    curState.data = data;
    return curState
  },
  WARNING: function (ostate, opts){
    let curState = this.curState;
    let { data } = curState
    if(typeof opts == 'object'){
      let { index, text } = opts
      data[index].warning = text
    }
    if(typeof opts == 'string' || typeof opts == 'boolean'){
      data.map((item,i) => {
        if(!item.disabled) data[i].warning = opts;
      })
    }
    curState.data = data
    return curState
  },
  ERROR: function (ostate, opts){
    let curState = this.curState;
    let { data } = curState
    if(typeof opts == 'object'){
      let { index, text } = opts
      data[index].error = text
    }
    if(typeof opts == 'string' || typeof opts == 'boolean'){
      data.map((item,i) => {
        if(!item.disabled) data[i].error = opts;
      })
    }
    curState.data = data
    return curState
  },
}

function index(opts){
  const instance = Aotoo(Count, Actions)
  instance.extend({
    getData: function (){
      let curState = instance.curState
      let data = curState ? curState.data : opts.data
      return data
    }
  })
  instance.on('rendered', function(options){
    const {dom, _opts, ctx} = options
    $(dom).find('.countx-content').once('mousemove', function (e){
      if(!$(e.target).hasClass('countx-minus') && !$(e.target).hasClass('countx-plus') && !$(e.target).hasClass('countx-warning') && !$(e.target).hasClass('countx-error')){
        $(this).find('.countx-tips').show()
      }else{
        $(this).find('.countx-tips').hide()
      }
    }).once('mouseleave', function (){
      $(this).find('.countx-tips').hide()
    })
    function plus(){
      let index = $(this).parents('.countx-list-item').index();
      instance.$plus({index,cb: opts.plus})
    }
    function minus(){
      let index = $(this).parents('.countx-list-item').index();
      instance.$minus({index})
    }
    $(dom).find('.countx-plus').once('click', _.debounce(plus, 100))
    $(dom).find('.countx-minus').once('click', _.debounce(minus, 100))
  })
  instance.setProps(opts)
  return instance
}

export default function count(opts){
  let dft = {
    
  }
  dft = _.merge(dft, opts)
  return index(dft)
}