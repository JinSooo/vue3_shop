<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    <el-breadcrumb-item>订单列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图区域 -->
  <el-card>
    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable class="search">
      <!-- 搜索框 -->
      <template #append>
        <el-button icon="el-icon-search" @click="getOrdersList"></el-button>
      </template>
    </el-input>
    <!-- 表格区域 -->
    <el-table :data="ordersList" border style="width: 100%">
      <el-table-column type="index" width="50" label="#"> </el-table-column>
      <el-table-column label="订单编号" prop="order_number"> </el-table-column>
      <el-table-column label="订单价格" prop="order_price" width="80px"> </el-table-column>
      <el-table-column label="是否付款" prop="order_pay" width="120px">
        <template v-slot="{ row }">
          <el-tag v-if="row.order_pag === '1'">已付款</el-tag>
          <el-tag v-else type="danger">未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否发货" prop="is_send" width="120px"> </el-table-column>
      <el-table-column label="下单时间" prop="create_time" width="180px"> </el-table-column>
      <el-table-column label="操作" width="200px">
        <el-button type="primary" icon="el-icon-edit" @click="editDialogVisible = true"></el-button>
        <el-button type="success" icon="el-icon-location" @click="dialogVisible = true"></el-button>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 修改地址 -->
    <el-dialog title="修改地址" v-model="editDialogVisible" width="30%">
      <div class="item">
        <p>省市区/县</p>
        <el-cascader :options="cityList" :props="props"></el-cascader>
      </div>
      <div class="item">
        <p>详细地址</p>
        <el-input type="text"></el-input>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="物流进度" v-model="dialogVisible" width="30%">
      <el-timeline>
        <el-timeline-item v-for="(info, index) in locationInfo" :key="index" :timestamp="info.time">
          {{ info.context }}
        </el-timeline-item>
      </el-timeline>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import { getParams } from '@/util/ajax'
import { dateFormat } from '@/util/dateFormat'
import { defineComponent, reactive, ref, onMounted } from 'vue'
import cityData from './citydata'
export default defineComponent({
  name: 'Orders',
  setup() {
    // 查询订单参数对象
    const queryInfo = reactive({
      query: '',
      pagenum: 1,
      pagesize: 5,
    })
    // 订单数据列表
    const ordersList = ref<any>()
    // 订单总数
    const total = ref(0)
    // 修改地址对话框
    const editDialogVisible = ref(false)
    const dialogVisible = ref(false)
    // 城市列表
    const cityList = ref<any>()
    const props = { expandTrigger: 'hover' }
    const locationInfo = [
      {
        time: '2018-05-10 09:39:00',
        ftime: '2018-05-10 09:39:00',
        context: '已签收,感谢使用顺丰,期待再次为您服务',
        location: '',
      },
      {
        time: '2018-05-10 08:23:00',
        ftime: '2018-05-10 08:23:00',
        context: '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
        location: '',
      },
      {
        time: '2018-05-10 07:32:00',
        ftime: '2018-05-10 07:32:00',
        context: '快件到达 [北京海淀育新小区营业点]',
        location: '',
      },
      {
        time: '2018-05-10 02:03:00',
        ftime: '2018-05-10 02:03:00',
        context: '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
        location: '',
      },
      {
        time: '2018-05-09 23:05:00',
        ftime: '2018-05-09 23:05:00',
        context: '快件到达 [北京顺义集散中心]',
        location: '',
      },
      {
        time: '2018-05-09 21:21:00',
        ftime: '2018-05-09 21:21:00',
        context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
        location: '',
      },
      {
        time: '2018-05-09 13:07:00',
        ftime: '2018-05-09 13:07:00',
        context: '顺丰速运 已收取快件',
        location: '',
      },
      {
        time: '2018-05-09 12:25:03',
        ftime: '2018-05-09 12:25:03',
        context: '卖家发货',
        location: '',
      },
      {
        time: '2018-05-09 12:22:24',
        ftime: '2018-05-09 12:22:24',
        context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
        location: '',
      },
      {
        time: '2018-05-08 21:36:04',
        ftime: '2018-05-08 21:36:04',
        context: '商品已经下单',
        location: '',
      },
    ]
    /* **************************************************************************************** */
    // 获取订单列表
    const getOrdersList = async () => {
      const res: any = await getParams('/orders', queryInfo)

      // 格式化日期
      res.data.goods.forEach((g: any) => {
        g.create_time = dateFormat(g.create_time)
      })

      ordersList.value = res.data.goods
      total.value = res.data.total
    }
    const handleSizeChange = (val: number) => {
      queryInfo.pagesize = val
      getOrdersList()
    }
    const handleCurrentChange = (val: number) => {
      queryInfo.pagenum = val
      getOrdersList()
    }
    /* **************************************************************************************** */
    onMounted(() => {
      getOrdersList()
      cityList.value = cityData
    })

    return {
      dialogVisible,
      locationInfo,
      cityList,
      editDialogVisible,
      getOrdersList,
      handleCurrentChange,
      handleSizeChange,
      queryInfo,
      ordersList,
      total,
      props,
    }
  },
})
</script>

<style lang="less" scoped>
.search {
  width: 400px;
}
.el-table {
  margin: 20px 0;
}
.el-pagination {
  text-align: center;
}
.item {
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
  > div {
    width: 300px;
  }
}
</style>
