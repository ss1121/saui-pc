class CustomSsTable extends React.Component {
  constructor (props) {
    super (props)
    this.state = { 
      hdData: this.props.headData || [],
      bdData: this.props.bodyData || [],
      tableClass: this.props.tableClass || 'ss-table-hb',
      headClass: this.props.headClass || '',
      bodyClass: this.props.bodyClass || '',
      bodyItemClass: this.props.bodyItemClass || '',
    }
  }
  render() {
    const newHeadData = this.state.hdData.map( (item, ii) => {
      return {
        title: item.title,
        attr: {key: item.key},
        itemClass: item.class ? 'ss-table-td ' + item.class : 'ss-table-td'
      }
    })
    const bdlist = (data, ii) => {
      let output = []
      for (let i =0; i < this.state.hdData.length; i++){
        output.push(
          {
            title: data[this.state.hdData[i].key],
            itemClass: this.state.hdData[i].class ? 'ss-table-td ' + this.state.hdData[i].class : 'ss-table-td'
          }
        )
      }
      return output
    }
    let newBodyData = this.state.bdData.map( (item, ii) => {
      return {
        li: bdlist(item, ii),
        liClassName: 'ss-table-tr',
        itemClass: 'ss-table-sx'
      }
    })
    newBodyData.unshift({li: newHeadData, liClassName: 'ss-table-tr', itemClass: 'ss-table-sx ss-table-tthead'})
    return Aotoo.list({
      data: newBodyData,
      itemClass: this.state.bodyItemClass,
      listClass: this.state.tableClass
    })
  }
}

export default function customSstable (opts){
  const ins = Aotoo(CustomSsTable)
  ins.setProps(opts)
  return ins
}