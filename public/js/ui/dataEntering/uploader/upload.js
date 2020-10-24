import uploader from 'component/modules/uploaderpro'
import uploadCfg from 'commonjs/uploadx'

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

const upld = uploadCfg({
  btnSize: {width: 160, height: 160}, 
  limitDesc: "30M",
  fileType: 'JPG,PNG,GIF',
  filePath: '/',  //图片链接前缀 CONFIG.SITE.img
  fileSingleSizeLimit: 30*1024*1024,
  data: [{src: 'images/ui/saui-logo.png'}],
  target: function(picInfo, tips){
    let w = picInfo.width
    let h = picInfo.height
    let r = w/h
    if (r<0.99 || r>1.01) {
      return {
        state: false,
        message: '比例不符，限1:1'
      }
    } else if (w < 540) {
      return {
        state: false,
        message: '尺寸不符，限宽度在540px以上'
      }
    } else {
      return {
        state: true
      }
    }
  },
  extensions: 'jpg,jpeg,png,bmp,gif',
  mimeTypes: 'image/jpg,image/jpeg,image/png,image/gif,image/x-ms-bmp',
  btnType: 'poster', 
  fileNumLimit: 1,
  isThumbnail: 1,
  thumbnailSize: '[{"w":1080,"h":0}]'
}).init()

const crop = uploadCfg({
  btnType: 'logo',
  btnSize: {width: 160, height: 90},  
  fileNumLimit: 8,
  limitDesc: "10M",
  fileType: 'JPG,PNG',
  fileSingleSizeLimit: 10*1024*1024,
  crop: {
    imgSize: {
      width: 1080,
      height: 20
    },
    config: {
      aspectRatio: 16/9,
      // minCropBoxWidth: 1080,
      // minCropBoxHeight: 606,
    }
  },
  isThumbnail: 1,
  thumbnailSize: '[{"w":270,"h":0},{"w":375,"h":0},{"w":540,"h":0},{"w":880,"h":0},{"w":1080,"h":0}]'    
}).init(); 

const movie = uploader({
  btnType: 'default',
  btnSize: {width: 200, height: 113},
  filePath: '/',
  // filePath: CONFIG.SITE.img,
  // data: [
  //   {mvsrc: 'group1/M00/02/E4/DhLuh1sh45GAcZYoAAB2jfy9j2k182_110x419.png'},
  // ],
  data: [],
  target: {
    width: 1280,
    height: 720
  },
  preview: null,
  // dragsort: null,
  warningText: '请上传免费视频', //警告文字
  errorText: '请上传正确的免费视频', //报错文字
  // descWarningText: '图片描述有误',
  // descErrorText: '请输入正确的图片描述',
  // popWarningText: <p>前台展示效果如上，建议上传 <i>16：9</i>的<i>横图</i>饱满整个图片区域框，效果会更好看哦</p>,//预览窗口提示文字
  // popWarningText: <p>视频预览</p>,//预览窗口提示文字
  hasDesc: false,//是否需要图片描述
  upConfig:{
    multiple: false,//是否多选
    limitDesc: '350M',
    uploaderConfig:{//webuploader配置
      fileNumLimit: 1,
      fileSingleSizeLimit: 350 * 1024 * 1024, // limitDesc需要一起设置
      //限制文件格式 
      accept: {
        title: 'Video',
        extensions: 'mp4,mov',
        mimeTypes: 'video/mp4,video/mov'
      },
    }
  },
  target: function(picInfo, tips){
    let w = picInfo.width
    let h = picInfo.height
    let r = w/h
    if (r<1.75 || r>1.80) {
      return {
        state: false,
        message: '比例不符，限16:9'
      }
    } else if (w < 1280 || h < 720) {
      return {
        state: false,
        message: '尺寸不符，限720P以上'
      }
    } else {
      return {
        state: true
      }
    }
  },
  descBlur: function (val){
    console.log(val)
  }
});


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
  upld2,
  movie,
  crop
}