import { grids } from 'component'

const isClient = typeof window !== 'undefined'

/* 农历日历start */
var CalendarData = new Array(100);
var madd = new Array(12);
var cYear, cMonth, cDay, TheDate;
CalendarData = new Array(
  0xA4B, 0x5164B, 0x6A5, 0x6D4, 0x415B5, 0x2B6, 0x957, 0x2092F, 0x497, 0x60C96,
  0xD4A, 0xEA5, 0x50DA9, 0x5AD, 0x2B6, 0x3126E, 0x92E, 0x7192D, 0xC95, 0xD4A,
  0x61B4A, 0xB55, 0x56A, 0x4155B, 0x25D, 0x92D, 0x2192B, 0xA95, 0x71695, 0x6CA,
  0xB55, 0x50AB5, 0x4DA, 0xA5B, 0x30A57, 0x52B, 0x8152A, 0xE95, 0x6AA, 0x615AA,
  0xAB5, 0x4B6, 0x414AE, 0xA57, 0x526, 0x31D26, 0xD95, 0x70B55, 0x56A, 0x96D,
  0x5095D, 0x4AD, 0xA4D, 0x41A4D, 0xD25, 0x81AA5, 0xB54, 0xB6A, 0x612DA, 0x95B,
  0x49B, 0x41497, 0xA4B, 0xA164B, 0x6A5, 0x6D4, 0x615B4, 0xAB6, 0x957, 0x5092F,
  0x497, 0x64B, 0x30D4A, 0xEA5, 0x80D65, 0x5AC, 0xAB6, 0x5126D, 0x92E, 0xC96,
  0x41A95, 0xD4A, 0xDA5, 0x20B55, 0x56A, 0x7155B, 0x25D, 0x92D, 0x5192B, 0xA95,
  0xB4A, 0x416AA, 0xAD5, 0x90AB5, 0x4BA, 0xA5B, 0x60A57, 0x52B, 0xA93, 0x40E95
);
madd[0] = 0;
madd[1] = 31;
madd[2] = 59;
madd[3] = 90;
madd[4] = 120;
madd[5] = 151;
madd[6] = 181;
madd[7] = 212;
madd[8] = 243;
madd[9] = 273;
madd[10] = 304;
madd[11] = 334;
function GetBit(m, n) {
  return (m >> n) & 1;
}
function e2c() {
  TheDate = (arguments.length != 3) ? new Date() : new Date(arguments[0], arguments[1], arguments[2]);
  var total, m, n, k;
  var isEnd = false;
  var tmp = TheDate.getYear();
  if (tmp < 1900) {
    tmp += 1900;
  }
  total = (tmp - 1921) * 365 + Math.floor((tmp - 1921) / 4) + madd[TheDate.getMonth()] + TheDate.getDate() - 38;
  if (TheDate.getYear() % 4 == 0 && TheDate.getMonth() > 1) {
    total++;
  }
  for (m = 0; ; m++) {
    k = (CalendarData[m] < 0xfff) ? 11 : 12;
    for (n = k; n >= 0; n--) {
      if (total <= 29 + GetBit(CalendarData[m], n)) {
          isEnd = true; break;
      }
      total = total - 29 - GetBit(CalendarData[m], n);
    }
    if (isEnd) break;
  }
  cYear = 1921 + m;
  cMonth = k - n + 1;
  cDay = total;
  if (k == 12) {
    if (cMonth == Math.floor(CalendarData[m] / 0x10000) + 1) {
      cMonth = 1 - cMonth;
    }
    if (cMonth > Math.floor(CalendarData[m] / 0x10000) + 1) {
      cMonth--;
    }
  }
}
function GetcDateString() {
  var mm = 0
  var dd = 0
  if (cMonth < 1) {
    mm = -cMonth - 1
  } else {
    mm = cMonth - 1
  }
  dd = cDay
  return {
    day: dd,
    month: mm+1
  };
}
function GetLunarDay(solarYear, solarMonth, solarDay) {
  if (solarYear < 1921 || solarYear > 2100) {
    return "";
  } else {
    solarMonth = (parseInt(solarMonth) > 0) ? (solarMonth - 1) : 11;
    e2c(solarYear, solarMonth, solarDay);
    return GetcDateString();
  }
}
/*农历end*/

