import { getUserInfo, login, getUserDetailById } from '@/api/user'
import { setToken, removeToken, setTimeStamp } from '@/utils/auth'
import {resetRouter} from '@/router'
const state = {
  token: null,
  userInfo: {}// 这里需要对象是防止undefined.xxx报错
}
const mutations = {
  setToken(state, payload) {
    state.token = payload
    setToken(payload) // 存token到缓存
  },
  setUserInfo(state, payload) {
    state.userInfo = payload
  },
  logout(state) {
    state.token = null
    state.userInfo = {}
    removeToken()
  }
}
const actions = {
  async loginAsync({ commit }, payload) {
    const res = await login(payload)
    commit('setToken', res)
    setTimeStamp()// 登录成功拿到token即设置时间戳
  },
  async getUserInfo({ commit }) {
    const res = await getUserInfo()
    const detailInfo = await getUserDetailById(res.userId)
    commit('setUserInfo', { ...res, ...detailInfo })// 接口数据合并
    return res
  },
  logoutAsync({commit}){
    commit('logout')
    //重置路由
    resetRouter()
    // 去设置权限模块下路由为初始状态
    // Vuex子模块怎么调用子模块的action 都没加锁的情况下 可以随意调用
    // 不加命名空间的情况下的 所有的mutations和action都是挂在全局上的 所以可以直接调用
    // 但是加了命名空间的子模块 怎么调用另一个加了命名空间的子模块的mutations
    // 加了命名空间的context指的不是全局的context
    // mutations名称 载荷 payload 第三个参数  { root: true } 调用根级的mutations或者action
    commit('permission/setRoutes',[],{root:true})

  }
}

export default { namespaced: true, state, mutations, actions }
