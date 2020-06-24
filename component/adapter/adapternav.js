const pageStore = SAX('PageStore');

function adapterBigNav(res){
  let result = []
  const newData = _.sortBy(res, function(data) {    //倒序
    return - data.sortIndex;
  });
  newData.map(item=> {
    if (item.parentId == 0)
      result.push({
        title: <span data-id={item.id}>{item.sourceName}</span>,
        attr: {type: item.preCode}
    })
  })
  return result
}
//
function adapterIdNav(res, code) {
  let childData = []
   if (res.length) {
     const newData = _.sortBy(res, function(data) {    //倒序
       return - data.sortIndex;
     });
    newData.map( (item, ii)=> {
      if (item.targetUrl == '#') {
        if (item.preCode == 'shopIndex') {          //我是供应商 店铺首页，作特殊处理
          childData.unshift(
            {
              title: <span className='disN'>{item.sourceName}</span>,
              idf: item.id
            },
            {
              title:  <span className='disN'>{item.sourceName}</span>,
              parent: item.id,
              content: code['shopIndex'],
              path: 'shopIndex',
              attr: {path: 'shopIndex'}
            }
          )
        }
        else if (item.preCode == 'buyerIndex') {          //我是供应商 店铺首页，作特殊处理
          childData.unshift(
            {
              title: <span className='disN'>{item.sourceName}</span>,
              idf: item.id
            },
            {
              title:  <span className='disN'>{item.sourceName}</span>,
              parent: item.id,
              content: code['buyerIndex'],
              path: 'buyerIndex',
              attr: {path: 'buyerIndex'},
            }
          )
        }
        else {
          childData.push({
            title: <span className={'item-icon item-icon-'+(item.defaultIco || item.preCode)}>{item.sourceName}</span>,
            idf: item.id
          })
        }
      }
      else{
        childData.push({
          title: item.sourceName,
          parent: item.parentId,
          content: code[item.targetUrl],
          path: item.targetUrl,
          attr: {path: item.targetUrl}
        })
      }
    })
  }
  return childData
}

function ifSession(cb, code){
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
}

export default {
  adapterBigNav: adapterBigNav,
  adapterIdNav: adapterIdNav,
  ifSession: ifSession
}
