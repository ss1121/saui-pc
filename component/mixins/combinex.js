// import combineX from 'react-combinex'
// module.exports = combineX







// const findDOMNode = React.findDOMNode
// const uniqueId = _.uniqueId
// const merge = _.merge

// const isClient = (() => typeof window !== 'undefined')()
// const store = ( sax => {
//   try {
//     if (!sax) throw 'storehlc depend on SAX, SAX is fkp-sax, is a Global fun'
//     return (id, ComposedComponent) => {
//       if (!id) throw 'storehlc id must be set'
//       return class extends ComposedComponent {
//         constructor(props) {
//           super(props)
//           this.globalName = id
//           const queryer = sax(id)
//           queryer.data.originalState
//           ? queryer.data.originalState[id] = _.cloneDeep(this.state)
//           : ( ()=>{
//             let temp = {}; temp[id] = _.cloneDeep(this.state)
//             queryer.data.originalState = temp
//           })()
//           sax.bind(id, this)
//         }
//       }
//     }
//   } catch (e) {
//     return ComposedComponent
//   }
// })(SAX)


// function combineX(ComposedComponent, opts, cb){
//   if (typeof opts == 'function') {
//     cb = opts
//     opts = undefined
//   }
//   if (!ComposedComponent) {
//     console.log('请指定ComposedComponent');
//     return
//   }
//   if ( typeof ComposedComponent == 'string' ||
//     Array.isArray(ComposedComponent)
//   ) { return }

//   const globalName = uniqueId('Combinex_')
//   let queryer = SAX(globalName, opts||{})

//   /**
//    * ComposedComponent 为 React element
//    * @param  {[type]} React [description]
//    * @return [type]         [description]
//    */
//   if (React.isValidElement(ComposedComponent)) {
//     return class extends React.Component {
//       constructor(props){
//         super(props)
//         this.intent = this.props.intent
//         this.state = { show: true }

//         this.show = this.show.bind(this)
//         this.hide = this.hide.bind(this)
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

//       componentDidUpdate(){
//         this.componentDidMount()
//       }

//       componentDidMount() {
//         let self = this
//   			let that = findDOMNode(this);
//         const _ctx = {
//           show: this.show,
//           hide: this.hide
//         }

//         super.componentDidMount ? super.componentDidMount() : ''

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

//       }
//       render(){
//         return this.state.show ? ComposedComponent : <var/>
//       }
//     }
//   }



//   /**
//    * ComposedComponent 为 React class
//    * @type {[type]}
//    */

//   function dispatcher(key, props){
//     const ctx = queryer.store.ctx[globalName]

//     const liveState = merge({}, ctx.state)
//     const oState = queryer.data.originalState[globalName]
//     // const oState = JSON.parse(queryer.data.originalState[globalName])

//     const queryActions = queryer.data

//     const _state = {
//       curState: liveState,
//     }

//     if (queryActions[key]) {
//       const _tmp = queryActions[key].call(_state, oState, props)
//       if (_tmp) {
//         const target = merge({}, oState, _tmp)
//         ctx.setState(target)
//       }
//     }
//   }

//   let ReactComponentMonuted = false
//   class Temp extends ComposedComponent {
//     constructor(props) {
//       super(props);
// 			this.intent = this.props.intent || [];
//     }

//     componentDidUpdate(){
//       this.componentDidMount()
//     }

//     componentDidMount(){
// 			let self = this
// 			let that = findDOMNode(this);

//       const _ctx = {
//         dispatch: dispatcher,
//         refs: this.refs
//       }

// 			// if( this.props.itemDefaultMethod ){
// 			// 	if (this.props.itemMethod) this.props.itemMethod.call(_ctx, that, self.intent)
// 			// 	setTimeout(function(){
// 			// 		if( typeof self.props.itemDefaultMethod === 'function' ) self.props.itemDefaultMethod.call(_ctx, that, self.intent)
// 			// 	}, 17)
// 			// }
//       // else if (typeof cb == 'function' || this.props.itemMethod){
//       //   const imd = cb ||this.props.itemMethod
//       //   imd.call(_ctx, that, self.intent)
// 			// }
//       super.componentDidMount ? super.componentDidMount() : ''

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

//       ReactComponentMonuted = true
// 		}
//   }

//   let timer;
//   class Query {
//     constructor(config){
//       this.element = store(globalName, Temp)
//       this.saxer = queryer
//       this.setActions = queryer.setActions
//       this.roll = queryer.roll
//     }

//     dispatch(key, props){
//       clearTimeout(timer)
//       timer = setTimeout(function() {
//         if (ReactComponentMonuted) dispatcher(key, props)
//       }, 0);
//     }
//   }

//   return new Query()
// }

module.exports = Aotoo.wrap
