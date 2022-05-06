<template>
  <div>
    <el-dialog :visible="showAssignrole" title="分配角色" @close="btnCancle">
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="item in list"  :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
      </el-checkbox-group>
      <el-row type="flex" justify="center" slot="footer">
        <span class="dialog-footer">
          <el-button @click="btnCancle">取 消</el-button>
          <el-button type="primary" @click="btnOk">确 定</el-button>
        </span>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList} from '@/api/seeting.js'
import { getUserDetailById } from '@/api/user'
import {assignRoles} from '@/api/employee'
export default {
  props: {
    showAssignrole: {
      type: Boolean,
      default: false,
    },
    userId:{
      type:String,
      default:null
    }
  },
  data() {
    return {
      checkList: [],
      list:[]
    };
  },
  created(){
    this.getRoleList()
    this.getUserDetailById()
  },
  methods: {
    async getRoleList(){
        console.log(await getRoleList())
        const {rows} = await getRoleList()
        this.list = rows
    },
    //现在要获取选中的，需要拿到id调用接口
    async getUserDetailById(id){
      console.log(33333,this.userId)//因为props传递是异步的，因此拿不到。可以父组件进行调用
      const { roleIds } = await getUserDetailById(id)
      this.checkList = roleIds

    },
    async btnOk() {
      try {
        await assignRoles({id:this.userId,roleIds:this.checkList})
        this.$emit("update:showAssignrole", false);
        this.$message({message:'修改成功',type:'success'})
      } catch (error) {
        console.log(error)
      }

    },
    btnCancle() {
      this.checkList = []
      this.$emit("update:showAssignrole", false);
    },
  },
};
</script>

<style scoped>
</style>
