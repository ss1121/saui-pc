import { grids } from '../grids'

/*节日&日期start*/
const weeks = [<span>日</span>, <span>一</span>, <span>二</span>, <span>三</span>, <span>四</span>, <span>五</span>, <span>六</span>]

/*节日&日期end*/
function initHead(data){
  let head = [];
  let today = new Date();
  today = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0) //把今天时间设置为凌晨零点
  if(data && data.length > 0){
    data.map((item,i) => {
      let itemDate = new Date(item.date)
      itemDate = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate(), 0, 0, 0); //把这条数据时间设置为凌晨零点
      if(itemDate.getTime() >= today.getTime()){
        let currentMon = new Date(itemDate.getFullYear(), itemDate.getMonth(), 1, 0, 0, 0)//获取这条数据当前月份
        head.push({
          title: currentMon.Format('yyyy年M月'),
          date: currentMon.Format('yyyy-MM'),
          attr: {
            date: currentMon.Format('yyyy-MM-dd')
          },
          fullDate: currentMon.Format('yyyy-MM-dd'),
          dateTime: currentMon.getTime()
        })
      }
    })
  }
  if(head.length <= 0){
    let currentMon = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0) //获取当前月份
    head.push({
      title: currentMon.Format('yyyy年M月'),
      date: currentMon.Format('yyyy-MM'),
      attr: {
        date: currentMon.Format('yyyy-MM-dd')
      },
      fullDate: currentMon.Format('yyyy-MM-dd'),
      dateTime: currentMon.getTime()
    })
  }
  head = _.uniqBy(head,'title')
  head = _.sortBy(head, function(item) {
    return item.dateTime;
  });
  return head
}
function initVsd(opts){
  let { type, startDate, data, dislodge } = opts
  if(!dislodge){
    return startDate
  }else{
    if(type == 3){
      return startDate
    }else{
      return initHead(data)[0].fullDate
    }
  }
}
class Calendar {
  constructor(props) {
    this.props = props
    this.state = {
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      vStartDate:  this.props.vStartDate || initVsd(this.props),
      vEndDate: this.props.vEndDate,
      monthHeadNum: this.props.monthHeadNum || 3,
      data: this.props.data,
      dislodge: typeof this.props.dislodge != 'undefined' ? this.props.dislodge : false,
      allDisabled: typeof this.props.allDisabled != 'undefined' ? this.props.allDisabled : false,
      nullDisabled: typeof this.props.nullDisabled != 'undefined' ? this.props.nullDisabled : false,
      disabledMonth: typeof this.props.disabledMonth != 'undefined' ? this.props.disabledMonth : true
    }
    this.wrap = grids({
      data:[this.wrapper()]
    })
  }
  header(head){
    let { type } = this.props;
    let { startDate, endDate, vStartDate, monthHeadNum, dislodge, allDisabled, disabledMonth } = this.state;
    let sd = new Date(startDate)
    let sdMon = new Date(sd.getFullYear(), sd.getMonth(), 1, 0, 0, 0)
    let ed = new Date(endDate)
    let edMon = new Date(ed.getFullYear(), ed.getMonth(), 1, 0, 0, 0)
    let vsd = new Date(vStartDate)
    let vsdMon = new Date(vsd.getFullYear(), vsd.getMonth(), 1, 0, 0, 0)
    let header;
    if( type == 1 || type == 2){
      let month = [];
      let start = 0;
      let index = _.findIndex(head, function(o) { 
        return o.dateTime == vsdMon.getTime(); 
      })
      if(index >= 1 && index < head.length - 1){
        start = index - 1;
      }else if(index == head.length - 1 && index != 0){
        start = index - 2;
      }
      let l = 3;
      if(allDisabled && !disabledMonth){
        l= 1
      }
      for(let i=0;i<l;i++){
        if(head[start + i]){
          let _head = head[start + i]
          if(start + i == index){
            _head.itemClass = 'active'
          }
          month.push(_head)
        }
      }
      header = Aotoo.list({
        data: month,
        listClass: 'calendar-month-list'
      })
    }else if(type == 3){
      let month = ''
      for(let i=0,l=monthHeadNum;i<l;i++){
        let format = i == 0 ? 'yyyy年 MM月 ' : vsdMon.getMonth() + i == 12 ? 'yyyy年 MM月 ' : 'MM月 '
        month += new Date(vsdMon.getFullYear(), vsdMon.getMonth() + i, 1).Format(format)
      }
      header = (
        <div className="calendar-month">
          { month }
        </div>
      )
    }
    let _prevShow = ''
    let _nextShow = ''
    let headLen = head.length
    if(type != 3){
      if(!dislodge){
        if(vsdMon.getTime() == sdMon.getTime()){
          _prevShow = 'disabled'
        }
        if(vsdMon.getTime() == edMon.getTime()){
          _nextShow = 'disabled'
        }
        if(allDisabled && !disabledMonth){
          _prevShow = 'disabled'
          _nextShow = 'disabled'
        }
      }else{
        if(vsdMon.getTime() == head[0].dateTime){
          _prevShow = 'disabled'
        }
        if(vsdMon.getTime() == head[headLen - 1].dateTime){
          _nextShow = 'disabled'
        }
      }
    }else{
      if(vsdMon.getTime() <= sdMon.getTime()){
        _prevShow = 'disabled'
      }
      if(vsd.getTime() >= edMon.getTime()){
        _nextShow = 'disabled'
      }
    }
    let that = this;
    const Header = Aotoo.wrap(
      <div className="calendar-header">
        <button className={"calendar-btn calendar-prev"} disabled={_prevShow}></button>
        { header }
        <button className={"calendar-btn calendar-next"} disabled={_nextShow}></button>
      </div>
      ,function (dom){
        $(dom).find('.calendar-prev').once('click',function (){
          that.prev()
        })
        $(dom).find('.calendar-next').once('click',function (){
          that.next()
        })
        $(dom).find('.calendar-month-list .item').once('click',function (){
          let thisMonth = $(this).data('date')
          that.jump(thisMonth)
        })
      }
    )
    return <Header />
  }
  bodys(date){
    let mon = new Date(date);
    let { type } = this.props;
    let { data } = this.state;
    const week = Aotoo.list({data:weeks,listClass:'calendar-week-list'});
    let currentMonDate = [];
    if(data && data.length > 0){
      data.map(item => {
        let date = new Date(item.date).Format('yyyy-MM')
        let current = mon.Format('yyyy-MM')
        if(date == current){
          currentMonDate.push(item)
        }
      })
    }
    const days = (
      <div className="datepick-day-wrap">
        {  week }
        { this.days(mon.Format('yyyy-MM-dd'),currentMonDate) }
      </div>
    )
    return (
      <div className="calendar-bodys">
        {
          type == 3 ? 
          <div className="calendar-day-left">
            <div>{mon.Format('M')}<br />月</div>
          </div> 
          : '' 
        }
        <div className="calendar-day-right">
          { days }
        </div>
      </div>
    )
  }
  days(date, data){
    let mon = new Date(date)
    let yy = mon.getFullYear();
    let mm = mon.getMonth()
    let day = new Date(yy, mm, 1);
    let today = new Date();
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)
    let { type } = this.props
    let { endDate, allDisabled, nullDisabled, disabledMonth } = this.state
    let ed = new Date(endDate)
    ed = new Date(ed.getFullYear(), ed.getMonth(), ed.getDate(), 0, 0, 0)
    let week = day.getDay() + 1;
    if (week == 0) week = 7;
    // let isMacaohkline =  window.location.pathname == '/localgroup/macaohkline/detail'
    let thispageStart = new Date(Date.parse(day) - (week - 1) * 24 * 3600 * 1000);
    let dayArr = [];
    for (let i = 0,l = 42; i < l; i++) {
      let theday = new Date(Date.parse(thispageStart) + i * 24 * 3600 * 1000);
      let _theday = new Date(theday).Format('yyyy-MM-dd')
      var tyear = theday.getFullYear()
      var tmonth = theday.getMonth()
      var tday = theday.getDate()
      if(mm == 1 && !(yy % 4 == 0 && yy % 100 != 0) || (yy % 400 == 0)){
        if(_theday == new Date(yy,mm,28).Format('yyyy-MM-dd') && i == 27){
          l = 28
        }
      }else if(mm == 1 || mm == 3 || mm == 5 || mm == 8 || mm == 10){
        if(_theday == new Date(yy,mm,28).Format('yyyy-MM-dd') && (i >= 27 && i < 33)){
          l = 35
        }
      }else{
        if(_theday == new Date(yy,mm,28).Format('yyyy-MM-dd') && (i >= 27 && i < 32)){
          l = 35
        }
      }
      let addFestivalName = theday.Featival(),showDay = ''
      if(addFestivalName.length > 0){
        addFestivalName.map(item => {
          showDay += item.desc
        })
      }else{
        if(theday.Format('yyyy-MM-dd') == today.Format('yyyy-MM-dd')){
          showDay = '今天'
        }else{
          showDay = tday
        }
      }
      if(theday.Format('yyyy-MM') != mon.Format('yyyy-MM')){
        showDay = ''
      }
      let itemElement = ''
      if(data && data.length > 0){
        data.map( (item,ii) => {
          let itemDate = new Date(item.date).Format('yyyy-MM-dd')
          if(theday.getTime() >= today.getTime() && _theday == itemDate){
            itemElement = item
          }
        })
      }
      let ifDisabled = tmonth != mm || theday.getTime() < today.getTime() || theday.getTime() > ed.getTime() || type != 3 && allDisabled && itemElement == '' || nullDisabled && itemElement == '' ? ' calendar-disabled' : '';
      let Day = (
        <div className="calendar-item-wrap">
          <div className="calendar-day-head">
            <div className="cdh-date">{showDay}</div>
            {ifDisabled == '' && !itemElement.disabled ? <div className='cdh-state'>{itemElement.state}</div> : ''}
          </div>
          {
            ifDisabled == '' && !itemElement.disabled ?
            <div className="calendar-day-content">{
              itemElement.itemAdapter ? 
              itemElement.itemAdapter(itemElement.data) : 
              this.props.cAdapter(itemElement.data)}
            </div>
            : ''
          }
        </div>
      )
      let that = this
      let DayData = [Day]
      if(itemElement.popup){
        DayData.push(itemElement.popup(itemElement.data));
      }else{
        if(this.props.popup){
          DayData.push(this.props.popup(itemElement.data));
        }
      }
      dayArr.push(
        {
          li: DayData,
          itemClass: 'calendar-item' + (itemElement.itemClass || '') + (itemElement ? (itemElement.disabled ? ' calendar-disabled' : ' calendar-optional') : ifDisabled != '' ? ' calendar-disabled' : ''),
          attr:{
            index:i,
            date:tyear+'-'+(tmonth+1 < 10 ? '0' + (tmonth+1) : (tmonth+1))+'-'+(tday<10 ? '0'+tday : tday),
            type: ifDisabled != '' ? 'disabled' : ''
          },
          itemMethod: function (dom){
            const method = that.props.method
            const _data = itemElement.data
            for(let m in method){
              if($(dom).data('type') !== 'disabled'){
                if(m != 'hover'){
                  $(dom).on(m,function (e){
                    method[m](e,{
                      date: _theday,
                      data: _data
                    })
                  })
                }else{
                  $(dom).mouseenter(function (){
                    $(this).mousemove(function (e){
                      method.hover[0](e,{
                        date: _theday,
                        data: _data
                      })
                    })
                  })
                  $(dom).mouseleave(function (e){
                    method.hover[1](e,{
                      date: _theday,
                      data: _data
                    })
                  })
                }
              }
            }
          }
        }
      )
    }
    return Aotoo.list({
      data: dayArr,
      listClass: 'calendar-day'
    })
  }
  
  wrapper(){
    let { type } = this.props;
    let { startDate, vStartDate, endDate, dislodge, monthHeadNum, data } = this.state;
    let sd = new Date(startDate)
    let ed = new Date(endDate);
    let head = [];
    let monthNum = (ed.getFullYear() - sd.getFullYear()) * 12 + (ed.getMonth() - sd.getMonth()) + 1
    if(!dislodge){
      for(let i=0,l=monthNum;i<l;i++){
        let headDate = new Date(sd.getFullYear(), sd.getMonth() + i, 1, 0, 0, 0)
        head.push({
          title: headDate.Format('yyyy年M月'),
          date: headDate.Format('yyyy-MM'),
          attr: {
            date: headDate.Format('yyyy-MM-dd')
          },
          fullDate: headDate.Format('yyyy-MM-dd'),
          dateTime: headDate.getTime()
        })
      }
      if(head.length <= 0){
        let today = new Date()
        let currentMon = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0)
        head.push({
          title: currentMon.Format('yyyy年M月'),
          date: currentMon.Format('yyyy-MM'),
          attr: {
            date: currentMon.Format('yyyy-MM-dd')
          },
          fullDate: currentMon.Format('yyyy-MM-dd'),
          dateTime: currentMon.getTime()
        })
      }
    }else{
      head = initHead(data)
    }
    let vsd = new Date(vStartDate)
    let bodysMon = [];
    if(type != 3){
      bodysMon.push(vsd.Format('yyyy-MM-dd'))
    }else{
      for(let i=0,l=monthHeadNum;i<l;i++){
        bodysMon.push(new Date(vsd.getFullYear(), vsd.getMonth() + i, 1).Format('yyyy-MM-dd'))
      }
    }
    return (
      <div className="calendar-wrap">
        { this.header(head) }
        { this.bodys(bodysMon[0]) }
        { type == 3 && monthHeadNum >= 2 ? this.bodys(bodysMon[1]) : '' }
        { type == 3 && monthHeadNum >= 3 ? this.bodys(bodysMon[2]) : '' }
      </div>
    )
  }
  prev(){
    let { type } = this.props;
    let { startDate, vStartDate, data, monthHeadNum, dislodge } = this.state
    let sd = new Date(startDate)
    sd = new Date(sd.getFullYear(), sd.getMonth(), 1, 0, 0, 0)
    let vsd = new Date(vStartDate)
    vsd = new Date(vsd.getFullYear(), vsd.getMonth(), vsd.getDate(), 0, 0, 0)
    let head = initHead(data)
    let index = _.findIndex(head, function(o) { 
      return o.dateTime == vsd.getTime(); 
    })
    if(type != 3){
      if(!dislodge){
        if(vsd.getTime() > sd.getTime()){
          vStartDate = new Date(vsd.getFullYear(), vsd.getMonth() - 1, 1).Format('yyyy-MM-dd')
        }
      }else{
        if(index - 1 > 0){
          vStartDate = head[index - 1].fullDate
        }else{
          vStartDate = head[0].fullDate
        }
      }
    }else{
      let t3vsd = new Date(vsd.getFullYear(), vsd.getMonth() - monthHeadNum, vsd.getDate(), 0, 0, 0)
      if(t3vsd.getTime() >= sd.getTime()){
        vStartDate = new Date(vsd.getFullYear(), vsd.getMonth() - monthHeadNum, 1).Format('yyyy-MM-dd')
      }
    }
    this.state.vStartDate = vStartDate
    if(this.props.prevMethod){
      this.props.prevMethod(vStartDate)
    }
    this.wrap.replace(this.wrapper())
  }
  next(){
    let { type } = this.props;
    let { endDate, vStartDate, data, monthHeadNum, dislodge } = this.state
    let ed = new Date(endDate)
    ed = new Date(ed.getFullYear(), ed.getMonth(), ed.getDate(), 0, 0, 0)
    let vsd = new Date(vStartDate)
    vsd = new Date(vsd.getFullYear(), vsd.getMonth(), vsd.getDate(), 0, 0, 0)
    let head = initHead(data)
    let index = _.findIndex(head, function(o) { 
      return o.dateTime == vsd.getTime(); 
    })
    if(type != 3){
      if(!dislodge){
        if(vsd.getTime() < ed.getTime()){
          vStartDate = new Date(vsd.getFullYear(), vsd.getMonth() + 1, 1).Format('yyyy-MM-dd')
        }
      }else{
        let headLen = head.length
        if(index + 1 < headLen - 1){
          vStartDate = head[index + 1].fullDate
        }else{
          vStartDate = head[headLen - 1].fullDate
        }
      }
    }else{
      if(vsd.getTime() <= ed.getTime()){
        vStartDate = new Date(vsd.getFullYear(), vsd.getMonth() + monthHeadNum, 1).Format('yyyy-MM-dd')
      }
    }
    this.state.vStartDate = vStartDate
    if(this.props.nextMethod){
      this.props.nextMethod(vStartDate)
    }
    this.wrap.replace(this.wrapper())
  }
  jump(month){
    this.state.vStartDate = month
    if(this.props.jumpMethod){
      this.props.jumpMethod(month)
    }
    this.wrap.replace(this.wrapper())
  }
  setData (data){
    let dayData = this.state.data
    if(data && data.length > 0){
      data.map( item => {
        let index = _.findIndex(dayData, function(o) { 
          return o.date == item.date;
        })
        if(index < 0){
          this.state.data.push(item)
        }else{
          this.state.data[index] = item
        }
      })
    }
    this.wrap.replace(this.wrapper())
  }
  removeData (data){
    let dayData = this.state.data
    if(data && data.length > 0){
      data.map( item => {
        let index = _.findIndex(dayData, function(o) { 
          return o.date == item;
        })
        if(index >= 0){
          this.state.data.splice(i,1)
        }
      })
    }
    this.wrap.replace(this.wrapper())
  }
  setStartDate (date){
    this.state.startDate = date;
    this.wrap.replace(this.wrapper())
  }
  setEndDate (date){
    this.state.endDate = date;
    this.wrap.replace(this.wrapper())
  }
  setVstartDate (date){
    this.state.vStartDate = date;
    this.wrap.replace(this.wrapper())
  }
  setState (opts){
    this.state = opts;
    this.wrap.replace(this.wrapper())
  }
  update(data){
    this.state.data = data;
    this.wrap.replace(this.wrapper())
  }
  render(){
    return (
      <div className={"calendar" + (this.props.type != 3 ? ' calendar-noleft' : '')}>
        { this.wrap.render() }
      </div>
    )
  }
}

export default function calendar(options){
  Aotoo.inject.css([
    `/css/m/calendarx`
  ])
  let dft = {
    startDate: new Date().Format('yyyy-MM-dd'),
    endDate: new Date(Date.parse(new Date()) + 365 * 24 * 3600 * 1000).Format('yyyy-MM-dd'),
    vStartDate: '',
    vEndDate: '',
    cAdapter: function (){},
    popup: undefined,
    type: 1
  }
  dft = _.merge(dft, options)
  const c = new Calendar(dft)
  return c
}