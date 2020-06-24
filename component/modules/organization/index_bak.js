import List from 'component/widgets/listView'
import baseX from 'component/class/basex'
import transTree from 'component/util/tree'

class Orgnization extends React.Component {
  constructor(props){
    super(props)
    this.preRender = this::this.preRender
    this.state = {
      data: this.props.data,
    }
  }

  preRender(){
    const orgnizationData = transTree(this.state.data)
    return <List 
      data = {orgnizationData}
      listClass = {this.props.listClass}
    />
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
  
}

class App extends baseX {
  constructor(config){
    super(config)
    this.selected=[]
    this.groupSelected = 'orgnization_0'
    this.combinex(Orgnization, Actions)
  }
}

/*
 [
  {title: '', idf: 'aaa', index: 0},
  {title: 'abcfd', parent: 'aaa', index: 1},
  {title: 'bcasd', parent: 'aaa', index: 2},
  {title: 'aacwq', parent: 'aaa', index: 2},

  {title: <button>123</button>, idf: 'bbb', index: 3},
  {title: 'yyufs', parent: 'bbb', index: 4},
  {title: 'xfdsw', parent: 'bbb', index: 5},
  {title: 'xxxdsehh', parent: 'bbb', index: 5},
  ]
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
  return new App(dft)
}

export function pure(props){
  return orgnization(props)
}
