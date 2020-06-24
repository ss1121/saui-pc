import tips from '../msgtips'
import modal from '../modal'
import cropper from '../cropper'
import popup from '../popup'
import Loading from '../Loading'

function getPicInfo(src,imgSize) {
  let _Idx = src.lastIndexOf('_');
  let dotIdx = src.lastIndexOf('.');
  let size = src.substring(_Idx + 1, dotIdx).split('x');
  let file = { _info: { width: 0, height: 0 } };
  let min = src;
  if (/^\d+$/.test(size[0]) && /^\d+$/.test(size[1])) {
    file = { _info: { width: size[0], height: size[1] } };
    min = src.substring(0, _Idx) + '_' + (imgSize || '375x0') + src.substring(dotIdx);
  }
  return { main: src, min, file };
}
function _calc(width,height,pWdith,pHeight){
  let imgclass = 'perwidth100', proportion = '';
  let propHeight = (width * pHeight / pWdith) //计算比例尺寸的高度 如16:9,(图片宽度 * 比例高度 / 比例宽度)
  let propWidth = (height * pWdith / pHeight) //计算比例尺寸的宽度 如16:9,(图片高度 * 比例宽度 / 比例高度)
  let min = (0 | height) - 2;//上传的图片容错范围下限
  let max = (0 | height) + 2;//上传的图片容错范围上限
  imgclass = (propHeight > min) ? 'perwidth100' : 'perHeight100' //判断图片宽度是否超出限定的比例,是就设置图片宽度100%,否则设置高度100%
  let isProportion = (Math.round(propHeight) >= min) && (Math.round(propHeight) <= max) //判断是否在容错范围内
  proportion = !isProportion ? 'uploader-icon-warning' : '' //通过上面的容错范围设置是否出现小叹号
  return {imgclass: imgclass, warning: proportion}
}
function calculate(prop,file){
  if(file){
    let proportwidth = prop.width //比例宽度
    let proportHeight = prop.height //比例高度
    
    if(file.width == 0 || file.height == 0){
      return {imgclass: 'perwidth100', warning: ''}
    }else{
      return _calc(file.width, file.height, proportwidth, proportHeight)
    }
  }
}
function bytesToSize(bytes){     //转换上传的文件大小
  if (bytes === 0) return '0 B';
  let k = 1024 // or 1000
  let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
}
class Uploader extends React.Component {
  constructor(props) {
    super(props)
    let loadingLength = props.upConfig.uploaderConfig.fileNumLimit;
    let loading = []
    for(let i=0,l=loadingLength;i<l;i++){
      loading.push(false)
    }
    this.state = {
      data: this.props.data || [],
      desc: this.props.desc || [],
      warning: false,
      error: false,
      warningText: this.props.warningText,
      errorText: this.props.errorText,
      descWarning: [],
      descError: [],
      descWarningText: [],
      descErrorText: [],
      loading: loading
    }
  }
  handleChange(i,e) {
    let value = e.target.value
    let desc = this.state.desc
    let descWarning = this.state.descWarning;
    let descError = this.state.descError;
    desc[i] = value
    descWarning[i] = false;
    descError[i] = false;
    this.setState({desc, descWarning, descError});
  }
  render(){
    let that = this;
    let { btnType, btnSize, proport, filePath, imgSize, hasDesc, upConfig } = that.props
    let { data, desc, warning, error, warningText, errorText, descWarning, descError, descWarningText, descErrorText, loading } = that.state;
    let fileNumLimit = that.props.upConfig.uploaderConfig.fileNumLimit;
    if(btnType !== 'files'){//图片上传
      let imgList = [];
      data.map((item,i) => {
        let { min } = getPicInfo( filePath + item.src, imgSize)
        let { imgclass, warning } = calculate( proport,{ src: item.src, width: item.width || 0, height: item.height || 0 })
        imgList.push(
          <li className={'upitem' + (hasDesc ? ' upitem-desc' : '')} key={ 'img'+i } data-src={ min } data-width={ item.width } data-height={ item.height } data-id={ item.id } data-original={item.original || ''}>
            <div className="upload-border" style={{ width: btnSize.width,height: (btnType == 'poster' || btnType == 'cards') ? '' : btnSize.height }}>
              <div className="upload-img">
                <i className={ btnType == 'default' ? warning : ''}></i>
                <div className="upimg-wrap">
                  <img className={ btnType == 'default' ? imgclass : btnType == 'logo' ? '' : 'perwidth100' } draggable="false" src={ min } />
                </div>
                <button className="updelete">删除</button>
                { hasDesc ? <div className="upload-desc-wrap">
                  <input type="text" className={ "upload-desc" + (descWarning[i] || descError[i] ? ' upload-desc-input-error' : '')} value={ desc[i] || '' } onChange={this.handleChange.bind(this,i)} placeholder="图片描述20字内" maxLength="20"/>
                  { descWarning[i] ? <span className="upload-desc-warning modu-wraning">{ descWarningText[i] }</span> : '' }
                  { descError[i] ? <span className="upload-desc-error modu-error">{ descErrorText[i] }</span> : '' }
                </div>
                 : null}
                <input className="upfile" id="upfile" type="file" accept={ upConfig.uploaderConfig.accept.mimeTypes } />
              </div>
            </div>
            <div className="upitem-loading disN" style={{...btnSize}}><i className='icon-loading'></i></div>
          </li>
        )
      })
      let fileNum = imgList.length
      let loadingArr = [];
      for(let i=0,l=loading.length;i<l;i++){
        loadingArr.push(<li className={"upload-loading " + (!loading[i] ? 'disN' : '' )} key={_.uniqueId('upload_') + i} style={{...btnSize}}><i className='icon-loading'></i></li>)
      }
      let Upload = (
        <div className={"uploader-wrapper " + that.props.btnType + '-wrap'}>
          <ul className="upload-imglist">
            { imgList }
            { loadingArr }
            {fileNum < fileNumLimit ? <li className="addFiles"><div className={ "webuploader-button" + (warning || error ? ' button-error' : '') } style={ btnSize }></div></li> : '' }
          </ul>
          { fileNumLimit > 1 ? 
            <input className="addfile" multiple='multiple' type="file" accept={ upConfig.uploaderConfig.accept.mimeTypes } /> 
          : <input className="addfile" type="file" accept={ upConfig.uploaderConfig.accept.mimeTypes } /> 
          }
          { warning ? <span className="uploader-warning modu-wraning">{ warningText }</span> : '' }
          { error ? <span className="uploader-error modu-error">{ errorText }</span> : '' }
        </div>
      )
      return Upload
    }else{//文件上传
      let fileList = []
      data.map(item => {
        fileList.push({
          title: (
            <div className="upload-file">
              <p className="upload-fileName">{ item.fileName || '' }({ bytesToSize(item.size) })</p>
              <div className="upload-operate">
                <span className="upload-progress">{ item.progress }</span>
                <a className="updelete" href="javascript:;" data-id={ item.size }>删除</a>
              </div>
            </div>
          ),
          attr:{id: item.id}
        })
      })
      let UploadFile = (
        <div className="uploaderFiles-wrapper">
          <button className={"webuploader-button" + (data.length >= upConfig.uploaderConfig.fileNumLimit ? ' uploader-button-disable' : '')}>点击上传</button>
          <p className="upload-tips">请上传{ upConfig.fileType }格式的文件，文件大小不超过{ upConfig.limitDesc }</p>
          { fileNumLimit > 1 ? 
            <input className="addfile" multiple='multiple' type="file" accept={ upConfig.uploaderConfig.accept.mimeTypes } />
          : <input className="addfile" type="file" accept={ upConfig.uploaderConfig.accept.mimeTypes } />
          }
          { warning ? <span className="uploader-warning modu-wraning">{ warningText }</span> : '' }
          { error ? <span className="uploader-error modu-error">{ errorText }</span> : '' }
          {
            that.list({
              data: fileList,
              listClass: 'upload-fileList',
              itemClass: 'upload-fileItem'
            })
          }
        </div>
      )
      return UploadFile
    }
  }
}
const Actions = {
  SETDATA: function (ostate, opts){
    let curState = this.curState
    curState.data[opts.index].width = opts.width
    curState.data[opts.index].height = opts.height
    return curState
  },
  EXCHANGE: function (ostate, obj){
    let curState = this.curState
    let itemData = curState.data[obj[0]]
    let targetData = curState.data[obj[1]]
    let itemDesc = curState.desc[obj[0]]
    let targetDesc = curState.desc[obj[1]]
    let itemDescWarn = curState.descWarning[obj[0]]
    let targetDescWarn = curState.descWarning[obj[1]]
    let itemDescWarnText = curState.descWarningText[0]
    let targetDescWarnText = curState.descWarningText[1]
    let itemDescError = curState.descError[obj[0]]
    let targetDescError = curState.descError[obj[1]]
    let itemDescErrorText = curState.descErrorText[0]
    let targetDescErrorText = curState.descErrorText[1]
    curState.data[obj[0]] = targetData
    curState.data[obj[1]] = itemData
    curState.desc[obj[0]] = targetDesc
    curState.desc[obj[1]] = itemDesc
    curState.descWarning[obj[0]] = targetDescWarn
    curState.descWarning[obj[1]] = itemDescWarn
    curState.descWarningText[obj[0]] = targetDescWarnText
    curState.descWarningText[obj[1]] = itemDescWarnText
    curState.descError[obj[0]] = targetDescError
    curState.descError[obj[1]] = itemDescError
    curState.descErrorText[obj[0]] = targetDescErrorText
    curState.descErrorText[obj[1]] = itemDescErrorText
    return curState
  },
  PUSH: function (ostate, data){
    let curState = this.curState
    curState.data.push(data);  
    curState.desc.push('');
    curState.descWarning.push(false);
    curState.descWarningText.push('');
    curState.descError.push(false);
    curState.descErrorText.push('');
    for(let i=0,l=curState.loading.length;i<l;i++){
      if(curState.loading[i]){
        curState.loading.splice(i,1);
        break;
      }
    }
    return curState
  },
  UPDATE: function (ostate, data){
    let curState = this.curState
    curState.data[data.index] = data.data
    return curState
  },
  LOADING: function (ostate, opts){
    let curState = this.curState
    if(opts.bol){
      curState.loading[opts.num] = true;
    }else{
      for(let i=0,l=curState.loading.length;i<l;i++){
        if(curState.loading[i]){
          curState.loading[i] = false;
          break;
        }
      }
    }
    return curState;
  },
  PROGRESS: function (ostate, pgs){
    let curState = this.curState
    let data = curState.data
    data.map((item, i) => {
      if(item.id == pgs.id){
        if(pgs.progress !== 100){
          curState.data[i].progress = pgs.progress !== '' ? (parseInt(pgs.progress * 100) == 100 ? 99+'%' : parseInt(pgs.progress * 100) + '%') : ''
        }else{
          curState.data[i].progress = '100%'
          curState.data[i].src = pgs.src
        }
      }
    })
    return curState
  },
  DELETE: function (ostate, index){
    let curState = this.curState
    if(curState.data.length > 0){
      curState.data.splice(index, 1)
    }
    if(curState.desc.length > 0){
      curState.desc.splice(index, 1)
    }
    curState.loading.push(false)
    return curState;
  },
  DESC: function (ostate, data){
    let curState = this.curState
    curState.desc[data.index] = data.value
    return curState
  },
  WARNING: function (ostate,text){
    let curState = this.curState
    curState.error = false;
    if(typeof text == 'boolean'){
      curState.warning = text;
    }else if(typeof text == 'string'){
      curState.warning = true;
      curState.warningText = text;
    }
    return curState
  },
  ERROR: function (ostate, text){
    let curState = this.curState
    curState.warning = false;
    if(typeof text == 'boolean'){
      curState.error = text;
    }else if(typeof text == 'string'){
      curState.error = true;
      curState.errorText = text;
    }
    return curState
  },
  DESCWARNING: function (ostate, opts){
    let curState = this.curState
    curState.warning = false;
    curState.error = false;
    let { warning, text, index } = opts
    if(warning){
      if(_.isArray(warning) || typeof warning == 'boolean'){
        if(typeof warning != 'boolean'){
          if(warning.length == curState.descWarning.length){
            curState.descWarning = warning;
          }else{
            warning.map((item,i) => {
              if(curState.descWarning[i] != 'undefined'){
                curState.descWarning[i] = item
              }
            })
          }
        }else{
          if(typeof index == 'number'){
            curState.descWarning[index] = warning;
          }else{
            curState.descWarning.map((item,i) => {
              curState.descWarning[i] = warning;
            })
          }
        }
      }else{
        console.error('传入的warning格式错误,请改为数组或布尔值')
        return false;
      }
    }
    if(text){
      if(_.isArray(text) || typeof text == 'string'){
        if(typeof text != 'string'){
          if(text.length == curState.descWarningText.length){
            curState.descWarningText = text;
          }else{
            text.map((item,i) => {
              if(curState.descWarningText[i] != 'undefined'){
                curState.descWarningText[i] = item
              }
            })
          }
        }else{
          if(typeof index == 'number'){
            curState.descWarningText[index] = text;
          }else{
            curState.descWarningText.map((item,i) => {
              curState.descWarningText[i] = text;
            })
          }
        }
      }else{
        console.error('传入的text格式错误,请改为数组或字符串')
        return false;
      }
    }
    return curState
  },
  DESCERROR: function (ostate, opts){
    let curState = this.curState
    curState.warning = false;
    curState.error = false;
    let { error, text, index } = opts
    if(error){
      if(_.isArray(error) || typeof error == 'boolean'){
        if(typeof error != 'boolean'){
          if(error.length == curState.descError.length){
            curState.descError = error;
          }else{
            error.map((item,i) => {
              if(curState.descError[i] != 'undefined'){
                curState.descError[i] = item
              }
            })
          }
        }else{
          if(typeof index == 'number'){
            curState.descError[index] = error;
          }else{
            curState.descError.map((item,i) => {
              curState.descError[i] = error;
            })
          }
        }
      }else{
        console.error('传入的error格式错误,请改为数组或布尔值')
        return false;
      }
    }
    if(text){
      if(_.isArray(text) || typeof text == 'string'){
        if(typeof text != 'string'){
          if(text.length == curState.descErrorText.length){
            curState.descErrorText = text;
          }else{
            text.map((item,i) => {
              if(curState.descErrorText[i] != 'undefined'){
                curState.descErrorText[i] = item
              }
            })
          }
        }else{
          if(typeof index == 'number'){
            curState.descErrorText[index] = text;
          }else{
            curState.descErrorText.map((item,i) => {
              curState.descErrorText[i] = text;
            })
          }
        }
      }else{
        console.error('传入的text格式错误,请改为数组或字符串')
        return false;
      }
    }
    return curState
  },
  CLEAR: function (ostate, index){
    let curState = this.curState
    if(index){
      if(curState.data.length >= index){
        curState.data.splice(index,1)
        curState.desc.splice(index,1)
      }else{
        console.error('要删除的对象不存在')
      }
    }else{
      curState.data = []
      curState.desc = []
    }
    return curState
  }
}
//碰撞检测
function colTest(item1,item2){
  let t1 = $(item1).offset().top;
  let r1 = $(item1).outerWidth() + $(item1).offset().left;
  let b1 = $(item1).outerHeight() + $(item1).offset().top;
  let l1 = $(item1).offset().left;

  let t2 = $(item2).offset().top;
  let r2 = $(item2).outerWidth() + $(item2).offset().left;
  let b2 = $(item2).outerHeight() + $(item2).offset().top;
  let l2 = $(item2).offset().left;

  if(t1>b2||r1<l2||b1<t2||l1>r2){
    return false;
  }else{
    return true;
  }
}
//勾股定理求距离
function getDis(item1,item2){
  let a = $(item1).offset().left- $(item2).offset().left;
  let b = $(item1).offset().top-$(item2).offset().top;
  return Math.sqrt(Math.pow(a,2)+Math.pow(b,2));
}
//找到距离最近的
function findItem(list,item){
  let minDis = 999999999;
  let minIndex = -1;
  let arr = list.children()
  arr.each((i)=>{
    if($(item).parents('.upitem')[0] == arr[i]) return true
    if(colTest(item,arr[i])){
      let dis = getDis(item,arr[i]);
      if(dis<minDis){
        minDis = dis;
        minIndex = i;
      }
    }
  })
  if(minIndex==-1){
    return null;
  }else{
    return arr[minIndex];
  }
}
function itemposition(pos1,pos2){
  return {
    left: -(pos2.left - pos1.left),
    top: -(pos2.top - pos1.top)
  }
}
function convertBase64UrlToBlob(urlData){  
  var bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte  
  //处理异常,将ascii码小于0的转换为大于0  
  var ab = new ArrayBuffer(bytes.length);  
  var ia = new Uint8Array(ab);  
  for (var i = 0; i < bytes.length; i++) {  
      ia[i] = bytes.charCodeAt(i);  
  }  
  return new Blob( [ab] , {type : 'image/jpeg'});
}  
function renderedMethod(wup, example, cfg, dom, opts, ctx){
  if(!example.loaded){
    const _inst = wup.create(cfg.upConfig.uploaderConfig)
    example.uploader = _inst;
    
    example.loaded = true;
    example.emit('loaded', { uploader: _inst })
  }
  let _updata = example.getData().data;
  function cropwrap(parents){
    let previewCfg = cfg.crop.previewCfg;
    let preview = [];
    let url = parents ? parents.attr('data-original') : undefined;
    let id = parents ? parents.attr('data-id') : undefined;
    let crop = cropper(
      {
        src: url ? url : undefined,
        ...cfg.crop
      }
    )
    previewCfg.map((item,i) => {
      preview.push(
        <li className="cropper-preview-item" key={'cropperPreview_' + i}>
          <div className="cropper-preview" style={{...item.size}}></div>
          {/* <p className="crropper-text">{item.size.width}X{item.size.height}像素</p> */}
        </li>
      )
    })
    let Cropwrap = Aotoo.wrap(
      <div className="modal">
        <div className='modal-head cropHead title-bg2'>
          <h5>{ cfg.cropTitle }</h5>
          <i className='close'></i>
        </div>
        <div className="modal-body cropWrap">
          <div className="crop-content" style={{ display: url ? 'block' : 'none' }}>
            <div className="crop-area">{ crop.render() }</div>
            <button className="crop-upload-button crop-upload-again">+ 重新上传</button>
          </div>
          <div className="crop-upload" style={{ display: !url ? 'flex' : 'none' }}>
            <div className="crop-upload-left">
              <button className="crop-upload-button">+ 选择图片</button>
            </div>
            <div className="crop-uoload-right">
              <p className="crropper-text">拖拽或缩放虚线框，<br />生成自己满意的图片</p>
              <ul className="cropper-preview-list">
                { preview }
              </ul>
            </div>
          </div>
          <p className="crop-upload-tips"> 上传图片宽度不得小于 { cfg.crop.imgSize.width } X { cfg.crop.imgSize.height }像素<span></span></p>
          <input className="crop-upload-file" type="file" accept={ cfg.upConfig.uploaderConfig.accept.mimeTypes } />
        </div>
        <div className='modal-foot cropFoot'>
          <button className='modal-foot-btn' disabled="disabled">保存并关闭</button>
        </div>
      </div>
      ,function (dd){
        if(url){
          setTimeout(()=>{
            $('.modal-foot-btn').removeAttr('disabled')
            crop.reupload(url)
          },200)
        }
        let again = false;
        $(dd).find('.crop-upload-button').once('click',function (){
          if($(this).hasClass('crop-upload-again')){
            again = true;
          }else{
            again = false;
          }
          $(dd).find('.crop-upload-file').click()
        })
        $(dd).find('.crop-upload-file').once('change',function (){
          let that = this
          let _files = that.files;
          let content = $(dd).find('.crop-content');
          let upload = $(dd).find('.crop-upload');
          let button = $(dd).find('.modal-foot-btn');
          if(_files){
            let fileType = cfg.upConfig.uploaderConfig.accept.mimeTypes.split(',')
            let correct = false;
            fileType.map(item => {
              if($.trim(item) == _files[0].type){
                correct = true;
              }
            })
            if(!correct){
              tips('文件类型不正确请重新上传', { type: 'error' });
              return false
            }
            if(_files[0].size > cfg.upConfig.uploaderConfig.fileSingleSizeLimit){
              tips('文件大小不能超过' + cfg.upConfig.limitDesc, { type: 'error' })
              return false;
            }
            if (window.FileReader) {
                var reader = new FileReader();
                reader.readAsDataURL(_files[0]);
                //监听文件读取结束后事件
                reader.onloadend = function (e) {
                  let img = new Image()
                  $(img).on('load',function (){
                    let imgWidth = img.width;
                    let imgHeight = img.height;
                    let imgSize = cfg.crop.imgSize
                    if(imgWidth >= imgSize.width && imgHeight >= imgSize.height){
                      if(!url){
                        crop.$setimg(e.target.result);
                      }
                      if(!again){//如果是中间的上传按钮
                        content.show()
                        $(dd).find('.crop-upload-tips').hide()
                        upload.hide()
                        button.removeAttr('disabled')
                      }else{//如果是重新上传
                        crop.reupload(e.target.result)
                        $(dd).find('.crop-upload-tips').hide()
                        // crop.$setimg(e.target.result);
                      }
                    }else{
                      $(dd).find('.crop-upload-tips span').html('，当前尺寸为:' + imgWidth + ' X ' + imgHeight + '像素')
                      $(dd).find('.crop-upload-tips').show()
                    }
                  })
                  img.src = e.target.result
                }
            }
          }
        })
        $(dd).find('.modal-foot-btn').once('click',function (){
          const cropConfig = cfg.crop
          const cfgImgSize = cropConfig.imgSize
          crop.validCrop(function(cropImgData){
            if (cropImgData.width < cfgImgSize.width ) {
              let { width, height } = crop.getData()
              $(dd).find('.crop-upload-tips span').html('，当前尺寸为:' + (0 | width) + ' X ' + (0 | height) + '像素')
              $(dd).find('.crop-upload-tips').show()
              return false
            }
            if(parents){
              parents.find('.upload-border').addClass('disN');
              parents.find('.upitem-loading').removeClass('disN');
              $(dd).find('.close').trigger('click');
            }else{
              example.$loading({ num: 0,bol: true })
              if(example.getData().data.length + 1 == cfg.upConfig.uploaderConfig.fileNumLimit){
                $(dom).find('.addFiles').addClass('disN')
              }
              $(dd).find('.close').trigger('click')
            }
            $(dd).find('.crop-upload-tips').hide()
            let cropData = crop.crop()
            if(cropData){
              let files = convertBase64UrlToBlob(cropData)
              if(parents){
                if(id){
                  example.uploader.removeFile(id,true)
                }
              }
              example.uploader.addFiles(files)
              $(dd).find('.crop-upload-file').val('');
              $(dd).find('.close').trigger('click');
              
              example.uploader.off('uploadSuccess').on('uploadSuccess',function (file,ret){
                if(ret.code == '00'){
                  example.$warning(false);
                  example.$error(false);
                  // if(parents){
                  //   example.$delete(parents.index())
                  // }
                  let image = new Image()
                  $(image).on('load',function (){
                    if(parents){
                      example.$update({ data: { src: ret.data.filePath, width: image.width, height: image.height, id: file.id }, index: parents.index() })
                      parents.find('.upload-border').removeClass('disN');
                      parents.find('.upitem-loading').addClass('disN');
                    }else{
                      example.$push({ src: ret.data.filePath, width: image.width, height: image.height, id: file.id,original:$(dd).find('.cropImg').attr('src') })
                      if(example.getData().data.length == cfg.upConfig.uploaderConfig.fileNumLimit){
                        $(dom).find('.addFiles').addClass('disN')
                      }
                    }
                    $(dd).find('.close').trigger('click')
                  })
                  image.src = cfg.filePath+ret.data.filePath
                }else{
                  if(ret.subCode == '0065'){
                    tips('您上传的图片不符合格式要求，请重新上传', { type: 'error' })
                  }else{z
                    tips(ret.subMsg, { type: 'error' })
                  }
                  if(parents){
                    parents.find('.upload-border').removeClass('disN');
                    parents.find('.upitem-loading').addClass('disN');
                  }else{
                    example.$loading({ bol: false })
                  }
                  $(dom).find('.addFiles').removeClass('disN')
                  example.uploader.removeFile(file.id)
                  return false;
                }
              })

              example.uploader.upload()
            }
          })
        })
      }
    )
    return <Cropwrap />
  }
  _updata.map((item,i) => {
    if(!item.width || !item.height){
      let image = new Image()
      $(image).on('load',function (){
        let _width = image.width;
        let _height = image.height;
        let imgType = item.src.split('.')
        let imgTypeLength = imgType.length
        example.$setdata({ width: _width, height: _height, index: i })
      })
      image.src = cfg.filePath + item.src
    }
  })
  //需要拖拽的类型
  if(cfg.dragsort){
    $(dom).find('.upimg-wrap').once('mousedown',function (e){
      let that = this;
      let parents = $(that).parents('.upitem')
      parents.css({zIndex: 1})
      let ifMove = false;
      let { offsetX, offsetY } = e
      let start = { x: e.pageX, y: e.pageY }
      if(example.popup) example.popup.colsePopup()
      $(document).once('mousemove',function (e){
        ifMove = true;
        if(example.getData().data.length > 1){
          if(e.pageX > (start.x + 3) || e.pageX < (start.x - 3) || e.pageY > (start.y + 3) || e.pageY < (start.y - 3)){
            
            $(that).parents('.upload-border').css({border: '1px dashed #ccc'})
            $(that).css({
              cursor: 'move'
            }).parent().css({
              left: e.pageX - parents.offset().left - offsetX,
              top: e.pageY - parents.offset().top - offsetY,
            })
            let target = findItem(parents.parent(),that)
            if(target){
              $(target).find('.upload-border').addClass('active')
              $(target).siblings().find('.upload-border').removeClass('active')
            }else{
              $(dom).find('.upload-border').removeClass('active')
            }
          }
        }
      })
      $(document).once('mouseup',function (e){
        $(document).off('mousemove mouseup')
        parents.css({zIndex: ''})
        if(ifMove){//鼠标放开的时候,检测是否有移动
          let target = findItem(parents.parent(),that)
          let ifAddFile = $(target).hasClass('addFiles')
          if(target && !ifAddFile){//如果该位置有同级对象则交换位置
            let parentOffset = parents.offset()
            let targetOffset = $(target).offset()
            let itemIndex = parents.index()
            let targetIndex = $(target).index()
            let exchange = [itemIndex, targetIndex]
            $(that).parent().animate(itemposition(targetOffset,parentOffset),300,function (){
              $(that).css({cursor: ''}).parent().css({zIndex: ''}).parent().css({border: ''})
            })
            $(target).find('.upload-img').animate(itemposition(parentOffset,targetOffset),300,function (){
              $(target).find('.upload-border').removeClass('active');
              $(target).find('.upload-img').css({zIndex: ''});
              example.$exchange(exchange)
              $(dom).find('.upload-img').css({ left: 0, top: 0 })
            })
          }else{//如果当前位置没有目标就返回原来的位置
            $(that).parent().animate({left: 0,top: 0},300,function (){
              $(that).parents('.upload-border').css({border: '1px dashed transparent',zIndex: 1})
              $(that).css({cursor: 'pointer'})
            })
          }
        }else{
          if(e.target.className != 'updelete'){
            if(cfg.dragsort){
              modal(cropwrap(parents),{
                width: (cfg.crop.modalWidth ? cfg.crop.modalWidth + 'px' : false) || '750px',
                bgClose: true,
                closeBtn: '.close'
              })
            }else{
              $(that).siblings('.upfile').click()
            }
          }
        }
      })
    })
  }else{
    $(dom).find('.upimg-wrap').once('click',function (){
      if(cfg.crop){
        let parents = $(this).parents('.upitem')
        modal(cropwrap(parents),{
          width: (cfg.crop.modalWidth ? cfg.crop.modalWidth + 'px' : false) || '750px',
          bgClose: true,
          closeBtn: '.close'
        })
      }else{
        $(this).siblings('.upfile').click()
      }
    })
  }
  if(cfg.preview){
    $(dom).find('.upimg-wrap').once('mouseenter',function (e){
      let parent = $(this).parents('.upitem')
      parent.css({zIndex: 3})
      let { imgclass, warning } = calculate( cfg.proport, { src: parent.attr('data-src'), width: parent.attr('data-width'), height: parent.attr('data-height') })
      example.popup = popup(
        <div className="uploader-popup">
          <div className="uploader-popup-header">
            <img className={ cfg.btnType == 'default' ? imgclass : 'perwidth100' } src={ parent.attr('data-src') } />
          </div>
          { warning != '' && cfg.btnType == 'default' ? <div className="uploader-popup-footer">{ cfg.popWarningText }</div> : null }
        </div>,
        {
          position: $(this).parent(),
          top: 20,
          left: '95%',
        }
      )
      example.popup.addPopup()
      parent.find('.popup').once('mouseleave',function (){
        parent.css({zIndex: 1})
        if(example.popup) example.popup.colsePopup()
      })
    }).parent().once('mouseleave',function (e){
      e.stopPropagation()
      $(this).parents('.upitem').css({zIndex: 1})
      if(example.popup) example.popup.colsePopup()
    })
  }
  /* 公共事件 */
  $(dom).find('.webuploader-button').once('click',function (){
    let fileQueue = example.getData().data
    let fileNumLimit = cfg.upConfig.uploaderConfig.fileNumLimit;
    if(fileQueue.length < fileNumLimit){
      if(cfg.crop){
        modal(cropwrap(),{
          width: (cfg.crop.modalWidth ? cfg.crop.modalWidth + 'px' : false) || '750px',
          bgClose: true,
          closeBtn: '.close'
        })
      }else{
        $(dom).find('.addfile').click()
      }
    }else{
      return false;
    }
  })
  $(dom).find('.addfile').once('change',function (){
    let _files = this.files;
    let that = $(this)
    if(_files){
      let fileType = cfg.upConfig.uploaderConfig.accept.mimeTypes.split(',')
      let correct = false;
      fileType.map(item => {
        if($.trim(item) == _files[0].type){
          correct = true;
        }
      })
      if(!correct){
        tips('文件类型不正确请重新上传', { type: 'error' });
        that.val('');
        return false
      }

      let fileQueue = example.getData().data
      let filelist = [];
      let fileNumLimit = cfg.upConfig.uploaderConfig.fileNumLimit;

      if (cfg.numLimitWarningText && _files.length > fileNumLimit - fileQueue.length) {
        tips(cfg.numLimitWarningText, { type: 'error' });
        that.val('');
        return false
      }

      for(let i=0,l=_files.length;i<l;i++){
        if(_files[i].size < cfg.upConfig.uploaderConfig.fileSingleSizeLimit){
          filelist.push(_files[i])
          if(filelist.length > fileNumLimit - fileQueue.length){
            break;
          }
          example.uploader.addFiles(_files[i])
          if(cfg.btnType != 'files'){
            example.$loading({num: i, bol: true })
          }
          if(example.getData().data.length + filelist.length >= fileNumLimit){
            $(dom).find('.addFiles').addClass('disN')
          }
          if(example.getData().data.length + filelist.length >= fileNumLimit){
            $(dom).find('.addFiles').addClass('disN')
          }
          example.uploader.off('uploadStart').on('uploadStart',function (file){
            if(cfg.btnType == 'files'){
              example.$push({ fileName: file.name, src: '', size: file.size, id: file.id, progress: '' })
            }
          })
          example.uploader.off('uploadProgress').on('uploadProgress',function (file, percentage){
            example.$progress({ progress: percentage, id: file.id })
          })
          example.uploader.off('uploadSuccess').on('uploadSuccess',function (file,ret){
            if(ret.code == '00'){
              example.$warning(false);
              example.$error(false);
              if(cfg.btnType !== 'files'){
                let image = new Image()
                $(image).on('load',function (){
                  example.$push({ src: ret.data.filePath, width: image.width, height: image.height, id: file.id })
                  if(example.getData().data.length >= fileNumLimit){
                    $(dom).find('.addFiles').addClass('disN')
                  }
                })
                image.src = cfg.filePath+ret.data.filePath
              }else{
                let id = file.id
                example.$progress({ progress: 100, id: id, src: ret.data.filePath })
                setTimeout(function (){
                  example.$progress({ progress: '', id: id })
                },5000)
              }
            }else{
              if(ret.subCode == '0065'){
                tips('您上传的图片不符合格式要求，请重新上传', { type: 'error' })
              }else{
                tips(ret.subMsg, { type: 'error' })
              }
              example.$loading({ bol:false })
              $(dom).find('.addFiles').removeClass('disN')
              example.uploader.removeFile(file.id,true)
              return false;
            }
          })
          example.uploader.off('error').on('error',function (type){
            tips('文件类型不正确请重新上传', { type: 'error' });
            return false;
          })
          example.uploader.upload()
          if(filelist.length == fileNumLimit - fileQueue.length){
            break;
          }
        }else{
          tips('文件大小不能超过' + cfg.upConfig.limitDesc, { type: 'error' })
          continue;
        }
      }
      that.val('');
    }
  })
  $(dom).find('.upfile').once('change',function (){
    let _files = this.files[0]
    let that = $(this)
    let index = that.parents('.upitem').index();
    let fileId = that.parents('.upitem').attr('data-id');
    if(_files){
      let fileType = cfg.upConfig.uploaderConfig.accept.mimeTypes.split(',')
      let correct = false;
      fileType.map(item => {
        if($.trim(item) == _files.type){
          correct = true;
        }
      })
      if(!correct){
        tips('文件类型不正确请重新上传', { type: 'error' });
        return false
      }
      if(cfg.crop){
        if (window.FileReader) {    
          var reader = new FileReader();    
          reader.readAsDataURL(_files);    
          //监听文件读取结束后事件
          reader.onloadend = function (e) {
            let img = new Image()
            $(img).on('load',function (){
              let imgWidth = img.width;
              let imgHeight = img.height;
              let imgSize = cfg.crop.imgSize
              if(imgWidth >= imgSize.width || imgHeight >= imgSize.height){
                let crop = cropper(
                  {
                    src: e.target.result,
                    ...cfg.crop
                  }
                )
                
                modal(cropwrap(e.target.result),{
                  width: (cfg.crop.modalWidth ? cfg.crop.modalWidth + 'px' : false) || '750px',
                  bgClose: true,
                  closeBtn: '.close'
                })
              }else{
                tips('图片尺寸不能小于' + imgSize.width + 'X' + imgSize.height + '像素');
                return false;
              }
            })
            img.src = e.target.result
          };    
        } 
        
      }else{
        if(fileId){
          example.uploader.removeFile(fileId,true);
        }
        example.uploader.addFiles(_files);
        that.parents('.upitem').find('.upload-border').addClass('disN');
        that.parents('.upitem').find('.upitem-loading').removeClass('disN');
        example.uploader.off('uploadSuccess').on('uploadSuccess',function (file,ret){
          if(ret.code == '00'){
            example.$warning(false);
            example.$error(false);
            let image = new Image()
            $(image).on('load',function (){
              example.$update({ data: { src: ret.data.filePath, width: image.width, height: image.height, id: file.id }, index: index })
              that.parents('.upitem').find('.upload-border').removeClass('disN');
              that.parents('.upitem').find('.upitem-loading').addClass('disN');
            })
            image.src = cfg.filePath + ret.data.filePath
          }else{
            if(ret.subCode == '0065'){
              tips('您上传的图片不符合格式要求，请重新上传', { type: 'error' })
            }else{
              tips(ret.subMsg, { type: 'error' })
            }
            that.parents('.upitem').find('.upload-border').removeClass('disN');
            that.parents('.upitem').find('.upitem-loading').addClass('disN');
            example.uploader.removeFile(file.id,true)
            return false;
          }
        })
        example.uploader.off('error').on('error',function (type){
          tips('文件类型不正确请重新上传', { type: 'error' });
          return false;
        })
        example.uploader.upload()
      }
    }
  })
  $(dom).find('.upload-desc').once('focus',function (e){
    let index = $(this).parents('.upitem').index();
    let { descWarning, descError } = example.curState
    descWarning[index] = false;
    descError[index] = false;
    example.$descwarning({warning: descWarning})
    example.$descerror({error: descError})
  }).once('blur',function (){
    let index = $(this).parents('.upitem').index();
    let $that = $(this)
    if(typeof cfg.descBlur == 'function'){
      cfg.descBlur($that.val(),index)
    }
  })
  $(dom).find('.updelete').once('click',function (e){
    e.stopPropagation();
    let parent = $(this).parents(cfg.btnType !== 'files' ? '.upitem' : '.upload-fileItem')
    let _index = parent.index()
    let fileId = parent.attr('data-id')
    example.$delete(_index)
    if(fileId){
      example.uploader.removeFile(fileId,true)
    }
  })
}
// 初始化第三方库的实例
function init3DSLib(wup, example, cfg, dom, opts, ctx){
  renderedMethod(wup, example, cfg, dom, opts, ctx)
}
// 循环检测 WebUploader 是否存在
function loopDetection(example, cfg, dom, opts, ctx){
  clearTimeout(example.loopTimmer)
  example.loopTimmer = setTimeout(function() {
    if (typeof WebUploader !== 'undefined') {
      init3DSLib(WebUploader, example, cfg, dom, opts, ctx)
    } else {
      loopDetection(example, cfg, dom, opts, ctx)
    }
  }, 50);
}
function renderedInject(example, cfg){
  return function(options){
    const {dom, opts, ctx} = options
    try {
      Aotoo.inject.js('/js/t/webuploader', function(){
        loopDetection(example, cfg, dom, opts, ctx)
      })
    } catch (error) {
      console.error('component/uploaderpro->renderInject error');
      console.log(error);
    }
  }
}
function index(opts){
  const instance = Aotoo(Uploader, Actions)
  instance.extend({
    getData: function(){
      let _state = instance.getState()
      return { data: _state ? _state.data : opts.data || [], desc: _state ? _state.desc : opts.desc || [] }
    },
    warning: function (text){
      if(typeof text == 'boolean' || typeof text == 'string'){
        instance.$warning(text)
      }else{
        console.error('格式错误,只支持布尔值或字符串')
      }
    },
    error: function (text){
      if(typeof text == 'boolean' || typeof text == 'string'){
        instance.$error(text)
      }else{
        console.error('格式错误,只支持布尔值或字符串')
      }
    },
    descWarning: function (opts){
      instance.$descwarning(opts)
    },
    descError: function (opts){
      instance.$descerror(opts)
    },
    delete: function (index){
      let _state = instance.getState()
      if(_state.data[index].id){
        instance.uploader.removeFile(_state.data[index].id,true)
      }
      instance.$clear(index)
    },
    clearData: function (index){
      let _state = instance.getState()
      _state.data.map((item,i)=>{
        if(item.id){
          instance.uploader.removeFile(item.id,true)
        }
      })
      instance.$clear()
    }
  })
  let type = opts.btnType
  if(type != 'files'){
    if(!opts.btnSize){
      opts.btnSize = {
        width: type == 'default' ? 172 : type == 'poster' ? 134 : type == 'cards' ? 250 : 80,
        height: type == 'default' ? 97 : type == 'poster' ? 238 : type == 'cards' ? 140 : 80
      }
    }
    if(!opts.proport){
      opts.proport = {
        width: type == 'default' ? 16 : type == 'poster' ? 9 : 1,
        height: type == 'default' ? 9 : type == 'poster' ? 16 : 1
      }
    }
    if(typeof opts.dragsort == 'undefined'){
      opts.dragsort = (type == 'default')
    }
    if(typeof opts.preview == 'undefined'){
      opts.preview = (type == 'default')
    }
  }else{
    opts.upConfig.uploaderConfig.server = '/fastdfs/upload.do'
  }
  // 截图配置
  if(!opts.crop){
    if(type == 'logo'){
      opts.crop = {
        width: 80,
        height: 80,
        modalWidth: '',
        imgSize: {
          width: 120,
          height: 120
        },
        previewCfg:[
          {
            size: {
              width: 120,
              height: 120
            },
            class: ''
          }
        ],
        config: {
          strict: true,
          viewMode: 1,
          aspectRatio: 1 / 1,
          minCropBoxWidth: 0,
          minCropBoxHeight: 0,
        },
      }
    }
  }
  instance.loaded = false   // swiper.js 未完成载入
  instance.uploader = instance.uploader || undefined
  instance.popup = instance.popup || undefined
  instance.loopTimmer = undefined
  instance.on('rendered', renderedInject(instance, opts))
  instance.setProps(opts)
  return instance
}
export default function upload(options){
  let dft = {
    btnType: 'default',//default(默认),cards(名片),poster(海报),//logo(店铺logo)
    cropTitle: '上传图片',
    upConfig:{
      limitDesc: '3M',
      fileType: 'JPG',
      multiple: false,
      uploaderConfig:{
        dnd: undefined,
        chunked: false,
        // thumb: {
        //   width: 110,
        //   height: 110,
        //
        //   // 图片质量，只有type为`image/jpeg`的时候才有效。
        //   quality: 70,
        //
        //   // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
        //   allowMagnify: true,
        //
        //   // 是否允许裁剪。
        //   crop: true,
        //
        //   // 为空的话则保留原有图片格式。
        //   // 否则强制转换成指定的类型。
        //   type: 'image/jpeg'
        // },
        compress: {
          width: 1920,
          height: 1920,
        
          // 图片质量，只有type为`image/jpeg`的时候才有效。
          quality: 80,
        
          // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
          allowMagnify: false,
        
          // 是否允许裁剪。
          crop: false,
        
          // 是否保留头部meta信息。
          preserveHeaders: true,
        
          // 如果发现压缩后文件大小比原来还大，则使用原来图片
          // 此属性可能会影响图片自动纠正功能
          noCompressIfLarger: false,
        
          // 单位字节，如果图片大小小于此值，不会采用压缩。
          compressSize: 50 * 1024
        },
        // 自动上传。
        auto: false,
        fileNumLimit: 4,
        fileSingleSizeLimit: 3 * 1024 * 1024,
        duplicate: true,
        swf: '/images/Uploader.swf',// swf文件路径
        server: '/fastdfs/upload.do?isThumbnail=1&thumbnailSize=[{"w":375,"h":0},{"w":880,"h":0},{"w":570,"h":0},{"w":750,"h":0},{"w":250,"h":0}]',// 文件接收服务端。
        accept: { // 只允许选择文件，可选。
          title: 'Images',
          extensions: 'jpg,jpeg,png',
          // mimeTypes: 'image/*'
          mimeTypes: 'image/jpg, image/jpeg, image/png'
        }
      }
    },
    fileQueued: undefined,
    success: undefined,
    error: undefined,
    uploadComplete: undefined
  }
  dft = _.merge(dft, options)
  return index(dft)
}