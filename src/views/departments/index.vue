<template>
  <div class="container">
    <el-card>
      <div slot="header" class="clearfix">
       <tree-tools :treeNode="company" :isRoot="true" @addDepts="addDepts"/>
      </div>
      <el-tree
       default-expand-all
        :data="treeData"
        :props="defaultProps"
        @node-click="handleNodeClick"
      >
        <tree-tools slot-scope="{data}"  :treeNode="data" @delDepts="getData" @addDepts="addDepts" @editDepts="editDepts" />
      </el-tree>
    </el-card>
    <!-- 弹窗 -->
    <add-depts ref="addDepts" :dialog-visible.sync="showDialog" :treeNode="node" @delDepts="getData" />



  </div>
</template>

<script>

import { getDepartments } from '@/api/department'
import {ListToTree} from '@/utils'

import treeTools from './coms/treeTools.vue'
import addDepts from './coms/addDepts.vue'
export default {
  components:{
    treeTools,
    addDepts
  },
  data() {
    return {
      company:{},
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      showDialog:false,
      node:null,//记录当前点击的node数据
    };
  },
  methods: {
    handleNodeClick(data) {
      console.log(data);
    },
    async getData(){
      const data = await getDepartments()
      this.treeData = ListToTree(data.depts,'')
      this.company = { name: data.companyName, manager: '负责人', id: '' }
    },
    addDepts(treeNode){
      this.node = treeNode //记录被点击的node
      this.showDialog = true //显示弹框
    },
    editDepts(treeNode){
      this.node = treeNode //记录被点击的node
      this.showDialog = true //显示弹框
      //此时需要调用接口获取详情
      this.$refs.addDepts.getDepartDetail(treeNode.id)
    }

  },
  created(){
    this.getData()
  }
};
</script>

<style scoped>

</style>
