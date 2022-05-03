import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getToken, getTimeStamp } from './auth'

const service = axios.create({
// 当执行 npm run dev  => .evn.development => /api => 跨域代理
  baseURL: process.env.VUE_APP_BASE_API, // npm  run dev  => /api npm run build =>  /prod-api
  timeout: 5000 // 设置超时时间
})
// 请求拦截器
service.interceptors.request.use(config => {
  // config 是请求的配置信息
  // 注入token
  if (getToken()) {
    if (isTimeOut()) {
      store.commit('user/logout')
      router.push('/login')
      return Promise.reject(new Error('您的token已过期！'))
    }
    config.headers['Authorization'] = `Bearer ${getToken()}`
  }
  return config // 必须要返回的
}, error => {
  return Promise.reject(error)
})
// 响应拦截器
service.interceptors.response.use(response => {
  // axios默认加了一层data
  const { success, message, data } = response.data
  //   要根据success的成功与否决定下面的操作
  if (success) {
    return data
  } else {
    // 业务已经错误了 还能进then ? 不能 ！ 应该进catch
    Message.error(message) // 提示错误消息
    return Promise.reject(new Error(message))
  }
}, error => {
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当等于10002的时候 表示 后端告诉我token超时了
    store.dispatch('user/logout') // 登出action 删除token
    router.push('/login')
  } else {
    Message.error(error.message) // 提示错误信息
  }
  return Promise.reject(error)
})

/**
 * 判断token是否超时
*/
const TIME_OUT = 3600
function isTimeOut() {
  const beforeTime = getTimeStamp()
  const nowTime = Date.now()
  console.log('shijian', (nowTime - beforeTime) / 1000)
  return (nowTime - beforeTime) / 1000 > TIME_OUT
}

export default service
