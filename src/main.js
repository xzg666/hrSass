import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import * as directives from '@/directives'
import * as filters from '@/filters'

import '@/icons' // icon
import '@/permission' // permission control
import Component from '@/components'
import checkPermission from '@/mixin/checkPermission'

// 注册自己的插件
Vue.use(Component)

// 注册自定义指令
// 遍历所有的导出的指令对象 完成自定义全局注册
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key]) // 注册自定义指令
})

//注冊過濾器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

//注册全局混入
Vue.mixin(checkPermission)//表示所有组件都拥有的检查的方法

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)



Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
