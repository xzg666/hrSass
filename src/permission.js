import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  NProgress.start()// 开启进度条

  if (getToken()) {
    // 只有有token的情况下 才能获取资料
    //   如果有token
    if (to.path === '/login') {
      // 如果要访问的是 登录页 跳到主页
      next('/')
    } else {
      // 只有放过的时候才去获取用户资料
      // 是每次都获取吗
      // 如果当前vuex中有用户的资料的id 表示 已经有资料了 不需要获取了 如果没有id才需要获取
      // 登录只拿了token  后续用户数据信息请求在这里获取  然后在这里获取动态路由加进来
      if (!store.getters.userId) {
        // 首先获取用户数据  之前我们返回了，so拿到了数据
        const {roles} = await store.dispatch('user/getUserInfo')
        //根据用户的menus筛选路由，也return了
        const routes = await store.dispatch('permission/filterRoutes',roles.menus)
        router.addRoutes([...routes,{ path: '*', redirect: '/404', hidden: true }])
        next(to.path)//添加完必须这样 是bug把
      }else{
        next()
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})

router.afterEach(() => {
  NProgress.done()// 关闭进度条
})

