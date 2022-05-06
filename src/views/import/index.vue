<template>
  <div>
    <upload-excel :on-success="success" />
  </div>
</template>

<script>
import { importEmployee } from '@/api/employee'
export default {
  data() {
    return {
      type: this.$route.query.type,
    };
  },
  methods: {
    async success({ header, results }) {
      console.log(header, results, this.type);
      //需要將results的keys轉成英文
      if (this.type === "user") {
        const userRelations = {
          入职日期: "timeOfEntry",
          手机号: "mobile",
          姓名: "username",
          转正日期: "correctionTime",
          工号: "workNumber",
        };
        const newRes = results.map(item=>{
          let obj = {}
          Object.keys(item).forEach(item2=>{
            if(userRelations[item2] === "timeOfEntry" || userRelations[item2] === "correctionTime" ){
              // 后端接口 限制了 不能是字符串 要求转化时间类型
                obj[userRelations[item2]] =  new Date(this.formatDate(item[item2], '/')) // 只有这样 才能存入数据库
            }else{
              obj[userRelations[item2]] = item[item2]
            }

          })
          return obj
        })
        console.log(newRes)
        await importEmployee(newRes)
        this.$message.success('导入excel成功')
        this.$router.back() // 回到上一个页面
      }
    },
    // 转化excel的日期格式  存到excel要減去70年
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  },
};
</script>

<style scoped>
</style>
