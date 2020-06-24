import {validator, strLen } from 'libs'

const valide = validator()

//注册页面表单校验
const valideMethod = {
  reguLib: {
    verify: /^[a-z\d]{4}$/i,
    imgCode: /^[0-9a-zA-Z]{4}$/,
    fullname: /^[\u4e00-\u9fa5]{2,5}$/,
    realName: /(^[\u4e00-\u9fa5]{2,5}$)|(^(?!\s)(?!.*?\s$)[a-zA-Z\s]{2,20})$/,
    realNameCn: /^[\u4e00-\u9fa5]{2,5}$/,
    address: /^[\u4e00-\u9fa5]([a-zA-Z0-9_\u4e00-\u9fa5\-\(\)\（\）]){2,29}$/,
    convention: /^[a-zA-Z0-9_\u4e00-\u9fa5]{3,}$/,
    companyName: /^[\u4e00-\u9fa5]([a-zA-Z0-9_\u4e00-\u9fa5\-\(\)\（\）]){3,19}$/,
    hotelorScenicName: /^[\u4e00-\u9fa5]([a-zA-Z0-9_\u4e00-\u9fa5\-\(\)\（\）]){1,19}$/,
    jobs: /^[a-zA-Z0-9\u4e00-\u9fa5\(\)\（\）]{2,10}$/,
    licenseCode: /^[a-zA-Z0-9]{4,20}$/,
    memberName: /^[A-Za-z0-9][\w]{4,11}$/,
    uname: /^(?=.*[A-Za-z])[A-Za-z0-9\:]{6,25}$/,
    accountName: /^(?=.*[A-Za-z])[A-Za-z0-9]{6,12}$/,
    zhname: /^(?=.*[A-Za-z])[A-Za-z0-9]{3,12}$/,
    childAccNo: /^[A-Za-z0-9_]{6,12}$/,
    accNo: /^[A-Za-z0-9_]{5,12}$/,
    companyId: /^[0-9]{3,15}$/,
    mobile: /^1[3|4|5|6|7|8|9]{1}\d{9}$/,
    hkMobile: /^([5|6|9])\d{7}$/,
    mcMobile: /^([6])\d{7}$/,
    hk_Mobile: /^(852)([5|6|9]{1})\d{7}$/,  // 带区号香港手机号码
    mc_Mobile: /^(8536)\d{7}$/,             // 带区号澳门手机号码
    qq: /^[1-9]([0-9]{4,10})$/,
    email: /^[\.a-zA-Z0-9_=-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    smscode: /^\d{6}$/,
    idcard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
    isntMlIdCard: /(^[A-Z]{1}[0-9]{6}(\()(\d|A)(\))$)|(^(1|5|7)([0-9]{6})(\()(\d)(\))$)/,
    hkIDcard: /^[A-Z]{1}[0-9]{6}(\()(\d|A)(\))$/,
    mcIDcard: /^(1|5|7)([0-9]{6})(\()(\d)(\))$/,
    twIDcard: /[A-Z][0-9]{9}/,
    companyCode: /^[0-9]{5,15}$/,
    accountNo: /^[a-zA-Z0-9][\w]{5,11}$/,
    departmentName: /^([a-zA-Z0-9_\u4e00-\u9fa5\-\.]{2,10})$/,
    notTarget: /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5\，\。\,\.\、\/\\]+$/,
    isNumber: /^[\d]+$/,
    telephone: /^[0-9-()（）]{7,18}$/,
    // isXSS: /<\W*script.*?<\/script>/,
    // isXSS: /<([a-z\d]+)([^<]+)*(?:>(.*)<\/\1>|\s+\/>)/,
    // isXSS: /<([a-z\d]+)([^<]+)*[>]?(.*)(<\/\1>|\s+\/>)/,
    isXSS: /<(\S*?)[^>]*>.*?<\/\1>|<.*? \/>/,
    lineName: /^[^\x00-\xff]+([\+][^\x00-\xff]*)*$/,
    mobileAndPhone: /(?:^0{0,1}1[345789]\d{9}$)|(?:^0[1-9]{1,2}\d{1}\-{0,1}[2-9]\d{6,7}$)|(?:^0[1-9]{1,2}\d{1}\-{0,1}[2-9]\d{6,7}[\-#]{1}\d{1,5}$)/,
    baseTel: /^(?=.*[\d])[\+\-0-9]{7,15}$/,
    basePhone: /^(?=.*[\d])[\+\-0-9]{7,15}$/,
    price: /^([1-9]\d*(\.\d{1,2})?|0\.[1-9]\d|0\.0[1-9])$/,
    invitationCode: /^[0-9]{6,10}$/,
    specialServiceListOptionRemark: /^((?!<|>|\\).){1,500}$/, //散房 - 特殊要求备注
    receiptHeadName: /^((?!<|>|\\).){1,100}$/, //散房 - 发票抬头
    taxpayerNumber: /^[a-zA-Z0-9]{15}$|^[a-zA-Z0-9]{18}$|^[a-zA-Z0-9]{20}$/, //散房 - 纳税人识别号
    incomingMail: /^[\.a-zA-Z0-9_=-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,  //散房 - 收票邮箱
    receiptRemark: /^((?!<|>|\\).){1,200}$/, //散房 - 发票备注
    cnInput: /^[^<>\\]+$/ /* /[^%&',;=?$\x22]+[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g */ , //输入中文校验
    cnInputnum: /^(0|([1-9]\d{0,2}))$/ //输入中文校验
    
  },
  onleAccountName: function (val, regu) {
    if (!val) return false
    return valideMethod.reguLib.onleAccountName.test(val) ? 'onleAccountName' : valideMethod.reguLib.mobile.test(val) ? 'mobile' : false
  },
  username: function (val, regu) {
    if (!val) return false
    return valideMethod.reguLib.email.test(val) ? 'email' : valideMethod.reguLib.mobile.test(val) ? 'mobile' : false
  },
  uname: function (val, regu) {
    if (!val) return false
    return valideMethod.reguLib.email.test(val) ? 'email' : valideMethod.reguLib.mobile.test(val) ? 'mobile' : valideMethod.reguLib.uname.test(val) ? 'uname' : false
  },
  password: function (passwd, reg) {
    const pwdRegex = /^(?=.*[a-zA-Z])(?=.*[\d])(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z0-9\S]{6,16}$/
    if (!pwdRegex.test(passwd)) return false
    let val = passwd, level
    if (val) {
      level = (val.length > 5) ? 0 + (val.length > 7) + (/[a-z]/.test(val) && /[A-Z]/.test(val)) + (/\d/.test(val) && /\D/.test(val)) + (/\W/.test(val) && /\w/.test(val)) + (val.length > 12) : 0;
      if (val.length > 20 || /\s/.test(val)) level = 0
      if (/^[0-9]+$/.test(val)) level = 0
      if (/^[a-zA-Z]+$/.test(val)) level = 0
      return level
    } else { return false }
  },
  repassword: function (val) {
    return val ? (val == this.value) : false
  },
  likeAccount: function (val) {
    return val ? (val != this.value) : true
  },
  isNotContais: function (val) {
    if (val) {
      if (this.value) {
        if (val.indexOf(this.value) == -1) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    } else {
      return true
    }
  },
  verify: function (val, regu) {
    return val ? (valideMethod.reguLib.verify.test(val) ? 'verify' : false) : false
  },
  imgCode: function (val, regu) {
    return val ? (valideMethod.reguLib.imgCode.test(val) ? 'imgCode' : false) : false
  },
  longishStr: function (val) {
    return val ? (strLen(val) >= 6 ? 'string' : false) : false
  },
  fullname: function (val) {
    return val ? (valideMethod.reguLib.fullname.test(val) ? 'fullname' : false) : false
  },
  realName: function (val) {
    return val ? (valideMethod.reguLib.realName.test(val) ? 'realName' : false) : false
  },
  realNameCn: function (val) {
    return val ? (valideMethod.reguLib.realNameCn.test(val) ? 'realNameCn' : false) : false
  },
  address: function (val) {
    return val ? (valideMethod.reguLib.address.test(val) ? 'address' : false) : false
  },
  convention: function (val) {
    return val ? (valideMethod.reguLib.convention.test(val) ? 'convention' : false) : false
  },
  companyName: function (val) {
    return val ? (valideMethod.reguLib.companyName.test(val) ? 'companyName' : false) : false
  }, 
  hotelorScenicName: function (val) {
    return val ? (valideMethod.reguLib.hotelorScenicName.test(val) ? 'hotelorScenicName' : false) : false
  },
  jobs: function (val) {
    return val ? (valideMethod.reguLib.jobs.test(val) ? 'jobs' : false) : false
  },
  licenseCode: function (val) {
    return val ? (valideMethod.reguLib.licenseCode.test(val) ? 'licenseCode' : false) : false
  },
  memberName: function (val) {
    return val ? (valideMethod.reguLib.memberName.test(val) ? 'memberId' : false) : false
  },
  accountName: function (val) {
    return val ? (valideMethod.reguLib.accountName.test(val) ? 'accountName' : false) : false
  },
  zhname: function (val) {
    return val ? (valideMethod.reguLib.zhname.test(val) ? 'zhname' : false) : false
  },
  cnInput: function (val) {
    return val ? (valideMethod.reguLib.cnInput.test(val) ? true : false) : true 
  },
  cnInputnum: function (val) {
    return val ? (valideMethod.reguLib.cnInputnum.test(val) ? false : true) : false
  },
  childAccNo: function (val) {
    return val ? (valideMethod.reguLib.childAccNo.test(val) ? 'childAccNo' : false) : false
  },
  accNo: function (val) {
    return val ? (valideMethod.reguLib.accNo.test(val) ? 'accNo' : false) : false
  },
  companyId: function (val) {
    return val ? (valideMethod.reguLib.companyId.test(val) ? 'companyId' : false) : false
  },
  mobile: function (val) {
    return val ? (valideMethod.reguLib.mobile.test(val) ? 'mobile' : false) : false
  },
  hkMobile: function (val) {
    return val ? (valideMethod.reguLib.hkMobile.test(val) ? 'mobile' : false) : false
  },
  mcMobile: function (val) {
    return val ? (valideMethod.reguLib.mcMobile.test(val) ? 'mobile' : false) : false
  },
  hk_Mobile: function (val) {
    return val ? (valideMethod.reguLib.hk_Mobile.test(val) ? 'mobile' : false) : false
  },
  mc_Mobile: function (val) {
    return val ? (valideMethod.reguLib.mc_Mobile.test(val) ? 'mobile' : false) : false
  },
  smscode: function (val) {
    return val ? (valideMethod.reguLib.smscode.test(val) ? 'smscode' : false) : false
  },
  smsCode: function (val) {
    return val ? (valideMethod.reguLib.smscode.test(val) ? 'smscode' : false) : false
  },
  qq: function (val) {
    return _.isEmpty(val) || valideMethod.reguLib.qq.test(val);
  },
  QQ: function (val) {
    return valideMethod.reguLib.qq.test(val);
  },
  email: function (val) {
    return val ? (valideMethod.reguLib.email.test(val) ? 'email' : false) : false
  },
  idcard: function (val) {
    return val ? (valideMethod.reguLib.idcard.test(val) ? 'idcard' : false) : false
  },
  isntMlIdCard: function (val) {
    return val ? (valideMethod.reguLib.isntMlIdCard.test(val) ? 'isntMlIdCard' : false) : false

  },
  companyCode: function (val) {
    return val ? (valideMethod.reguLib.companyCode.test(val) ? 'companyCode' : false) : false
  },
  accountNo: function (val) {
    return val ? (valideMethod.reguLib.accountNo.test(val) ? 'accountNo' : false) : false
  },
  departmentName: function (val) {
    return val ? (valideMethod.reguLib.departmentName.test(val) ? 'departmentName' : false) : false
  },
  notTarget: function (val) {
    return val ? (valideMethod.reguLib.notTarget.test(val) ? true : false) : false
  },
  isNumber: function (val) {
    return val ? (valideMethod.reguLib.isNumber.test(val) ? true : false) : false
  },
  isANum: function (val) {
    return val ? (isNaN(val) ? false : true) : false
  },
  telephone: function (val) {
    return val ? (valideMethod.reguLib.telephone.test(val) ? true : false) : false
  },
  isXSS: function (val) {//需要先判断val是否为空再使用
    return valideMethod.reguLib.isXSS.test(val) ? true : false
  },
  lineName: function (val) {
    return val ? (valideMethod.reguLib.lineName.test(val) ? true : false) : false
  },
  arrayNotEmpty: function (val) {
    return Array.isArray(val) ? (val.length != 0 ? true : false) : false
  },
  baseText: function (val) {//返回校验是否可安全保存的结果
    return val ? (valideMethod.reguLib.isXSS.test(val) ? false : true) : false
  },
  remarkBaseText: function (val) {
    return val ? valideMethod.baseText(val) : true;
  },
  mobileAndPhone: function (val) {
    return val ? (valideMethod.reguLib.mobileAndPhone.test(val) ? true : false) : false
  },
  baseTel: function (val) {
    return val ? (valideMethod.reguLib.baseTel.test(val) ? true : false) : false
  },
  basePhone: function (val) {
    return val ? (valideMethod.reguLib.basePhone.test(val) ? true : false) : false
  },
  price: function (val) {
    return val ? (valideMethod.reguLib.price.test(val) ? true : false) : false
  },
  invitationCode: function (val) {
    return val ? (valideMethod.reguLib.invitationCode.test(val) ? true : false) : false
  },
  notEmpty: function (val) {
    return val ? 'notEmpty' : false
  },
  specialServiceListOptionRemark: function (val) {
    return val ? (valideMethod.reguLib.specialServiceListOptionRemark.test(val) ? true : false) : false
  },
  receiptHeadName: function (val) {
    return val ? (valideMethod.reguLib.receiptHeadName.test(val) ? true : false) : false
  },
  taxpayerNumber: function (val) {
    return val ? (valideMethod.reguLib.taxpayerNumber.test(val) ? true : false) : false
  },
  incomingMail: function (val) {
    return val ? (valideMethod.reguLib.incomingMail.test(val) ? true : false) : false
  },
  receiptRemark: function (val) {
    return val ? (valideMethod.reguLib.receiptRemark.test(val) ? true : false) : false
  },
}

//提交总校验
const checkForm = {
  // 个人表单
  pInspect: function (data) {
    let state1 = valide(data.realNameCn, 'truename', valideMethod.fullname)
                        (data.sex, 'gender', valideMethod.notEmpty)
                        (data.address, 'fulladdress', valideMethod.convention)
                        (data.cardType, 'realtype', valideMethod.notEmpty)
                        (data.safeMobile, 'phone', valideMethod.mobile)
                        (data.smsCode, 'vcode', valideMethod.smscode)
                        ((query, errs) => {
                          let errs_arr = []
                          if (errs.length != 0) {
                            for (let i = 0; i < errs.length; i++) {
                              errs_arr.push(errs[i].key)
                            }
                          }
                          return errs_arr
                        })
    let state2
    if (data.cardType == 1) {
      state2 = valide(data.provinceCode, 'province', valideMethod.notEmpty)
                      (data.cardNo, 'cardnumber', valideMethod.idcard)
                      ((query, errs) => {
                        let errs_arr = []
                        if (errs.length != 0) {
                          for (let i = 0; i < errs.length; i++) {
                            errs_arr.push(errs[i].key)
                          }
                        }
                        return errs_arr
                      })
    } else {
      state2 = valide(data.cityCode, 'city', valideMethod.notEmpty)
                      (data.cardPhotoZM, 'cardPhotoZM', valideMethod.notEmpty)
                      (data.cardPhotoFM, 'cardPhotoFM', valideMethod.notEmpty)
                      (data.cardNo, 'cardnumber', valideMethod.curIDcard)
                      ((query, errs) => {
                        let errs_arr = []
                        if (errs.length != 0) {
                          for (let i = 0; i < errs.length; i++) {
                            errs_arr.push(errs[i].key)
                          }
                        }
                        return errs_arr
                      })
    }

    let state3
    if (data.regCompanyOperator == 2) {
      state3 = valide(data.regCompanyOperator, 'employee', valideMethod.notEmpty)
                    (data.belongComanyName, 'companyName', valideMethod.longishStr)
                    (data.postName, 'position', valideMethod.longishStr)
                    (data.businessSphere, 'scope', valideMethod.notEmpty)
                    ((query, errs) => { 
                      let errs_arr = []
                      if (errs.length != 0) {
                        for (let i = 0; i < errs.length; i++) {
                          errs_arr.push(errs[i].key)
                        }
                      }
                      return errs_arr
                    })
    } else {
      state3 = valide(data.enterpriseCode, 'enterprisecode', valideMethod.curIDcard)
                    ((query, errs) => {
                      let errs_arr = []
                      if (errs.length != 0) {
                        for (let i = 0; i < errs.length; i++) {
                          errs_arr.push(errs[i].key)
                        }
                      }
                      return errs_arr
                    })
    }
    const state = state1.concat(state2, state3)
    return state
  },
  // 企业表单
  cInspect: function (data) {
    let state1 = valide(data.address, 'c-address', valideMethod.longishStr)
                        (data.companyName, 'c-fullname', valideMethod.longishStr)
                        (data.businessSubjectCharacter, 'c-bizScope', valideMethod.notEmpty)
                        (data.businessLicencePhoto, 'c-businessLicencePhoto', valideMethod.notEmpty)
                        (data.isMainland, 'companytype', valideMethod.notEmpty)
                        (data.principalName, 'm-truename', valideMethod.fullname)
                        (data.principalTel, 'm-phone', valideMethod.mobile)
                        (data.smsCode, 'm-code', valideMethod.smscode)
                        (data.principalEmail, 'm-email', valideMethod.email)
                        (data.principalQq, 'm-qq', valideMethod.qq)
                        ((query, errs) => {
                          let errs_arr = []
                          if (errs.length != 0) {
                            for (let i = 0; i < errs.length; i++) {
                              errs_arr.push(errs[i].key)
                            }
                          }
                          return errs_arr
                        })

    let state2, state3
    if (data.isMainland == 1) {
      state2 = valide(data.provinceCode, 'c-province', valideMethod.notEmpty)
                      (data.businessModel, 'c-bizModel', valideMethod.notEmpty)
                      (data.businessLicenceCode, 'c-number', valideMethod.companyCode)
                      ((query, errs) => {
                        let errs_arr = []
                        if (errs.length != 0) {
                          for (let i = 0; i < errs.length; i++) {
                            errs_arr.push(errs[i].key)
                          }
                        }
                        return errs_arr
                      })
      if (data.businessModel == 3) {
        state3 = valide(data.brandName, 'c-brand', valideMethod.longishStr)
                        ((query, errs) => {
                          let errs_arr = []
                          if (errs.length != 0) {
                            for (let i = 0; i < errs.length; i++) {
                              errs_arr.push(errs[i].key)
                            }
                          }
                          return errs_arr
                        })
      } else {
        state3 = []
      }

    } else { 
      state2 = valide(data.cityCode, 'c-city', valideMethod.notEmpty)
                      (data.businessLicenceCode, 'c-number', valideMethod.curIDcard)
                      ((query, errs) => {
                        let errs_arr = []
                        if (errs.length != 0) {
                          for (let i = 0; i < errs.length; i++) {
                            errs_arr.push(errs[i].key)
                          }
                        }
                        return errs_arr
                      })
      state3 = []
    }
    const state = state1.concat(state2, state3)
    return state
  },

  // 账号中心--子账号管理--新建员工表单
  addEmployeeInspect: function (data) {
    const state1 = valide(data.isMainland, 'realtype', valideMethod.notEmpty)
                          (data.childAccNo, 'e-add-accountname', valideMethod.accountNo)
                          (data.childAccPwd, 'e-add-password', valideMethod.password)
                          (data.childAccRepeatPwd, 'e-add-affirm', valideMethod.repassword.bind({ value: data.childAccPwd }))
                          (data.childAccName, 'e-add-name', valideMethod.fullname)
                          // (data.sex, 'sextype', valideMethod.notEmpty)
                          // (data.mobile, 'e-add-people', valideMethod.mobile)
                          // (data.childAccEmail, 'e-add-email', valideMethod.email)
                          // (data.childAccQq, 'e-add-qq', valideMethod.qq)
                          (data.departmentId, 'e-add-class', valideMethod.notEmpty)
                          (data.postIds, 'e-add-post', valideMethod.notEmpty)
                          (data.isManager, 'classadmin', valideMethod.notEmpty)
                          (data.memberStatus, 'accountstates', valideMethod.notEmpty)
                          ((query, errs) => {
                            let errs_arr = []
                            if (errs.length != 0) {
                              for (let i = 0; i < errs.length; i++) {
                                errs_arr.push(errs[i].key)
                              }
                            }
                            return errs_arr
                          })
    // let state2
    // if(data.isMainland == 1){
    //   state2 = valide(data.cardNo, 'e-add-number', valideMethod.idcard)
    //                   ((query, errs) => {
    //                     let errs_arr = []
    //                     if(errs.length !=0 ){
    //                       for(let i=0; i<errs.length; i++){
    //                         errs_arr.push(errs[i].key)
    //                       }
    //                     }
    //                     return errs_arr
    //                   })
    // }else{
    //   state2 = valide(data.cardNo, 'e-add-number', valideMethod.curIDcard)
    //                   (data.cardPhotoZM, 'cardPhotoZM', valideMethod.notEmpty)
    //                   (data.cardPhotoFM, 'cardPhotoFM', valideMethod.notEmpty)
    //                   ((query, errs) => {
    //                     let errs_arr = []
    //                     if(errs.length !=0 ){
    //                       for(let i=0; i<errs.length; i++){
    //                         errs_arr.push(errs[i].key)
    //                       }
    //                     }
    //                     return errs_arr
    //                   })
    // }
    // const state = state1.concat(state2)
    return state1
  },

  //供应商--店铺设置
  setStoreInspect: function (data) {
    const state = valide(data.shopLogo, 'shopLogo', valideMethod.notEmpty)
                        (data.businessTime, 'businessTime', valideMethod.notEmpty)
                        // (data.contactName, 'contactName', valideMethod.shopInfoContacts)
                        (data.contactMobile, 'contactMobile', valideMethod.basePhone)
                        // (data.contactTel, 'contactTel', valideMethod.baseTel)
                        // (data.contactQq, 'contactQq', valideMethod.QQ)
                        // (data.contactEmail, 'contactEmail', valideMethod.email)
                        ((query, errs) => {
                          let errs_arr = []
                          if (errs.length != 0) {
                            for (let i = 0; i < errs.length; i++) {
                              errs_arr.push(errs[i].key)
                            }
                          }
                          return errs_arr
                        })
    return state
  },

  //供应信息基本信息表单校验
  //手机电话同时匹配  (?:^0{0,1}1[35]\d{9}$)|(?:^0[1-9]{1,2}\d{1}\-{0,1}[2-9]\d{6,7}$)|(?:^0[1-9]{1,2}\d{1}\-{0,1}[2-9]\d{6,7}[\-#]{1}\d{1,5}$)   匹配手机格式：13800138000 匹配电话格式：02065430457
  releaseSplInspect: function (data) {
    const state1 = valide(data.productTitle, 'b-line-name', valideMethod.lineName) // 标题前缀
                        (data.productTheme, 'b-title-theme', valideMethod.baseText) //标题主题
                        (data.suppplyProductName, 'b-supply-name', valideMethod.baseText)  //供应商定义编号 产品别名
                        (data.pcLineMapper.days, 'b-days', valideMethod.notTarget) //天数
                        (data.pcLineMapper.nights, 'b-nihgts', valideMethod.notTarget) //晚数
                        (data.advertPeriod, 'b-circle', valideMethod.notEmpty)  //投放周期
                        (data.pcLineMapper.departCityCode, 'b-place', valideMethod.notEmpty) //出发地
                        (data.pcLineMapper.destination, 'b-destination', valideMethod.notEmpty) //目的地
                        (data.pcLineMapper.lineAttraction, 'sellingPoint', valideMethod.baseText) //线路卖点
                        (data.productImages, 'productImages', valideMethod.notEmpty) //产品图片
                        ((query, errs) => {
                          let errs_arr = []
                          if (errs.length != 0) {
                            for (let i = 0; i < errs.length; i++) {
                              errs_arr.push(errs[i].key)
                            }
                          }
                          return errs_arr
                        })
    //todo 联系方式
    let contact_state = {}
    data.productContacts.map((item, index) => {
      const state = valide(item.contactName, 'b-people', valideMethod.fullname)
                          (item.contactTel, 'b-phone', valideMethod.mobileAndPhone)
                          (item.contactQq, 'b-qq', valideMethod.qq)
                          ((query, errs) => {
                            let errs_arr = []
                            if (errs.length != 0) {
                              for (let i = 0; i < errs.length; i++) {
                                errs_arr.push(errs[i].key)
                              }
                            }
                            return errs_arr
                        })
      contact_state[index + 1] = state
    })
    let state2 = []
    data.productProperties.map((item, index) => {
      let err_key = valide(item.productPropertyValueIds, item.productPropertyName, valideMethod.notEmpty)
                            ((query, errs) => {
                              if (errs.length) {
                                state2.push(errs[0].key)
                              }
                            })
    })
    const state = { errs: state1, contactErrs: contact_state, props: state2 }
    return state
  },
  //发布供应所有信息校验
  supplyProductInspect: function (data) {
    const t1_data = {
      pcLineMapper: data.pcLineMapper,
      productProperties: data.productProperties,
      productContacts: data.productContacts,

      productTitle: data.productTitle,
      productTheme: data.productTheme,
      suppplyProductName: data.suppplyProductName,
      advertPeriod: data.advertPeriod,
      productImages: data.productImages,

    }
    const t1_state = checkForm.releaseSplInspect(t1_data)
    const t2_state = valide(data.pcLineSchedules, '价格日历', valideMethod.notEmpty)
                            ((query, errs) => {
                              let errs_arr = []
                              if (errs.length != 0) {
                                for (let i = 0; i < errs.length; i++) {
                                  errs_arr.push(errs[i].key)
                                }
                              }
                              return errs_arr
                            })
    const t3_state = data.pcLinePlans.map((item, index) => {
      return valide(item.title, 'schedule-title', valideMethod.baseText)
                    (item.trafficIntro, 'schedule-trafficIntro', valideMethod.baseText)
                    (item.breakfastMemo, 'schedule-breakfastMemo', valideMethod.baseText)
                    (item.lunchMemo, 'schedule-lunchMemo', valideMethod.baseText)
                    (item.dinnerMemo, 'schedule-dinnerMemo', valideMethod.baseText)
                    (item.accommodationType, 'schedule-accommodationType', valideMethod.notEmpty)
                    (item.customPoiName, 'schedule-customPoiName', valideMethod.notEmpty)
                    (item.hotelName, 'schedule-hotelName', valideMethod.baseText)//酒店名称
                    (item.hotelGrade, 'schedule-hotelGrade', valideMethod.notEmpty)
                    (item.planDescript, 'schedule-planDescript', valideMethod.baseText)
                    (item.planImages, 'schedule-planImages', valideMethod.notEmpty)
                    ((query, errs) => {
                      let errs_arr = []
                      if (errs.length != 0) {
                        for (let i = 0; i < errs.length; i++) {
                          errs_arr.push(errs[i].key)
                        }
                      }
                      return errs_arr
                    })
    })
    const t4_state = valide(data.pcLineMapper.priceInfo, '费用说明', valideMethod.baseText)
                            ((query, errs) => {
                              let errs_arr = []
                              if (errs.length != 0) {
                                for (let i = 0; i < errs.length; i++) {
                                  errs_arr.push(errs[i].key)
                                }
                              }
                              return errs_arr
                            })
    const t5_state = valide(data.pcLineMapper.visaInfo, '签证信息', valideMethod.baseText)
                            ((query, errs) => {
                              let errs_arr = []
                              if (errs.length != 0) {
                                for (let i = 0; i < errs.length; i++) {
                                  errs_arr.push(errs[i].key)
                                }
                              }
                              return errs_arr
                            })
    const t6_state = valide(data.pcLineMapper.bookingInfo, '预订须知', valideMethod.baseText)
                            ((query, errs) => {
                              let errs_arr = []
                              if (errs.length != 0) {
                                for (let i = 0; i < errs.length; i++) {
                                  errs_arr.push(errs[i].key)
                                }
                              }
                              return errs_arr
                            })

    const state = {
      t1: t1_state,
      t2: t2_state,
      t3: t3_state,
      t4: t4_state,
      t5: t5_state,
      t6: t6_state,
    }
    return state
  }

}

const checkTextareaNum = function (inputForm, inputId, inputnum) {         //限制textarea的字数
  function getLength(str) {//处理输入的内容是文字还是字母的函数
    return String(str).replace(/[^\x00-\xff]/g, 'aa').length;
  };
  setTimeout(() => {
    const explain = '#' + inputForm.allocation[inputId].id
    $(explain).find('textarea').off('keyup').on('keyup', function () {
      let curLenght = Math.ceil(getLength($(explain).find('textarea').val()) / 2)
      if (curLenght > inputnum) {
        let num = $(explain).find('textarea').val().substr(0, inputnum);
        $(explain).find('textarea').val(num);
      } else {
        $(explain).find(".countName").text($(explain).find('textarea').val().length)
      }
    })
  }, 200)
}

// const checkInputNum = function(inputForm, inputId, inputnum){         //限制input的字数
//   function getLength(str){//处理输入的内容是文字还是字母的函数
//     return String(str).replace(/[^\x00-\xff]/g,'aa').length;
//   };
//   setTimeout(()=> {
//     const explain = '#'+inputForm.allocation[inputId].id
//     $(explain).attr('maxlength', inputnum)
//     $(explain).off('keyup').on('keyup', function(){
//       let curLenght = Math.ceil(getLength($(explain).val())/2)
//       if(curLenght > inputnum){
//         let num =$(explain).val().substr(0, inputnum);
//         $(explain).val(num);
//       }else{
//         $(explain).parents('.fkp-content').find(".countName").text($(explain).val().length)
//       }
//     })
//   },200)
// }
const checkInputNum = function ($obj) {

  let inputnum = $obj.prop('maxlength');
  let curLenght = Math.ceil(($obj.val() + '').replace(/[^\x00-\xff]/g, 'aa').length / 2)
  if (curLenght > inputnum) {
    $obj.val($obj.val().substr(0, inputnum));
  } else {
    $obj.parent().parent().find(".countName").text($obj.val().length);
  }
}

export { valideMethod, checkForm, checkTextareaNum, checkInputNum }
