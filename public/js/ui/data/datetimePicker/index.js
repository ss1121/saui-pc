import { jsxFun, single, double, month, dayTime } from 'commonjs/datePicker'
import { getDateStr } from 'commonjs/util'
import { modalConfig } from '../../modal/modalConfig'

function pages() {
  const data = [
    { title: '单日历', idf: 'picker', itemClass: 'item-list' },
    { title: jsxFun("cdatex", '', '请选择时间'), parent: 'picker' },

    { title: '双日期', idf: 'picker2', itemClass: 'item-list flex' },
    { title: jsxFun("cdatexDouble", '', '请选择时间'), parent: 'picker2' },
    { title: jsxFun("cdatexDouble2", '', '请选择时间'), parent: 'picker2' },

    { title: '起始日期', idf: 'picker3', itemClass: 'item-list flex' },
    { title: jsxFun("cdatex3", '', '请选择时间'), parent: 'picker3' },
    { title: jsxFun("cdatex4", '', '请选择时间'), parent: 'picker3' },

    { title: '月份日期', idf: 'picker4', itemClass: 'item-list' },
    { title: jsxFun("cdatex5", '', '请选择时间'), parent: 'picker4' },

    { title: '时间', idf: 'picker5', itemClass: 'item-list' },
    { title: jsxFun("cdatex6", '', '请选择时间',  'time'), parent: 'picker5' },
  ]

  const tree = Aotoo.tree({
    data: data,
    footer: <hr data-content='点击查看代码' className='demo-code-line click-lookCode'/>
  })

  const Pages = Aotoo.wrap(
    <div className='adminDiv' id='tag'>
      <h2 className='item-title-lg'>日历控件</h2>
      {tree}
    </div>
    ,function(dom) {
      single($('#cdatex'), {
        disabledSelect: false,
        startDate: new Date().Format('yyyy-MM-dd'),
        endDate: getDateStr(180),
        currentMonth: new Date().Format('yyyy-MM-dd'),
        // cb: function (date) {}
      })
      double($('#cdatexDouble'), $('#cdatexDouble2'), {
        disabledSelect: true,
        startDate: new Date().Format('yyyy-MM-dd'),
        endDate: getDateStr(180),
        currentMonth: new Date().Format('yyyy-MM-dd'),
        // cb: function (date) {}
      })
      single($('#cdatex3'), {
        disabledSelect: true,
        startDate: new Date().Format('yyyy-MM-dd'),
        endDate: getDateStr(180),
        currentMonth: new Date().Format('yyyy-MM-dd'),
        cb: function (date) {
          $('#cdatex4').datepicker('setStartDate', date)
        }
      })
      single($('#cdatex4'), {
        disabledSelect: true,
        startDate: new Date().Format('yyyy-MM-dd'),
        endDate: getDateStr(180),
        currentMonth: new Date().Format('yyyy-MM-dd'),
        // cb: function (date) {}
      })
      month($('#cdatex5'), {
        disabledSelect: true
      })
      dayTime($('#cdatex6'), {
        disabledSelect: true,
        startDate: new Date(new Date().getTime() + 60 * 60 * 1000).Format("yyyy-MM-dd hh:mm:ss"),
        // endDate: new Date(new Date().getTime() + parseInt(that.maxDisplayTime) * 60 * 60 * 1000).Format("yyyy-MM-dd hh:mm:ss")
      })
      //查看源码
      $(dom).find('.click-lookCode').click(function(e) {
        e.stopPropagation()
        modalConfig({
          title: '扫码，查看代码',
          body: <img style={{width: '100%'}} src='/images/saui2.jpg'/>,
          type: 'options',
          showFooter: false
        })
      })
    }
  )
  return <Pages/>
}
export default pages()
