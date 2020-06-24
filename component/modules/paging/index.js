/**
 * 前台SEO专用的分页，需要用带分页参数的href的a标签，便于搜索引擎爬取
 * 异步可用js阻止默认事件从data-page获取分页参数或直接使用./pagination组件
 */

class Paging extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.props
  }
  render(){
    return (
      <div className="paging">
        {
          this.list({
            listClass: 'paging-pages',
            data: this.state.data
          })
        }
      </div>
    )
  }
}

// 搜索参数序列化(/?key=value&key=value),返回分页a标签的href属性
function serializeSearch(opts,number){
  var search=opts.search
  if(search){
    if(/page=\d+/.test(search)){
      return search.replace(/page=\d+/,'page='+number)
    }else{
      return search+'&page='+number
    }
  }else{
    return '?page='+number
  }
}

function getPageData(opts){
  let pageCount=opts.pageCount;
  let start = 0,len = 0;
  let startPage = [],element = [],endPage = [];
  const maxPage = Math.ceil(opts.totalRow / opts.pageSize)
  if(opts.pageNumber < pageCount){
    start = 1
  }else if(opts.pageNumber >= pageCount){
    start = opts.pageNumber - 2
    if(start > maxPage - (pageCount-1)){
      start = maxPage - (pageCount-1)
    }
  }
  len = opts.pageNumber < (pageCount-1) ? pageCount : opts.pageNumber == (pageCount-1) ? (pageCount+1) : start + (pageCount-1)
  if(len > maxPage){
    len = maxPage;
    start = len - pageCount < 1 ? 1 :  len - pageCount
  }
  if(opts.pageNumber == pageCount){
    startPage.push(
      { title: <a href={serializeSearch(opts,1)}>1</a>, itemClass: 'paging-link' },
      { title: '...', itemClass: 'paging-dot' }
    )
  }else if(opts.pageNumber > pageCount){
    startPage.push(
      { title: <a href={serializeSearch(opts,1)}>1</a>, itemClass: 'paging-link' },
      { title: <a href={serializeSearch(opts,2)}>2</a>, itemClass: 'paging-link' },
      { title: '...', itemClass: 'paging-dot' }
    )
  }
  if(opts.pageNumber < maxPage - 2 && maxPage>opts.pageCount){
    endPage.push(
      { title: '...', itemClass: 'paging-dot' },
      { title: <a href={serializeSearch(opts,maxPage)}>{maxPage}</a>, itemClass: 'paging-link'}
    )
  }
  for(let i=start;i<=len;i++){
    element.push({
      title: <a href={ opts.pageNumber == i ? 'javascript:;' :serializeSearch(opts,i)}>{i}</a>,
      itemClass:opts.pageNumber == i ? 'paging-active' : 'paging-link'
    })
  }
  const data = [
    {title: <a className={ !opts.prevButton ? 'paging-prev paging-disabled' : 'paging-prev'} href={ !opts.prevButton ? 'javascript:;' : serializeSearch(opts, opts.pageNumber - 1 < 1 ? 1 : opts.pageNumber - 1)} data-disabled={ !opts.prevButton }>{opts.pageIsIcon == false ? '上一页' : ''}</a>},
    ...startPage,
    ...element,
    ...endPage,
    {title: <a className={ !opts.nextButton ? 'paging-next paging-disabled' : 'paging-next'} href={ !opts.nextButton ? 'javascript:;' : serializeSearch(opts, opts.pageNumber + 1 > maxPage ? maxPage : opts.pageNumber + 1)} data-disabled={ !opts.nextButton }>{opts.pageIsIcon == false ? '下一页' : ''}</a>},
    // {title: <div className='paging-jump'>共{ maxPage }页，前往<input className='paging-jump-val' type="text" defaultValue={ opts.pageNumber+1 > maxPage ? maxPage : opts.pageNumber } />页<button className='paging-jump-confirm'>确定</button></div>}
  ]
  return data
}
const Actions = {
  NEXT: function (ostate){
    let curState = this.curState
    // if(curState)
  },
  PREV: function (ostate){
    let curState = this.curState
    // return run(opts);
  },
  JUMP: function (ostate, val){
    let curState = this.curState
    // return run(opts);
  }
}
function pagination(opts){
  opts.pageNumber=parseInt(opts.pageNumber) //分页参数兼容字符串
  opts.nextButton = opts.pageNumber != Math.ceil(opts.totalRow / opts.pageSize) ? true : false
  opts.prevButton = opts.pageNumber != 1 ? true : false
  const instance = Aotoo(Paging, Actions, {
    props: {
      pageNumber: opts.pageNumber,
      pageNext: opts.pageNext ? opts.pageNext : '',
      pagePrev: opts.pagePrev ? opts.pagePrev : '',
      pageJump: opts.pageJump ? opts.pageJump : '',
      data: getPageData(opts),
    }
  })
  instance.rendered = function(dom){
    $(dom).find('.paging-jump-confirm').click(function (){
      window.location = serializeSearch(opts,$(dom).find('.paging-jump-val').val())
    })
  }
  return instance
}
export default function paging(options){
  let dft = {
    pageIsIcon: false,
    base: '',//根目录
    search: '',//路径
    hash: '',
    pageSize:20,
    pageNumber:1,
    pageCount:6,//总共显示的页码数(包括头尾,多余的省略号代替)-1
    totalRow:0,
  }
  dft = _.merge(dft, options)
  return pagination(dft)
}

export function pure(props){
  return paging(props)
}
