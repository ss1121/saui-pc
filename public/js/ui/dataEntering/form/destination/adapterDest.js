import destination from "./destination";

let valued = location.search && location.search.substr(13).split('&')[0] || ''

//是否多地
function isMulti(data){
  // return /^\w+_\w+$/.test(data.poiId)
  return false
}
function tabContent(arr, option, isHot){
  let [ singleTreexData, multiTreexData, CLevelLength, isCLevel ] = [ [], [], '', true ]
  if (arr.length){
    /*
      * 需要对3、4级数据特殊处理，处理规则如下：
      * 有发布产品的目的地优先度最高排前，3级相对于4级优先排前，4级紧跟对应的3级排列(3级-4级-3级-4级)
      * 目前做法为：先按规则统一排序，4级数据父级ID取父级的父级
      */
    // console.time('testDeconstruction');
    //将产品发布数从大到小排列
    let arr1 = [], arr2 = [];
    arr.forEach(function(item){
      if(item.customLevel >= option.sortLevel){
        arr2.push(item)
      }else{
        arr1.push(item)
      }
    })
    arr2 = arr2.sort(function(a, b){
      if (a.releaseTimes < b.releaseTimes) {
        return 1;
      }
      if (a.releaseTimes > b.releaseTimes) {
        return -1;
      }
      return b.sortIndex - a.sortIndex
    })
    arr = arr1.concat(arr2)
    // arr=arr.sort(function(a,b){
    //   // if(a.customLevel >2 || a.isSearchPoi == 1){
    //   if(a.customLevel >= option.sortLevel && b.customLevel >= option.sortLevel){
    //     if (a.releaseTimes < b.releaseTimes) {
    //       return 1;
    //     }
    //     if (a.releaseTimes > b.releaseTimes) {
    //       return -1;
    //     }
    //     return b.sortIndex - a.sortIndex
    //   }
    //   return b.sortIndex - a.sortIndex
    // })
    //四级数据和非四级数据分组
    const listData=[],exportArr=[],exportMap={}
    arr.map(function(item){
      if(item.releaseTimes==0 && item.customLevel==4){
        exportArr.push(item)
      } else {
        listData.push(item)
      }
    })
    //四级数据转为map
    exportArr.forEach(function(item){
      if(exportMap[item.parentId]){
        exportMap[item.parentId].push(item)
      }else{
        exportMap[item.parentId]=[item]
      }
    })
    //将四级数据插在三级后边
    for (let key in exportMap){
      let index = _.findIndex(listData,function(item){
        if(item && item.id){
          return item.id == key
        }
      })
      if(index>-1 && listData[index].releaseTimes<1){
        listData.splice(index+1,0,...exportMap[key])
      } else {
        listData.push(...exportMap[key])
      }
    }
    // console.timeEnd('testDeconstruction');
    //render
    // listData.sort(function(o,v){
    //   let o_releaseTimes = o.releaseTimes || 0
    //   let v_releaseTimes = v.releaseTimes || 0
    //   return v_releaseTimes - o_releaseTimes
    // })
    listData.forEach( item => {
      // let testList=['东澳岛','珠海全区']
      // if(_.indexOf(testList,item.navTitle)>-1){
      //   console.log(item)
      // }
      let ischecked = ''
      if (isMulti(item)){
        multiTreexData.push({
          title: <a href={`${option.target}${item.poiId}/`} data-level={item.customLevel} data-id={item.poiId} data-customPoiId={item.id} className={'ss-item' + (valued == item.poiId ? ' active' : '')}>{item.navTitle}</a>,
          idf: item.id,
          parent: (item.customLevel == 3) ? item.parentId : (item.customLevel == 4 ? item.idLinks.split(' ')[2] : '')
        })
      } else {
        let href=`${option.target}?destination=${item.poiId}&customPoiId=${item.id}`;
        // 特别色:s-color <span className="ss-item s-color ">
        singleTreexData.push({
          title: item.isSearchPoi!=1 ? 
          <span className="ss-item" key={'_'+item.id}>{item.navTitle}</span>
          :
          <a href={href} data-id={item.poiId} data-customPoiId={item.id} className={'ss-item' + (valued == item.poiId ? ' active' : '')}>{item.navTitle}</a>,
          // <a href={href} data-id={item.poiId} data-customPoiId={item.id} className={'ss-item'+(item.releaseTimes>0 ? ' s-color' : '')}>{item.navTitle}</a>,
          idf: item.id,
          parent: !isHot ? (item.customLevel == 3) ? item.parentId : (item.customLevel == 4 ? item.idLinks.split(' ')[2] : '') : ''
        })
      }
      CLevelLength += item.customLevel
    })
    if (_.uniq(CLevelLength.split('')).length <= 1){
      isCLevel = false      //判断有几层数据 false是一层  true是多层
    }
  }
  const multiTreex = Aotoo.tree({
    data: multiTreexData,
    listClass: multiTreexData ? 'front-mudd-more' : '',
  })
  const singleTreex = Aotoo.tree({
    data: singleTreexData,
    //判断widgetType的控件，再通过数级的层级最终显示
    listClass: !isHot ? (
      option.widgetType == '1' ? option.sortLevel == '2' ? 'ss-destination' : 'ss-destination-title'
      : option.widgetType == '2' ? 'ss-destination-title-two' : 'ss-destination-x'
    ) : 'ss-destination' 
  })
  /**
   * singleTreex listClass 这里需要几个条件，
   *      1 isDropdown 是否是下拉形式也就是弹出层，如果不是，表示是首页（地接，签证）。如果是，表示是弹出层。
   *      2 isHot 是否是热门， 热门统一是一层数据的  目前只给控件1的热门格式
   *      3 widgetType 判断单层还是多层，还要判断是哪个版块 目前有3种形式 (1 默认 2 地接 3签证)
   */
  
  const ContensWrap = singleTreexData.length > 0 && singleTreex
  // const ContensWrap = Aotoo.wrap(
  //   <div>
  //     {/* { multiTreexData.length>0 && (
  //       <h5 className='center'>多地连线</h5>
  //     )} */}
  //     { multiTreexData.length>0 && multiTreex }
  //     {/* { singleTreexData.length>0 && (
  //       <h5 className='center'>一地</h5>
  //     )} */}
  //     { singleTreexData.length>0 && singleTreex }
  //   </div>
  // )
  return ContensWrap
}

