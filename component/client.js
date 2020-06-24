import tips from './modules/msgtips'
import modal from './modules/modal'
import sticky from './modules/sticky'
import slip from './modules/slip'
import router from './modules/router'
import countdown from './modules/countdown'
import stars from './modules/stars'
import count from './modules/count'
import transfer from './modules/transfer'
import popup from './modules/popup'
import timepicker from './modules/timepicker'
import scale from './modules/scale'
import ruler from './modules/ruler'
import paging from './modules/paging'
import loading from './modules/loadingx'
import slide from './modules/slide'
import starsx from './modules/starsx'
import * as uploader from './modules/upload'
import datepick from './modules/datepick'
import calendarx from './modules/calendarx'
import editor from './modules/editor'
import list from './modules/list'

// import combinex from './mixins/combinex'
import * as Sync from './index'

const combineX = Aotoo.combinex
const wrap = Aotoo.wrap

function wrapItem(comp, opts, cb){
  return wrap(comp, opts, cb)
}

module.exports = {
  tips,
  modal,
  sticky,
  slip,
  router,
  wrapItem,
  combineX,
  uploader,
  countdown,
  stars,
  count,
  transfer,
  popup,
  timepicker,
  paging,
  loading,
  slide,
  scale,
  ruler,
  starsx,
  datepick,
  calendarx,
  editor,
  list,
  ...Sync
}
