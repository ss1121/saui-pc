/**
 * react-imgLazyLoad：不完全版，图片懒加载专用，部分功能已删减，完全版使用./index
 */

import { on, off } from './utils/event';
import { passiveEvent } from './utils/passiveEventSupport';
import { checkOverflowVisible, checkNormalVisible } from './utils/checkVisible';
import scrollParent from './utils/scrollParent';



class ImgLazyLoad extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false
    }
    this.lazyLoadHandler=this.lazyLoadHandler.bind(this)
  }
  componentDidMount(){
    this.node=ReactDOM.findDOMNode(this);
    on(window, 'scroll', this.lazyLoadHandler, passiveEvent);
    this.lazyLoadHandler()
  }
  componentWillUnmount(){
    off(window, 'scroll', this.lazyLoadHandler, passiveEvent);
  }
  lazyLoadHandler(){
    const node = this.node
    if (!node) {
      return;
    }
  
    const parent = scrollParent(node);
    const isOverflow = this.props.overflow &&
                       parent !== node.ownerDocument &&
                       parent !== document &&
                       parent !== document.documentElement;
    const visible = isOverflow ?
                    checkOverflowVisible(this, parent) :
                    checkNormalVisible(this);
    if (visible) {
      this.onLazyLoad();
    }
  }
  onLazyLoad(){
    let img = new Image(); //创建一个Image对象，实现图片的预下载
    img.src = this.props.src;
    if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
      this.setState({
        loaded:true
      })
      return; // 直接返回，不用再处理onload事件
    }
    img.onload = ()=> { //图片下载完毕时异步调用callback函数。
      this.setState({
        loaded:true
      })
    };
    off(window, 'scroll', this.lazyLoadHandler, passiveEvent);
  }
  render(){
    return (
        this.state.loaded?<img className="animated fadeIn" src={this.props.src} />:this.props.placeholder
    )
  }
}

ImgLazyLoad.defaultProps = {
  offset: 0,        //触发加载图片时到视口底部的最小距离
  overflow: false,  //滚动容器是否不为window
  placeholder: <div className="background-f8f8f8 flex-center-row" style={{height:'100%',width:'100%'}}><i className="shop-logo-long"></i></div>,  //占位节点，可为jsx
};

export default ImgLazyLoad