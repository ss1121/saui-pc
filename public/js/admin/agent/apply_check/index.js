/***
 * 审核页面
 * 进来的时候，可以带参数, this.main(data),data就是上一页传过来的
*/
//table 方法
import { modalConfig } from 'commonjs/adapter/modalConfig'
import {likeTable} from './ctable'
//table 数据
import _data from './data'
//分销商公司 数据  
const detailData = {
  number: '23179808',
  city: '广东省 广州市 天河区',
  mode: '合作经营',
  address: '广东省广州市荔湾区康王中路486号和业广场2301',
  code: '91440606MA4UNC3Y7W',
  peoson: '黄霞',
  company: '广州市汇旅信息技术有限公司(锦粤汇旅)',
  phone: '13754545454',
  brand: '西部旅行',
  theme: '黄霞',
  license: '/images/logo2.png',
}

function pages(router, data) {
  //分销商公司信息
  const applyDetail = Aotoo.item({
    data: {
      body: [
        {k: <span className='ss-table-td item-title'>申请编号</span>, v: <sapn className='ss-table-td item-desc'>{detailData.number}</sapn> || '-', itemClass: 'ss-table-sx'},
        {k: <span className='ss-table-td item-title'>所在城市</span>, v: <sapn className='ss-table-td item-desc'>{detailData.city}</sapn> || '-', itemClass: 'ss-table-sx'},
        {k: <span className='ss-table-td item-title'>经营模式</span>, v: <sapn className='ss-table-td item-desc'>{detailData.mode}</sapn> || '-', itemClass: 'ss-table-sx'},
        {k: <span className='ss-table-td item-title'>公司地址</span>, v: <sapn className='ss-table-td item-desc'>{detailData.address}</sapn> || '-', itemClass: 'ss-table-sx'},
        {k: <span className='ss-table-td item-title'>统一社会信用代码</span>, v: <sapn className='ss-table-td item-desc'>{detailData.code}</sapn> || '-', itemClass: 'ss-table-sx'}, 
        {k: <span className='ss-table-td item-title'>联系人</span>, v: <sapn className='ss-table-td item-desc'>{detailData.peoson}</sapn> || '-', itemClass: 'ss-table-sx'},
        {k: <span className='ss-table-td item-title'>企业全称</span>, v: <sapn className='ss-table-td item-desc'>{detailData.company}</sapn> || '-', itemClass: 'ss-table-sx'},
        {k: <span className='ss-table-td item-title'>联系手机</span>, v: <sapn className='ss-table-td item-desc'>{detailData.phone}</sapn> || '-', itemClass: 'ss-table-sx'},
        {k: <span className='ss-table-td item-title'>品牌名称</span>, v: <sapn className='ss-table-td item-desc'>{detailData.brand}</sapn> || '-', itemClass: 'ss-table-sx'},
        {k: <span className='ss-table-td item-title'>业务主体</span>, v: <sapn className='ss-table-td item-desc'>{detailData.theme}</sapn> || '-', itemClass: 'ss-table-sx'},
        { k: <span className='ss-table-td item-title'>营业执照</span>, v: <p className='ss-table-td item-desc'><img src={detailData.license || '-'} /></p>, itemClass: 'ss-table-sx' }
      ],
      // footer: { k: <span className='ss-table-td item-title'>营业执照</span>, v: <p className='ss-table-td item-desc'><img src={detailData.license || '-'} /></p>, itemClass: 'ss-table-sx' },
    },
    itemClass: 'apply-detail'
  })
  const Pages = Aotoo.wrap(
    <div className='pages-wrapper'>
      <div className='pages-header padding-minor-lr'>
        <h2 className='pages-title-lg'>审核分销商申请</h2>
      </div>
      <div className='bb-default'></div>
      <div className='pages-body ss-c-scroll padding-minor'>
        {applyDetail}
        <h4 className='pages-title'>操作日志</h4>
        {likeTable({data: _data, listClass: 'ss-table-log'}).render()}
      </div>
      <div className='pages-footer'>
        <button className='ss-button btn-grey plain click-decline'>拒绝</button>
        <button className='ss-button btn-default mlr-default click-pass'>通过</button>
      </div>
    </div>
    ,function(dom) {
      $(dom).find('.click-decline').click(function(e) {
        e.stopPropagation()
        modalConfig({
          title: '拒绝申请',
          body: '这是一个操作性弹出层。',
          type: 'options'
        })
      })
    }
  )
  return <Pages />
}

export default function(router){
  return {
    main: function(data){
      return pages(router, data)
    },
    enter: function(data){
      console.log(data, '上一页传过来的参数')
      return this.main(data)
    },
    leave: function(){
    },
    loaded: function(){
    }
  }
}