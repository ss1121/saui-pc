class Orgnization extends React.Component {
  constructor(props){
    super(props)
    this.preRender = this::this.preRender
    this.state = {
      data: this.props.data,
    }
  }

  preRender(){
    return Aotoo.tree({
      data: this.state.data,
      listClass: this.props.listClass
    })
  }

  render(){
    return (
      <div className={'orgnizationClass'}>
        {this.preRender()}
      </div>
    )
  }
}

const Actions = {
  UPDATE: function(state, props={}){
    let curState = state
    let group = curState.group
    let groupItem = curState.groupItem
    let data = curState.data

    const index = props.index
    if (!index && index!=0) {
      if ( _.isArray(props.data) ) {
        curState.data = props.data
        return curState
      }
    } else {
      let oriData = data[index]
      oriData = _.merge(oriData, props.data)
      return curState
    }
  },
  MERGE: function(state, props={}){
    let curState = this.curState
    let group = curState.group
    let groupItem = curState.groupItem
    let data = curState.data

    const index = props.index
    if (!index && index!=0) {
      if ( _.isArray(props.data) ) {
        curState.data = props.data
        return curState
      }
    } else {
      let oriData = data[index]
      oriData = _.merge(oriData, props.data)
      return curState
    }
  }
}

let idrecode = []
let indexcode = []
function _getGroups(dataAry, idf){
  let nsons = []

  let sons = _.filter(dataAry, (o, jj) => {
    if (o.parent == idf) {
      indexcode.push(jj)
      return o.parent == idf
    }
  })

  sons.forEach( (son, ii) => {
    if (son.idf && idrecode.indexOf(son.idf) == -1) {
      idrecode.push(son.idf)
      nsons = nsons.concat(_getGroups(dataAry, son.idf))
    } else {
      nsons = nsons.concat(son)
    }
  })
  return nsons
}

let myParentsIndex = []
let myParents = []
function findParents(dataAry, idf){
  let _parentIndex
  const item = _.find(dataAry, (o,ii)=>o.idf==idf)

  if (item && item.parent) {
    const p = _.find(dataAry, (o, ii)=>{
      _parentIndex = ii
      return o.idf==item.parent
    })
    if (p){
      myParents.push({index: _parentIndex, content: p})
      findParents(dataAry, item.parent)
    }
  }
}

function newTreex(opts) {
  const inst = Aotoo(Orgnization, Actions, opts)
  inst.extend({
    getGroups(data, idf, son) {
      data = data || this.data || []
      idrecode = []
      indexcode = []
      const index = _.findIndex(data, o => o.idf == idf)
      indexcode.push(index)
      _getGroups(data || [], idf)
      if (son) {
        let temp = []
        indexcode.forEach($id => {
          temp.push(data[$id])
        })
        return temp
      }
      return indexcode
    },
    getParents(data, idf) {
      myParents = []
      findParents(data, idf)
      return myParents
    },
    update(props) {
      this.dispatch('UPDATE', props)
    }
  })
  return inst
}

/*
 [ {title: '', idf: 'aaa', index: 0},
  {title: 'abcfd', parent: 'aaa', index: 1},
  {title: 'bcasd', parent: 'aaa', index: 2},
  {title: 'aacwq', parent: 'aaa', index: 2},

  {title: <button>123</button>, idf: 'bbb', index: 3},
  {title: 'yyufs', parent: 'bbb', index: 4},
  {title: 'xfdsw', parent: 'bbb', index: 5},
  {title: 'xxxdsehh', parent: 'bbb', index: 5}, ]
*/

export default function orgnization(opts){
  var noop = false
    , dft = {
        data: [],
        props: false,
        theme: 'tree/permission',
        autoinject: true,
        autoOrgnization: true,
        container: false,
        header: '',
        footer: '',
        itemClass: '',
        listClass: 'permission-ul',
        orgnizationClass: '',
        itemMethod: '',
        listMethod: '',
        rendered: '',
        fold: false
      };

  dft = _.merge(dft, opts)
  // return new App(dft)
  return newTreex(dft)
}

export function pure(props){
  return orgnization(props)
}
