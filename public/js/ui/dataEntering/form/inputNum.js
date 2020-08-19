  class Numberx extends React.Component {
    constructor(props){
      super(props)
      this.state = this.props
    }
    onPrev = () => {
      if (this.state.count > this.state.min) {
        this.setState({
          count: this.state.count - 1
        })
      }
    }
    onNext = () => {
      if (this.state.count < this.state.max) {
        this.setState({
          count: this.state.count + 1
        })

        // if (this.props.callback) {
        //   callback(this.state.count)
        // }
      }
    }
    render(){
      let ouput = null
      if (this.props.type == 'lr') {
        ouput = (
          <div className='input-num lr'>
            <a href='javascript:;' onClick={this.onPrev} className={"item item-left " + (this.state.count <= this.state.min ? 'disabled' : '')}></a>
            <input type='text' className="form_control" value={this.state.count} readOnly={this.state.readOnly} />
            <a href='javascript:;' onClick={this.onNext} className={"item item-right " + (this.state.count >= this.state.max ? 'disabled' : '')}></a>
          </div>
          
        )
      }
      else {
        ouput = (
          <div className='input-num'>
            <input type='text' className="form_control" value={this.state.count} readOnly={this.state.readOnly} />
            <ul className='item-number'>
              <li onClick={this.onNext} className={"item item-right " + (this.state.count >= this.state.max ? 'disabled' : '')}></li>
              <li onClick={this.onPrev} className={"item item-left " + (this.state.count <= this.state.min ? 'disabled' : '')}></li>
            </ul>
          </div>
        )
      }
      return ouput
    }
  }

  const Action = {
    // GETVALUE(stat, opts, ctx){
    //   let curState = this.curState
    //   if (typeof opts === 'function') {
    //     opts(curState)
    //   }
    // }
  }

function num(params) {

  let dft = {
    count: 0,
    min: 0, 
    max: 5,
    type: 'right',
    readOnly: true,
  }

  let opts = Object.assign(dft, params)

  const instance = Aotoo(Numberx, Action, opts)
  instance.extend({
    getValue: function (){
      let curState = instance.curState
      return curState ? curState.count : opts.count
    }
  })
  instance.setProps(opts)
  return instance
}

export default function (options) {
  return num(options)
}