import tips from '../msgtips'
import modal from '../modal'
import cropper from '../cropper'
import popup from '../popup'
import Loading from '../Loading'

let injectTimmer
let injectFailed = true
let waitForQueue = []

Aotoo.inject.css([
  '/js/t/cropper/cropper.css',
])

// 参考说明网址: https://blog.csdn.net/weixin_38023551/article/details/78792400
// https://github.com/fengyuanchen/jquery-cropper
Aotoo.inject.js([
  '/js/t/webuploader',
  '/js/t/cropper/cropper',
  '/js/t/cropper/cropper_jq'
], waitForInject)

function waitForInject(callback) {
  if (Aotoo.isClient) {
    if (typeof callback === 'function') {
      if (!injectFailed) {
        callback()
      } else {
        waitForQueue.push(callback)
      }
    } else {
      if (callback === 'waiting') {
        injectTimmer = setTimeout(() => {
          waitForInject('waiting')
        }, 200);
      } else {
        clearTimeout(injectTimmer)
        if (injectFailed) {
          injectFailed = false
          setTimeout(() => {
            if (waitForQueue && waitForQueue.length) {
              const method = waitForQueue.shift()
              method()
              if (waitForQueue && waitForQueue.length) {
                injectFailed = true
                waitForInject()
              }
            }
          }, 100);
        }
      }
    }
  }
}

// group1/M00/01/A4/wKgeyV9oayaARZ9NAAC6l4v-vLo56.jpeg
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

