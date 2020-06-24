class DateTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      thead: this.props.thead,
      content: this.props.content
    }
  }
  render (){
    let { thead, content } = this.state
    let head = []
    let week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    let today = new Date();
    function dateItem(item){
      let { date, itemClass } = item
      let dd = new Date(date);
      let dateList = [];
      for(let i=0,l=7;i<l;i++){
        let itemDate = new Date(dd.getFullYear(), dd.getMonth(), dd.getDate() + i)
        let day = itemDate.Format('yyyy-MM-dd') == today.Format('yyyy-MM-dd') ? '今天' : week[itemDate.getDay()]
        let title = (
          <div className="dateTable-date">
            { itemDate.Format('M-d') }
            { day }
          </div>
        )
        dateList.push({title: title, itemClass})
      }
      return dateList
    }
    thead.map(item => {
      if(item.type != 'date'){
        head.push(item)
      }else{
        head.push(dateItem(item))
      }
    })
    head = _.flattenDeep(head)
    return (
      <div className="ss-dateTable">
        { 
          Aotoo.list({
            data: head,
            listClass: 'ss-table-tthead hei50',
            itemClass: 'ss-table-td'
          })
        }
        <div className="ss-table-body">
          { content }
        </div>
      </div>
    )
  }
}
const Actions = {
  UPDATE: function (ostate, opts){
    let { curState } = this;
    if(opts.date != 'undefined'){
      let thead = []
      curState.thead.map(item => {
        if(item.type == undefined){
          thead.push(item)
        }
        if(item.type == 'date'){
          item.date = opts.date
          thead.push(item)
        }
      })
      curState.thead = thead
    }
    if(opts.content != 'undefined'){
      curState.content = opts.content
    }
    return curState
  }
}

function index(opts){
  const instance = Aotoo(DateTable, Actions)
  instance.extend({
    
  })
  instance.on('rendered', function (options){
    const {dom, opts, ctx} = options

  })
  instance.setProps(opts)
  return instance
}

export default function dateTable(options){
  let dft = {
    date: new Date().Format('yyyy-MM-dd')
  }
  dft = _.merge(dft, options)
  return index(dft)
}