/**
 * 带有裁剪功能的
 */
import uploader from 'component/modules/uploaderpro'

// Aotoo.inject.css(`/css/m/uploader`)


export default class Uploaderx {
  constructor(props) {
    // that.uploadPic['uploadPosters'] = uploader({
    //   btnType: 'poster',
    //   filePath: Config.IMG_BASE,
    //   warningText: '请上传图片',
    //   data: prcData.data || [],
    //   upConfig: {
    //     uploaderConfig: {
    //       fileNumLimit: 1,
    //       fileSingleSizeLimit: 3 * 1024 * 1024,
    //       limitDesc: '3M',
    //     },
    //   },

    // });
    this.opts = $.extend({
      btnType: 'default', //default(默认),cards(名片),poster(海报)
      popWarningText: <p>前台展示效果如上，建议上传 <i>16：9</i>的<i>横图</i>饱满整个图片区域框，效果会更好看哦</p>,
      data:[],
      desc:[],
      filePath:'',
      warningText:'',
      numLimitWarningText:'',
      hasDesc:'',
      target: {
        width: 1920,
        height: 1080,
      },
      // btnSize: {
      //   width: 172,
      //   height: 97,
      // },
      // proport: {
      //   width: 16,
      //   height: 9
      // },
      upConfig: {
        multiple: false,
        uploaderConfig: {
          dnd: undefined,
          chunked: false,
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
          compress: {
            width: 1600,
            height: 1600,

            // 图片质量，只有type为`image/jpeg`的时候才有效。
            quality: 70,

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
          auto: true,
          fileNumLimit: 4,
          // fileSizeLimit: '',
          fileSingleSizeLimit: 10 * 1024 * 1024,
          duplicate: true,
          swf: '/images/Uploader.swf', // swf文件路径
          server: '/fastdfs/upload.do', // 文件接收服务端。
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
    }, props);

  }
  init(){
    let uploadPic = uploader(this.opts);
    return uploadPic;
  }
}
