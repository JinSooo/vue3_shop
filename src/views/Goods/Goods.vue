<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图区域 -->
  <el-card>
    <div class="search">
      <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
        <!-- 搜索框 -->
        <template #append>
          <el-button icon="el-icon-search" @click="getGoodsList"></el-button>
        </template>
      </el-input>
      <!-- 添加用户按钮 -->
      <el-button type="primary" @click="add">添加商品</el-button>
    </div>
    <!-- 表格区域 -->
    <el-table :data="goodsList" border style="width: 100%">
      <el-table-column type="index" width="50" label="#"> </el-table-column>
      <el-table-column label="商品名称" prop="goods_name"> </el-table-column>
      <el-table-column label="商品价格(元)" prop="goods_price" width="120px"> </el-table-column>
      <el-table-column label="商品重量" prop="goods_weight" width="80px"> </el-table-column>
      <el-table-column label="创建时间" prop="add_time" width="180px"> </el-table-column>
      <el-table-column label="操作" width="200px">
        <template v-slot="{ row }">
          <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(row.goods_id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" @click="removed(row.goods_id)"></el-button>
        </template>
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
    <!-- 修改商品对话框 -->
    <el-dialog title="修改商品" v-model="editDialogVisible" width="30%" @close="handleEditClose">
      <el-form :model="editForm" :rules="goodsRules" ref="editFormRef" label-width="100px">
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="edit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import router from '@/router'
import { get, getParams, put, remove } from '@/util/ajax'
import { ElMessage, ElMessageBox } from 'element-plus'
import { defineComponent, onMounted, reactive, ref } from 'vue'
export default defineComponent({
  name: 'Goods',
  setup() {
    // 查询商品参数对象
    const queryInfo = reactive({
      query: '',
      pagenum: 1,
      pagesize: 5,
    })
    // 商品数据列表
    const goodsList = ref<any>([])
    // 商品总数
    const total = ref(0)
    // 是否显示修改对话框
    const editDialogVisible = ref(false)
    // 获取添加用户表单元素
    const editFormRef = ref()
    // 添加用户表单数据
    const editForm = ref<any>()
    // 表单规则
    const goodsRules = reactive({
      goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
      goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
      goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
      goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
    })
    /* **************************************************************************************** */
    // 格式化日期
    const dateFormat = (ms: number) => {
      const date = new Date(ms)
      return `${date.getFullYear()}-${(date.getMonth() + 1 + '').padStart(2, '0')}-${(date.getDate() + ' ').padStart(
        2,
        '0'
      )} ${(date.getHours() + '').padStart(2, '0')}:${(date.getMinutes() + '').padStart(2, '0')}:${(
        date.getSeconds() + ''
      ).padStart(2, '0')}`
    }
    // 获取商品列表
    const getGoodsList = async () => {
      const res: any = await getParams('/goods', queryInfo)

      res.data.goods.forEach((g: any) => {
        g.add_time = dateFormat(g.add_time)
      })

      goodsList.value = res.data.goods
      total.value = res.data.total
    }
    const handleSizeChange = (val: number) => {
      queryInfo.pagesize = val
      getGoodsList()
    }
    const handleCurrentChange = (val: number) => {
      queryInfo.pagenum = val
      getGoodsList()
    }
    const handleEditClose = () => {
      editFormRef.value.resetFields()
    }
    // 显示修改用户对话框
    const showEditDialog = async (goodsId: number) => {
      const { data } = await get('/goods/' + goodsId)
      editForm.value = data
      editDialogVisible.value = true
    }
    // 修改用户
    const edit = () => {
      editFormRef.value.validate((valid: boolean) => {
        if (!valid) return
        put(
          '/goods/' + editForm.value.goods_id,
          {
            goods_name: editForm.value.goods_name,
            goods_price: editForm.value.goods_price,
            goods_number: editForm.value.goods_number,
            goods_weight: editForm.value.goods_weight,
          },
          () => {
            editDialogVisible.value = false
            getGoodsList()
          },
          true
        )
      })
    }
    // 删除商品
    const removed = (goodsId: number) => {
      ElMessageBox.confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          remove(
            '/goods/' + goodsId,
            () => {
              getGoodsList()
            },
            true
          )
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消删除',
          })
        })
    }
    // 添加商品
    const add = () => {
      router.push('/add')
    }
    /* **************************************************************************************** */
    onMounted(() => {
      getGoodsList()
    })

    return {
      add,
      removed,
      showEditDialog,
      edit,
      handleEditClose,
      editDialogVisible,
      editFormRef,
      editForm,
      goodsRules,
      getGoodsList,
      handleSizeChange,
      handleCurrentChange,
      queryInfo,
      goodsList,
      total,
    }
  },
})
</script>

<style lang="less" scoped>
.search .el-input {
  width: 400px;
  margin-right: 15px;
}
.el-table {
  margin: 30px 0;
}
.el-pagination {
  text-align: center;
}
</style>
