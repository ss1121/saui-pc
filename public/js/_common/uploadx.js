import Uploaderx from 'commonjs/uploaderx'

function uploadCfg (param) {
  const btnSize = param.btnSize || { width: 160, height: 90 }
  const data = param.data
  const btnType = param.btnType || 'logo'     //上传类型
  const fileNumLimit = param.fileNumLimit || 1     //上传数
  const limitDesc = param.limitDesc || '500KB'
  const fileSingleSizeLimit = param.fileSingleSizeLimit || (500 * 1024)
  const fileType = param.fileType || 'JPG'
  const crop = param.crop; delete param.crop
  const target = param.target; delete param.target
  const extensions = param.extensions || 'jpg,jpeg,png,bmp'
  const mimeTypes = param.mimeTypes || 'image/jpg,image/jpeg,image/png,image/x-ms-bmp'
  let ableWaterMasker = param.water || 1
  let isThumbnail = param.isThumbnail || 2
  let thumbnailSize = param.thumbnailSize || ''
  const inst = new Uploaderx({
    btnSize: btnSize,
    btnType: param.btnType || 'logo',
    filePath: param.filePath || CONFIG.SITE.img,
    // filePath:'http://14.18.238.135:8080/',
    warningText: '请上传图片',
    data: data || [],
    desc: [],
    imgSize:'250x0',
    hasDesc: false,
    target,
    crop,
    water: param.water,
    upConfig: {
      limitDesc,
      fileType,
      uploaderConfig: {
        server: '/fastdfs/upload.do?isWatermark='+ableWaterMasker+'&isThumbnail='+isThumbnail+'&thumbnailSize='+thumbnailSize, // 文件接收服务端。
        fileNumLimit: fileNumLimit,
        fileSingleSizeLimit,
        accept: {
          title: 'Images',
          extensions,
          mimeTypes
        }
      },
    },
})
  return inst
}
module.exports = uploadCfg