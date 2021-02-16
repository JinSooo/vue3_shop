<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>权限列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图区域 -->
  <el-card class="box-card">
    <!-- 表格区域 -->
    <el-table :data="rightsList" border style="width: 100%">
      <el-table-column type="index" width="50" label="#"> </el-table-column>
      <el-table-column prop="authName" label="权限名称"> </el-table-column>
      <el-table-column prop="path" label="路径"> </el-table-column>
      <el-table-column prop="level" label="权限等级">
        <template v-slot="{ row }">
          <el-tag v-if="row.level === '0'">一级</el-tag>
          <el-tag v-else-if="row.level === '1'" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts">
import { get } from '@/util/ajax'
import { defineComponent, onMounted, ref } from 'vue'
export default defineComponent({
  name: 'Rights',
  setup() {
    // 权限列表
    const rightsList = ref<any>([])
    /* **************************************************************************************** */
    const getRightsList = async () => {
      const res = await get('/rights/list')
      rightsList.value = res.data
      console.log(res)
    }

    onMounted(() => {
      getRightsList()
    })

    return {
      rightsList,
    }
  },
})
</script>

<style lang="less" scoped></style>
