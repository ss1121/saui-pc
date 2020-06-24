import path from 'path'
Aotoo.inject.css(`
  .webuploader-element-invisible{
    position: absolute !important;
    clip: rect(1px,1px,1px,1px);
  }
`)

Aotoo.inject.js('/js/t/webuploader', waitForInject)

const waitForQueue = []
let injectTimmer
function waitForInject(callback) {
  if (Aotoo.isClient) {
    if (typeof callback === 'function') {
      waitForQueue.push(callback)
    }
  
    if (typeof WebUploader !== 'undefined') {
      clearTimeout(injectTimmer)
      if (waitForQueue.length) {
        const method = waitForQueue.shift()
        method(WebUploader)
        if (waitForQueue.length) {
          waitForInject()
        }
      }
    } else {
      injectTimmer = setTimeout(() => {
        waitForInject()
      }, 200);
    }
  }
}

const inject = Aotoo.inject
var ratio = window.devicePixelRatio || 1,
    // 缩略图大小
    thumbnailWidth = 100 * ratio,
    thumbnailHeight = 100 * ratio

function checkFiles(fields){
  let filterPicture = ['.jpg','.jpeg','.png','.gif']
  if (fields) {
    let ext = path.extname(fields.name)
    if (filterPicture.indexOf(ext)>-1) {
      return true
    }
  }
}

class ThumbUp extends React.Component {
  constructor(props){
    super(props)

    let _stat = {
      data: [],       // item => {id: file.id, name: file.name, src: imgurl, progress: 0, stat: 'success/faild'}
      preview: false,
      title: this.props.title || '上传文件',
    }

    if (this.props.preview) {
      if (Array.isArray(this.props.preview)) {
        _stat.data = this.props.preview
        _stat.preview = true
      } else {
        _stat.preview = this.props.preview
      }
    }

    this.state = _stat
  }

  render(){
    const previewImglist = this.state.data.map( (item, ii) => {
      if (React.isValidElement(item)){
        return <li key={"preview"+ii}>{item}</li>
      }
      const progress = <span className='up-progress' style={{width: item.progress+'%'}}></span>
      if (checkFiles(item.file)) {
        return (
          <li key={"preview"+ii}>
            <img src={item.src}/>
            <div className="up-info">{item.name}</div>
            {progress}
          </li>
        )
      }
      else {
        return (
          <li key={"preview"+ii}>
            {item.name}
          </li>
        )
      }
    })

    const title = this.state.title

    //添加listClass 20170620 lgh
    const listClass = this.props.listClass ? 'uploader-wrap ' + this.props.listClass : 'uploader-wrap'
    return this.state.preview
    ? (
        <div className={listClass}>
          <div className='uploader-list'>
            { previewImglist.length ? <ul ref={'preview'}>{previewImglist}</ul> : '' }
          </div>
          <div ref={'upBtn'} className='uploader-button'>{title}</div>
        </div>
      )
    : <div ref={'upBtn'} className='uploader-button'>{title}</div>
  }
}

const Actions = {
  APPEND: function(state, options){
    this.curState.data.push(options)
    return this.curState
  },

  UPDATE: function(state, options){
    this.curState.data = [].concat(options)
    return this.curState
  },

  PROGRESS: function(state, options){
    const data = this.curState.data
    const targetIndex = _.findIndex(data, function(o) { return o.id == options.id });
    if (targetIndex > -1) {
      let target = data[targetIndex]
      target['progress'] = options.progress
      this.curState.data[targetIndex] = target
    }
    return this.curState
  },

  STAT: function(state, options){
    const data = this.curState.data
    const targetIndex = _.findIndex(data, function(o) { return o.id == options.id });
    if (targetIndex > -1) {
      let target = data[targetIndex]
      target['stat'] = options.stat
      this.curState.data[targetIndex] = target
    }
    return this.curState
  },

  TITLE: function(ostate, options={}){
    let state = this.curState
    if (options.title) {
      state.title = options.title
    }
    return state
  }
}

