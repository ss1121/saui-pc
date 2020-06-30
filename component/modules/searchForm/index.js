import { on, off } from '../utils/event';
import { passiveEvent } from '../utils/passiveEventSupport';
// import Input from '../form/inputs'
const isClient = (() => typeof window !== 'undefined')()


class SearchForm extends React.Component {
  constructor(props){
    super(props)
    this.timer=null;
    this.dropdown='';
    this.hasUnmount = false
    this.exec = true
    this.state = {
      value: this.props.value || '',
      attr: this.props.attr,
      showDropdown:false,
      historyData: this.props.historyData || null,      //是否在输入框下显示搜索记录
    }
  }
  componentDidMount() {
    this.dom=ReactDOM.findDOMNode(this);
    // onDidMount callback
    if(typeof this.props.onDidMount === 'function'){
      this.props.onDidMount.call(this,this.dom)
    }
    
    on(this.searchInput, 'focus', (e)=>{this.props.onSearchFocus.call(this,this.state.value, e)}, passiveEvent);
    on(this.searchInput, 'blur', (e)=>{this.props.onSearchBlur.call(this,this.state.value, e)}, passiveEvent);
    
    if(this.props.enterConfirm){
      on(this.searchInput, 'keyup', (e)=>{
        if (window.event) //如果window.event对象存在，就以此事件对象为准
            e = window.event;
        var code = e.charCode || e.keyCode;
        if (code == 13) { // enter keycode
          this.props.onSearchConfirm.call(this,this.state.value, e)
          // this.hideDropdown()
        }
      }, passiveEvent);
    }
  }
  componentWillUnmount() {
    this.hasUnmount = true
    off(this.searchInput, 'focus', ()=>{this.props.onSearchFocus.call(this,this.state.value)}, passiveEvent);
    off(this.searchInput, 'blur', ()=>{this.props.onSearchBlur.call(this,this.state.value)}, passiveEvent);
    if(typeof this.props.onUnMount === 'function'){
      this.props.onUnMount.call(this)
    }
  }
  updateDropdown(jsx){
    this.dropdown=jsx;
    this.forceUpdate();
    return this
  }
  showDropdown(){
    this.setState({
      showDropdown:true
    })
    return this
  }
  hideDropdown(){
    this.setState({
      showDropdown:false
    })
    return this
  }
  setValue(value){
    this.setState({
      value:value
    })
    return this
  }

  onSearchChange(e){
    var value=this.searchInput.value;
    this.setState({
      value:value
    });
    this.props.onInputChange.call(this,value, e)
    clearTimeout(this.timer)
    if(value){
      this.timer=setTimeout(()=>this.props.onSearchChange.call(this,value, e),this.props.delay)
    }else{ //没有值时直接触发不需要延迟
      this.props.onSearchChange.call(this,value, e)
    }
  }
  render(){
    let myinput = <input type="text" className="form_control" value={this.state.value} placeholder={this.props.placeholder} ref={(input)=>{this.searchInput=input}} onChange={(e)=>{this.onSearchChange.call(this, e)}}/>
    if (this.props.input && React.isValidElement(this.props.input)) {
      const tmpInput = this.props.input
      const attr = this.state.attr
     
      let attrs = {}
      if (attr) { 
        Object.keys(attr).forEach(key=>{
          const val = attr[key]
          if (key.indexOf('data-')==0) {
            attrs[key] = val
          } else {
            const nKey = `data-${key}`
            attrs[nKey] = val
          }
        })
      }
      myinput = React.cloneElement(tmpInput, {
        className: 'form_control',
        value: this.state.value,
        placeholder: this.props.placeholder,
        ref: (input)=>{this.searchInput=input},
        onChange: (e)=>{this.onSearchChange.call(this, e)},
        ...attrs
      })
    }
    return (
      <div className={this.props.containerClass}>
        <div className="inputGroup">
          <label className="inputItem input-search">
            {myinput}
            <span className="fkp-input-error"></span>
            <span className="fkp-desc">
              <div className="list-container" style={{visibility: this.state.showDropdown ? '' : 'hidden', height: this.state.showDropdown ? '' : '0'}}>{this.dropdown}</div>
            </span>
          </label>
          {this.props.searchBtn&&(
          <label className="inputItem btn-search">
            <input type="button" className="btn" value={this.props.searchBtnName} ref={(btn)=>{this.searchBtn=btn}} onClick={(e)=>this.props.onSearchConfirm.call(this,this.state.value, e)}/>
          </label>
          )}
        </div>
        {this.state.historyData ? <div>{this.state.historyData}</div> : ''}
      </div>
    )
  }
}
SearchForm.defaultProps = {
  input: false,
  attr: false,
  searchBtn:true, // has search button
  searchBtnName:'搜索', // text of search button
  placeholder:'搜索关键字', // placeholder of search input
  containerClass:'search-wrap', // component wrapper className
  enterConfirm:true,  // has enter callback with search
  delay:400,          // delay search input callback
  // all function params bind this as component instance
  onSearchFocus:function(value, e){  //default focus action
    this.searchInput.select()
    this.showDropdown()
  },
  onSearchBlur:function(value, e){  // default blur action
    this.hideDropdown()
  },
  onInputChange:function(value, e){},
  onSearchChange:function(value, e){},
  onSearchConfirm:function(value, e){},
  onDidMount:function(dom){} // dom: component dom
};

export default SearchForm
