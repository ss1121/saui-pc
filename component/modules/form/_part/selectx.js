function isFunction(cb) {
  return typeof cb == 'function'
}

const dpickerAssets = {
  minView: "month", //选择日期后，不会再跳转去选择时分秒
  language: 'zh-CN',
  format: "yyyy-mm-dd",                //格式化日期
  autoclose: true,
  clearBtn: true
}

function select(_intent, ctx){
  const intent = ctx.data('intent')

  // const allocation = ctx.allocation // 配置文件, 每一个有id的表单的配置文件都在这个对象下
  const allocation = ctx.saxer.get('allocation') // 配置文件, 每一个有id的表单的配置文件都在这个对象下
  const elements = ctx.elements('all')
  let isSelect = {}   // 注册所有的select到这个对象下
  let watchs = {}  // 所有联动的联动方法都会被注册到这个对下下
  let that = ctx

  /*
   * 检测单项是否有联动操作
   * param {JSON} {id: xxx}
   * cb {function}  回调函数
   * 通过lodash的filter函数匹配出符合param条件的联动项数组，从intent中
   * 在对数组项做处理，输出结构，及补全操作
   */
  function checkUnion(param, cb){
    const ary = _.filter(intent, param)
    if (ary.length) {
      watchs[param.id] = function(){
        if (isFunction(cb)) cb(ary)
      }
      return true
    }
  }

  function dealWatchs(param){
    if (watchs[param.id]) watchs[param.id]()
  }

  function getrcBoxName(pdata){
    let superID
    if (_.isArray(pdata.name)) return P.name[0]
    else {
      return pdata.name
    }
  }

  // console.log(elements);
  // console.log(allocation);

  function dealSpan(item){
    const thisInput = elements[item.id]
    const itMtd = item.itemMethod || item.attr.itemMethod
    if (typeof itMtd == 'function') {
      itMtd.call(this, thisInput)
    }
  }

  function dealText(item){
    const thisInput = elements['#'+item.id]
    const itMtd = item.itemMethod || item.attr.itemMethod
    if (typeof itMtd == 'function') {
      itMtd.call(this, thisInput)
    }

    const hasUnion = checkUnion({id: item.id}, dealWithUnion);
    if (hasUnion) {
      $(thisInput).off('input').on('input', function(e){
        ctx.form[item.id] = this.value
        dealWatchs({id: thisInput.id})
      })
    } else {
      $(thisInput).off('input').on('input', function(e){
        ctx.form[item.id] = this.value
      })
    }
  }

  function dealRcbox(item){
    const _name = getrcBoxName(item)
    const lable = elements[_name]
    const thisInput = $(lable).find('input[name='+_name+']')
    $(thisInput).change(function(){
      if (item.type == 'checkbox') {
        let cbVal = []
        thisInput.each( (ii, item) => {
          if (item.checked) cbVal.push(item.value)
        })
        ctx.form[_name] = cbVal;
      } else {
        ctx.form[_name] = [this.value];
      }
      const itMtd = item.itemMethod || item.attr.itemMethod
      if (typeof itMtd == 'function') {
        itMtd.call(this, thisInput)
      }
    })
  }

  function dealDatePicker(item){
    const thisInput = elements['#'+item.id]
    if (!thisInput) return
    const isJx = item.datetype == 'jx' ? true : false
    const picker = isJx ? 'datepicker' : 'datetimepicker'
    const dftAssets = _.merge({}, dpickerAssets, item.profile.assets)
    const change = isJx ? 'change': 'changeDate'
    setTimeout(()=> {
      if (dftAssets.stat && dftAssets.stat == 'update') {
        $(thisInput)[picker]('setStartDate', dftAssets.startDate);
        $(thisInput)[picker]('setEndDate', dftAssets.endDate);
      } else {
        $(thisInput)[picker](dftAssets);
        const hasUnion = checkUnion({id: item.id}, dealWithUnion)
        $(thisInput).off(change).on(change, function(){
          let targetIt = {}
          targetIt[item.id] = this.value;
          ctx.values(targetIt)
          if (hasUnion) {
            dealWatchs({id: thisInput.id})
          }
        })
      }
    }, 300)
  }

  function forceDealWithUnion(item){
    const hasUnion = checkUnion({id: item.id}, dealWithUnion)
    if (hasUnion) {
      dealWatchs({id: item.id})
    }
  }

  const escape = [
    [/&gt;/g, '>'],
    [/&lt;/g, '<'],
  ]

  Object.keys(allocation).forEach( unit => {

    const item = allocation[unit]
    const itMtd = item.itemMethod || item.attr.itemMethod

    let thisInput
    let lable
    let bindBodyClick = false
    switch (item.type) {
      case 'span':
        dealSpan(item)
        break;

      case 'text':
        dealText(item)
        break;

      case 'date':
        dealDatePicker(item)
        break;

      case 'checkbox':
        dealRcbox(item)
        break;

      case 'radio':
        dealRcbox(item)
        break;

      case 'select':
        const watch = item.profile.watch || item.watch
        thisInput = elements['#'+item.id]
        lable = elements[item.id]
        const ddMenu = elements['+'+item.id]  //下拉菜单容器
        let change = true

        const accessAttrs = ['key', 'id', 'name', 'value', 'text']

        // if (item.attr) {
        //   Object.keys(item.attr).forEach(key=>{
        //     if (accessAttrs.indexOf(key)>-1) {
        //       thisInput.setAttribute('data-'+key, item.attr[key])
        //     }
        //   })
        // }

        if (item.value) {
          if (item.type == 'select'){
            const _val = item.attr && (item.attr['text'] || item.value || item.attr['value'] || '')
            thisInput.value = _val
            // ctx.form[item.id] = item.attr&&item.attr['value']
          } else {
            ctx.form[item.id] = item.value
          }
        }

        !isSelect[item.id]
        ? isSelect[item.id] = { ...item, ddMenu: ddMenu }
        : ''
        
        if (!bindBodyClick) {
          bindBodyClick = true
          $('body').click(function(){
            $(this).find('.fkp-dd-list').each(function(ii, jtem){
              if ($(this).css('display') != 'none'){
                const inputid = $(this).siblings('.fkp-dd-input')[0].id
                $('#'+inputid).trigger('toggledd')
                $(this).hide()
              }
            })
            $(this).find('.time-icon').show()
            $(this).find('.time-clear').hide()
          })
        }

        if (watch) {
          $(thisInput).off('input').on('input', function(){
            forceDealWithUnion(item)
          })
        }

        $(thisInput).off('change').on('change', function(e){
          e.stopPropagation()
          const hasUnion = checkUnion({id: item.id}, dealWithUnion)
          if (hasUnion) {
            dealWatchs({id: thisInput.id})
          }
        })

        const _ctx = {
          toggle: function(){
            $(ddMenu).toggle()
          },
          value: function(val){
            ctx.form[item.id] = val
            thisInput.setAttribute('data-value', val)
            thisInput.value = val
          }
        }
        function selectHide(obj){
          $(obj).find('.fkp-dd-list').hide()
          $(obj).find('.time-icon').show()
          $(obj).find('.time-clear').hide()
        }
        $(elements[item.id]).off('toggledd').on('toggledd', function(){
          if (isFunction(itMtd)) {
            const willToggle = itMtd.call(_ctx, elements['+'+item.id])
            if (willToggle) $(ddMenu).show()
          } else {
            $(ddMenu).toggle()
          }
          if (watch) {
            forceDealWithUnion(item)
          }
        })
        $(lable).find('.fkp-dd').off('click').on('click', function(e){
          e.stopPropagation()
          // $('.fkp-dd-list').hide()
          // $(this).siblings().find('.fkp-dd-list').hide()
          const thisShow = $(this).find('.fkp-dd-list').css('display')
          if(thisShow !== 'none'){
            selectHide('body')
          }else{
            selectHide('body')
            $(elements[item.id]).trigger('toggledd')
          }
        })

        $(ddMenu).off('click').on('click', '.fkp-dd-option', function(e){
          e.stopPropagation()
          const theOption = this
          if ($(this).hasClass('select-disabled')) {
            
          } else {
            const _val = this.getAttribute('data-value')
            change = ctx.form[item.id] === _val ? false : true
  
            $(elements[item.id]).trigger('toggledd')
            if (change) {
              ctx.review(
                (item.id||item.name),
                function(){
                  return { 
                    value: _val||theOption.innerHTML,
                    text: theOption.innerHTML
                  }
                }
              )
              
              setTimeout(() => {
                ctx.form[item.id] = _val
                thisInput.setAttribute('data-value', _val)
                var _value = this.innerHTML
                escape.forEach((item)=>{
                  _value = _value.replace(item[0], item[1])
                })
                thisInput.value = _value
                $(thisInput).trigger('change')
              }, 200);
            }
          }
        })
        break;

      default:
        thisInput = elements['#'+item.id]
        const hasUnion = checkUnion({id: item.id}, dealWithUnion);
        if (hasUnion) {
          $(thisInput).off('input').on('input', function(e){
            ctx.form[item.id] = this.value
            if (isFunction(itMtd)) itMtd(this)  // ???
            dealWatchs({id: thisInput.id})
          })
        } else {
          $(thisInput).off('input').on('input', function(e){
            if (isFunction(itMtd)) itMtd(this)  // ???
            ctx.form[item.id] = this.value
          })
        }
    }
  })


  /*
   * 处理union动作
   * unionAry  {Array}  匹配到的 input 元素
   * data {JSON}  父级下拉选项的值  val, txt, attr
   * 支持异步数据处理
   */
  function dealWithUnion(unionAry, data){
    unionAry.forEach( unionObj => {
      const src_id = unionObj.id
      let target_id = unionObj.target.id
      let isCheckBoxOrRadioBox = false
      if (unionObj.target.type == 'radio' || unionObj.target.type == 'checkbox' ){
        target_id = unionObj.target.name
        isCheckBoxOrRadioBox = true
      }

      const targetDom = elements['#'+target_id] || elements[target_id]
      const srcDom = elements['#'+src_id] || elements[src_id]

      const _ctx = {
        srcId: src_id,
        targetId: target_id,
        type: unionObj.target.type,
        src: srcDom,
        target: targetDom,
        elements: ctx.elements,
        values: ctx.values,
        context: ctx
      }
      // 清空目标的值
      if (!ctx.allocation[target_id].emptyUnionTarget){
        if (src_id != target_id) {
          let targetIt = {}
          targetIt[target_id] = '';
          ctx.values(targetIt)
        }
      }

      // target 为select类型
      function options(data, text){
        let xxx = isSelect[target_id]
        ctx.$updateselect({
          index: xxx._index,
          options: data
        })
      }
      
      let xctx = {
        value: function(val, text){
          let targetValue = {}
          targetValue[target_id] = val
          if (isSelect[target_id]) options(val, text)  // 目标对象是 select类型
          else {
            // targetValue[target_id] = isCheckBoxOrRadioBox ? allocation[target_id].value : '';
            ctx.values(targetValue)
          }
        }
      }

      if (isSelect[target_id]) {
        xctx.options = function(val, text){
          options(val, text)
        }
      }


      function setTargetDpicker(dom, targetid, type, val){
        // let preAsset = allocation[targetid].profile.assets
        // if (typeof type == 'object') {
        //   preAsset = _.merge(preAsset, type)
        // } else {
        //   preAsset[type] = val
        // }
        // const asset = _.merge({}, dpickerAssets, preAsset)
        // $(dom).datetimepicker(asset)
        $(dom).datetimepicker(type, val)
      }
      let ctx_dpicker = {
        refresh: function(type, val){
          setTargetDpicker(targetDom, target_id, type, val)
        },
        picker: function(type, val){
          setTargetDpicker(targetDom, target_id, type, val)
        }
      }

      if (unionObj.target.type == 'date') {
        xctx = ctx_dpicker
      }

      // 执行关联方法
      if (src_id == target_id) {
        if (isFunction(unionObj.cb)) unionObj.cb.call(xctx, _ctx)
        return
      }

      if (isFunction(unionObj.cb)) unionObj.cb.call(xctx, _ctx)
      else if(unionObj.target.type == 'date'){
        return
      }
      else {
        let targetValue = {}
        targetValue[target_id] = srcDom.value
        if (isSelect[target_id]) {
          switch (allocation[src_id].type) {
            case 'select':
              /* 不应该到这里来，应该去cb */
            break;
            case 'radio':
              /* 不应该到这里来，应该去cb */
            break;
            case 'checkbox':
              /* 不应该到这里来，应该去cb */
            break;
            default:
              /* 不应该到这里来，应该去cb */
              targetDom.value = srcDom.value
              targetDom.setAttribute('data-value', srcDom.value)
          }
        } else {
          ctx.values(targetValue)
        }
      }
    })
  }
}

module.exports = function(ctx, intent){
  return select(intent, ctx)
}
