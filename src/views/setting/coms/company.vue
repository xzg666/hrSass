<template>
  <div>
    <el-alert
      type="info"
      :show-icon="true"
      :closable="false"
      title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
    />
    <el-form label-width="120px" style="margin-top: 30px">
      <el-form-item label="企业名称">
        <el-input v-model="formData.name" disabled style="width: 400px" />
      </el-form-item>
      <el-form-item label="公司地址">
        <el-input
          v-model="formData.companyAddress"
          disabled
          style="width: 400px"
        />
      </el-form-item>
      <el-form-item label="电话">
        <el-input
          v-model="formData.companyPhone"
          disabled
          style="width: 400px"
        />
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="formData.mailbox" disabled style="width: 400px" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          v-model="formData.remarks"
          type="textarea"
          :rows="3"
          disabled
          style="width: 400px"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {getCompanyInfo} from '@/api/seeting'
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      formData: {
        companyPhone:'',
        mailbox:'',
        remarks:''
      },
    };
  },
  computed:{
    ...mapGetters(['companyId'])
  },
  async mounted(){
    this.formData = await getCompanyInfo(this.companyId)
  }
};
</script>

<style scoped>
</style>
