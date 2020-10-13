// import PriceCalendar from './priceCalendar'
import { calendarx, popup } from 'component/client'
import { lrMonth, month} from 'commonjs/datePicker'

import { modalConfig } from '../../modal/modalConfig'
import priceForm from './formcfg'



//click事件 popup start

function priceSetModalFunc(data){
  const modalBody = priceForm()
  modalConfig({
    title: '批量开/关',
    showClose: true,
    body: modalBody.render(),
    type: 'options',
    width: 'wid-p70'
  })
}
//click事件 popup end
//hover事件 popup start
function itemPopupFunc(data){
  if (typeof data == 'object'){
    const res = data
    const ShowModal = Aotoo.wrap(
      <div className='popup-box-2'>
        <p className='item-lr'><label className='item-title'>销售价(含税)</label><span className='color-aux-warning size'>￥<b>{data.a}</b></span></p>
        <p className='item-lr'><label className='item-title'>销售价(含税)</label><span className='color-aux-warning size'>￥<b>{data.b}</b></span></p>
        <p className='item-lr'><label className='item-title'>分销佣金</label><span className='color-title'>￥<b>{data.c}</b></span></p>
        <p className='item-lr'><label className='item-title'>税/费</label><span className='color-title'>250</span></p>
        <p className='item-lr'><label className='item-title'>库存</label><span className='color-title'>250</span></p>
        <p className='item-lr'><label className='item-title'>已收</label><span className='color-title'>250</span></p>
        <p className='item-lr'><label className='item-title'>余位</label><span className='color-title'>250</span></p>
      </div>
    )
    return <ShowModal/>
  }
}
//hover事件 popup end

//日期排期 组件方法
function calendarxFunc(data){
  if (typeof data == 'object'){
    const CalendarWrap = Aotoo.wrap(
      <div className='cdh-content'>
        <p className='item-lr'><label className='item-title'>销售价(含税)</label><span className='color-aux-warning size'>￥<b>{data.a}</b></span></p>
        <p className='item-lr'><label className='item-title'>销售价(含税)</label><span className='color-aux-warning size'>￥<b>{data.b}</b></span></p>
        <p className='item-lr'><label className='item-title'>分销佣金</label><span className='color-title'>￥<b>{data.c}</b></span></p>
        <p className='item-lr'><label className='item-title'>余位</label><span className='color-title'>250</span></p>
      </div>
    )
    return <CalendarWrap/>
  }
}

// 自定义日历头部结构
function catHeader(context) {
  const Temp = Aotoo.wrap(
    <div className='calendar-header between'>
        {lrMonth("priceDate", new Date().Format('yyyy-MM'), '请选择时间')}
        <div>
          <a href='javascript:;' className='icon-warning color-primary'>操作日志</a>
          <a href='javascript:;' className='ss-button btn-default plain mlr-small'>批量开/关</a>
          <a href='javascript:;' className='ss-button btn-default plain'>批量编辑</a>
        </div>
      </div>
    ,function(dom) {
      function setCurMonth(date) {
        setTimeout(() => {
          $('.cur-month-text').text(context.state.vStartDate)
        }, 50);
      }

      $(dom).find('.cur-month').toggle(function() {
        $('.cur-month-pop').toggleClass('disN')
      })

      $(dom).off('click', '.cur-month-pop').on('click', '.cur-month-pop', function(e) {
        e.stopPropagation()
        // do some thing
      })

      $(dom).find('.to-left').once('click', function() {
        // context.prev()
        // setCurMonth(context.state.vStartDate)
      })
      $(dom).find('.to-right').once('click', function() {
        // context.next()
        // setCurMonth(context.state.vStartDate)
      })
    }
  )
  return <Temp />
}

