
const util = {
  //过滤菜单接口数据，保留需要的字段
  adapterfilterRouterData(data){
    return data.map(item => {
      return {
        id: item.id,
        sortIndex: item.sortIndex,
        parentId: item.parentId,
        preCode: item.preCode,
        sourceName: item.sourceName,
        targetUrl: item.targetUrl,
        defaultIco: item.defaultIco,
      }
    })
  },
  //返回菜单数据接口
  ifSession(cb, code){
    if (typeof cb == 'function') {
      if (pageStore.data.getIdNavData) {
        cb(pageStore.data.getIdNavData)
      }
      else {
        ajax.post('/api/getMemberPermission', {
          method: 'getMemberPermission.do',
          memberId: sessionStore('UserDetail').id,
          preCode: code,
          sourceType: '1'
        })
        .then( data => {
          if (data.data.code == '00') {
            if (data.data.data.permission.length) {
              pageStore.data.getIdNavData = data.data.data.permission
              cb(pageStore.data.getIdNavData)
            }
          }
        })
      }
    }
  },
  //处理过滤后的菜单接口数据，来适用于router组件
  adapterIdNav(res, code, status) {
    let childData = []
    if (res.length) {
       const newData = _.sortBy(res, function(data) {    //倒序
         return - data.sortIndex;
       });
      newData.map( (item, ii)=> {
        if (item.targetUrl == '#') {
          if (item.preCode == 'shopIndex') {          //我是供应商 店铺首页，作特殊处理
            // childData.unshift(
            //   {
            //     title: <span className='disN'>{item.sourceName}</span>,
            //     idf: item.id
            //   },
            //   {
            //     title:  <span className='disN'>{item.sourceName}</span>,
            //     parent: item.id,
            //     content: code['shopIndex'],
            //     path: 'shopIndex',
            //     attr: {path: 'shopIndex'}
            //   }
            // )
          }
          else {
            childData.push({
              title: <label className={'item-icon item-icon-'+(item.defaultIco || item.preCode)}><span className='item-title'>{item.sourceName}</span></label>,
              idf: item.id
            })
            //子菜单 需要有一个主菜单来当标题
            if (status) {
              childData.push({
                title: item.sourceName,
                parent: item.id,
                attr: {path: 'item-title'}
              })
            }
          }
        }
        else {
          childData.push({
            // title:  <a href={'#'+item.targetUrl}>{item.sourceName}</a>,
            title:  item.sourceName,
            parent: item.parentId,
            content: code[item.targetUrl] || '',
            path: item.targetUrl,
            attr: {path: item.targetUrl},
          })
        }
      })
    }
    console.log(childData)
    return childData
  },
  // 计算日期
  getDateStr(addDayCount) { // 数字类型值：正数计算多少天后，负数计算多少天前 
    const today = new Date()
    today.setDate(today.getDate() + addDayCount) //获取addDayCount天后的日期
    const y = today.getFullYear();
    const M = (today.getMonth() + 1) < 10 ? "0" + (today.getMonth() + 1) : (today.getMonth() + 1) //获取当前月份的日期，不足10补0
    const d = today.getDate() < 10 ? "0" + today.getDate() : today.getDate() //获取当前几号，不足10补0
    return (y + "-" + M + "-" + d)
  }
}

module.exports = { 
  adapterfilterRouterData: util.adapterfilterRouterData,
  ifSession: util.ifSession,
  adapterIdNav: util.adapterIdNav,
  getDateStr: util.getDateStr
}