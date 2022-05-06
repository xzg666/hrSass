<template>
  <div class="container">
    <page-tools>
      <template #before>共{{ page.total }}条记录</template>
      <template #after>
        <el-button
          size="small"
          type="success"
          @click="$router.push('/import?type=user')"
          >导入</el-button
        >
        <el-button size="small" type="danger" @click="exportExcel"
          >导出</el-button
        >
        <el-button size="small" type="primary" @click="showAdd = true"
          >新增员工</el-button
        >
      </template>
    </page-tools>
    <!-- 表格 -->
    <el-card class="mt" v-loading="isLoading">
      <el-table
        :data="tabelData"
        style="width: 100%"
        border
        stripe
        height="72vh"
      >
        <el-table-column type="index" label="序碼"></el-table-column>
        <el-table-column prop="username" label="姓名" sortable width="100px">
        </el-table-column>
        <el-table-column label="头像" sortable width="120px">
          <template v-slot="{ row }">
            <img
              v-imagerror="require('@/assets/common/head.jpg')"
              :src="row.staffPhoto"
              class="staffPhoto"
              width="100px"
              @click="showQrCode(row.staffPhoto)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="workNumber" label="工号" sortable width="100px">
        </el-table-column>
        <el-table-column
          label="聘用形式"
          prop="formOfEmployment"
          sortable=""
          width="120px"
          :formatter="formatter"
        />
        <el-table-column
          prop="departmentName"
          label="部门"
          sortable
          width="100px"
        >
        </el-table-column>
        <el-table-column prop="timeOfEntry" label="入职时间" sortable>
          <template v-slot="{ row }">
            <!-- 将时间进行格式化 -->
            {{ row.timeOfEntry | formatDate }}
          </template>
        </el-table-column>
        <el-table-column
          label="账户状态"
          prop="enableState"
          sortable
          width="120px"
        >
          <template v-slot="{ row }">
            <el-switch :value="row.enableState === 1"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template v-slot="{ row }">
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="edit(row.id)">角色</el-button>
            <el-button type="text" size="small" @click="deleteNode(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="center">
        <el-pagination
          layout="prev, pager, next"
          :total="page.total"
          :current-page="page.page"
          :page-size="page.size"
          @current-change="pageChange"
        >
        </el-pagination>
      </el-row>
    </el-card>
    <!-- 新增彈框 -->
    <add-worker :showAdd.sync="showAdd"></add-worker>
    <!-- 二维码弹框 -->
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <!-- 分配角色弹框 -->
    <assign-role :showAssignrole.sync="showAssignrole" :userId="userId" ref="assignRole" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from "@/api/employee.js";
import EmployeeEnum from "@/api/constant/employees"; // 引入员工的枚举对象
import addWorker from "./coms/addWorker.vue";
import { formatDate } from "@/filters";
import QrCode from 'qrcode'
import assignRole from './coms/assign-role.vue'

export default {
  components: {
    addWorker,assignRole
  },
  data() {
    return {
      tabelData: [],
      page: {
        page: 1,
        size: 10,
        total: 0,
      },
      isLoading: false,
      showAdd: false,
      showCodeDialog:false,
      showAssignrole:false,
      userId:null
    };
  },
  methods: {
    async getEmployeeList() {
      this.isLoading = true;
      const { rows, total } = await getEmployeeList(this.page);
      console.log(rows);
      this.tabelData = rows;
      this.page.total = total;
      this.isLoading = false;
    },
    async pageChange(page) {
      //更新page
      this.page.page = page;
      await this.getEmployeeList();
    },
    formatter(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue);
      return obj ? obj.value : "未知";
    },
    async deleteNode(id) {
      console.log(id);
      try {
        await this.$confirm("確定刪除嗎？");
        await delEmployee(id);
        this.$message("刪除成功");
        //組件更新
        await this.getEmployeeList();
      } catch (error) {
        console.log(error);
      }
    },
    async exportExcel() {
      const headers = {
        姓名: "username",
        手机号: "mobile",
        入职日期: "timeOfEntry",
        聘用形式: "formOfEmployment",
        转正日期: "correctionTime",
        工号: "workNumber",
        部门: "departmentName",
      };
      //excel導出
      import("@/vendor/Export2Excel").then(async (excel) => {
        //現在要获取所有数据，没有那种接口，直接3.
        const { rows } = await getEmployeeList({
          page: 1,
          size: this.page.total,
        });
        // console.log(this.formatData(headers, rows));
        //现在要将row转成下面data格式
        //  excel.export_json_to_excel({
        //   header: ['姓名','工資'],
        //   data:[['張三',100000],['李四',120000]],
        //   filename: '员工资料表',
        //   // multiHeader, // 复杂表头
        //   // merges // 合并选项
        // })
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']

        excel.export_json_to_excel({
          header: Object.keys(headers),
          data: this.formatData(headers, rows),
          filename: "员工资料表",
          multiHeader, // 复杂表头
          merges // 合并选项
        });
      });
    },
    formatData(headers, data) {
      return data.map((item) =>
        Object.keys(headers).map((key) => {
          //对数据进行处理
          if(headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime'){
            return formatDate(item[headers[key]])
          }else if(headers[key] === 'formOfEmployment' ){
            const obj = EmployeeEnum.hireType.find((item2) => item2.id === item[headers[key]]);
              return obj ? obj.value : "未知";
          }else{
            return item[headers[key]]
          }

          })
      );
    },
    showQrCode(url) {
      // url存在的情况下 才弹出层
      if (url) {
        this.showCodeDialog = true // 数据更新了 但是我的弹层会立刻出现吗 ？页面的渲染是异步的！！！！
        // 有一个方法可以在上一次数据更新完毕，页面渲染完毕之后
        console.log('uuu',url)
        this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
          // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    edit(id){
      this.showAssignrole = true
      this.userId = id
      console.log(id)
      this.$refs.assignRole.getUserDetailById(id)//调用子组件弹框获取选中的函数
    }
  },
  created() {
    this.getEmployeeList();
  },
};
</script>

<style scoped>
.staffPhoto {
  width: 50px;
  height: 50px;
  border-radius: 20px;
}
</style>
