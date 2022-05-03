import { getUserInfo, login, getUserDetailById } from '@/api/user'
import { setToken, removeToken, setTimeStamp } from '@/utils/auth'
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
  }
}

export default { namespaced: true, state, mutations, actions }
