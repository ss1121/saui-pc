import {form} from 'component/client'

const FormData = [
  {
    title: '',
    input: {
      id: 'username',
      type: 'text',
      placeholder: '邮箱/用户名/手机号',
      required: true,
    }
  },
  {
    title: '',
    input: {
      id: 'psw',
      type: 'password',
      placeholder: '邮箱/密码/手机号',
      required: true
    }
  },
  {
    title: '',
    input: [
      { id: 'code', type: 'text', placeholder: '请输入验证码' },
      { id: 'codeImage', type: 'span', value: <img src='/images/saui-logo.png' />, itemClass: 'item-code'}
    ],
    multiplyClass: 'ss-relative'
  },
  // {
  //   title: '',
  //   input: {
  //     type: 'checkbox',
  //     title: ['两周内自动登录'],
  //     name:  'checkbox',
  //     value: ['1'],
  //     required: true
  //   },
  // },
  {
    title: '',
    input: {
      id: 'btn',
      type: 'span',
      value: <button className='ss-button btn-default'>立即登录</button>,
      itemClass: 'item-btn'
    }
  },
]
const loginfrom = form({
  data: FormData, 
  listClass: 'login-form'
})

const Login = Aotoo.wrap(
  <div className='pages-login'>
    <div className='pages-login-body'>
      <img src='/images/logo.png' className='pages-login-logo'/>
      <img src='/images/login-pic.png' className='pages-login-pic' />
      {loginfrom.render()}
    </div>
    <p className='item-copyright'>Copyright © 2016-2018 组团助手 版权所有 粤ICP备17128641号 粤公安备44040402000069号</p>
  </div>
  , function(dom) {
    $('#username').focus(function () {
      // loginfrom.removeWarn('username')
    }).blur(function () {
      const val = $(this).val().trim()
      if (val == '') {
        loginfrom.addWarn('username', '请输入登录账号', {class: 'error'})
      }
    })
  }
)

Aotoo.render(<Login />, 'login')