// 初始化第三方库的实例
function init3DSLib(GVar, Instance, config, dom, refs, idf){
  const upld_button = refs['upBtn']
  // if (Instance && Instance.uploader && Instance.uploader.destroy) Instance.uploader.destroy()
  // else {
    //   Instance.uploader = null
    // }
  if(!Instance.loaded){
    const uploader = GVar.create(config.uploaderConfig)
    Instance.uploader = uploader
    Instance.loaded = true
    Instance.emit('loaded', { uploader: uploader })
    uploaderEvent(Instance, uploader, config)
    uploader.addButton({
      id:  upld_button,
      multiple: config.multiple
    })
  }
}

// 循环检测 WebUploader
let loopTimmer 
function loopDetection(Instance, config, dom, refs, idf){
  clearTimeout(loopTimmer)
  loopTimmer = setTimeout(function() {
    if (typeof WebUploader !== 'undefined') {
      init3DSLib(WebUploader, Instance, config, dom, refs, idf)
    } else {
      loopDetection(Instance, config, dom, refs, idf)
    }
  }, 50);
}

function renderedInject(MyUp, config){
  return function(options){
    const {dom, refs, idf} = options
    waitForInject(function(webup) {
      console.log('========= init3DSLib');
      init3DSLib(webup, MyUp, config, dom, refs, idf)
    })
    // try {
    //   inject.js('/js/t/webuploader', function(){
    //     loopDetection(MyUp, config, dom, refs, idf)
    //   })
    // } catch (error) {
    //   console.log('component/uploader->renderInject error');
    //   console.log(error);
    // }
  }
}

// webuploader实例绑定事件，并与传入的方法做交互
function uploaderEvent(upInst, upHandle, config){
  const uploader = upHandle
  uploader.on('beforeFileQueued', function( file ){
    if (typeof config.beforeFileQueued == 'function') {
      config.beforeFileQueued(file)
    }
  })
  
  uploader.on('fileQueued', function( file ) {
    uploader.makeThumb( file, function( error, src ) {
      if (typeof config.fileQueued == 'function') {
        config.fileQueued(src, file)
      }
    }, thumbnailWidth, thumbnailHeight )
  })

  uploader.on('filesQueued', function( files ) {
    if (typeof config.filesQueued == 'function') {
      config.filesQueued(files)
    }
  })

  uploader.on('startUpload', function(){
    if (typeof config.startUpload == 'function') {
      config.startUpload()
    }
  })
  
  uploader.on('uploadFinished', function(){
    if (typeof config.uploadFinished == 'function') {
      config.uploadFinished()
    }
  })  
  
  // 当所有文件上传结束时触发
  uploader.on('fileDequeued', function(file){
    if (typeof config.fileDequeued == 'function') {
      config.fileDequeued(file)
    }
  })

  uploader.on('uploadStart', function (file) {
    if (typeof config.uploadStart == 'function') {
      config.uploadStart(file)
    }
  }) 
  
  // 当所有文件上传结束时触发
  uploader.on('uploadComplete', function(file){
    if (typeof config.uploadComplete == 'function') {
      config.uploadComplete(file)
    }
  })  
  
  // 不管成功或者失败，文件上传完成时触发
  uploader.on( 'uploadProgress', function( file, percentage ) {
    if (typeof config.uploadProgress == 'function') {
      config.uploadProgress(file, percentage)
    }
  });

  uploader.on( 'uploadSuccess', function( file, ret ) {
    if (typeof config.success == 'function') {
      config.success(file, ret)
    }
  })

  uploader.on( 'uploadError', function( file, reason ) {
    if (typeof config.faild == 'function') {
      config.faild(file, reason)
    }
  })

  uploader.on('uploadBeforeSend', function (object, data, headers) {
    if (typeof config.uploadBeforeSend == 'function') {
      config.uploadBeforeSend(object, data, headers)
    }
  })

  uploader.on('error', function (type) {
    if (typeof config.error == 'function') {
      config.error(type)
    }
  })
}


