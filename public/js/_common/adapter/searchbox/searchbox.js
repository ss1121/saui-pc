import {form} from 'component/client'

function searchbox(params) {
  const listClass = params.listClass
  const data = params.data || []
  
  const formWrap = form({
    data: data, 
    listClass: 'item-column searchbox-form ' +listClass,
    itemClass: 'inputItem-column'
  })

  return formWrap
}

module.exports = {
  searchbox
}
