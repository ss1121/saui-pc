import {inject} from 'libs'
import list from 'component/modules/list/_component/loadlist'
import combinex from '../mixins/combinex'


function delay(cb, timer){
  if (typeof cb == 'function') {
    _.delay(cb, (timer||17))
  }
}

function rendered(cb){
  delay(cb, 1000)
}

export default class {
  constructor(config){
    const dft = {
      autoinject: true
    }
    this.config = _.merge(dft, config)
    this.data = this.config.data
    this.eles
    this.stat = 'start'
    this.actions = this.config.globalName ? SAX(this.config.globalName): SAX(_.uniqueId('TempBase_'))
    this.rendered = this.config.rendered
    this.client = (() => typeof window !== 'undefined')()

    this.componentWill = this::this.componentWill
    this.inject = this::this.inject
    this.componentDid = this::this.componentDid
    this._componentDid = this::this._componentDid
    this.createList = this::this.createList
    this.sequentialRun = this::this.sequentialRun
    this.render = this::this.render
  }

  on(key, fun){
    this.actions.on(key, fun)
  }

  emit(key, data) {
    this.actions.roll(key, data)
  }

  createList(gname){
    return list(gname)
  }

  inject(src){
    if (this.client) {
      const ij = inject()
      if (this.config.theme && this.config.autoinject) {
        ij.css(['/css/m/'+this.config.theme])  //注入样式
      }
      if (typeof src == 'function') {
        src(ij)
      }
      return ij
    }
  }

  componentWill(){}

  componentDid(){ }

  _componentDid(){
    delay(()=>{
      this.stat = 'finish'
      delay(()=>{
        this.componentDid()
        // if (typeof this.rendered == 'function') {
        //   rendered(this.rendered)
        // }
      }, 17)

    }, 17)
  }

  sequentialRun(){
    if (this.stat != 'finish') {
      this.inject()
      this.componentWill()
      this.stat = 'firstrun'
    }
    this._componentDid()
  }

  sequentialElementRun(){
    if (this.stat != 'finish') {
      this.inject()
      this.componentWill()
      this.stat = 'firstrun'
    }
    delay(()=>{
      this.stat = 'finish'
      this.componentDid()
    }, 300)
  }

  render(id){
    if (typeof id == 'function') {
      this.rendered = id
      id = undefined
    }
    let container = id || this.config.container

    if (!container) {
      this.sequentialElementRun()
      this.stat = 'done'
      const Elements = combinex(this.eles, this.rendered)
      return <Elements />
    } else {
      this.sequentialRun()
    }

    container = typeof container == 'string'
    ? document.getElementById(container)
    : container.nodeType ? container : ''

    if (container) {
      const Elements = combinex(this.eles, this.rendered)
      React.render( <Elements />, container )
      // React.render( this.eles, container )
    }
    this.stat = 'done'

    return this
  }
}
