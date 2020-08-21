import { BTable } from 'component/modules/table'
import {searchbox} from 'commonjs/adapter/searchbox/searchbox'
import { jsxFun, single, double, month, dayTime } from 'commonjs/datePicker'

//table 模拟数据
const _datas = require("./boostrapTableData")
//搜索条件
const FormData = [
  {
    title: '申请时间',
    input: [
      { type: 'span', id: 'date', value: jsxFun("cdatex", '', '请选择时间')},
      { type: 'span', id: 'date2', value: jsxFun("cdatex2", '', '请选择时间'), itemClass: 'item-striping'}
    ],
    multiplyClass: 'item-flex'
  },
  {
    title: '申请编号',
    input: { type: 'text', id: 'wxh', placeholder: '请输入编号'}
  },
  {
    title: '企业全称',
    input: { type: 'text', id: 'yq', placeholder: '关键字搜索'}
  },
  {
    title: '统一社会信用代码',
    input: { type: 'text', id: 'bh', placeholder: '精确搜索', itemClass: 'input-w-lg'},
  },
  {
    title: '品牌名称',
    input: { type: 'text', id: 'wxh', placeholder: '关键字搜索'}
  },
  {
    title: '联系手机',
    input: { type: 'text', id: 'sj', placeholder: '精确搜索'}
  },
  {
    title: ' ',
    input: {
      id: 'btn',
      type: 'span',
      value: <button className='ss-button btn-default plain'><i className='icon-search'></i><span>搜索</span></button>
    }
  },
  {
    title: ' ',
    input: {
      id: 'btn2',
      type: 'span',
      value: <button className='ss-button btn-grey plain'>清空条件</button>
    }
  }
]


function pages(router, data) {
  const condition = searchbox({listClass: 'padding-minor-lr', data: FormData})    
  // 生成table
  function actionFormatter(value, row, index) {
    return [
      '<a class="color-primary ss-block unlock" href="javascript:void(0)" title="Edit">解锁</a>',
      '<a class="color-primary ss-block edit" href="javascript:void(0)" title="Edit">修改</a>',
      '<a class="color-primary ss-block audit" href="javascript:void(0)" title="Remove">审核</a>',
      '<a class="color-primary ss-block detail" href="javascript:void(0)" title="Remove">详情</a>'
    ].join('');
  }
  let actionEvents = {
    // 'click .edit': function (e, value, row, index) {
    //   _.delay(()=>{
    //     $('.modal').attr('data-id',index)
    //     $('#names').val(row.name)
    //     $('#prices').val(row.price)
    //   }, 500)
    //   modal(<ModalEdit />)
    // },
    'click .audit': function (e, value, row, index) {
      router.goto('agent_apply_check', {id: 1})
      // window.location.href = window.location.origin + `/admin#agent_apply_check`
      // window.location.reload()
    }
  };
  const MemberTable = BTable({
    bstable: {
      // method: 'post',
      // dataType: "json",
      // contentType: "application/x-www-form-urlencoded",           //一种编码。好像在post请求的时候需要用到。这里用的get请求，注释掉这句话也能拿到数据
      // url: '/api...',
      // dataField: 'data',        //默认是rows
      // responseHandler: responseHandler,       //请求数据成功后，渲染表格前的方法
      // clickToSelect: true,  //点击行即可选中单选/复选框
      // queryParams: queryParams,      //请求服务器时所传的参数
      // sidePagination: 'server',      //指定服务器端分页
      data: _datas.rows,
  
      classes: 'table table-hover',
      columns: [
        {
          field: 'id',
          title: 'id',
          visible: false,
          align: 'center',
          valign: 'middle'
        },
        {
          field: 'number',
          title: '申请编号',
          align: 'center',
          width: '4%',
          valign: 'middle'
        },
        {
          field: 'employee',
          title: '申请企业',
          align: 'center',
          width: '11%',
          valign: 'middle',
        },
        {
          field: 'wxh',
          title: '经营模式',
          align: 'center',
          width: '8%',
          valign: 'middle'
        },
        {
          field: 'dm',
          title: '统一社会信用代码',
          align: 'center',
          width: '8%',
          valign: 'middle'
        },
        {
          field: 'nickname',
          title: '品牌名称',
          align: 'center',
          width: '8%',
          valign: 'middle'
        },
        {
          field: 'city',
          title: '业务主体(负责人)',
          align: 'center',
          width: '8%',
          valign: 'middle'
        },
        {
          field: 'addup',
          title: '所在城市',
          align: 'center',
          width: '8%',
          valign: 'middle'
        },
        {
          field: 'addup30',
          title: '联系人',
          align: 'center',
          width: '8%',
          valign: 'middle'
        },
        {
          field: 'phone',
          title: '联系手机',
          align: 'center',
          width: '8%',
          valign: 'middle'
        },
        {
          field: 'regtimer',
          title: '申请时间',
          align: 'center',
          width: '8%',
          valign: 'middle'
        },
        {
          field: 'afxx',
          title: '处理人',
          align: 'center',
          width: '8%',
          valign: 'middle'
        },
        {
          field: 'status',
          title: '审核状态',
          align: 'center',
          width: '5%',
          valign: 'middle',
          formatter: function (value, row, index) {
            return (
              `<span class=${value== 1 ? 'color-aux-success' : value == 2 ? 'color-aux-warning' : 'color-aux-fail'}>
                ${value == 1 ? '已通过' : value == 2 ? '待审核' : '已拒绝'}
              </span>`
            )
          }
        },
        {
          field: 'Desc',
          title: '操作',
          align: 'right',
          valign: 'middle',
          width: '8%',
          events: actionEvents,
          formatter: actionFormatter,
        }
      ],
      checkboxHeader: true,   //为否隐藏全选按钮
      // toolbar: '.tb-btn',    //工具按钮用哪个容器
      // pageNumber: 1,          //初始化加载第一页，默认第一页
      // pagination: false,        //是否分页
      pageSize: 1,//单页记录数
      // pageList: [10, 20, 30, 40],     //分页步进值
      // queryParamsType: "limit",
    }
  })
  


  const Welcome = Aotoo.wrap(
    <div className='pages-wrapper'>
      <div className='pages-header padding-minor-lr'>
        <h2 className='pages-title-lg'>分销商申请</h2>
      </div>
      <div className='pages-body ss-c-scroll'>
        {condition.render()}
        <div className='bb-default'></div>
        <div className='padding-minor'>{MemberTable.render()}</div>
      </div>
    </div>
  )
  return <Welcome />
}

export default function(router){
  return {
    main: function(data){
      return pages(router, data)
    },
    enter: function(data){
      return this.main(data)
    },
    leave: function(){
    },
    loaded: function(){
    }
  }
}