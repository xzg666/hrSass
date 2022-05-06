const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  staffPhoto: state => state.user.userInfo.staffPhoto,
  username: state => state.user.userInfo.username,
  userId: state => state.user.userInfo.userId,
  companyId: state => state.user.userInfo.companyId,
  routes: state => state.permission.routes,//建立动态路由的快速访问
}
export default getters