function getFileType(filename) {
  const imgs = ['.jpg', '.jpeg', '.png', '.gif', '.wep', '.tiff']
  const mvs = ['.mp4', '.m4v']
  const files = ['.pdf', '.doc', '.docx']
  if (filename) {
    filename = filename.toLowerCase()
    let nameary = filename.split('.')
    let tail = '.'+nameary[nameary.length-1]
    if (imgs.indexOf(tail)>-1) {
      return 'image'
    }
    if (mvs.indexOf(tail)>-1) {
      return 'movie'
    }
    if (files.indexOf(tail)>-1) {
      return 'file'
    }
  }
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
        let mvsrc = ''
        if (item.mvsrc && (item.mvsrc.indexOf('http') === 0 || item.mvsrc.indexOf('//')===0)) {
          mvsrc = item.mvsrc
        } else {
          mvsrc = item.mvsrc ? filePath + item.mvsrc : null
        }
        let mvid = item.mvid || ''
        let { imgclass, warning } = calculate( proport,{ src: item.src, width: item.width || 0, height: item.height || 0 })
        imgList.push(
          <li className={'upitem' + (hasDesc ? ' upitem-desc' : '')} key={ 'img'+i } data-mvid={mvid} data-mvsrc={mvsrc} data-src={ min } data-width={ item.width } data-height={ item.height } data-id={ item.id } data-original={item.original || ''}>
            {/* <div className="upload-border" style={{ width: btnSize.width,height: (btnType == 'poster' || btnType == 'cards') ? '' : btnSize.height }}> */}
            <div className="upload-border" style={{ width: btnSize.width, height: btnSize.height }}>
              <div className="upload-img">
                <i className={ btnType == 'default' ? warning : ''}></i>
                {
                mvsrc ? <video src={mvsrc} controls="controls" style={{position: 'relative', width: '100%', height: '100%', zIndex: 2}}></video>
                : 
                (
                  <div className="upimg-wrap" data-src={min}>
                    <img className={ btnType == 'default' ? imgclass : btnType == 'logo' ? '' : 'perwidth100' } draggable="false" src={ min } />
                    <div className="media-cover" style={{width: '100%', height: "100%"}}></div>
                  </div>
                )
                }
                
                <a href='javascript:;' className="updelete"></a>
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
    if (_.isArray(data)) {
      let len = data.length
      let desc = new Array(len).fill().map(()=>'')
      let descWarning = new Array(len).fill().map(() => false)
      let descWarningText = new Array(len).fill().map(() => '')
      let descError = new Array(len).fill().map(() => false)
      let descErrorText = new Array(len).fill().map(() => '')
      curState.data = curState.data.concat(data)
      curState.desc = curState.desc.concat(desc)
      curState.descWarning = curState.descWarning.concat(descWarning)
      curState.descWarningText = curState.descWarningText.concat(descWarningText)
      curState.descError = curState.descError.concat(descError)
      curState.descErrorText = curState.descErrorText.concat(descErrorText)
    } else {
      curState.data.push(data);  
      curState.desc.push('');
      curState.descWarning.push(false);
      curState.descWarningText.push('');
      curState.descError.push(false);
      curState.descErrorText.push('');
    }
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
    if (data.datas) {
      Object.keys(data.datas).forEach(idx=>{
        curState.data[idx] = data.datas[idx]
      })
    } else {
      curState.data[data.index] = data.data
    }
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
          curState.data[i].mvsrc = pgs.mvsrc
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
    example.emit('loaded', { uploader: _inst, config: cfg })
  }
  let _updata = example.getData().data;
  function cropwrap(parents, option={}){
    let previewCfg = cfg.crop.previewCfg||[];
    let preview = [];
    let url = parents ? (parents.attr('data-original')||parents.attr('data-src')) : undefined;
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
      <div className="modal options">
        <div className='modal-header cropHead title-bg2'>
          <h5>{ cfg.cropTitle }</h5>
          <i className='icon-del-primary click-cancel close'></i>
        </div>
        <div className="modal-body cropWrap">
          <div className="crop-content" style={{ display: url ? 'block' : 'none' }}>
            <div className="crop-area">{ crop.render() }</div>
            {/* <button className="crop-upload-button crop-upload-again">+ 重新上传</button> */}
          </div>
          <div className="crop-upload" style={{ display: !url ? 'flex' : 'none' }}>
            <div className="crop-upload-left">
              {/* <button className="crop-upload-button">+ 选择图片</button> */}
              <button className="ss-button btn-default crop-upload-button">+ 选择图片</button>
            </div>
            <div className="crop-uoload-right">
              <ul className="cropper-preview-list">
                { preview }
              </ul>
              <p className="crropper-text">拖拽或缩放虚线框，<br />生成自己满意的图片</p>
            </div>
          </div>
          {/* <p className="crop-upload-tips"> 上传图片尺寸不符，建议上传图片宽度不得小于 { cfg.crop.imgSize.width } X { cfg.crop.imgSize.height }像素<span></span></p> */}
          <p className="crop-upload-tips"> 尺寸不符，限宽度在 { cfg.crop.imgSize.width } px以上<span></span></p>
          <input className="crop-upload-file" type="file" accept={ cfg.upConfig.uploaderConfig.accept.mimeTypes } />
        </div>
        <div className='modal-footer cropFoot'>
          <button className='ss-button btn-grey plain crop-upload-button mr-auto crop-upload-again disabled'>重新上传</button>
          {/* <button className={url ? 'ss-button btn-grey plain crop-upload-button mr-auto crop-upload-again' : 'ss-button btn-grey plain crop-upload-button mr-auto disabled'} data-url={url}>重新上传</button> */}
          <div>
            <button className='close ss-button btn-grey plain'>取消</button>
            <button className='modal-foot-btn ss-button btn-default ml-10 disabled' disabled="disabled">确定</button>
          </div>
        </div>
      </div>
      ,function (dd){
        if(url){
          setTimeout(()=>{
            $('.modal-foot-btn').removeAttr('disabled')
            crop.reupload(url)
          },200)
        }

        let again = option.againOpen||false;
        if (again) {
          $(dd).find('.crop-upload-again').removeClass('disabled')
        }
        $(dd).find('.crop-upload-button').once('click',function (){
          $(dd).find('.crop-upload-tips').hide()
          if($(this).hasClass('crop-upload-again') && !again){
            return 
          }
          // if($(this).hasClass('crop-upload-again')){
          //   again = true;
          // }else{
          //   again = false;
          // }
          $(dd).find('.crop-upload-file').click()
        })

        let cropChange = false
        $(dd).find('.crop-upload-file').once('change',async function (){
          let that = this
          cropChange = true
          console.log('======= 4444');
          let _files = that.files;
          let content = $(dd).find('.crop-content');
          let upload = $(dd).find('.crop-upload');
          let button = $(dd).find('.modal-foot-btn');
          if(_files && _files[0]){
            let picinfo = await getMediafileInfo(_files[0])

            let fileType = cfg.upConfig.uploaderConfig.accept.mimeTypes.split(',')
            let correct = false;
            fileType.map(item => {
              if($.trim(item) == _files[0].type){
                correct = true;
              }
            })
            if(!correct){
              // tips('文件类型不正确请重新上传', { type: 'error' });
              $(dd).find('.crop-upload-tips').html('文件类型不正确请重新上传')
              $(dd).find('.crop-upload-tips').show()
              $(dd).find('.crop-upload-file').reset()
              // $(dd).find('.crop-upload-again').addClass('disabled')
              return false
            }
            if(_files[0].size > cfg.upConfig.uploaderConfig.fileSingleSizeLimit){
              // tips('文件大小不能超过' + cfg.upConfig.limitDesc, { type: 'error' })
              $(dd).find('.crop-upload-tips').html('大小不符，限' + cfg.upConfig.limitDesc + '内')
              $(dd).find('.crop-upload-tips').show()
              $(dd).find('.crop-upload-file').reset()
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
                      $(dd).find('.modal-foot-btn').removeClass('disabled')
                      if(!url){
                        crop.$setimg(e.target.result);
                      }
                      if(!again){//如果是中间的上传按钮
                        again = true
                        $(dd).find('.crop-upload-again').removeClass('disabled')
                        $(dd).find('.crop-upload-again').removeClass('disabled')
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
                      // $(dd).find('.crop-upload-tips span').html('，当前尺寸为:' + imgWidth + ' X ' + imgHeight + '像素')
                      // $(dd).find('.crop-upload-again').addClass('disabled')
                      $(dd).find('.crop-upload-tips span').html('，请取消或重新选择')
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
          if (!cropChange) {
            $(dd).find('.close').trigger('click')
            return
          }
          crop.validCrop(function(cropImgData){
            if (cropImgData.width < cfgImgSize.width ) {
              let { width, height } = crop.getData()
              // $(dd).find('.crop-upload-tips span').html('，当前尺寸为:' + (0 | width) + ' X ' + (0 | height) + '像素')
              $(dd).find('.crop-upload-tips span').html('，请取消或重新选择')
              $(dd).find('.crop-upload-tips').show()
              // $(dd).find('.crop-upload-file').reset()
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

              example.uploader.off('uploadSuccess').on('uploadSuccess',function (file, ret){
                console.log('========= 111');
                example.emit('uploadSuccess', {ret});
                example.value = ret
                if(ret.code == '000'){
                  let tmp = {}
                  let $tmp = []
                  let index = -1
                  if (parents) {
                    index = parents.index()
                  }

                  ret.data.map((pic, ii) => {
                    let image = new Image()
                    let src = cfg.filePath + pic.url
                    let $index = index + ii
                    image.src = src
                    image.onload = function (params) {
                      if (parents) {
                        tmp[$index] = {
                          // mvsrc: pic.url,
                          src: pic.url,
                          width: image.width,
                          height: image.height,
                          id: file.id
                        }
                        if (ii === ret.data.length-1) {
                          example.$update({
                            datas: tmp
                          })
                          parents.find('.upload-border').removeClass('disN');
                          parents.find('.upitem-loading').addClass('disN');
                        }
                      } else {
                        $tmp.push({
                          src: pic.url,
                          width: image.width,
                          height: image.height,
                          id: file.id,
                          original: src
                        })

                        if (ii === ret.data.length - 1) {
                          example.$push($tmp)
                          setTimeout(() => {
                            if (example.getData().data.length == cfg.upConfig.uploaderConfig.fileNumLimit) {
                              $(dom).find('.addFiles').addClass('disN')
                              cropChange = false
                            }
                          }, 100);
                        }
                      }
                    }
                  })

                  // // if(parents){
                  // //   example.$delete(parents.index())
                  // // }
                  // let image = new Image()
                  // $(image).on('load',function (){
                  //   if(parents){
                  //     example.$update({
                  //       data: {
                  //         mvsrc: ret.data.mvPath, 
                  //         src: ret.data.filePath,
                  //         width: image.width,
                  //         height: image.height,
                  //         id: file.id
                  //       },
                  //       index: parents.index()
                  //     })
                  //     parents.find('.upload-border').removeClass('disN');
                  //     parents.find('.upitem-loading').addClass('disN');
                  //   }else{
                  //     example.$push({ src: ret.data.filePath, width: image.width, height: image.height, id: file.id,original:$(dd).find('.cropImg').attr('src') })
                  //     if(example.getData().data.length == cfg.upConfig.uploaderConfig.fileNumLimit){
                  //       $(dom).find('.addFiles').addClass('disN')
                  //     }
                  //   }
                  //   $(dd).find('.close').trigger('click')
                  // })
                  // image.src = cfg.filePath+ret.data.filePath

                }else{
                  if(ret.subCode == '0065'){
                    tips('您上传的图片不符合格式要求，请重新上传', { type: 'error' })
                  }else{
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
        let url = (parents.attr('data-original')||parents.attr('data-src'))
        console.log('======= aaa');
        modal(cropwrap(parents, {againOpen: true} ), {
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
    if (_.isPlainObject(cfg.preview)) {
      Object.keys(cfg.preview).forEach(evt=>{
        // $(dom).find('.upimg-wrap').once('click', function(params) {
        //   console.log('====== 4444');
        // })
        $(dom).off(evt).on(evt, '.upimg-wrap', function(e) {
          e.stopPropagation()
          e.preventDefault()
          cfg.preview[evt](e, this, cfg)
        })
      })
    } 
    else if(_.isFunction(cfg.preview)){
      cfg.preview(dom, cfg, example)
    }
    else {
      // $(dom).find('.upimg-wrap').once('mouseenter',function (e){
      $(dom).find('.upimg-wrap, input[type=file]').once('mouseenter', function (e) {
        let parent = $(this).parents('.upitem')
        parent.css({zIndex: 3})
        let { imgclass, warning } = calculate( cfg.proport, { src: parent.attr('data-src'), width: parent.attr('data-width'), height: parent.attr('data-height') })
        let previewBody = <img className={ cfg.btnType == 'default' ? imgclass : 'perwidth100' } src={ parent.attr('data-src') } />
        if (cfg.preview === 'movie') {
          let mvsrc = parent.attr('data-mvsrc')
          mvsrc = cfg.filePath+mvsrc
          previewBody = <video src={mvsrc} controls="controls" style={{width: '100%', height: '100%'}}></video>
        }
        example.popup = popup(
          <div className="uploader-popup">
            <div className="uploader-popup-header">
              {previewBody}
              {/* <img className={ cfg.btnType == 'default' ? imgclass : 'perwidth100' } src={ parent.attr('data-src') } /> */}
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
  }
  /* 公共事件 */
  let webuploader_timestamp = 0 // 拖拽超时，控制不触发上传
  $(dom).find('.webuploader-button').once('mousedown', function () {
    webuploader_timestamp = 0
    webuploader_timestamp = (new Date()).getTime()
  })

  $(dom).find('.webuploader-button').once('click',function (){
    let tmp_timestamp = (new Date()).getTime()
    if (tmp_timestamp - webuploader_timestamp > 300) return
    
    let fileQueue = example.getData().data
    let fileNumLimit = cfg.upConfig.uploaderConfig.fileNumLimit;
    if(fileQueue.length < fileNumLimit){
      if(cfg.crop){
        console.log('======= bbb');
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

  async function getMediafileInfo(targetFile) {
    let ftype = getFileType(targetFile.name)
    return new Promise((res, rej)=>{
      let name = targetFile.name
      let type = targetFile.type
      let size = targetFile.size
      let rtn = {name, type, size, ftype}
      if (ftype !== 'image') {
        if (ftype === 'movie') {
          var videoUrl = URL.createObjectURL(targetFile);
          var videoObj = document.createElement("video");
          videoObj.onloadedmetadata = function (evt) {
            URL.revokeObjectURL(videoUrl);
            rtn.width = videoObj.videoWidth
            rtn.height = videoObj.videoHeight
            res(rtn)
          };
          videoObj.src = videoUrl;
          videoObj.load();
        } else {
          res(rtn)
        }
      } else {
        let reader = new FileReader();
        reader.onload = function (e) {
          var data = e.target.result;
          var image = new Image();
          image.onload = function () {
            var width = image.width;
            var height = image.height;
            var size = targetFile.size
            rtn.width = width
            rtn.height = height
            res(rtn)
          };
          image.src = data;
        };
        reader.readAsDataURL(targetFile);
      }
    })
  }
  $(dom).find('.addfile').once('change', async function (){
    let _files = this.files;
    let that = $(this)

    if(_files){
      let targetFile = _files[0]
      let fileSize = targetFile.size
      let fileType = targetFile.type
      let fileTypes = cfg.upConfig.uploaderConfig.accept.mimeTypes.split(',')
      let picInfo = await getMediafileInfo(targetFile)

      if (fileSize > cfg.upConfig.uploaderConfig.fileSingleSizeLimit) {
        tips('大小不符，限' + cfg.upConfig.limitDesc + '内', { type: 'error' });
        that.val('');
        return false
      }

      if (fileTypes.indexOf(fileType) === -1) {
        tips('文件类型不正确请重新上传', { type: 'error' });
        that.val('');
        return false
      }

      if (picInfo) {
        let ftype = picInfo.ftype
        let mediaText = ftype ==='movie' ? '视频' : '图片'
        let w = picInfo.width
        let h = picInfo.height
        let r = w/h

        // let tw = (cfg.target&&cfg.target.width) || 0
        // let th = (cfg.target&&cfg.target.height) || 0
        // let tr = tw / th
        // if (w < (tw * 0.7)) {
        //   tips(`请上传${mediaText}宽度不小于${tw}px，建议${mediaText}尺寸为${tw}×${th}px`, {
        //     type: 'error'
        //   });
        //   that.val('');
        //   return false
        // }
        // if (cfg.target.width!=0 && cfg.target.height!=0) {
          
        // }
        let cfgTarget = cfg.target
        if (typeof cfgTarget === 'function') {
          let res = cfgTarget(picInfo, tips)
          // if (typeof res === 'boolean' && !res) {
          //   tips(`请上传${mediaText}宽度不小于${tw}px，建议${mediaText}尺寸为${tw}×${th}px`, { type: 'error' });
          //   that.val('');
          //   return false
          // }

          if (typeof res === 'object') {
            let state = res.state
            let message = res.message
            if (!state) {
              tips(message, { type: 'error' });
              that.val('');
              return false
            }
          }
        } else {
          let tw = (cfg.target&&cfg.target.width) || 0
          let th = (cfg.target&&cfg.target.height) || 0
          let tr = tw / th
          if (tr && w < (tw * 0.7)) {
            // tips(`请上传${mediaText}宽度不小于${tw}px，建议${mediaText}尺寸为${tw}×${th}px`, {
            tips(`尺寸不符，限宽度在${tw}px以上`, {
              type: 'error'
            });
            that.val('');
            return false
          }
        }
      }

      // fileSizeLimit: undefined, // 总大小
      // fileSingleSizeLimit: 3 * 1024 * 1024, // 3M，单文件大小
      
      // let fileType = cfg.upConfig.uploaderConfig.accept.mimeTypes.split(',')
      // let correct = false;
      // fileType.map(item => {
      //   if($.trim(item) == _files[0].type){
      //     correct = true;
      //   }
      // })
      // if(!correct){
      //   tips('文件类型不正确请重新上传', { type: 'error' });
      //   that.val('');
      //   return false
      // }

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
          if(filelist.length > fileNumLimit - fileQueue.length){
            break;
          }
          // tips('您上传的图片不符合格式要求，请重新上传', { type: 'error' })
          example.uploader.addFiles(_files[i])
          filelist.push(_files[i])

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
            example.value = ret
            console.log('======== 222');
            example.emit('uploadSuccess', {ret})
            if(ret.code == '000'){
              example.$warning(false);
              example.$error(false);

              function updateState(params) {
                setTimeout(() => {
                  example.$push(params)
                  if (example.getData().data.length == cfg.upConfig.uploaderConfig.fileNumLimit) {
                    $(dom).find('.addFiles').addClass('disN')
                  }
                }, 100);
              }
              if(cfg.btnType !== 'files'){
                let $tmp = []
                ret.data.map((pic, ii) => {
                  let picurl = pic.url
                  let fileType = getFileType(picurl)
                  let src = cfg.filePath + pic.url

                  
                  if (fileType === 'image') {
                    let image = new Image()
                    image.src = src
                    $tmp.push({
                      src: pic.url,
                      width: image.width,
                      height: image.height,
                      id: file.id,
                      original: src
                    })

                    // let image = new Image()
                    // let src = cfg.filePath + pic.url
                    // image.src = src
                    // $(image).on('load', function () {
                    //   $tmp.push({
                    //     mvsrc: pic.url,
                    //     src: pic.url,
                    //     width: image.width,
                    //     height: image.height,
                    //     id: file.id,
                    //     original: $(dd).find('.cropImg').attr('src')
                    //   })
                    //   if (ii === ret.data.length - 1) {
                    //     updateState($tmp)
                    //   }
                    // })
                  }



                  if (fileType === 'movie') {
                    $tmp.push({
                      mvsrc: pic.url,
                      mvid: pic.vodFileId,
                      src: pic.url,
                      id: file.id,
                      original: src
                    })
                  }



                  if (fileType === 'file') {
                    $tmp.push({
                      filesrc: pic.url,
                      src: pic.url,
                      id: file.id,
                      original: src
                    })
                  }

                  if (ii === ret.data.length - 1) {
                    updateState($tmp)
                  }
                })

                // let image = new Image()
                // $(image).on('load',function (){
                //   example.$push({ 
                //     mvsrc: ret.data.mvPath,
                //     src: ret.data.filePath, 
                //     width: image.width, 
                //     height: image.height, 
                //     id: file.id 
                //   })
                //   if(example.getData().data.length >= fileNumLimit){
                //     $(dom).find('.addFiles').addClass('disN')
                //   }
                // })
                // image.src = cfg.filePath+ret.data.filePath

              }else{
                let id = file.id
                example.$progress({ 
                  progress: 100, 
                  id: id, 
                  src: ret.data[0].url
                })
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
          tips('大小不符，限' + cfg.upConfig.limitDesc + '内', { type: 'error' })
          // example.$warning('文件大小不能超过' + cfg.upConfig.limitDesc)
          continue;
        }
      }
      that.val('');
    }
  })
  $(dom).find('.upfile').once('change',async function(){
    let _files = this.files[0]
    let that = $(this)
    let index = that.parents('.upitem').index();
    let fileId = that.parents('.upitem').attr('data-id');
    if(_files){
      let targetFile = _files
      let fileSize = targetFile.size
      let fileType = targetFile.type
      let fileTypes = cfg.upConfig.uploaderConfig.accept.mimeTypes.split(',')
      let picInfo = await getMediafileInfo(targetFile)

      if (fileSize > cfg.upConfig.uploaderConfig.fileSingleSizeLimit) {
        tips('大小不符，限' + cfg.upConfig.limitDesc + '内', { type: 'error' });
        that.val('');
        return false
      }

      if (fileTypes.indexOf(fileType) === -1) {
        tips('文件类型不正确请重新上传', { type: 'error' });
        that.val('');
        return false
      }

      if (picInfo) {
        let ftype = picInfo.ftype
        let mediaText = ftype ==='movie' ? '视频' : '图片'
        let w = picInfo.width
        let h = picInfo.height
        let r = w/h

        let cfgTarget = cfg.target
        if (typeof cfgTarget === 'function') {
          let res = cfgTarget(picInfo, tips)
          // if (typeof res === 'boolean' && !res) {
          //   tips(`请上传${mediaText}宽度不小于${tw}px，建议${mediaText}尺寸为${tw}×${th}px`, { type: 'error' });
          //   that.val('');
          //   return false
          // }

          if (typeof res === 'object') {
            let state = res.state
            let message = res.message
            if (!state) {
              tips(message, { type: 'error' });
              that.val('');
              return false
            }
          }
        } else {
          let tw = (cfg.target&&cfg.target.width) || 0
          let th = (cfg.target&&cfg.target.height) || 0
          let tr = tw / th
          if (tr && w < (tw * 0.7)) {
            // tips(`请上传${mediaText}宽度不小于${tw}px，建议${mediaText}尺寸为${tw}×${th}px`, {
            tips(`尺寸不符，限宽度在${tw}px以上`, {
              type: 'error'
            });
            that.val('');
            return false
          }
        }
      }

      

      // let fileType = cfg.upConfig.uploaderConfig.accept.mimeTypes.split(',')
      // let correct = false;
      // fileType.map(item => {
      //   if($.trim(item) == _files.type){
      //     correct = true;
      //   }
      // })
      // if(!correct){
      //   tips('文件类型不正确请重新上传', { type: 'error' });
      //   return false
      // }


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
                console.log('======= ccc');
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
          example.emit('uploadSuccess', {ret})
          example.value = ret
          if(ret.code == '000'){
            console.log('===== 333');
            example.$warning(false);
            example.$error(false);


            let tmp = {}
            ret.data.map((pic, ii) => {
              let image = new Image()
              let src = cfg.filePath + pic.url
              let $index = index+ii
              image.src = src
              $(image).on('load', function (){
                tmp[$index] = {
                  // mvsrc: pic.url,
                  src: pic.url,
                  width: image.width,
                  height: image.height,
                  id: file.id
                }
                if (ii === ret.data.length - 1) {
                  example.$update({
                    datas: tmp
                  })
                  that.parents('.upitem').find('.upload-border').removeClass('disN');
                  that.parents('.upitem').find('.upitem-loading').addClass('disN');
                }
              })
            })





            // let image = new Image()
            // $(image).on('load',function (){
            //   example.$update({ 
            //     data: {
            //       mvsrc: ret.data.mvPath,  
            //       src: ret.data.filePath, 
            //       width: image.width, 
            //       height: image.height, 
            //       id: file.id 
            //     }, 
            //     index: index 
            //   })
            //   that.parents('.upitem').find('.upload-border').removeClass('disN');
            //   that.parents('.upitem').find('.upitem-loading').addClass('disN');
            // })
            // image.src = cfg.filePath + ret.data.filePath
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
function renderedInject(example, cfg){
  return function(options){
    const {dom, opts, ctx} = options
    try {
      waitForInject(()=>{
        if (typeof WebUploader !== 'undefined') {
          setTimeout(() => {
            init3DSLib(WebUploader, example, cfg, dom, opts, ctx)
          }, 100);
        }
      })
    } catch (error) {
      console.error('component/uploaderpro->renderInject error');
      console.log(error);
    }
  }

  // return function(options){
  //   const {dom, opts, ctx} = options
  //   try {
  //     Aotoo.inject.js('/js/t/webuploader', function(){
  //       loopDetection(example, cfg, dom, opts, ctx)
  //     })
  //   } catch (error) {
  //     console.error('component/uploaderpro->renderInject error');
  //     console.log(error);
  //   }
  // }
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
    let ableWaterMasker = opts.water || 1
    opts.upConfig.uploaderConfig.server = '/fastdfs/upload.do?isWatermark='+ ableWaterMasker
  }
  // 截图配置
  let newCropConfig = opts.crop; delete opts.crop
  if(!opts.crop){
    if(type == 'logo'){
      let oCrop = _.isObject(opts.crop) ? opts.crop : {}
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
          aspectRatio: 1,
          minCropBoxWidth: 0,
          minCropBoxHeight: 0,
        },
      }
      if (oCrop.previewCfg) {
        opts.crop.previewCfg = Object.assign(opts.crop.previewCfg, oCrop.previewCfg)
        oCrop.previewCfg = undefined
      }
      if (oCrop.imgSize) {
        opts.crop.imgSize = Object.assign(opts.crop.imgSize, oCrop.imgSize)
        opts.crop.previewCfg[0].size.width = opts.crop.imgSize.width
        opts.crop.previewCfg[0].size.height = opts.crop.imgSize.height
        oCrop.imgSize = undefined
      }
      if (oCrop.config) {
        opts.crop.config = Object.assign(opts.crop.config, oCrop.config)
        oCrop.config = undefined
      }
      opts.crop = Object.assign({}, opts.crop, oCrop)
    }
  }
  if (opts.crop && newCropConfig) {
    opts.crop = Object.assign({}, opts.crop, newCropConfig)
  }
  instance.loaded = false   // swiper.js 未完成载入
  instance.uploader = instance.uploader || undefined
  instance.popup = instance.popup || undefined
  instance.loopTimmer = undefined

  // instance.on('uploadSuccess', function(){})  // 监听上传后的返回值

  instance.on('rendered', renderedInject(instance, opts))
  instance.setProps(opts)
  return instance
}
export default function upload(options){
  let ableWaterMasker = options.water || 1
  let dft = {
    btnType: 'default',//default(默认),cards(名片),poster(海报),//logo(店铺logo)
    cropTitle: '上传图片',
    target: {
      width: 0,
      height: 0
    },
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
          height: 1080,
        
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
        fileSizeLimit: undefined,  // 总大小
        fileSingleSizeLimit: 3 * 1024 * 1024, // 3M，单文件大小
        duplicate: true,
        swf: '/images/Uploader.swf',// swf文件路径
        server: '/fastdfs/upload.do?isWatermark='+ ableWaterMasker,// 文件接收服务端。
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