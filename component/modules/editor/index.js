class Editor extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      
    }
  }
  render(){
    return (
      <div id={this.props.id}></div>
    )
  }
}


Aotoo.inject.js([
  '/js/t/ueditor/ueditor.config.js',
  '/js/t/ueditor/ueditor.all.js', 
  '/js/t/ueditor/lang/zh-cn/zh-cn.js'
], waitForInject)

let injectTimmer
let injectFailed = true
let waitForQueue = []
function waitForInject(callback) {
  if (Aotoo.isClient) {
    if (typeof callback === 'function') {
      if (!injectFailed) {
        callback()
      } else {
        waitForQueue.push(callback)
      }
    } else {
      if (callback === 'waiting') {
        injectTimmer = setTimeout(() => {
          waitForInject('waiting')
        }, 200);
      } else {
        clearTimeout(injectTimmer)
        if (injectFailed) {
          injectFailed = false
          setTimeout(() => {
            if (waitForQueue && waitForQueue.length) {
              const method = waitForQueue.shift()
              method()
              if (waitForQueue && waitForQueue.length) {
                injectFailed = true
                waitForInject()
              }
            }
          }, 100);
        }
      }
    }
  }
}


function renderedInject(example, config){
  return function(options){
    const {dom, opts, ctx} = options
    try {
      waitForInject(()=>{
        if (window.UE && UE.getEditor) {
          UE.delEditor(config.id)
          setTimeout(() => {
            example.ueditor = UE.getEditor(config.id, config.opts)
          }, 100);
        }
      })
    } catch (error) {
      console.error('component/ueditor->renderInject error');
      console.log(error);
    }
  }
}
function index(opts){
  const instance = Aotoo(Editor)
  instance.on('rendered', renderedInject(instance, opts))
  instance.setProps(opts)
  return instance
}

export default function jRange(options){
  let dft = {
    id: '',
    opts: {}
  }
  dft = _.merge(dft, options)
  return index(dft);
}