Aotoo.inject.css('/css/t/animate.css')

export default class Animated extends React.Component {
  constructor (props) {
    super (props)
    this.state = {
      animate: this.props.animate || 'fadeOut',
      duration: this.props.duration || '',
      delay: this.props.delay || '',
      content: this.props.children || ''
    }
  }
  render() {
    let cls = 'animated ' + this.state.animate
    return (
      <div className={cls} >
        {this.state.content}
      </div>
    )
  }
}


/**
 *  animation-duration: 2s;    //动画持续时间   ->animationDuration
 *  animation-delay: 1s;    //动画延迟时间       ->animationDelay:
 *  animation-iteration-count: 2;    //动画执行次数            ->animationIterationCount
 */
