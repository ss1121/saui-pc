import {objtypeof} from 'libs'

Aotoo.inject.css('/css/t/bootstrap_table.css')
.js('/js/t/bootstrap_table.js')
// .js('/js/t/bootstrap_table.js', function() {
//   setTimeout(() => {
//     Aotoo.inject.js('/js/t/bootstrap_table_zh_CN.js', waitForInject)
//   }, 100);
// })

const waitForQueue = []
let injectTimmer
function waitForInject(callback) {
  if (Aotoo.isClient) {
    if (typeof callback === 'function') {
      waitForQueue.push(callback)
    }
  
    if ($.fn.bootstrapTable) {
      clearTimeout(injectTimmer)
      setTimeout(() => {
        if (waitForQueue && waitForQueue.length) {
          const method = waitForQueue.shift()
          method()
          if (waitForQueue && waitForQueue.length) {
            waitForInject()
          }
        }
      }, 100);
    } else {
      injectTimmer = setTimeout(() => {
        waitForInject()
      }, 200);
    }
  }
}

class BT extends React.Component {
  constructor(props){
    super(props)
  }

  render(){
    return (
      <table className="" data-toggle="table"></table>
    )
  }
}

function myTables(config) {
  let tableInstance = Aotoo(BT, {})
  const bsConfig = config.bstable

  tableInstance.on('rendered', function(param) {
    const { dom } = param
    tableInstance.table = $(dom)
    waitForInject(() => {
      setTimeout(() => {
        $(dom).bootstrapTable(bsConfig);
      }, 100);
    })

    // Aotoo.inject.css('/css/t/bootstrap_table.css')
    // .js('/js/t/bootstrap_table.js', ()=>{
    //   setTimeout(() => {
    //     Aotoo.inject.js('/js/t/bootstrap_table_zh_CN.js', () => {
    //       setTimeout(() => {
    //         $(dom).bootstrapTable(bsConfig);
    //       }, 200);
    //     })
    //   }, 200);
    // })

    // .js([
    //   '/js/t/bootstrap_table.js',
    //   '/js/t/bootstrap_table_zh_CN.js'
    // ], ()=>{
    //   setTimeout(() => {
    //     $(dom).bootstrapTable(bsConfig);
    //   }, 500);
    // })
  })
  return tableInstance
}

export function BTable(opts){
  let dft = {
    container: '',
    bstable:{
      classes: 'table',     //设置 table的类
      method: 'post',
      url: undefined,                          //数据链接
      ajax: undefined,
      cache: true,                      //开启缓存
      data: [],                         //json 数据
      dataType: "json",
      striped: false,                      //使表格带有条纹
      sortable: false,                    //是否启用排序
      pagination: true,                     //在表格底部显示分页工具栏
      pageSize: 10,
      pageNumber: 1,
      // pageList: [10, 20, 50, 100, 200, 500],
      pageList: [10],
      sidePagination: "client",           //服务端处理分页 server
      // cardView: false,                      //设置为True时显示名片（card）布局
      showColumns: false,                  //显示隐藏列

      silentSort: true,                   // ajax交互的时候是否显示loadding加载信息


      singleSelect: false,                 //复选框只能选择一条记录
      clickToSelect: false,                //点击行即可选中单选/复选框
      checkboxHeader: false,              //为否隐藏全选按钮

      search: false,// 是否支持搜索
      searchOnEnterKey: false,            // enter键开启搜索
      searchText: '',                     // 初始化搜索内容
      strictSearch: false,                // 搜索框输入内容是否须和条目显示数据严格匹配，false时只要键入部分值就可获得结果
      searchAlign: 'right',               // 搜索框对齐方式

      // queryParams: queryParams, //参数

      showRefresh: false,                    //显示刷新按钮
      silent: false,                       //刷新事件必须设置
      checkboxHeader: false,
      uniqueId: "id",                       //每一行的唯一标识，一般为主键列
      showToggle:false,                     //是否显示详细视图和列表视图的切换按钮
      showExport: false,                     //是否显示导出
      exportDataType: "basic",              //basic', 'all', 'selected'.

      // iconSize: undefined,// 按钮、搜索输入框通用大小，使用bootstrap的sm、md、lg等
      // iconsPrefix: 'glyphicon', // 按钮通用样式
      // icons: {
      //  paginationSwitchDown: 'glyphicon-collapse-down icon-chevron-down',// 显示分页按钮
      //  paginationSwitchUp: 'glyphicon-collapse-up icon-chevron-up',// 隐藏分页按钮
      //  refresh: 'glyphicon-refresh icon-refresh',// 刷新按钮
      //  toggle: 'glyphicon-list-alt icon-list-alt',// 切换表格详情显示、卡片式显示按钮
      //  columns: 'glyphicon-th icon-th',// 筛选条目按钮
      //  detailOpen: 'glyphicon-plus icon-plus',// 卡片式详情展开按钮
      //  detailClose: 'glyphicon-minus icon-minus'// 卡片式详情折叠按钮
      // },// 工具栏按钮具体样式
      onAll: function (name, args) {
       return false;
      },
      onClickCell: function (field, value, row, $element) {
       return false;
      },
      onDblClickCell: function (field, value, row, $element) {
       return false;
      },
      onClickRow: function (item, $element) {
       return false;
      },
      onDblClickRow: function (item, $element) {
       return false;
      },
      onSort: function (name, order) {
       return false;
      },
      onCheck: function (row) {
       return false;
      },
      onUncheck: function (row) {
       return false;
      },
      onCheckAll: function (rows) {
       return false;
      },
      onUncheckAll: function (rows) {
       return false;
      },
      onCheckSome: function (rows) {
       return false;
      },
      onUncheckSome: function (rows) {
       return false;
      },
      onLoadSuccess: function (data) {
       return false;
      },
      onLoadError: function (status) {
       return false;
      },
      onColumnSwitch: function (field, checked) {
       return false;
      },
      onPageChange: function (number, size) {
       return false;
      },
      onSearch: function (text) {
       return false;
      },
      onToggle: function (cardView) {
       return false;
      },
      onPreBody: function (data) {
       return false;
      },
      onPostBody: function () {
       return false;
      },
      onPostHeader: function () {
       return false;
      },
      onExpandRow: function (index, row, $detail) {
       return false;
      },
      onCollapseRow: function (index, row) {
       return false;
      },
      onRefreshOptions: function (options) {
       return false;
      },
      onResetView: function () {
       return false;
      },
      formatLoadingMessage: function () {
        return "请稍等，正在加载中...";
      },
      formatNoMatches: function () {  //没有匹配的结果
        return '无符合条件的记录';
      },
      formatShowingRows: function (pageFrom, pageTo, totalRows) {
        return '显示第 ' + pageFrom + ' 到第 ' + pageTo + ' 条记录，总共 ' + totalRows + ' 条记录';
      },
      formatter: function(){},
      columns: [],
    }
  }

  if (objtypeof(opts) == 'object') dft = _.merge(dft, opts)
  // return new _BoostrapTbale(dft)
  console.log(dft, 'dft')
  return myTables(dft)
}

export function pure(props){
  return BTable(props)
}
