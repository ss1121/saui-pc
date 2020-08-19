import uploader from 'component/modules/uploaderpro'
function success(file, ret){}

function mkUpld(src, file, id){
  return uploader({
    title: (
      <div id={id}>
        <img src={src} />
        <span id={"progress_" + id} className="uploaderProgress" />
      </div>
    ),
    multiple: false,
    uploaderConfig: {
      server: '/fastdfs/upload.do',
      fileNumLimit: 1
    },
    fileQueued: function(src, file){
      const fileid = "progress_" + id
      $('#' + id).find('img').attr({ src: src})
      // $('#'+id).html('<img src='+src+' />')
      $('#' + fileid).css({ width: 0 })
    },
    uploadProgress: function (file, percentage) {
      const fileid = "progress_" + id
      $('#' + fileid).css({ width: percentage * 100 + '%' })
    },
    success: success
  })
}

const upld = uploader({
  btnSize: {
    width: 160,
    height: 90
  },
  preview: false,
  btnType: 'default',                         //default(默认),cards(名片),poster(海报),//logo(店铺logo)//files(上传文件)
  data: [{src: 'images/saui-logo.png'}],
  filePath: '/',                              //图片链接前缀
  warningText: '请上传营业执照扫描件',            //警告文字
  errorText: '请上传正确图片',                  //报错文字
  popWarningText: '',
  hasDesc: false,                             //是否需要图片描述,
  upConfig: {
    limitDesc: '10M',
    multiple: true,                          //是否多选
    uploaderConfig: {                         //webuploader配置
      fileNumLimit: 5,
      duplicate: true,
      server: '/fastdfs/upload.do?isWatermark=1&isThumbnail=1&thumbnailSize=[{"w":375,"h":0},{"w":880,"h":0},{"w":570,"h":0},{"w":750,"h":0},{"w":250,"h":0}]',
      fileSingleSizeLimit: 10 * 1024 * 1024,
      accept: {
        title: 'Images',
        extensions: 'jpg, jpeg, png, bmp',
        mimeTypes: 'image/jpg, image/jpeg, image/png, image/x-ms-bmp'
      }
    }
  }
})

const upld2 = uploader({
  btnSize: {
    width: 176,
    height: 306
  },
  preview: false,
  btnType: 'files',                         //default(默认),cards(名片),poster(海报),//logo(店铺logo)//files(上传文件)
  data: [],
  warningText: '请上传文件',            //警告文字
  errorText: '请上传正确文件格式',                  //报错文字
  popWarningText: '',
  hasDesc: false,                             //是否需要图片描述,
  upConfig: {
    limitDesc: '20M',
     fileType: 'pdf',
    uploaderConfig: {
      fileNumLimit: 2,
      fileSingleSizeLimit: 20 * 1024 * 1024,
      accept: {
        title: 'File',
        extensions: 'pdf',
        mimeTypes: 'application/pdf'
      }
    },
  },
})

module.exports = {
  upld,
  upld2
}