<template>
  <div>
    <el-dialog title="新增員工" :visible="showAdd" @close="btnCancle">
      <!-- 表单 -->
      <el-form
        ref="addEmployee"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="姓名" prop="username">
          <el-input
            v-model="formData.username"
            style="width: 50%"
            placeholder="请输入姓名"
          />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input
            v-model="formData.mobile"
            style="width: 50%"
            placeholder="请输入手机号"
          />
        </el-form-item>
        <el-form-item label="入职时间" prop="timeOfEntry">
          <el-date-picker
            v-model="formData.timeOfEntry"
            style="width: 50%"
            placeholder="请选择入职时间"
          />
        </el-form-item>
        <el-form-item label="聘用形式" prop="formOfEmployment">
          <el-select
            v-model="formData.formOfEmployment"
            style="width: 50%"
            placeholder="请选择"
          >
            <el-option
              v-for="item in EmployeeEnum.hireType"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="workNumber">
          <el-input
            v-model="formData.workNumber"
            style="width: 50%"
            placeholder="请输入工号"
          />
        </el-form-item>
        <el-form-item label="部门" prop="departmentName">
          <el-input
            v-model="formData.departmentName"
            style="width: 50%"
            placeholder="请选择部门"
            @focus="getDepartments"
          />
          <!-- 放置一个树形组件 -->
          <el-tree
            v-if="showTree"
            v-loading="loading"
            :data="treeData"
            :props="{ label: 'name' }"
            :default-expand-all="true"
            @node-click="selectNode"
          />
        </el-form-item>
        <el-form-item label="转正时间" prop="correctionTime">
          <el-date-picker
            v-model="formData.correctionTime"
            style="width: 50%"
            placeholder="请选择转正时间"
          />
        </el-form-item>
      </el-form>
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
import EmployeeEnum from "@/api/constant/employees";
import { getDepartments } from "@/api/department";
import { ListToTree } from "@/utils";
import { addEmployee } from "@/api/employee.js";
export default {
  props: {
    showAdd: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      EmployeeEnum,
      formData: {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: "",
      },
      rules: {
        username: [
          { required: true, message: "用户姓名不能为空", trigger: "blur" },
          {
            min: 1,
            max: 4,
            message: "用户姓名为1-4位",
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            //  pattern正则表达式 如果满足 就通过校验 如果不满足 不通过
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
        formOfEmployment: [
          { required: true, message: "聘用形式不能为空", trigger: "blur" },
        ],
        workNumber: [
          { required: true, message: "工号不能为空", trigger: "blur" },
        ],
        // 这里为什么要设置它为change呢
        departmentName: [
          { required: true, message: "部门不能为空", trigger: "change" },
        ],
        timeOfEntry: [{ required: true, message: "入职时间", trigger: "blur" }],
      },
      treeData: [],
      showTree: false,
    };
  },
  methods: {
    btnOk() {
      this.$refs.addEmployee.validate(async (isOk) => {
        if (isOk) {
          await addEmployee(this.formData);
          //然後需要通知父組件更新
          (await this.$parent.getEmployeeList) &&
            this.$parent.getEmployeeList();
          this.$parent.showAdd = false;
        }
      });
    },
    btnCancle() {
      this.formData = {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: "",
      };
      this.$refs.addEmployee.resetFields()
      this.$emit("update:showAdd", false);
    },
    async getDepartments() {
      this.showTree = true;
      this.loading = true;
      const { depts } = await getDepartments();
      // depts是一个数组 它需要转化成树形结构 才可以被 el-tree 显示
      console.log(depts);
      this.treeData = ListToTree(depts, "");
      this.loading = false;
    },
    selectNode(val) {
      this.formData.departmentName = val.name;
      this.showTree = false;
    },
  },
};
</script>

<style scoped>
</style>
