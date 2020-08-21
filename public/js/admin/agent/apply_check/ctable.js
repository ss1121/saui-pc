import customTable from 'commonjs/customTable'

const bodyDataFunc = (res) =>{
  return res.map(item => {
    return {
      id:     item.id,
      person:   item.person,
      operator:  item.operator,
      time:   item.time,
      remark:  item.remark,
    }
  })
}

const likeTable = (parmas) => {
  console.log(parmas)
  let orderinfoTable = customTable({
    headData: [
      {
        title: '编号',
        class: 'wid-p6',
        key: 'id'
      },
      {
        title: '操作人',
        class: 'wid-p9',
        key: 'person'
      },
      {
        title: '操作方',
        class: 'wid-p9',
        key: 'operator'
      },
      {
        title: '操作时间',
        class: 'wid-p16',
        key: 'time'
      },
      {
        title: '操作信息/备注',
        class: 'wid-p60',
        key: 'remark'
      },
    ],
    bodyData: parmas.data ? bodyDataFunc(parmas.data) : '',
    tableClass: parmas.listClass || 'ss-table',
  })
  return orderinfoTable
}

module.exports = {
  likeTable
}