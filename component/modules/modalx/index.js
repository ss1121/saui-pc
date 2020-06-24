function insertDom(id, cb){
  if(!document.getElementById(id)){
    $('body').append('<div id="'+id+'"></div>')
  }
  if (typeof cb == 'function') {
    cb()
  }
}

class Modalx extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: this.props.title,
      modal: this.props.modal,
      close: this.props.close,
      mask: this.props.mask,
      confirm: this.props.confirm
    }
  }
  render(){
    let { title, modal, mask } = this.state
    return (
      <div className="modalx-mask" style={ mask }>
        <div className='modalx-container'>
          <div className="modalx-wrapper">
            { title ? <div className="modalx-header">{ title }{close ? <span className="modalx-close"></span> : ''}</div> : '' }
            <div className="modalx-body">{ modal }</div>
            <div className="modalx-footer">
              <button className="modalx-cancel btn-default">取消</button>
              <button className="modalx-confirm btn-ff7e11">确定</button>
            </div>
          </div>
        </div>
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
  const instance = Aotoo(Modalx, Actions)
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
    const {dom, _opts, ctx} = options
    $(dom).find('.modalx-confirm').once('click',function (e){
      let confirm = instance.curState ? instance.curState.confirm : opts.confirm
      if(confirm){
        confirm( dom, e )
      }
    })
    $(dom).find('.modalx-cancel').once('click', function (e){
      instance.hide()
    })
  })
  instance.setProps(opts)
  insertDom(mdId,function (){
    setTimeout(()=>{
      instance.render(mdId)
    },200)
  })
  return instance
}
export default function modalx(options){
  let dft = {
    data: []
  }
  dft = _.merge(dft, options)  
  return index(dft)
}