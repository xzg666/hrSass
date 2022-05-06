<template>
  <div>
    <el-button type="primary" size="small" @click="edit">新建角色</el-button>
    <el-table border="" :data="tableData.rows" class="mt">
      <el-table-column align="center" type="index" label="序号" width="120" />
      <el-table-column align="center" prop="name" label="名称" width="240" />
      <el-table-column align="center" prop="description" label="描述" />
      <el-table-column align="center" label="操作">
        <!-- 作用域插槽 -->
        <template v-slot="{row}">
          <el-button size="small" type="success" @click="assignPerm(row.id)">分配权限</el-button>
          <el-button size="small" type="primary" @click="edit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" justify="center">
      <el-pagination
        layout="prev, pager, next"
        :total="tableData.total"
        :current-page="page.page"
        :page-size="page.pagesize"
        @current-change="pageChange"
      >
      </el-pagination>
    </el-row>
    <!-- 编辑弹框 -->
    <el-dialog :visible="showEdit" :title="title" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 放置footer插槽 -->
      <el-row type="flex" justify="center">
        <el-col :span="8">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 放置一个弹层 -->
    <el-dialog title="分配权限" :visible.sync="showPermDialog" >
      <!-- 权限是一颗树 -->
      <!-- 将数据绑定到组件上 -->
      <!-- check-strictly 如果为true 那表示父子勾选时  不互相关联 如果为false就互相关联 -->
      <!-- id作为唯一标识 -->
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :show-checkbox="true"
        :check-strictly="true"
        :default-expand-all="true"
        :default-checked-keys="selectCheck"
        node-key="id"
      />
      <!-- 确定 取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK">确定</el-button>
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {deleteRole,updateRole,addRole,getRoleDetail,assignPerm} from '@/api/seeting.js'
import { getPermissionList } from '@/api/permission'
import {ListToTree} from '@/utils'
export default {
  props: {
    tableData: {
      type: Object,
    },
  },
  data() {
    return {
      page: {
        page: 1,
        pageSize: 10,
      },
      showEdit:false,
      roleForm:{
        name:'',
        description:''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      showPermDialog:false,
      selectCheck:[],
      defaultProps: {
        label: 'name'
      }, // 定义显示字段的名称 和 子属性的字段名称
      permData:[],
      roleId:null
    };
  },
  computed:{
    title(){
      return this.roleForm.id?'编辑':'新增'
    }
  },
  methods:{
    pageChange(val){
      console.log(val)
    },
    //删除
    async deleteRole(id){
      try {
        await this.$confirm('确定删除？')
        await deleteRole(id)
        //通知父组件更新
        this.$emit('delNode')
        this.$message('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    edit(row){
      if(row.id){
        //编辑
        this.roleForm = row
        console.log('编辑')
      }
      this.showEdit = true
    },
    btnOK(){
      this.$refs.roleForm.validate(async(isok)=>{
        if(isok){
          if(this.roleForm.id){
            //编辑
            await updateRole(this.roleForm)
            this.$message({
              message:'编辑成功',
              type:'success'
            })
          }else{
            //新增
            await addRole(this.roleForm)
            //通知父组件更新
            this.$emit('addRole')
            this.$message({
              message:'新增成功',
              type:'success'
            })
          }
          this.showEdit = false
        }

      })
    },
    //点击分配权限
    async assignPerm(id){
      this.permData = ListToTree(await getPermissionList(),'0')//获取树结构
      this.roleId = id
      //选中回显数据请求
       const {permIds} = await getRoleDetail(id)
       this.selectCheck = permIds
      this.showPermDialog = true
    },
    btnCancel(){
      this. roleForm={
        name:'',
        description:''
      }
      this.showEdit = false
      this.$refs.roleForm.resetField()
    },
    async  btnPermOK() {
      console.log(this.$refs.permTree.getCheckedKeys())//获取选中的key数组值
      //分配权限 this.roleId是之前记录表下来的
      await assignPerm({permIds:this.$refs.permTree.getCheckedKeys(),id:this.roleId})
      this.$message.success('分配权限成功')
      this.showPermDialog = false
    },
    btnPermCancel() {
      this.selectCheck = [] // 重置数据
      this.showPermDialog = false
    }
  }
};
</script>

<style scoped>
</style>
