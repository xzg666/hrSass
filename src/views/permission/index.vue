<template>
  <div class="container">
    <!-- 靠右的按钮 -->
    <page-tools :showBefore="false">
      <template v-slot:after>
        <el-button type="primary" size="small" @click="addPermission(1, '0')"
          >添加权限</el-button
        >
      </template>
    </page-tools>
    <!-- 表格 -->
    <!-- 指定id为唯一属性的标识 -->
    <el-table border :data="list" row-key="id">
      <el-table-column label="名称" prop="name" />
      <el-table-column align="center" label="标识" prop="code" />
      <el-table-column align="center" label="描述" prop="description" />
      <el-table-column align="center" label="操作">
        <template v-slot="{ row }">
          <!-- 添加按钮只在 访问权的层级显示 当type==1 时才显示添加按钮 -->
          <el-button
            v-if="row.type === 1"
            type="text"
            @click="addPermission(2, row.id)"
            >添加</el-button
          >
          <el-button type="text" @click="editPermission(row.id)"
            >编辑</el-button
          >
          <el-button type="text" @click="delPermission(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增编辑弹框 -->
    <el-dialog :visible.sync="showDialog" :title="showText">
      <!-- 表单 -->
      <el-form
        ref="permForm"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" style="width: 90%" />
        </el-form-item>
        <el-form-item label="标识" prop="code">
          <el-input v-model="formData.code" style="width: 90%" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="formData.description" style="width: 90%" />
        </el-form-item>
        <el-form-item label="开启">
          <!-- 当值为1时 激活 当值为0时  不激活 -->
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
            style="width: 90%"
          />
        </el-form-item>
      </el-form>
      <!-- 底部的确定和取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPermissionList,
  getPermissionDetail,
  addPermission,
  updatePermission,
  delPermission,
} from "@/api/permission";
import { ListToTree } from "@/utils";
export default {
  data() {
    return {
      formData: {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: "", // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: "0", // 开启
      },
      list: [],
      showDialog: false,
      rules: {
        name: [
          { required: true, message: "权限名称不能为空", trigger: "blur" },
        ],
        code: [
          { required: true, message: "权限标识不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getPermissionList();
  },
  computed: {
    showText() {
      return this.formData.id ? "编辑" : "新增";
    },
  },
  methods: {
    async getPermissionList() {
      this.list = ListToTree(await getPermissionList(), "0");
    },
    addPermission(type, pid) {
      this.formData.type = type;
      this.formData.pid = pid;
      this.showDialog = true;
    },
    async editPermission(id) {
      this.formData = await getPermissionDetail(id);
      this.showDialog = true;
    },
    async delPermission(id) {
      this.$confirm("确定删除吗？").then(async () => {
        await delPermission(id);
        //更新表格
        await this.getPermissionList();
        this.$message({ type: "warning", message: "删除成功" });
      });
    },
    btnOK() {
      this.$refs.permForm
        .validate()
        .then(async () => {
          if (this.formData.id) {
            //编辑
            await updatePermission(this.formData);
            this.$message({ type: "success", message: "编辑成功" });
          } else {
            //新增
            await addPermission(this.formData);
            this.$message({ type: "success", message: "新增成功" });
          }
        })
        .then(async () => {
          //更新表格
          await this.getPermissionList();
          this.showDialog = false;
        });
    },
    btnCancel() {
      // 重置数据
      this.formData = {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: "", // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: "0", // 开启
      };
      // 移除校验
      this.$refs.permForm.resetFields(); // 移除校验
      this.showDialog = false;
    },
  },
};
</script>

<style scoped>
</style>