// 输出webuploader实例
function myApp(opts={}){
  const props = {
    preview: opts.preview,
    title: opts.title,
    listClass: opts.listClass
  }
  opts.props = props
  const MyUp = Aotoo(ThumbUp, Actions)
  MyUp.loaded = false   // webuploader.js 未完成载入
  MyUp.uploader = undefined
  MyUp.extend(extendFuns(opts))
  MyUp.on('rendered', renderedInject(MyUp, opts))
  MyUp.setConfig(opts)
  return MyUp
}

// 实例的自定义方法
function extendFuns(opts){
  return {
    addButton: function(id, title, options={}){
      const uploader = this.uploader
      if (uploader) {
        uploader.addButton({
          id:  id,
          innerHTML: title,
          ...options
        })
      }
    },

    makeThumb: function(file, cb){
      if (this.loaded) {
        this.uploader.makeThumb( file, function( error, src ) {
          if (typeof cb == 'function') {
            cb(src, file)
          }
        }, thumbnailWidth, thumbnailHeight )
      }
    },
    
    upload: function(){
      const uploader = this.uploader
      if (uploader) {
        uploader.upload()
      }
    },
  
    // 设置预览图
    preview: function(obj){   // obj = {name, src} || jsx
      if (typeof obj == 'object') {
        this.$update(obj)
      }
    },

    title: function(title){
      this.$title({title})
    }
  
    // beforeFileQueued: function(file){
    //   this.dispatch('STAT', {id: file.id, name: file.name, stat: 'beforeFileQueued', file: file})
    // },
  
    // fileQueued: function(src, file){
    //   this.dispatch(opts.solitary ? 'UPDATE' : 'APPEND', {id: file.id, name: file.name, src: src, progress: 0, file: file})
    // },
  
    // uploadSuccess: function(file, ret){
    //   this.dispatch('STAT', {id: file.id, name: file.name, stat: 'success', file: file})
    // },
  
    // uploadError: function(file, reason){
    //   this.dispatch('STAT', {id: file.id, name: file.name, stat: 'faild', file: file})
    // },
  
    // uploadProgress: function(file, percentage){
    //   this.dispatch('PROGRESS', {id: file.id, name: file.name, progress: percentage, file: file})
    // }
  }
}


export default function(opts){
  let dft = {
    success: function(){},
    faild: function(){},
    beforeFileQueued: function(){},
    fileQueued: undefined,
    preview: true,
    title: '上传文件',
    multiple: false,
    solitary: true,
    listClass: '',
    uploaderConfig: {
      dnd: undefined,
      chunked: false,
      fileNumLimit: undefined,
      fileSizeLimit: undefined,
      fileSingleSizeLimit: undefined,
      duplicate: undefined,
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
      // compress: {
      //   width: 1600,
      //   height: 1600,
      //
      //   // 图片质量，只有type为`image/jpeg`的时候才有效。
      //   quality: 90,
      //
      //   // 是否允许放大，如果想要生成小图的时候不失真，此选项应该设置为false.
      //   allowMagnify: false,
      //
      //   // 是否允许裁剪。
      //   crop: false,
      //
      //   // 是否保留头部meta信息。
      //   preserveHeaders: true,
      //
      //   // 如果发现压缩后文件大小比原来还大，则使用原来图片
      //   // 此属性可能会影响图片自动纠正功能
      //   noCompressIfLarger: false,
      //
      //   // 单位字节，如果图片大小小于此值，不会采用压缩。
      //   compressSize: 0
      // }
      // 自动上传。
      auto: true,

      // swf文件路径
      swf: '/images/Uploader.swf',

      // 文件接收服务端。
      server: '/upup',

      // 只允许选择文件，可选。
      accept: {
        title: 'Images',
        extensions: 'gif,jpg,jpeg,png',
        // mimeTypes: 'image/*'
        mimeTypes: 'image/jpg, image/jpeg, image/png, image/gif'
      }
    }
  }

  if (typeof opts == 'object') {
    dft = Aotoo.merge({}, dft, opts)
  }
  
  return myApp(dft)
}
