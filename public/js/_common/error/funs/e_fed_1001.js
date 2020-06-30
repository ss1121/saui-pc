import { tips } from 'component/client'

module.exports = (res, errInfo) => {
  tips(errInfo, { type: 'error' })
  setTimeout(() => {
    window.location.reload()
  }, 3000)
}