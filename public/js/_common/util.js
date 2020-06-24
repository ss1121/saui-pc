
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
  adapterIdNav(res, code) {
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
          }
        }
        else{
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
    return childData
  }
}

module.exports = { 
  adapterfilterRouterData: util.adapterfilterRouterData,
  ifSession: util.ifSession,
  adapterIdNav: util.adapterIdNav
}