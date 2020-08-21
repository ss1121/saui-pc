require('commonjs/pages_head')

const routerCfg = require('commonjs/page_router')

const data = require('./indexData')       //模拟router菜单数据

/********页面 路径***/
//欢迎页
import welcome from './welcome'
//会员
import member from './member'
//分销商
import agent_apply from './agent/apply'                 //申请列表
import agent_apply_check from './agent/apply_check'     //审核
// import agent_apply_detail from './agent/apply_detail'   //详情
// import agent_apply_edit from './agent/edit'             //修改
/********页面 路径 end***/
const tmpRouter = {
  welcome: welcome,
  member: member,
  agent_apply: agent_apply,
  agent_apply_check: agent_apply_check,
  // agent_apply_detail: agent_apply_detail,
  // agent_apply_edit: agent_apply_edit,
}

const router = routerCfg({data: data, tmpRouter: tmpRouter})
router.render('etravel')