function instData(data, option) {
  var poiData = data.poiData      //正常数据
  var hotData = data.hotData      //hot数据
  
  option=_.merge({
    target: '', // attribute of a tag's href
    // defaultTab: '欧洲', // origin tab show
    sortLevel: '3',          //数组有几层    
    widgetType: '2',      //通过这个去判断展示效果 1是默认（控件1） 2为地接(控件2)  3是签证（控件3）
  },option)


  if (poiData && poiData.length){
    let treexStra = [], defaultSelect = 0;
    //tab title,level0
    const newRes = _.filter(poiData, o=> {
      if (o.customLevel == 1){
        return o
      }
    })
    const differRes = _.differenceBy(poiData, newRes)
    newRes.map((item, i) => {
      const idData = _.filter(differRes, o=>{
        if (o.idLinks.indexOf(item.id)> -1){
          return o
        }
      })
      treexStra.push({
        title: <a href='javascript:;' data-id={item.poiId}>{item.navTitle}</a>,
        content: tabContent(idData, option)
      })
      if(item.navTitle === option.defaultTab) defaultSelect = i;
    })
    if (hotData && hotData.length) {
      treexStra.unshift({
        title: <a href='javascript:;' data-id='hot'>热门</a>,
        content: tabContent(hotData, option, true)
      })
      defaultSelect++;
    }
    return treexStra
  }
}

module.exports = function(params, mddConfig) {
  params.data = instData(params.data, mddConfig)
  const destionation = destination({
    props: params
  })

  destionation.rendered = function (dom) {
    if (typeof params.cb === 'function') params.cb.call(this, dom, destionation)
  }
  return destionation.render()
}