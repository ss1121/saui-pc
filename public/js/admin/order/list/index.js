import { BTable } from 'component/modules/table'
import {searchbox} from 'commonjs/adapter/searchbox/searchbox'
//table 模拟数据
const _datas = require("./boostrapTableData")
 //搜索条件
const condition = searchbox({listClass: 'padding-minor-lr'})    
// 生成table
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
        title: '会员编号',
        align: 'center',
        width: '5%',
        valign: 'middle'
      },
      {
        field: 'employee',
        title: '会员角色',
        align: 'center',
        width: '6%',
        valign: 'middle',
      },
      {
        field: 'wxh',
        title: '微信号',
        align: 'center',
        width: '6%',
        valign: 'middle'
      },
      {
        field: 'phone',
        title: '手机',
        align: 'center',
        width: '6%',
        valign: 'middle'
      },
      {
        field: 'img',
        title: '头像',
        align: 'center',
        width: '6%',
        valign: 'middle',
        formatter: function (value, row, index) {
          return `<img src=${value} />`
        }
      },
      {
        field: 'nickname',
        title: '会员昵称',
        align: 'center',
        width: '6%',
        valign: 'middle'
      },
      {
        field: 'city',
        title: '所在城市',
        align: 'center',
        width: '6%',
        valign: 'middle'
      },
      {
        field: 'addup',
        title: '累计消费次数',
        align: 'center',
        width: '6%',
        valign: 'middle'
      },
      {
        field: 'addup30',
        title: '近30天消费次数',
        align: 'center',
        width: '6%',
        valign: 'middle'
      },
      {
        field: 'timerx',
        title: '最近活动时间',
        align: 'center',
        width: '6%',
        valign: 'middle'
      },
      {
        field: 'regtimer',
        title: '注册时间',
        align: 'center',
        width: '6%',
        valign: 'middle'
      },
      {
        field: 'afxx',
        title: '所属分销商',
        align: 'center',
        width: '6%',
        valign: 'middle'
      },
      {
        field: 'from',
        title: '注册来源',
        align: 'center',
        width: '6%',
        valign: 'middle'
      },
      {
        field: 'yqc',
        title: '邀请公司',
        align: 'center',
        width: '10%',
        valign: 'middle'
      },
      {
        field: 'yqp',
        title: '邀请人',
        align: 'center',
        width: '6%',
        valign: 'middle'
      },
      {
        field: 'status',
        title: '会员状态',
        align: 'center',
        width: '6%',
        valign: 'middle',
        formatter: function (value, row, index) {
          return (
            '<span class="color-aux-success">' + 
              (value == 1 ? '正常' : value == 2 ? '未激活' : value == 3 ? '停用' : value == 4 ? '冻结' : value == 5 ? '注销' : '') + 
            '</span>'
          )
        }
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


function pages(params) {
  const Welcome = Aotoo.wrap(
    <div className='pages-wrapper'>
      <div className='pages-header padding-minor-lr'>
        <h2 className='pages-title-lg'>会员列表</h2>
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
export default pages()