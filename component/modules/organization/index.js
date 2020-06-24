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

function appOrganiz(config) {
  const appInst = Aotoo(Orgnization, {}, config)
  appInst.selected = []
  appInst.groupSelected = 'orgnization_0'
  return appInst
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
  dft.props = {...dft}
  return new App(dft)
}

export function pure(props){
  return orgnization(props)
}
