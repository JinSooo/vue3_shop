<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图区域 -->
  <el-card class="box-card">
    <div class="addBtn">
      <!-- 添加角色按钮 -->
      <el-button type="primary" @click="showAddDialog">添加分类</el-button>
    </div>
    <!-- 表格区域 -->
    <el-table
      :data="categoriesList"
      border
      style="width: 100%"
      row-key="cat_id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="cat_name" label="分类名称"> </el-table-column>
      <el-table-column prop="cat_deleted" label="是否有效">
        <template v-slot="{ row }">
          <span class="el-icon-success" style="color: green" v-if="row.cat_deleted === false"></span>
          <span class="el-icon-error" style="color: red" v-else></span>
        </template>
      </el-table-column>
      <el-table-column prop="cat_level" label="排序">
        <template v-slot="{ row }">
          <el-tag v-if="row.cat_level === 0">一级</el-tag>
          <el-tag v-else-if="row.cat_level === 1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(row.cat_id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" @click="removed(row.cat_id)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>
    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" v-model="addDialogVisible" width="30%" :before-close="handleAddClose">
      <el-form :model="addForm" :rules="categoriesRules" ref="addFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="addForm.cat_level"
            :options="cascaderList"
            :props="props"
            clearable
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="add">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 添加分类对话框 -->
    <el-dialog title="修改分类" v-model="editDialogVisible" width="30%" :before-close="handleEditClose">
      <el-form :model="editForm" :rules="categoriesRules" ref="editFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
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
import { get, getParams, post, put, remove } from '@/util/ajax'
import { ElMessage, ElMessageBox } from 'element-plus'
import { defineComponent, onMounted, reactive, ref } from 'vue'
export default defineComponent({
  name: 'Categories',
  setup() {
    // 是否显示添加对话框
    const addDialogVisible = ref(false)
    // 获取添加用户表单元素
    const addFormRef = ref()
    // 添加用户表单数据
    const addForm = reactive({
      cat_name: '',
      cat_level: 0,
      cat_pid: 0,
    })
    // 表单规则
    const categoriesRules = reactive({
      cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
    })
    // 分类列表
    const categoriesList = ref<any>([])
    // 查询参数
    const queryInfo = reactive({
      type: [3],
      pagenum: 1,
      pagesize: 5,
    })
    // 总数量
    const total = ref(0)
    // 级联选择器配置对象
    const props = reactive({ expandTrigger: 'hover', label: 'cat_name', value: 'cat_id', checkStrictly: true })
    // 级联选择器列表对象
    const cascaderList = ref<any>([])
    // 是否显示修改对话框
    const editDialogVisible = ref(false)
    // 获取添加用户表单元素
    const editFormRef = ref()
    // 添加用户表单数据
    const editForm = ref<any>([])
    /* **************************************************************************************** */
    const getCategoriesList = async () => {
      const res: any = await getParams('/categories', queryInfo)
      categoriesList.value = res.data.result
      total.value = res.data.total
    }
    const handleAddClose = (done: Function) => {
      addFormRef.value.resetFields()
      done()
    }
    const handleEditClose = (done: Function) => {
      editFormRef.value.resetFields()
      done()
    }
    const handleSizeChange = (val: number) => {
      queryInfo.pagesize = val
      getCategoriesList()
    }
    const handleCurrentChange = (val: number) => {
      queryInfo.pagenum = val
      getCategoriesList()
    }
    const showAddDialog = async () => {
      const res: any = await getParams('/categories', { type: [2] })
      cascaderList.value = res.data
      addDialogVisible.value = true
    }
    const handleChange = (val: any) => {
      if (!val) {
        addForm['cat_level'] = 0
        addForm['cat_pid'] = 0
      } else {
        addForm['cat_level'] = val.length
        addForm['cat_pid'] = val[val.length - 1]
      }
      console.log(addForm)
    }
    const add = () => {
      addFormRef.value.validate((valid: boolean) => {
        if (!valid) return
        post(
          '/categories',
          addForm,
          () => {
            getCategoriesList()
            addDialogVisible.value = false
          },
          true
        )
      })
    }
    // 显示修改用户对话框
    const showEditDialog = async (catId: number) => {
      const { data } = await get('/categories/' + catId)
      editForm.value = data
      editDialogVisible.value = true
    }
    // 修改用户
    const edit = () => {
      editFormRef.value.validate((valid: boolean) => {
        if (!valid) return
        put(
          '/categories/' + editForm.value.cat_id,
          {
            cat_name: editForm.value.cat_name,
          },
          () => {
            editDialogVisible.value = false
            getCategoriesList()
          },
          true
        )
      })
    }
    // 删除用户
    const removed = (catId: number) => {
      ElMessageBox.confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          remove(
            '/categories/' + catId,
            () => {
              getCategoriesList()
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

    onMounted(() => {
      getCategoriesList()
    })

    return {
      showEditDialog,
      edit,
      removed,
      handleEditClose,
      editDialogVisible,
      editFormRef,
      editForm,
      add,
      handleChange,
      showAddDialog,
      cascaderList,
      total,
      queryInfo,
      props,
      addDialogVisible,
      addFormRef,
      addForm,
      categoriesRules,
      categoriesList,
      handleAddClose,
      handleSizeChange,
      handleCurrentChange,
    }
  },
})
</script>

<style lang="less" scoped>
.addBtn {
  margin-bottom: 20px;
}
.el-pagination {
  margin-top: 20px;
  text-align: center;
}
</style>