/*节日&日期start*/
const [feativals,lunarFeatival,weeks] = [{
  '1-1': '元旦',
  '5-1': '劳动',
  '10-1': '国庆',
},{
  '1-1': '春节',
  '5-5': '端午',
  '8-15': '中秋',
  '12-30': '除夕',
},
[<span>日</span>, <span>一</span>, <span>二</span>, <span>三</span>, <span>四</span>, <span>五</span>, <span>六</span>],
]
/*节日&日期end*/

// let wrap
function header (yy,mm){
  return (
    <div className="datepick-header">
      <span className="datepick-month">{mm + 1 > 12 ? ( yy+1 ) + '年' + (mm + 1 - 12) + '月' : yy + '年' + (mm + 1) + '月'}</span>
      <span className="datepick-month">{mm + 2 > 12 ? ( yy+1 ) + '年' + (mm + 2 - 12) + '月' : yy + '年' + (mm + 2) + '月'}</span>
    </div>
  )
}
function bodys (sd,ed,vsd,ved,csd,max,type){
  let _sd = new Date(sd)
  let _ed = new Date(ed)
  let yy = _sd.getFullYear()
  let mm = _sd.getMonth()
  let dd = _sd.getDate()
  const week = Aotoo.list({data:weeks,listClass:'datepick-week-list'})
  return (
    <div className="datepick-day-wraps">
      <div className="datepick-day-wrap">
        {  week }
        { days(yy,mm,_sd,_ed,vsd,ved,csd,max,type) }
      </div>
      <div className="datepick-day-wrap">
        {  week }
        { days(yy,mm + 1,_sd,_ed,vsd,ved,csd,max,type) }
      </div>
    </div>
  )
}
function days (yy,mm,sd,ed,vsd,ved,csd,max,type){
  if(mm >= 12){
    mm -= 12
    yy++
  }else if(mm < 0){
    mm += 12
    yy --
  }
  let day = new Date(yy, mm, 1);//获取当月第一天
  let week = day.getDay()+1;//设置第一个格子为周日
  if (week == 0) week = 7;
  let thispageStart = new Date(Date.parse(day) - (week - 1) * 24 * 3600 * 1000);//计算得到第一个格子的日期
  let dayArr = [];
  for (var i = 0; i < 42; i++) {
    var theday = new Date(Date.parse(thispageStart) + i * 24 * 3600 * 1000);
    var tyear = theday.getFullYear()
    var tmonth = theday.getMonth()
    var tday = theday.getDate()
    var lunar = GetLunarDay(tyear,tmonth + 1,tday);
    let today = new Date().Format('yyyy-MM-dd');
    let addFestivalName = '',showDay = ''
    if(feativals[(tmonth+1) + '-' + tday]){
      addFestivalName = feativals[(tmonth+1) + '-' + tday]
    }
    if(tyear % 4 <= 1 && tmonth == 3 && tday == 4){
      addFestivalName = '清明'
    }else if(tyear % 4 >= 2  && tmonth == 3 && tday == 5){
      addFestivalName = '清明'
    }
    if(addFestivalName != ''){
      showDay = addFestivalName
    }else{
      if(theday.Format('yyyy-MM-dd') == today){
        showDay = '今天'
      }else{
        showDay = tday
      }
    }
    
    // let _today = new Date()
    let nsd = new Date(csd + ' 00:00:00') //传入的开始日期转成Date类型
    let dtd = Date.parse(theday)//当前格子的时间戳格式
    let _sd = (Date.parse(new Date(nsd.getFullYear(),nsd.getMonth(),nsd.getDate())))//转成时间戳格式
    let _ed = (Date.parse(new Date(ed.getFullYear(),ed.getMonth(),ed.getDate())))//转成时间戳格式
    //由于传过来的时间默认是08:00,而theday的时间是00:00,所以做了下面两个操作
    let _vsd = new Date(vsd + ' 00:00:00') 
    let _ved = new Date(ved + ' 00:00:00')
    let checkClass = Date.parse(theday) == Date.parse(_vsd) || Date.parse(theday) == Date.parse(_ved) ? ' active' : '';//当前选中的起始日期与结束日期class
    let sectionClass = Date.parse(theday) > Date.parse(_vsd) && Date.parse(theday) < Date.parse(_ved) ? ' section' : '';//当前选中的起始日期与结束日期之间的日期class
    dayArr.push(
      {title:
        (
          tmonth == mm ? (<div 
            className={(dtd < _sd || dtd > _ed ? 'datepick-dasable' : 'datepick-optional') + checkClass + sectionClass} 
          >
            {showDay}
            { type == 'end' && dtd >= _sd && dtd <= _ed ? <div className="datepick-tips">{'共' + ((dtd - _sd) / (1 * 24 * 3600 * 1000) + 1) + '天'}</div> : <div className="datepick-tips">{'最多可选' + max + '天'}</div>}
            {/* {dtd > _ed || max != '' || max ? <div className="datepick-tips">{'最多可选' + max + '天'}</div> : ''} */}
          </div>)
          : <div></div>
        ),
        attr:{
          index:i,
          date:tyear+'-'+(tmonth+1 < 10 ? '0' + (tmonth+1) : (tmonth+1))+'-'+(tday<10 ? '0'+tday : tday)
        }
      }
    )
  }
  return Aotoo.list({
    data: dayArr,
    listClass: 'datepick-day'
  })
}
class Datepick  {
  constructor(props) {
    this.props = props
    const sd = this.props.startDate
    const vsd = this.props.vStartDate || sd || new Date().Format('yyyy-MM-dd')
    this.state = {
      startDate: sd || new Date().Format('yyyy-MM-dd'),
      endDate: this.props.endDate || new Date(Date.parse(new Date()) + 365 * 24 * 3600 * 1000).Format('yyyy-MM-dd'),
      vStartDate: vsd ,
      vEndDate: this.props.vEndDate || new Date(Date.parse( new Date(vsd) || new Date() ) + 1 * 24 * 3600 * 1000).Format('yyyy-MM-dd'),
      cStartDate: sd || new Date().Format('yyyy-MM-dd'),
      max: this.props.max
    }
    this.wrap = grids({
      data:[this.wrapper(this.state.startDate, this.state.endDate, this.state.vStartDate, this.state.vEndDate, this.state.cStartDate, this.state.max)]
    })
  }
  wrapper (sd,ed,vsd,ved,csd,max,type){
    let _sd = new Date(sd)
    let _ed = new Date(ed)
    let yy = _sd.getFullYear()
    let mm = _sd.getMonth()
    let dd = _sd.getDate()
    let _nextShow = ''
    let _prevShow = ''
    const td = Date.parse(new Date(new Date().getFullYear(),new Date().getMonth(),1))
    const startMonth = Date.parse(new Date(yy,mm,1));
    const endMonth = _ed != '' ? Date.parse(new Date(_ed.getFullYear(),_ed.getMonth(),1)) : '';
    let _vsd = new Date(vsd)
    let _ved = new Date(ved)
    let _csd = new Date(csd).Format('yyyy-MM-dd')
    const vStartMonth = Date.parse(new Date(_vsd.getFullYear(),_vsd.getMonth(),1));
    const _max = new Date(Date.parse(new Date(_vsd)) + max * 24 * 3600 * 1000);
    const maxMonth = Date.parse(new Date(_max.getFullYear(),_max.getMonth(),1));
    if(type != 'end'){//如果不是结束日期
      //前(左)按钮
      if(td >= startMonth){
        _prevShow = 'disabled'
      }else{
        _prevShow = ''
      }
      //后(右)按钮
      if(td < endMonth){
        _nextShow = ''
      }else{
        _nextShow = 'disabled'
      }
    }else{
      //前(左)按钮
      if(startMonth >= vStartMonth){
        _prevShow = 'disabled'
      }else{
        _prevShow = ''
      }
      //后(右)按钮
      if(vStartMonth >= maxMonth){
        _nextShow = 'disabled'
      }else{
        _nextShow = ''
      }
    }
    return (
      <div className="datepick-table-wrap">
        { header(yy,mm) }
        { bodys(_sd,_ed,_vsd.Format('yyyy-MM-dd'),_ved.Format('yyyy-MM-dd'),_csd,max,type) }
        <button className="datepick-prev" disabled={_prevShow}></button>
        <button className="datepick-next" disabled={_nextShow}></button>
      </div>
    )
  }
  next (){
    let sd = new Date(this.state.startDate)
    let yy = sd.getFullYear()
    let mm = sd.getMonth()
    let dd = sd.getDate()
    if(mm + 1 >= 12){
      mm = mm + 1 - 12
      yy++
    }else{
      mm++
    }
    this.state.startDate = new Date(yy,mm,dd).Format('yyyy-MM-dd')
    this.wrap.replace(this.wrapper(this.state.startDate, this.state.endDate, this.state.vStartDate, this.state.vEndDate, this.state.cStartDate, this.state.max))
  }
  prev (){
    let sd = new Date(this.state.startDate)
    let yy = sd.getFullYear()
    let mm = sd.getMonth()
    let dd = sd.getDate()
    if(mm - 1 <= 0){
      mm = mm - 1 + 12
      yy--
    }else{
      mm--
    }
    this.state.startDate = new Date(yy,mm,dd).Format('yyyy-MM-dd')
    this.wrap.replace(this.wrapper(this.state.startDate, this.state.endDate, this.state.vStartDate, this.state.vEndDate, this.state.cStartDate, this.state.max))
  }
  setVal (opts){
    if(opts.type == 'start'){
      let vsd = Date.parse(new Date(opts.val))
      let ved = Date.parse(new Date(this.state.vEndDate))
      this.state.vStartDate = new Date(vsd).Format('yyyy-MM-dd')
      if(vsd > ved || vsd < ved - this.state.max * 24 * 3600 * 1000){
        this.state.vEndDate = new Date(Date.parse(opts.val) + 1 * 24 * 3600 * 1000).Format('yyyy-MM-dd')
      }
      this.wrap.replace(this.wrapper(this.state.startDate, this.state.endDate, this.state.vStartDate, this.state.vEndDate, this.state.vStartDate, this.state.max))
    }else if(opts.type == 'end'){
      this.state.vEndDate = new Date(opts.val).Format('yyyy-MM-dd')
      this.wrap.replace(this.wrapper(this.state.startDate, this.state.endDate, this.state.vStartDate, this.state.vEndDate, this.state.cStartDate, this.state.max))
    }
  }
  show(type) {
    if(type == 'start'){
      this.wrap.replace(this.wrapper(this.state.vStartDate, this.state.endDate, this.state.vStartDate, this.state.vEndDate, this.state.cStartDate, this.state.max))
    }else if(type == 'end'){
      let end = new Date(Date.parse(this.state.vStartDate) + this.state.max * 24 * 3600 * 1000)
      this.wrap.replace(this.wrapper(this.state.vStartDate, end, this.state.vStartDate, this.state.vEndDate, Date.parse(new Date(this.state.vStartDate).Format('yyyy-MM-dd')) + 1 * 24 * 3600 * 1000, this.state.max,'end'))
    }
  }
  render (){
    let vsd = new Date(this.state.vStartDate).Format('yyyy-MM-dd')
    let ved = new Date(this.state.vEndDate).Format('yyyy-MM-dd')
    const _this = this;
    const DubDate = Aotoo.wrap(
      <div className="datepick">
        <div className="datepick-input">
           <label><span>{this.props.startTitle}</span><input className="datepick-startTitle" data-type="start" type="text" value={vsd} readOnly /></label>
           <label><span>{this.props.endTitle}</span><input className="datepick-endTitle" data-type="end" type="text" value={ved} readOnly /></label>
        </div>
        <div className="datepick-wrap">
          { isClient ? this.wrap.render() : this.wrap }
        </div>
      </div>
      ,function (dom){
        let currObj
        $(dom).find('.datepick-startTitle').once('click',function (e){
          // e.stopPropagation()
          currObj = $(this)
          let ll = $(this).position().left
          $(dom).find('.datepick-wrap').show().css({marginLeft: ll})
          _this.show('start')
        })
        $(dom).find('.datepick-endTitle').once('click',function (e){
          // e.stopPropagation()
          currObj = $(this)
          let ll = $(dom).find('.datepick-input label:first-child').outerWidth(true) + $(this).position().left
          
          $(dom).find('.datepick-wrap').show().css({marginLeft: ll})
          _this.show('end')
        })
        $(document).on('click',function (e){
          // $(dom).find('.datepick-wrap').hide()
          e.stopPropagation()
          var $self=$(e.target)
          if($self.closest('.datepick').length===0){
            $(dom).find('.datepick-wrap').hide()
          }
        })
        $(dom).find('.datepick-wrap').on('click','.datepick-optional',function (e){
          e.stopPropagation()
          let val = $(this).parent().data('date')
          let ved = $(dom).find('.datepick-endTitle').val()
          currObj.val(val)
          _this.setVal({type: currObj.data('type'), val: val})
          if(currObj.data('type') == 'start'){
            if(Date.parse(new Date(val)) >= Date.parse(new Date(ved)) || Date.parse(new Date(val)) < Date.parse(new Date(ved)) - _this.state.max * 24 * 3600 * 1000){
              _this.state.vEndDate = new Date(Date.parse(new Date(val)) + 1 * 24 * 3600 * 1000).Format('yyyy-MM-dd')
              $(dom).find('.datepick-endTitle').val(new Date(Date.parse(new Date(val)) + 1 * 24 * 3600 * 1000).Format('yyyy-MM-dd'))
            }
            if(_this.props.max > 1){
              $(dom).find('.datepick-endTitle').click()
            }else{
              $(dom).find('.datepick-wrap').hide()
            }
          }else if(currObj.data('type') == 'end'){
            $(dom).find('.datepick-wrap').hide()
          }
        })
        $(dom).find('.datepick-wrap').on('click','.datepick-prev',function (e){
          e.stopPropagation()
          _this.prev()
        })
        $(dom).find('.datepick-wrap').on('click','.datepick-next',function (e){
          e.stopPropagation()
          _this.next()
        })
      }
    )
    return <DubDate />
  }
}

export default function datepick(options){
  Aotoo.inject.css([
    `/css/m/datepick`
  ])
  let sd = new Date().Format('yyyy-MM-dd')
  let dft = {
    startDate: sd,
    endDate: new Date(Date.parse(new Date(sd)) + 365 * 24 * 3600 * 1000).Format('yyyy-MM-dd'),
    vStartDate: sd ,
    vEndDate: new Date(Date.parse( new Date(sd) || new Date() ) + 1 * 24 * 3600 * 1000).Format('yyyy-MM-dd'),
    cStartDate: sd,
    max: ''
  }
  dft = _.merge(dft, options)
  const dp = new Datepick(options)
  return dp
}
