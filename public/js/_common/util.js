import Uploaderx from 'commonjs/uploaderx'
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
        abc: item.abc,
        linkids: item.linkids
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
    //status 是否子列表需要包含父标题
    let childData = []
    if (res.length) {
      const newData = _.sortBy(res, function(data) {    //倒序
        return - data.sortIndex;
      });
      newData.map( (item, ii)=> {
        let linkids = []
        if (item.linkids) {
          linkids = item.linkids.filter(function (s) {
            return s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
          });
        }
        if (item.preCode == 'index') {          //首页，作特殊处理
          // childData.unshift({
          //   title: <span className='disN'>{item.sourceName}</span>,
          //   idf: item.id,
          // })
        } else if (linkids.length == 1) {
          childData.push({
            title: <label className={'item-icon item-icon-'+(item.defaultIco || item.preCode)}><span className='item-title'>{item.sourceName}</span></label>,
            idf: item.id
          })
        } else if (linkids.length == 2) {
          console.log(item.sourceName)
          childData.push({
            title: item.sourceName,
            parent: item.parentId,
            attr: {path: 'item-title'}
          })
        } else {
          childData.push({
            // title:  <a href={'#'+item.targetUrl}>{item.sourceName}</a>,
            title:  item.abc ? <span className='disN'>{item.sourceName}</span> : item.sourceName,
            parent: item.parentId,
            content: code[item.preCode] || '',
            path: item.targetUrl,
            attr: {path: item.targetUrl},
          })
        }
        // if (item.preCode == 'index') {          //首页，作特殊处理
        //   // childData.unshift({
        //   //   title: <span className='disN'>{item.sourceName}</span>,
        //   //   idf: item.id,
        //   // })
        // }
        // else {
        //   if (item.targetUrl == '#') {
        //     childData.push({
        //       title: <label className={'item-icon item-icon-'+(item.defaultIco || item.preCode)}><span className='item-title'>{item.sourceName}</span></label>,
        //       idf: item.id
        //     })
        //     //子菜单 需要有一个主菜单来当标题
        //     if (status) {
        //       childData.push({
        //         title: item.sourceName,
        //         parent: item.id,
        //         attr: {path: 'item-title'}
        //       })
        //     }
        //   }
        //   else {
        //     childData.push({
        //       // title:  <a href={'#'+item.targetUrl}>{item.sourceName}</a>,
        //       title:  item.abc ? <span className='disN'>{item.sourceName}</span> : item.sourceName,
        //       parent: item.parentId,
        //       content: code[item.preCode] || '',
        //       path: item.targetUrl,
        //       attr: {path: item.targetUrl},
        //     })
        //   }
        // }
      })
    }
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
  },
  checkTextareaNum(inputForm, inputId, inputnum, cls = false) {         //限制textarea的字数
    function getLength(str) {//处理输入的内容是文字还是字母的函数
      return String(str).replace(/[^\x00-\xff]/g, 'aa').length;
    };
    setTimeout(() => {
      const explain = cls ? cls : '#' + inputForm.allocation[inputId].id
      $(explain).off('keyup').on('keyup', function () {
        let curLenght = Math.ceil(getLength($(explain).val()) / 2)
        if (curLenght > inputnum) {
          let num = $(explain).val().substr(0, inputnum);
          $(explain).val(num);
        } else {
          if (cls) {
            $(explain).next().find(".countName").text($(explain).val().length)
          }
          else {
            $(explain).parents('.fkp-content').find(".countName").text($(explain).val().length)
          }
        }
      })
    }, 200)
  },
  showUploader(obj) {
    // if (app.picData[opt.type]) {
    //   if (app.picData[opt.type].posterImage) {
    //     imageUrl = app.picData[opt.type].posterImage.split(',');
    //   }
    //   if (app.picData[opt.type].posterImageInfo) {
    //     imageInfo = app.picData[opt.type].posterImageInfo.split(',');
    //   }
    // }
    let prcData = {
      data: [],
      desc: []
    }
    let imageUrl = obj.data && obj.data.split(',') || [];
    imageUrl.map((item, i) => {
      prcData.data.push({
        src: item
      })
    })

    let upload = new Uploaderx({
      btnType: 'default',  //default(默认),cards(名片),poster(海报),//logo(店铺logo)//files(上传文件)
      btnSize: {
        width: 80,
        height: 80
      },
      preview: false,
      filePath: '',                             //图片链接前缀
      warningText: '请上传图片',                    //警告文字
      errorText: '请上传正确图片',                  //报错文字
      popWarningText: '',
      hasDesc: false,                             //是否需要图片描述,
      data: prcData.data,
      desc: '',
      upConfig: {
        limitDesc: '10M',
        multiple: false,   
        uploaderConfig: {
          fileNumLimit: 1,
          duplicate: true,
          fileSingleSizeLimit: 10 * 1024 * 1024,
          server: '/fastdfs/upload.do?isWatermark=1&isThumbnail=1&thumbnailSize=[{"w":375,"h":0},{"w":880,"h":0},{"w":570,"h":0},{"w":750,"h":0},{"w":250,"h":0}]',
          // server: '/fastdfs/upload.do?isWatermark=' + (obj.isWatermark || '2') + '&watermarkType='+ (obj.watermarkType || '1') +'&isThumbnail=1&thumbnailSize=[{"w":375,"h":0},{"w":880,"h":0},{"w":570,"h":0},{"w":750,"h":0},{"w":250,"h":0}]', // 文件接收服务端。
          accept: {
            title: 'Images',
            extensions: 'jpg,jpeg,png,bmp',
            mimeTypes: 'image/jpg, image/jpeg, image/png, image/x-ms-bmp'
          }
        },
      },
    })
    return upload.init().render();
  },
  getHash () {
    let hashData = document.location.hash
    if (hashData) {
        hashData = hashData.replace('#', '')
        hashData = hashData.split('?')
    }
    return hashData
  },
  parseParam (param, key) {
    var vm = this
    var paramStr = "";
    if ( typeof param ==  'string' || typeof param == 'number' || typeof param == 'boolean') {
        paramStr += "&" + key + "=" + encodeURIComponent(param);
    } else {
        $.each(param, function(i) {
            var k = key == null ? i : key + (param instanceof Array ? "[" + i + "]" : "." + i);
            paramStr += '&' + util.parseParam(this, k);
        });
    }
    return paramStr.substr(1);
  },
  queryString(url){
    var arr = [],
       res = {};
    if(url){
        arr = url.split('&');
        for(var i=0; i< arr.length; i++){
            res[arr[i].split('=')[0]] = decodeURIComponent(arr[i].split('=')[1]);
        }
    }else{
        res = {};
    }
    return res;
  },
  kwHighlight(str, key){
    if (key !== '') {
      var reg = new RegExp("(" + key + ")", "g");
      var newstr = str.replace(reg, "<em>$1</em>");
      return newstr;
    }
  }
}

module.exports = { 
  adapterfilterRouterData: util.adapterfilterRouterData,
  ifSession: util.ifSession,
  adapterIdNav: util.adapterIdNav,
  getDateStr: util.getDateStr,
  checkTextareaNum: util.checkTextareaNum,
  showUploader: util.showUploader,
  getHash: util.getHash,
  parseParam: util.parseParam,
  queryString: util.queryString,
  kwHighlight: util.kwHighlight
}