# paging

分页组件


## 用法

```javascript
import pagination from 'component/modules/paging';
//组件初始化
var search = window.location.search;
var pagination =  paging({
  pageType: 'link',
  pageIsIcon: false,
  linkUrl:{
    type: 'search',//url类型
    url: '',//根目录
    parame: search,//路径
    hash: ''
  },
  pageNumber: searchMap.page ? searchMap.page : '1',
  pageSize: 20,
  totalRow: totalRow
})
//组件使用
const LazyLoad=(
  <div className="container">
    {pagination.render()}
  </div>
)
```


## props

### pageType

Type: 'link' || ''

'link':a标签按钮

### pageNumber || pageSize || totalRow

Type: Number Default: 1 || 20 || 0

当前页码数 || 每页条数 || 总数

### pageIsIcon

Type: Bool Default: false

仅加载一次，加载完无后续处理则使用该属性

### linkUrl.type

Type: String Default: undefined

'search':以window.location.search做为分页参数

### linkUrl.parame

Type: String Default: undefined

客户端传入window.location.search(服务端需另处理)



