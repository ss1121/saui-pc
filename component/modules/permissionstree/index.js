import treex from 'aotoo-react-treex'
import normalAdapter from '../../adapter/treeadapterwithckbox'
import renderedFold from '../tree/scene/rendered_fold'
import renderedCkbox from '../tree/scene/rendered_ckbox'

const category = {
  1: '会员系统',
  2: '资源产品',
  3: '积分系统',
  4: '工单系统',
  5: '订单系统',
  6: '秒杀系统',
  7: '消息系统',
  8: '运营系统',
  9: 'PC站点',
  10: 'APP'
}

function myOptionBar (ctx) {
  return function (item, edits, index) {
    const stat = edits && edits.indexOf(item.index) > -1
    if (item.systemCode) {
      return (
        <div className='title-bg'>
          {category[item.systemCode]}
          <a className='tree-more' data-index={(item.index || 0)} data-idf={item.idf}>
            {stat ? '增加权限' : '增加权限'}
          </a>
        </div>
      )
    }
  }
}

function myCheckBox (ctx) {
  return function (item, edits, index) {
    const that = this
    const val = item.idf ? item.idf.indexOf('-') > -1 ? item.idf.split('-')[1] : item.idf : 1000
    let props = {
      'type': 'checkbox',
      'className': 'tree-checkbox',
      'data-index': item.index,
      'id': 'ckbox-' + item.idf,
      'name': 'privilegex',
      'defaultValue': val
    }
    let _style = {}
    if (item.isDefault == 1) {
      props.readOnly = 'readonly'
      props.disabled = 'disabled'
      props.name = 'privilegex-readonly'
      item.checked = true
      // _style = {
      //   visibility: 'hidden'
      // }
      // props.style = _style
    }
    return item.checked ? <input {...props} defaultChecked /> : <input {...props} />
  }
}

module.exports = function (param) {
  const my_data = param.data
  const my_edits = param.edits
  const editPage = param.editPage
  const my_optionBar = function (params) {
    if (typeof param.optionbar == 'function') {
      return param.optionbar
    }
    return myOptionBar()
  }
  const my_checkbox = function (params) {
    if (typeof param.checkbox == 'function') {
      return param.checkbox
    }
    if (param.checkbox == false) {
      return false
    }
    return myCheckBox()
  }

  let clickedIds = []
  let editIndexGroups = []

  const prettyTreeData = normalAdapter({
    edits: my_edits,
    data: my_data,
    editPage: editPage,
    optionBar: my_optionBar(),
    checkBox: my_checkbox()
  })

  const permissionStree = treex({
    props: {
      data: prettyTreeData.result,
      listClass: 'permission-ul'
    }
  })

  let renderCbk

  permissionStree.on('default', function (param) {
    let dom = param.dom
    renderedFold(dom, {}, permissionStree)
    renderCbk = renderedCkbox(dom, {}, prettyTreeData, {
      checkboxName: 'privilegex'
    })

    $(dom).once('click', '.tree-more', function (e) {
      e.stopPropagation()
      const idf = $(this).attr('data-idf')
      if (clickedIds.indexOf(idf) == -1) {
        clickedIds.push(idf)
      }

      clickedIds.map(itemIdf => {
        editIndexGroups = _.uniq(editIndexGroups.concat(prettyTreeData.getGroups(itemIdf)))
      })

      prettyTreeData.refresh({
        edits: editIndexGroups,
        checked: renderCbk.getChecked()
      })

      permissionStree.$update({ data: prettyTreeData.result })
    })
  })

  permissionStree.getGroups = function (idf, feather) {
    return prettyTreeData.getGroups(idf, feather)
  }

  permissionStree.getParents = function (idf) {
    return prettyTreeData.getParents(idf)
  }

  // 获取所有勾选的checkbox在数组中的下标
  permissionStree.getChecked = function () {
    return renderCbk.getChecked()
  }

  // 获取当前点击的checkbox及相关checkbox的在数组中的下标
  permissionStree.getSelected = function () {
    return renderCbk.getSelected()
  }

  permissionStree.refresh = function (params) {
    if (params) {
      if (params.data) {
        prettyTreeData.data = params.data
      }
      if (params.edits) {
        params.checked = params.checked || []
        prettyTreeData.refresh(params)
        permissionStree.$update({ data: prettyTreeData.result })
      }
    }
  }

  return permissionStree
}
