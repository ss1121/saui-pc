import { form } from 'component/client'

import {jsxFun, single, dayTime} from 'commonjs/datePicker'

export default function(params) {
  // const {jsxFun, single, dayTime, month} = params
  //可通过传参，来判断是新增 还是编辑等....
  const fCfg = [
    {
      caption: <p><span className='fkp-input-required'></span>指定时间段</p>,
      input: [
        {
          id: 'start',
          type: 'span',
          value: jsxFun("start", '', '请选择日期', '', true),
          required: true,
          itemClass: 'input-w'
        },
        {
          id: 'end',
          type: 'span',
          value: jsxFun("end", '', '请选择日期', '', true),
          required: true,
          itemClass: 'item-striping input-w',
        },
      ],
      multiplyClass: 'item-flex contaniner-flex'
    },
    {
      title: '指定周期',
      required: true,
      input: {
        id: 'week',
        type: 'checkbox',
        title: ['全部', '周日', '周一'],
        name:  'checkbox',
        value: ['0', '1', '2'],
        itemMethod: function(dom) {
          const idx = $(this).val()     //value作为下标
          if (idx == 0) {
            if($(dom[idx]).attr('checked') === 'checked') {
              dom.map(item => {
                $(dom[item]).attr('checked', false)
                return item
              })
            }
            else {
              dom.map(item => {
                $(dom[item]).attr('checked', true)
                return item
              })
            }
          }
          else {
            if ($(dom[idx]).attr('checked') === 'checked') {
              $(dom[idx]).attr('checked', false)
            }
            else {
              $(dom[idx]).attr('checked', true)
            }
          }
          console.log()
        },
      }
    },
    {
      title: '状态设置',
      input: {
        type: 'radio',
        title: ['开售', '停售'],
        name:  'radio',
        value: ['0', '1'],
        itemMethod: function(dom) {
          const idx = $(this).val()     //value作为下标
          console.log(dom);
        },
        itemClass: 'fkp-mb-primary '
      },
    },
    {
      title: ' ',input: { type: 'span', id: 'tips', value: <p className='icon-exlain color-info size-sm'>修改操作只对在此时间段内，维护过价格和库存的日期有效。</p>, itemClass: 'fkp-mb-0'}
    },
    '分隔符',
    {
      caption: <p><span className='fkp-input-required'></span>报名截止时间</p>,
      input: [
        {
          title: '提前',
          id: 't1',
          type: 'text',
        },
        {
          title: '天',
          id: 't2',
          type: 'span',
          value: jsxFun("cdatex6", '', '请选择时间',  'time'),
          desc: '时',
          itemClass: 'fkp-content-flex mlr-small'
        },
      ],
      multiplyClass: 'item-flex contaniner-flex'
    },
    {
      caption: '价格设置',
      input: [
        {
          title: '销售价',
          id: 'p1',
          type: 'text',
          itemClass: 'fkp-mb-monir'
        },
        {
          title: '税/费',
          id: 'p2',
          type: 'text',
          itemClass: 'fkp-mb-monir'
        },
        {
          title: '分销佣金',
          id: 'p3',
          type: 'text'
        },
      ],
      multiplyClass: 'item-flex'
    },
    {
      title: (
        <div className ='c-checkandradio yuwei'>
          <input type='checkbox' />
          <span className='fkp-checkbox-box'></span>
          <span className='c-value'>余位</span>
          <span className="fkp-input-error "></span>
        </div>
      ),
      input: {
        id: 'sh-RemainingPosition',
        type: 'span',
        value: (
          <div className='flex-row'>
            <div className='flex-row'>
              <label className='c-checkandradio al-item-center' >
                <input type='radio' name='remaining' disabled ='disabled' value='2'/>
                <span className='fkp-radio-box'></span>
                <span className='c-value'>增加</span>
              </label>
              <div className='relative'>
                <input type='text' id='addremainingPosition' maxLength="3" placeholder="0" disabled ='disabled' className='form_control'/>
                <span className="fkp-input-error "></span>
              </div>
            </div>
            <div className='flex-row ml-default'>
              <label className='c-checkandradio al-item-center' >
                <input type='radio' name='remaining' disabled ='disabled' value='3'/>
                <span className='fkp-radio-box'></span>
                <span className='c-value'>减少</span>
              </label>
              <div className='relative'>
                <input type='text' id='removeremainingPosition' maxLength="3" placeholder="0" disabled ='disabled' className='form_control'/>
                <span className="fkp-input-error "></span>
              </div>
            </div>
          </div>
        )
      }
    }
  ] 
  const modalForm = form({data: fCfg, listClass: 'modal-form'})
  modalForm.rendered = function(dom) {
    single($('#start'), {
      disabledSelect: true,
      startDate: new Date().Format('yyyy-MM-dd'),
      // endDate: getDateStr(180),
      currentMonth: new Date().Format('yyyy-MM-dd'),
      cb: function (date) {
        $('#cdatex4').datepicker('setStartDate', date)
      }
    })
    single($('#end'), {
      disabledSelect: true,
      startDate: new Date().Format('yyyy-MM-dd'),
      // endDate: getDateStr(180),
      currentMonth: new Date().Format('yyyy-MM-dd'),
      // cb: function (date) {}
    })
    dayTime($('#cdatex6'), {
      disabledSelect: true,
      // startDate: new Date(new Date().getTime() + 60 * 60 * 1000).Format("yyyy-MM-dd hh:mm:ss"),
      // endDate: new Date(new Date().getTime() + parseInt(that.maxDisplayTime) * 60 * 60 * 1000).Format("yyyy-MM-dd hh:mm:ss")
    })
    $(dom).off('click').on('click', '.yuwei', function(e){
      e.stopPropagation()
      console.log($(this));
      if ($(this).find('input').attr('checked') === 'checked') {
        $(this).find('input').attr('checked', false)
        $('#sh-RemainingPosition').find("input[type='radio']").attr('disabled', true)
      }
      else {
        console.log($('#sh-RemainingPosition'));
        $('.yuwei').find('input').attr('checked', true)
        $('#sh-RemainingPosition').find("input[type='radio']").attr('disabled', false)
      }

    })
  }
  return modalForm
}