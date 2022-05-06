<template>
  <div>
    <el-card class="page-tools">
      <el-row type="flex" justify="space-between">
        <el-col>
          <div v-if="showBefore" class="before">
            <i class="el-icon-info" />
            <slot name="before">11</slot>
          </div>
        </el-col>
        <el-col>
          <el-row type="flex" justify="end">
              <slot name="after">22</slot>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  export default {
    props:{
      showBefore:{
        type:Boolean,
        default:true
      }
    }
  }
</script>

<style lang='scss' scoped>
.page-tools {
    margin: 10px 0;
    .before {
      line-height: 34px;
    i {
      margin-right: 5px;
      color: #409eff;
    }
    display: inline-block;
    padding: 0px 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }
 }
</style>
