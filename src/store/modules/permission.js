

import {constantRoutes,asyncRoutes} from '@/router'

const state = {
  routes:constantRoutes
}

const mutations = {
  setRoutes(state, newRouter){
      //静态路由和动态路由合并
      state.routes = [...constantRoutes,...newRouter]
  }
}

const actions = {
  filterRoutes({ commit }, menus) {
    const routes = [] //筛选出与menus能匹配上的路由
    //筛选出 动态路由中能和menus匹配上的
    menus.forEach(key=>{
      //key是标识
      routes.push(...asyncRoutes.filter(item => item.name === key))
    })
    commit('setRoutes',routes)
    return routes //state数据是用来显示左侧菜单  而return是给路由addRoutes用的
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

