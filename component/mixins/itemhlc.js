
/**
 * itemHlc  [react的高阶组件，给子组件绑定itemMethod方法，componentDidMount后]
 * ComposedComponent  {React-Element}   [被包围的子组件]
 */
// export default (ComposedComponent, cb) => {
//   if (!ComposedComponent) {
//     console.log('请指定ComposedComponent');
//     return
//   }
//   if (React.isValidElement(ComposedComponent)) {
//     return class extends React.Component {
//       constructor(props){
//         super(props)
//         this.intent = this.props.intent
//         this.state = { show: true }

//         this.show = this::this.show
//         this.hide = this::this.hide
//       }
//       componentWillMount() {
//         if (this.props.show == false) this.setState({ show: false })
//       }
//       show(){
//         this.setState({
//           show: true
//         })
//       }
//       hide(){
//         this.setState({
//           show: false
//         })
//       }
//       componentDidMount() {
//         let self = this
//   			let that = React.findDOMNode(this);
//         const _ctx = {
//           show: this.show,
//           hide: this.hide
//         }

//   			// if( this.props.itemDefaultMethod ){
//   			// 	if (this.props.itemMethod) this.props.itemMethod.call(ctx, that, self.intent)
//   			// 	setTimeout(function(){
//   			// 		if( typeof self.props.itemDefaultMethod === 'function' ) self.props.itemDefaultMethod.call(ctx, that, self.intent)
//   			// 	}, 17)
//   			// } else if (typeof cb == 'function' || this.props.itemMethod){
//         //   const imd = cb ||this.props.itemMethod
//   			// 	imd.call(ctx, that, self.intent)
//   			// }

//         if( typeof this.props.itemDefaultMethod == 'function' ){
//           self.props.itemDefaultMethod.call(_ctx, that, self.intent)
//         }

//         if (
//           typeof cb == 'function' ||
//           typeof this.props.rendered == 'function' ||
//           typeof this.props.itemMethod == 'function'
//         ) {
//           const imd = cb || this.props.rendered || this.props.itemMethod
//           imd.call(_ctx, that, self.intent)
//         }

//         super.componentDidMount ? super.componentDidMount() : ''
//       }
//       render(){
//         return this.state.show ? ComposedComponent : <var/>
//       }
//     }
//   }

//   return class extends ComposedComponent {
//     constructor(props) {
//       super(props);
// 			this.intent = this.props.intent || [];
//     }

//     // componentWillReceiveProps(){}
//     // shouldComponentUpdate(){}
//     // componentWillUpdate(){}
//     componentDidUpdate(){
//       this.componentDidMount()
//     }

//     componentDidMount(){
// 			let self = this
// 			let that = React.findDOMNode(this);
//       const _ctx = {
//         idf: this.idf,
//         getState: this.getState,
//         updateState: this.updateState,
//         parent: this.parent,
//         refs: this.refs
//       }

//       if( typeof this.props.itemDefaultMethod == 'function' ){
//         self.props.itemDefaultMethod.call(_ctx, that, self.intent)
//       }

//       if (
//         typeof cb == 'function' ||
//         typeof this.props.rendered == 'function' ||
//         typeof this.props.itemMethod == 'function'
//       ) {
//         const imd = cb || this.props.rendered || this.props.itemMethod
//         imd.call(_ctx, that, self.intent)
//       }

// 			// if( this.props.itemDefaultMethod ){
// 			// 	if (this.props.itemMethod) this.props.itemMethod.call(ctx, that, self.intent)
// 			// 	setTimeout(function(){
// 			// 		if( typeof self.props.itemDefaultMethod === 'function' ) self.props.itemDefaultMethod.call(ctx, that, self.intent)
// 			// 	}, 17)
// 			// }
//       // else if (typeof cb == 'function' || this.props.itemMethod){
//       //   const imd = cb ||this.props.itemMethod
//       //   imd.call(ctx, that, self.intent)
// 			// }

//       super.componentDidMount ? super.componentDidMount() : ''
// 		}
//   }
// }

export default Aotoo.wrap
