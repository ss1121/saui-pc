import customTable from 'commonjs/customTable'

const bodyDataFunc = (res) =>{
  return res.map(item => {
    return {
      id:     item.id,
      name:   item.name,
      price:  item.price,
    }
  })
  
}

const likeTable = (data) => {
  let orderinfoTable = customTable({
    headData: [
      {
        title: 'id',
        class: 'wid-p10',
        key: 'id'
      },
      {
        title: '产品名称',
        class: 'wid-p50',
        key: 'name'
      },
      {
        title: '价格',
        class: 'wid-p40',
        key: 'price'
      },
    ],
    bodyData: data ? bodyDataFunc(data) : '',
    tableClass: 'ss-table',
  })
  return orderinfoTable
}

module.exports = {
  likeTable
}