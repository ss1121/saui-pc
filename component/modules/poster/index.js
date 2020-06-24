import { input as Input } from 'component/client'
import modal from '../modal'
import editor from '../editor'
import { grids } from '../grids'
import html2canvas from 'html2canvas'

class Poster extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      text: this.props.text,
      title: this.props.title,
      link: this.props.link,
      form: this.props.form,
      textarea: this.props.textarea,
      previewBg: this.props.previewBg,
      active: this.props.active,
      data: this.props.data
    }
  }
  render(){
    return (
      <div className="poster-wrap">
        <div className="poster-text">{ this.state.text }（{this.state.title}<a className="poster-make" href="javascript:;">{this.state.link}</a>）</div>
        <div className="poster-canvas">

        </div>
      </div>
    )
  }
}
const Actions = {
  UPDATE: function (ostate,obj){
    let curState = this.curState;
    curState = _.merge(curState, obj)
    return curState
  }
}
function index(opts){
  const instance = Aotoo(Poster, Actions)
  instance.extend({

  })
  instance.on('rendered', function(options){
    const {dom, _opts, ctx} = options
    function posterModal(){
      let { form, textarea, previewBg, active } = instance.curState ? instance.curState : opts
      let posterForm = Input(form)
      let edit = editor({
        id: _.uniqueId('poster-textarea'),
        opts:{
          // 服务器统一请求接口路径
          serverUrl: undefined,
          //工具栏上的所有的功能按钮和下拉框，可以在new编辑器的实例时选择自己需要的从新定义
          toolbars:[[
            'forecolor', '|',
          ]],
          // 为编辑器实例添加一个路径，这个不能被注释
          UEDITOR_HOME_URL: 'https://apps.bdimg.com/libs/ueditor/1.4.3.1/',
          //给编辑器内部引入一个css文件
          iframeCssUrl: 'https://apps.bdimg.com/libs/ueditor/1.4.3.1/themes/iframe.css',
          //语言包文件存放目录
          langPath: 'https://apps.bdimg.com/libs/ueditor/1.4.3.1/lang/',
          //现有如下皮肤：default
          themePath: 'https://apps.bdimg.com/libs/ueditor/1.4.3.1/themes/',
          //如果sourceEditor是codemirror需要配置这项，codeMirror js加载的路径
          codeMirrorJsUrl: "https://apps.bdimg.com/libs/ueditor/1.4.3.1/third-party/codemirror/codemirror.js",
          //如果sourceEditor是codemirror需要配置这项，codeMirror css加载的路径
          codeMirrorCssUrl: "https://apps.bdimg.com/libs/ueditor/1.4.3.1/third-party/codemirror/codemirror.css",
          //focus时不清空初始化时的内容
          autoClearinitialContent: false,
          //开启字数统计
          wordCount: true,
          //关闭elementPath
          elementPathEnabled: false,
          //默认的编辑区域高度
          initialFrameHeight: 180,
          //最大字数
          maximumWords: textarea.maxLength || 100,
          //是否自动保存
          // enableAutoSave: false,
          //是否启用自动长高
          autoHeightEnabled: false,
          //是否启用可拉伸,启用后自动长高失效
          scaleEnabled: false,
          // 字数提醒格式
          wordCountMsg: '{#count} \/ 100',
          //超出字数限制提示 留空支持多语言自动切换，否则按此配置显示
          wordOverFlowMsg: '<span style="color:red;">你输入的字符个数已经超出最大允许值</span>',
          //粘贴只保留标签，去除标签所有属性
          retainOnlyLabelPasted: true,
          //禁止word中粘贴进来的列表自动变成列表标签
          autoTransWordToList: true,
          //初始化编辑器的内容，也可以通过textarea/script给值，看
          initialContent: textarea ? textarea.content : '',
          //是否默认为纯文本粘贴。false为不使用纯文本粘贴，true为使用纯文本粘贴
          pasteplain: true,
        }
      })
      let previewData = {}
      form.data.map(item => {
        if(item.input.length){
          let input = item.input[0]
          previewData[input.name] = { title: '' }
        }else{
          if(item.input.name == 'p4' || item.input.name == 'p7' || item.input.name == 'p8'){
            previewData[item.input.name] = { title: (item.input.value != '' ? item.pvTitle : '') + ( item.input.value || ''), value: item.input.value}
          }else{
            previewData[item.input.name] = { title: item.input.value }
          }
        }
      })
      let background = []
      previewBg.map((item,i) => {
        background.push(<div className={'poster-bg ' + item.class + (i == active ? ' active' : '')} key={ "bg_" + i }></div>)
      })
      previewData.p9 = { title: textarea ? textarea.content : '' }
      function postetPV(obj,bg){
        return <div className={'poster-preview '+ bg}>
          <div className="poster-p1" data-location="p1">{ obj.p1 ? obj.p1.title : '' }</div>
          <div className="poster-p2" data-location="p2">{ obj.p2 ? obj.p2.title : '' }</div>
          <div className="poster-p3" data-location="p3">{ obj.p3 ? '【' + obj.p3.title + '】' : '' }</div>
          <div className="poster-p5" data-location="p5">￥{ obj.p5 ? obj.p5.title : '' }</div>
          <div className="poster-p6" data-location="p6"><span>￥{ obj.p6 ? obj.p6.title : '' }</span></div>
          <div className="poster-p4" data-location="p4">{ obj.p4 ? obj.p4.title : '' }</div>
          <div className="poster-p7" data-location="p7">{ obj.p7 ? obj.p7.title : '' }</div>
          <div className="poster-p8" data-location="p8">{ obj.p8 ? obj.p8.title : '' }</div>
          <div className="poster-p9" data-location="p9" dangerouslySetInnerHTML={{ __html: obj.p9.title }}></div>
        </div>
      }
      let posterPreview = grids({
        data:[
          postetPV(previewData, previewBg[active].class)
        ]
      })

      let PosterModal = Aotoo.wrap(
        <div className="modal">
          <div className='modal-head title-bg2'>
            <h5>制作海报</h5>
            <i className='close'></i>
          </div>
          <div className="modal-body poster-wrapper">
            <div className="poster-form">
              { posterForm.render() }
              <label className="inputItem">
                <span className="fkp-title">{ textarea.title }</span>
                <div className="poster-editor">
                  { edit.render() }
                  <div className="poster-editor-tips">
                    <div className="poster-editor-warning"></div>
                    <div className="poster-editor-error"></div>
                  </div>
                </div>
              </label>
            </div>
            <div className="poster-preview-wrap">
              <div className="poster-preview-content">
                {posterPreview.render()}
              </div>
            </div>
            <div className="poster-bgselector">
              <p className="poster-bgtitle">海报选择</p>
              { background }
            </div>
          </div>
          <div className='modal-foot'>
            <button className="modal-cancel">取消</button>
            <button className="modal-confirm">确定</button>
          </div>
        </div>
        ,function (dd){
          setTimeout(function (){
            edit.ueditor.addListener("contentChange",function(){
              let text = edit.ueditor.getContent()
              let rex = /&lt;(\S*?)[^>]*&gt;.*?&lt;\/\1&gt;|&lt;.*? \/&gt;|&lt;!--((.*)|(\n))*?--&gt;/g;
              if(text.match(rex)){
                text = text.replace(rex,'')
                edit.ueditor.setContent(text);
              }
              previewData.p9.title = text
              previewData.p9.length = edit.ueditor.getContentTxt().length
              textarea.content = text
              posterPreview.replace(postetPV(previewData,previewBg[active].class))
            });
            edit.ueditor.addListener('focus',function (){
              $(dd).find('.poster-editor-warning').hide()
              $(dd).find('.poster-editor-error').hide()
            });
          },1100)
          if(opts.formMethod){
            opts.formMethod(dd,previewData,function (data,preview){
              if(data){
                if(preview){
                  posterPreview.replace(postetPV(preview,previewBg[active].class))
                }else{
                  let pvTitle = (data.index == 'p4' ? '入住日期：' : data.index == 'p7' ? '场次：' : data.index == 'p8' ? '座位等级：' : '')
                  if(data.index == 'p4' || data.index == 'p7' || data.index == 'p8'){
                    previewData[data.index].value = data.value
                  }
                  previewData[data.index].title = (data.value ? pvTitle : '') + data.value
                  posterPreview.replace(postetPV(previewData,previewBg[active].class))
                }
              }
            })
          }
          $(dd).find('.poster-bg').once('click',function (){
            active = $(this).index() - 1
            $(this).addClass('active').siblings().removeClass('active')
            posterPreview.replace(postetPV(previewData,previewBg[active].class))
          })
          $(dd).find('.modal-confirm').once('click',function (){
            if(opts.confirm){
              // let txt = ;
              let confirm = opts.confirm(previewData,previewBg[active])
              if(confirm){
                html2canvas($(dd).find(".poster-preview")[0]).then(canvas => {
                  $(canvas).addClass('poster-canvas-img')
                  $(dom).find('.poster-canvas').html(canvas)
                  $(dom).find('.poster-canvas').append('<div class="poster-del">删除</div>')
                  $(dom).find('.poster-canvas-img').once('click',function (){
                    if(opts.make){
                      let make = opts.make()
                      if(make){
                        instance.$update({
                          ...make
                        })
                        setTimeout(()=>{
                          modal(posterModal(),{
                            width:'1080px',
                            bgClose: true,
                            closeBtn: '.close,.modal-cancel'
                          })
                        },200)
                      }
                    }
                  })
                  instance.$update({
                    form, textarea, active
                  })
                  $(dd).find('.close').trigger('click')
                });
              }
            }
          })
        }
      )
      return <PosterModal />
    }
    $(dom).find('.poster-make').once('click',function (){
      if(opts.make){
        let make = opts.make()
        if(make){
          instance.$update({
            ...make
          })
          setTimeout(()=>{
            modal(posterModal(),{
              width:'1080px',
              bgClose: true,
              closeBtn: '.close,.modal-cancel'
            })
          },200)
        }
      }
      
    })
    $(dom).find('.poster-canvas').off().on('click','.poster-del',function (){
      if(opts.delete){
        $(this).parents('.poster-canvas').html('')
        opts.delete()
      }
    })
  })
  instance.setProps(opts)
  return instance
}

export default function poster(opts){
  let dft = {
    title: '',
    form: {
      data: [
        { title: '酒店名称:', input:{id:'xxx', type: 'text', placeholder: '请输入酒店名称',maxlength: 12 }, location: 'p1'}
      ]
    },
    textarea: {
      title: <div><span className="color-ff0000">*</span>对客推广说明：</div>,
      content: ''
    },
    previewBg: [
      {
        class: 'poster-hotel1',
      },
      {
        class: 'poster-hotel2',
      }
    ],
    active: 0,
    data: undefined
  }
  dft = _.merge(dft, opts)
  return index(dft)
}