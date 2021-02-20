<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>数据统计</el-breadcrumb-item>
    <el-breadcrumb-item>数据报表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图区域 -->
  <el-card class="box-card">
    <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
    <div id="main" style="width: 600px;height:400px;"></div>
  </el-card>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { init } from 'echarts'
import { get } from '@/util/ajax'
import _ from 'lodash'
export default defineComponent({
  name: 'App',
  setup() {
    const options: any = {
      title: {
        text: '用户来源',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#E9EEF3',
          },
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          boundaryGap: false,
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
    }
    /* **************************************************************************************** */
    const getReports = async () => {
      const { data } = await get('/reports/type/1')
      const result = _.merge(data, options)
      // 基于准备好的dom，初始化echarts实例
      const myChart = init(document.getElementById('main')!)
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(result as any)
    }
    onMounted(() => {
      getReports()
    })
  },
})
</script>

<style></style>
