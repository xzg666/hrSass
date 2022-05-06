<template>
  <div>
    <el-dialog
      :title="title"
      :visible="dialogVisible"
      width="30%"
      @close="btnCancle"
    >
      <el-form ref="deptFormRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="部门名称" prop="name">
          <el-input
            style="width: 80%"
            v-model="form.name"
            placeholder="1-50个字符"
          />
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input
            style="width: 80%"
            v-model="form.code"
            placeholder="1-50个字符"
          />
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select
            style="width: 80%"
            v-model="form.manager"
            @focus="getEmployeeSimple"
            placeholder="请选择部门负责人"
          >
            <el-option
              v-for="item in peoples"
              :key="item.id"
              :label="item.username"
              :value="item.username"
              ></el-option
            >
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input
            style="width: 80%"
            v-model="form.introduce"
            placeholder="1-300个字符"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="btnCancle">取 消</el-button>
        <el-button type="primary" @click="btnOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getEmployeeSimple,getDepartments,addDepartments,getDepartDetail,updateDepartments } from "@/api/department";
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    treeNode:{
        required:true,
        type:Object
      }
  },
  data() {
    const checkNameRepeat = async (rule, value, callback) => {
      //这里需要验证部门名称不能和之前的重复
      //  value 是部门名称 要去和同级部门下的部门去比较 有没有相同的 有相同的 不能过 / 不相同就可以过
      const {depts} = await getDepartments()
      console.log('depts',depts)
      console.log(1111111111111,value,this.treeNode)
      let isRepeat = false
      if(this.form.id){
        //编辑（同级部门不能相同）
        isRepeat = depts.filter(item => item.pid === this.treeNode.pid && item.id !== this.treeNode.id).some(item => item.name === value)
      }else{
        //新增子部门（子部门不能名字一样）
        isRepeat  = depts.filter(item => item.pid === this.treeNode.id ).some(item => item.name === value)
      }

      isRepeat ? callback(new Error(`同级部门下已经存在这个${value}部门了`)) : callback()

    };

    const checkCodeRepeat = async (rule, value, callback) => {
      const {depts} = await getDepartments()
      let isRepeat = false
      //不能有相同的编码
      isRepeat = depts.filter(item=>item.id !== this.treeNode.id).some(item=>item.code === value)
      isRepeat ? callback(new Error(`编码${value}已存在！`)) : callback()
    };

    return {
      form: {
        name: "",
        code: "",
        manager: "",
        introduce: "",
      },
      peoples: [],
      rules: {
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门名称长度为1-50个字符",
            trigger: "blur",
          },
          {
            trigger: "blur",
            validator: checkNameRepeat,
          },
        ],
        code: [
          { required: true, message: "部门编码不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门编码长度为1-50个字符",
            trigger: "blur",
          },
          {
            trigger: "blur",
            validator: checkCodeRepeat,
          },
        ],
        manager: [
          { required: true, message: "部门负责人不能为空", trigger: "blur" },
        ],
        introduce: [
          { required: true, message: "部门介绍不能为空", trigger: "blur" },
          {
            min: 1,
            max: 300,
            message: "部门介绍长度为1-300个字符",
            trigger: "blur",
          },
        ],
      }, // 校验规则 {key: 数组}
    };
  },
  computed:{
    title(){
       return this.form.id?'编辑':'新增'
    }
  },
  methods: {
    async getDepartDetail(id){
      //请求详情数据
      this.form =  await getDepartDetail(id)
    },
    btnOk() {
      this.$refs.deptFormRef.validate(async(isok)=>{
        if(isok){
          if(this.form.id){
            //编辑

            await updateDepartments({...this.form})
            this.$message({message:'修改成功',type:'success'})
          }else{
            //新增部门
            await addDepartments({...this.form,pid:this.treeNode.id})
            this.$message('新增成功')
          }
          //通知父组件跟新
          this.$emit('delDepts')
           //关闭弹框
          this.$emit("update:dialogVisible", false);
        }
      })

    },
    btnCancle() {
       // 重置数据  因为resetFields 只能重置 表单上的数据 非表单上的 比如 编辑中id 不能重置
      this.form = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$emit("update:dialogVisible", false);
      this.$refs.deptFormRef.resetFields()//重置规则
    },
    async getEmployeeSimple() {
      try {
        console.log(123)
      this.peoples = await getEmployeeSimple();
      } catch (error) {
        console.log(error)
      }

    },
  },
};
</script>

<style scoped>
</style>
