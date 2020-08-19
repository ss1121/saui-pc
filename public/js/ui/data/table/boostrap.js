import { BTable } from 'component/modules/table'
/**
 * 以下是表格里的数据，参数、及方法
 *
 */
function actionFormatter(value, row, index) {
  return [
    '<a class="ss-link-primary ss-block edit" href="javascript:void(0)" title="Edit">修改</a>',
    '<a class="ss-link-primary ss-block remove" href="javascript:void(0)" title="Remove">删除</a>'
  ].join('');
}

let actionEvents = {
  'click .edit': function (e, value, row, index) {
    _.delay(()=>{
      $('.modal').attr('data-id',index)
      $('#names').val(row.name)
      $('#prices').val(row.price)
    }, 500)
    modal(<ModalEdit />)
  },
  'click .remove': function (e, value, row, index) {
    modal(<ModalDel />)
  }
};
let boostrapTable = (data) =>{
  const inst =  BTable({
    // container: 'btTable',
    bstable:{
      data: data,
      columns: [
        {
            checkbox: true,
            field: 'state',
            align: 'center',
            width: 50,
            valign: 'middle'
        },
        {
            field: 'id',
            title: 'id',
            visible: false,
            valign: 'middle'
        },
        {
            field: 'name',
            title: '名称',
            valign: 'middle',
            sortable: true,
            editable: true
        },
        {
            field: 'price',
            title: '价钱',
            valign: 'middle'
        },
        {
            field: 'Desc',
            title: '操作',
            align: 'right',
            valign: 'middle',
            width: 140,
            events: actionEvents,
            formatter: actionFormatter,
        }
      ],
      clickToSelect: true,                //点击行即可选中单选/复选框
      checkboxHeader: true,              //为否隐藏全选按钮
      toolbar: '.tb-btn',    //工具按钮用哪个容器
      paginationLoop: false,
      pageSize: 5,
      onCheck: function (row, $element) {
        // $element.attr('data-xxx',row.id)
        return false;
      },
      onUncheckSome: function (rows) {
        return false;
      },
    }
  })
  return inst
}

module.exports = {
  boostrapTable
}