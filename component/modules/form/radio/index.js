import {inject} from 'libs'
let Radio = require('../_part/radio')
let render = React.render;

// var radiodata_waterCard = {
//     name: ['payWay','payWay'],
//     title: [<span className="pay_icon_bg"><i className="iconfont icon-weixinzhifu"></i>{'微信支付'}</span>,<span className="pay_icon_bg"><i className="iconfont icon-fukuan"></i>{'货到付款'}</span>],
//     value: ['-WEIXIN_DBGZH_PAY','PAY_ON_DELIVERY']
// }
// radio(radiodata_waterCard, 'radiodata_waterCard')

function radio(data, opts, c){

  var noop = false,
  dft = {
    container: '',
    theme:      'radio',
    itemMethod: noop
  }

  dft = _.assign(dft, opts)
  if (!dft.container) return false;
  if (data) dft.data = data

  var inject = libs.inject().css;
  inject('/css/t/ui/form/'+dft.theme+'.css')

  var _fun = function(data, ele, cb){
    this.value;
    this.ipt;
    var self = this;

    function dm(){
      self.ipt = this;
      $(this).find('input[type=radio]').change(()=>{
        self.value = this.value;
      })
      $(this).find('input[type=checkbox]').change(()=>{
        let _name = this.name;
        let _items = $('input[name='+_name+']:checked')
        if( _items.length ){
          self.value = _items.each((j, it)=>{
            return it.value
          })
        }
      })
      if (cb&&typeof cb==='function') cb.call(self, this)
    }

    render(
      <Radio data={data} itemMethod={dft.itemMethod} itemDefaultMethod={dm}/>,
      (function(){return ele.nodeType ? ele : document.getElementById(ele)}())
    )
  }

  _fun.prototype = {
    getValue: function(){
      return this.value;
    }
  }
  return new _fun(dft.data, dft.container, c)
}

radio.pure = function(){
  return Radio;
}

module.exports = radio
