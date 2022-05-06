import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageLoad from './ImageLoad'
import Print from 'vue-print-nb'//引入打印组件

export default{
  install(Vue){
    // 组件的注册
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageLoad', ImageLoad)
    Vue.use(Print) // 注册打印组件
  }
}
