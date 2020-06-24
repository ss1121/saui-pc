import {form} from 'component/client'
import list from 'component/modules/list'
import inputNum from "./inputNum";

import inputPop from "./input-pop";
import {dataTier3, dataTier2, dataTierHot,} from './destination/data-destination'


/**
 * 表单内容
 */

//搜索列表-弹出层内容
const searchPopList = list({data: [], listClass: 'item-pop-list'})
//搜索列表数据 
const searchList = (data) => {
  data = data || ['abc', 'bcs', 'bsam', 'ssss']
  return data.map(item => {
    return {
      title: item
    }
  })
}
//输入框加减
let iNum = inputNum({count: 0, min: 0, max: 5})
let iNum2 = inputNum({count: 2, min: 0, max: 5, type: 'lr'})


const LikeForm = Aotoo.wrap(
  <ul className='like-form lr'>
    <li className='ss-item'>
      <label className='item-title'>时间限制</label>
      <div className='item-coentent'>
        <label className='item-label form-tips'><input className='form_control' type='text' /><span className='item-desc'>天</span><span className='ss-form-tips'></span></label>
        <label className='item-label form-tips'><input className='form_control' type='text' /><span className='item-desc'>前可改</span><span className='ss-form-tips'></span></label>
      </div>
    </li>
    <li className='ss-item'>
      <label className='item-title'>修改次数</label>
      <div className='item-coentent'>
        <label className='item-label form-tips'><input className='form_control' type='text' /><span className='ss-form-tips'></span></label>
        <span className='item-desc'>天</span>
        <label className='item-label form-tips'><input className='form_control' type='text' /><span className='item-desc'>天</span><span className='ss-form-tips'></span></label>
      </div>
    </li>
  </ul>
)

const FormData = [
  {
    title: '普通文本',
    input: {
      type: 'text',
      id: 'tt',
      placeholder: '默认',
      desc: <span className='icon-warning mlr-default color-regular'>地点仅购买后可见</span>
    },
    required: true
  },
  {
    title: '复选框',
    input: {
      type: 'checkbox',
      title: ['选项1', '选项2', '选项3'],
      name:  'checkbox',
      value: ['1', '2', '3'],
    },
  },
  {
    title: '单选框',
    input: {
      type: 'radio',
      title: ['选项1', '选项2', '选项3'],
      name:  'radio',
      value: ['1', '2', '3'],
      itemMethod: function(dom) {
        const parentId = $(this).val()
        const areaTitle = $(this).prev().text()
        console.log(parentId, areaTitle)
      },
      itemClass: 'fkp-mb-primary '
    },
  },
  {
    title: ' ',
    input: {
      type: 'span',
      id: 'radioDesc',
      value:  <LikeForm />,
      itemClass: 'fkp-content-flex1 '
    }
  },
  {
    title: '下拉',
    input:{
      type: 'select', 
      id: 'select', 
      readOnly: 'readOnly',
      placeholder: '请选择',
      options:[
        {title: 'aaa', attr: {'value': 1}, activated: true},
        {title: 'bbb', attr: {'value': 2}},
        {title: 'ccc', attr: {'value': 3}},
      ]
    }
  },
  {
    title: '禁用下拉',
    input:{
      type: 'select', 
      id: 'selectx', 
      readOnliy: 'readOnly',
      disabled: 'disabled',
      value: 'abc',
      itemClass: 'inputItem-disabled',
      options:[
        {title: 'aaa', attr: {'value': 1}},
        {title: 'bbb', attr: {'value': 2}},
        {title: 'ccc', attr: {'value': 3}},
      ]
    }
  },
  {
    title: '选择日期',
    input:{
      type: 'date', 
      id: 'date', 
      readOnliy: 'readOnly',
      placeholder: '请选择日期',
      assets: {
        startDate: "2000-01-01",
        endDate: new Date().Format("yyyy-MM-dd")
      }
    }
  },
  {
    title: '多行文本',
    input:{
      type: 'textarea', 
      id: 'textarea', 
      placeholder: '请输入',
      maxLength: '200',
      desc: <p className="textarea-count"><span className="countName">0</span>/200</p>
    },
    required: true
  },
  {
    title: '纯文字',
    input:{
      type: 'span', 
      id: 'textarea2xx', 
      value: '活动描述仅用于公司内部管理活动，不会显示给客人',
      itemClass: 'al-item-center color-info fkp-mb-monir'
    }
  },
  {
    title: ' ',
    input:{
      type: 'textarea', 
      id: 'textarea2', 
      placeholder: '请输入',
      maxLength: '200',
      itemClass: 'ss-form-textarea-single',
      desc: <p className="textarea-count"><span className="countName">0</span>/50</p>
    }
  },
  {
    title: '目的地',
    input: {
      type: 'span',
      id: 'dic',
      value: inputPop(
        {
          tabsConfig: {
            data: dataTier3,     // dataTier3是三级数据  dataTier2是二级数据 dataTierHot带有热门的二级数据
            // select: 1,
            listClass: 'destination-tabs',
            hasMenusBtn: false,     //显示左右切换按钮
            cb: function(dom, inst) {
              //通过params传回来的idx,来判断点击的栏目是哪一个,从而更新content
              // inst.saxer.on('updateContent', function(params) {
              //   const idx = params.idx
              //   inst.$upcontent({data: {title: 'xxxx'}, select: idx})
              // })
            }
          },
          mddConfig: {
            sortLevel: '3',          //数组有几层    
            widgetType: '1',      //通过这个去判断展示效果 1是默认（控件1） 2为地接(控件2)  3是签证（控件3）
          }
        }
      )
    }
  },
  {
    title: '搜索',
    input: {
      type: 'text',
      id: 'search',
      placeholder: '默认',
      itemClass: 'inputItem-icon-x pages-search',
      // desc: <i className='item-icon-x icon-del'></i>
      desc: (
        <div className='item-pop-wrap'>
          <i className='item-icon-x icon-del'></i>
          {searchPopList.render()}
        </div>
      )
    }
  },
  {
    title: '计数框',
    input: {
      id: 'num',
      type: 'span',
      value: iNum.render()
    }
  },
  {
    title: '计数框',
    input: {
      id: 'num2',
      type: 'span',
      value: iNum2.render()
    }
  },
  {
    title: ' ',
    input: {
      id: 'btn',
      type: 'span',
      value: <button className='ss-button btn-default'>提交</button>
    }
  }
]

const formWrap = form({
  data: FormData, 
  listClass: 'form'
})

iNum.rendered = function(params) {
  setTimeout(() => {
    iNum.getValue()
  }, 1000);
  setTimeout(() => {
    iNum2.getValue()
  }, 1000);
}

module.exports = {
  formWrap,
  searchPopList,
  searchList,
  iNum
}