let today = new Date()
const calendar = calendarx({
  startDate: today.Format('yyyy-MM-dd'),//日历开始月份会根据startDate的月份开始
  endDate:   new Date(today.getFullYear(),today.getMonth() + 1,28).Format('yyyy-MM-dd'),//日历开始月份会根据startDate的月份开始
  type:      1,  //type: 1(一个月) type: 2(暂时预留,暂时没用) type: 3(三个月)
  cAdapter:  calendarxFunc,        //这个是有数据的日期，显示在每个格子的结构
  popup:     itemPopupFunc,           //这个是鼠标移进来 出现的提示层
  header:    catHeader,
  data:[//日期设置
    {
      date: new Date(today.getFullYear(),today.getMonth(),5).Format('yyyy-MM-dd'),//需要操作的日期
      price: '111',
      priceShow: true,
      disabled: true,//是否禁用当前天,默认false(不禁用)
      itemClass: '',
      data:{//当前日期的数据,不在页面上显示(只做储存和自定义事件中返回)
        a: 111,
        b: 222,
        c: 333,
      },
      // itemAdapter: xxx,
    },
    {
      date: new Date(today.getFullYear(),today.getMonth(),10).Format('yyyy-MM-dd'),//需要操作的日期
      price: '111',
      priceShow: true,
      state: <div className='ss-tag tag-success round'>收满</div>,//日期格子右上角的内容,jsx格式
      content: <div>Hello World!</div>,//日期格子下面的内容,jsx格式
      data:{//当前日期的数据, 不在页面上显示(只做储存和自定义事件中返回)
        a: 111,
        b: 222,
        c: 333,
      }
    },
    {
      date: new Date(today.getFullYear(),today.getMonth(),15).Format('yyyy-MM-dd'),//需要操作的日期
      price: '111',
      priceShow: true,
      state: <div className='ss-tag tag-fail round'>停售</div>,//日期格子右上角的内容,jsx格式
      content: <div>Hello World!</div>,//日期格子下面的内容,jsx格式
      data:{//当前日期的数据,不在页面上显示(只做储存和自定义事件中返回)
        a: 111,
        b: 222,
        c: 333,
      }
    },
    {
      date: new Date(today.getFullYear(),today.getMonth(),18).Format('yyyy-MM-dd'),//需要操作的日期
      price: '111',
      priceShow: true,
      state: <div className='ss-tag tag-success round'>收满</div>,//日期格子右上角的内容,jsx格式
      content: <div>Hello World!</div>,//日期格子下面的内容,jsx格式
      data:{//当前日期的数据,不在页面上显示(只做储存和自定义事件中返回)
        a: 111,
        b: 222,
        c: 333,
      }
    },
    {
      date: new Date(today.getFullYear(),today.getMonth(),20).Format('yyyy-MM-dd'),//需要操作的日期
      price: '111',
      priceShow: true,
      state: <div className='ss-tag tag-success round'>收满</div>,//日期格子右上角的内容,jsx格式
      content: <div>Hello World!</div>,//日期格子下面的内容,jsx格式
      data:{//当前日期的数据,不在页面上显示(只做储存和自定义事件中返回)
        a: 111,
        b: 222,
        c: 333,
      }
    },
    {
      date: new Date(today.getFullYear(),today.getMonth(),25).Format('yyyy-MM-dd'),//需要操作的日期
      price: '111',
      priceShow: true,
      state: <div className='ss-tag tag-success round'>收满</div>,//日期格子右上角的内容,jsx格式
      disabled: true,
      content: <div>Hello World!</div>,//日期格子下面的内容,jsx格式
      data:{//当前日期的数据,不在页面上显示(只做储存和自定义事件中返回)
        a: 111,
        b: 222,
        c: 333,
      }
    },
  ],
  method:{//根据data的设置绑定事件,返回自定义data
    'click': function (eve,data){
      eve.stopPropagation()
      priceSetModalFunc()
    }
  }
})

function pages() {
  // const xx = new PriceCalendar()
  // console.log(xx)
  const Pages = Aotoo.wrap(
    <div className='adminDiv' id='defaults'>
      <h2 className='item-title-lg'>价格库存</h2>
      <div className='item-space'>
        <h6 className='pages-title-sm'>套票名称：尊荣房含早晚餐-B套餐</h6>
        <p className='icon-exlain color-info size-sm'>近90天内须有可售排期方可发布上线</p>
      </div>
      {calendar.render()}
    </div>
    , function(dom) {
      month($('#priceDate'), {
        disabledSelect: true,
        // startDate: new Date().Format('yyyy-MM-dd'),
        // endDate: getDateStr(180),
      })
    }
  )
  return <Pages/>
}
export default pages()