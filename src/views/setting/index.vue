<template>
  <div class="container">
    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="角色管理" name="first">
          <role :tableData="tableData" @delNode="getTableData()" @addRole="getTableData()"></role>
        </el-tab-pane>
        <el-tab-pane label="公司信息" name="second">
          <company></company>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import Company from './coms/company.vue';
import role from './coms/role.vue';
import {getRoleList } from '@/api/seeting.js'
export default {
  components: { role, Company },
  data(){
    return {
        activeName: 'first',
        tableData: [],
      };
  },
  methods: {
    async getTableData(){
      this.tableData = await getRoleList()
    }
  },
  created() {
    this.getTableData()
  },
};
</script>

<style scoped>
</style>
