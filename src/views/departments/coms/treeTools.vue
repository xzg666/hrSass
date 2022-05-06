<template>
     <el-row  type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%">
          <el-col  style="font-weight:bold">{{treeNode.name}}</el-col>
          <el-col :span = "4">
            <el-row type="flex" justify="end" >
              <el-col >{{treeNode.manager}}</el-col>
              <el-col >
                  <el-dropdown @command="handleCommand">
                  <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                 <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="a" :disabled="!checkPermission('add-dept')">添加子部门</el-dropdown-item>
                    <el-dropdown-item v-if="!isRoot" command="b">编辑部门</el-dropdown-item>
                    <el-dropdown-item v-if="!isRoot" command="c">删除部门</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-col>
            </el-row>
          </el-col>
     </el-row>
</template>

<script>

import {delDepartments} from '@/api/department'
  export default {
    props:{
      treeNode:{
        required:true,
        type:Object
      },
      isRoot:{
        type:Boolean,
        default:false
      }
    },
    methods:{
      handleCommand(type){
        if(type === 'a'){
          //通知父组件打开弹窗,并且把当前节点数据传过去
          this.$emit('addDepts',this.treeNode)
        }else if(type === 'b'){
          this.$emit('editDepts',this.treeNode)
        }else{
          this.$confirm(`确定要删除${this.treeNode?.name}吗？`).then(async()=>{
            await delDepartments(this.treeNode?.id)
          }).then(()=>{
            //通知父组件更新
            this.$emit('delDepts')
            this.$message(`删除${this.treeNode?.name}成功~`)
          })
        }
      }
    }

  }
</script>

<style scoped>

</style>
