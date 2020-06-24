class Loading extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      dotNum: this.props.dotNum || 3,
      listClass: this.props.listClass
    }
  }
  ins(){
    let str = []
    for (let i = 0; i<this.props.dotNum; i++){
      str.push({
        title: ''
      })
    }
    return Aotoo.list({
      data: str,
      listClass: this.state.listClass,
      itemClass: 'item-div'
    })
  }
  render(){
    return this.ins()
  }
}
export default Loading