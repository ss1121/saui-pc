function insertDom(id, cb){
  if(!document.getElementById(id)){
    $('body').append('<div id="'+id+'"></div>')
  }
  if (typeof cb == 'function') {
    cb()
  }
}  

class Modalxx extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modal: this.props.modal,
    }
  }
  render(){
    let modal = this.state.modal
    return (
      <div className="modal-bg modalx-mask">
        { modal }
      </div>
    )
  }
}
const Actions = {
  UPDATE: function (ostate, opts){
    let curState = this.curState;
    for(let item in opts){
      curState[item] = opts[item]
    }
    return curState
  }
}

function index(opts){
  const instance = Aotoo(Modalxx, Actions)
  let mdId = _.uniqueId('Modalx_')
  instance.extend({
    show: function (cb){
      if(cb){
        cb();
      }
      $('#'+mdId).find('.modalx-mask').show()
    },
    hide: function (cb){
      if(cb){
        cb();
      }
      $('#'+mdId).find('.modalx-mask').hide()
    }
  })
  instance.on('rendered', function (options){
    if (typeof opts.rendered == 'function ') opts.rendered()
  })
  instance.setProps(opts)
  insertDom(mdId,function (){
    setTimeout(()=>{
      instance.render(mdId)
    },200)
  })
  return instance
}
export default function modalxx(options){
  let dft = {
    data: []
  }
  dft = _.merge(dft, options)  
  return index(dft)
}