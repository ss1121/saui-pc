// import PriceCalendar from './priceCalendar'
import { calendarx, popup } from 'component/client'

//hover事件 popup start
function itemPopupFunc(data){
  if (typeof data == 'object'){
    const res = data
    const ShowModal = Aotoo.wrap(
      <ul className='popup-wrap'>
        {res.price ? <li className='popup-item'> <em className='pi-title'>价格</em><p className='pi-content'>{res.priceShow == true ? '￥'+res.price :  res.priceType == '2' ? '特约价' : '基础价'}</p> </li> : ''}
        {res.state ? <li className='popup-item'> <em className='pi-title'>房态</em><p className='pi-content'>{res.state == 1 ? '充足' : res.state == 2 ? '紧张' : '满房'}</p> </li> : ''}
        {res.concessions && res.concessions.length> 0 ? <li className='popup-item'> <em className='pi-title'>优惠</em><p className='pi-content'>{res.concessions.map( (item, ii) => { return <span key={'c_'+ii}>{item.concessionsType == 'breakfast' ? '早：'+item.concessionsContent : item.concessionsType == 'give' ? '送：'+item.concessionsContent :  item.concessionsType == 'free' ? '免：'+item.concessionsContent: ''}</span>})}</p> </li> : ''}
      </ul>
    )
    return <ShowModal/>
  }
}
//hover事件 popup end

//日期排期 组件方法
function calendarxFunc(data){
  if (typeof data == 'object'){
    console.log(data, 'data');
    const CalendarWrap = Aotoo.wrap(
      <div className='cdh-content'>
        {data.priceShow  == true ? <p className='color-ff7e11 size14 ml-3-m'>￥{data.price}</p> :  <p className='color-ff7e11 size14'>{data.priceType == '2' ? '特约价' : '基础价'}</p>}
        <ul className='flex-row'>
          {data.priceType == '2' ? <li className='mr1'><i className='tag-square-ff6666'>特</i></li> : ''}
          {
            data.concessions && data.concessions.map( (item, ii) => {
              return <li key={'tag_'+ii} className='mr1'>{item.concessionsType == 'breakfast' ? <i className='tag-square-00cccc'>早</i> : item.concessionsType == 'give' ? <i className='tag-square-ff7e11'>送</i> :  item.concessionsType == 'free' ? <i className='tag-square-3399ff'>名</i>: ''}</li> 
            })
          }
        </ul>
      </div>
    )
    return <CalendarWrap/>
  }
}

let today = new Date()
const calendar = calendarx({
  startDate: today.Format('yyyy-MM-dd'),//日历开始月份会根据startDate的月份开始
  endDate: new Date(today.getFullYear(),today.getMonth() + 1,28).Format('yyyy-MM-dd'),//日历开始月份会根据startDate的月份开始
  type: 1,//type: 1(一个月) type: 2(暂时预留,暂时没用) type: 3(三个月)
  cAdapter: calendarxFunc,        //这个是有数据的日期，显示在每个格子的结构
  popup: itemPopupFunc,           //这个是鼠标移进来 出现的提示层
  data:[//日期设置
    {
      date: new Date(today.getFullYear(),today.getMonth(),5).Format('yyyy-MM-dd'),//需要操作的日期
      price: '111',
      priceShow: true,
      state: '满房',//日期格子右上角的内容,jsx格式
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
      state:<div>满房</div>,//日期格子右上角的内容,jsx格式
      content: <div>Hello World!</div>,//日期格子下面的内容,jsx格式
      data:{//当前日期的数据,不在页面上显示(只做储存和自定义事件中返回)
        a: 111,
        b: 222,
        c: 333,
      }
    },
    {
      date: new Date(today.getFullYear(),today.getMonth(),15).Format('yyyy-MM-dd'),//需要操作的日期
      price: '111',
      priceShow: true,
      state:<div>满房</div>,//日期格子右上角的内容,jsx格式
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
      state:<div>满房</div>,//日期格子右上角的内容,jsx格式
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
      state:<div>满房</div>,//日期格子右上角的内容,jsx格式
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
      state:<div>满房</div>,//日期格子右上角的内容,jsx格式
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
      console.log(data)
      console.log('========111111111111')
    },
    'hover': [function (e,data){
      console.log('======== 2222');
    },function(eve,data){
     
    }]
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
        <p className='icon-exlain'>近90天内须有可售排期方可发布上线</p>
      </div>
      <div className='border-default'>
        <div className='item-space padding-small-lr bb-default'>
          <div>
            <a href='javascript:;' className='ss-button btn-default plain'>批量开/关</a>
            <a href='javascript:;' className='ss-button btn-default plain ml-10'>批量编辑</a>
          </div>
        </div>
        {calendar.render()}
      </div>
    </div>
  )
  return <Pages/>
}
export default pages()