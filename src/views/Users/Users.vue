<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图区域 -->
  <el-card class="box-card">
    <div class="search">
      <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
        <!-- 搜索框 -->
        <template #append>
          <el-button icon="el-icon-search" @click="getUsersList"></el-button>
        </template>
      </el-input>
      <!-- 添加用户按钮 -->
      <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
    </div>

    <!-- 表格区域 -->
    <el-table :data="usersList.users" border style="width: 100%">
      <el-table-column type="index" width="50" label="#"> </el-table-column>
      <el-table-column prop="username" label="姓名"> </el-table-column>
      <el-table-column prop="email" label="邮箱"> </el-table-column>
      <el-table-column prop="mobile" label="电话"> </el-table-column>
      <el-table-column prop="role_name" label="角色"> </el-table-column>
      <el-table-column prop="mg_state" label="状态">
        <template v-slot="{ row }">
          <el-switch v-model="row.mg_state" active-color="#409eff" @click="setState(row.id, row.mg_state)"> </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300px">
        <template v-slot="{ row }">
          <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(row.id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" @click="removed(row.id)"></el-button>
          <el-button type="warning" icon="el-icon-setting"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页功能 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" v-model="addDialogVisible" width="30%" :before-close="handleAddClose">
      <el-form :model="addForm" :rules="usersRules" ref="addFormRef" label-width="100px">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="用户手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="add">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" v-model="editDialogVisible" width="30%" :before-close="handleEditClose">
      <el-form :model="editForm.data" :rules="usersRules" ref="editFormRef" label-width="100px">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="editForm.data.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email">
          <el-input v-model="editForm.data.email"></el-input>
        </el-form-item>
        <el-form-item label="用户手机" prop="mobile">
          <el-input v-model="editForm.data.mobile"></el-input>
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
import { defineComponent, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
export default defineComponent({
  name: 'Users',
  setup() {
    // 查询用户参数对象
    const queryInfo = reactive({
      query: '',
      pagenum: 1,
      pagesize: 2,
    })
    // 用户数据列表
    const usersList = reactive({ users: [] })
    // 用户总数
    const total = ref(0)
    // 是否显示添加对话框
    const addDialogVisible = ref(false)
    // 获取添加用户表单元素
    const addFormRef = ref()
    // 添加用户表单数据
    const addForm = reactive({
      username: '',
      password: '',
      email: '',
      mobile: '',
    })
    // 是否显示修改对话框
    const editDialogVisible = ref(false)
    // 获取添加用户表单元素
    const editFormRef = ref()
    // 添加用户表单数据
    const editForm = reactive<{ data: any }>({ data: {} })
    // 表单规则
    const usersRules = reactive({
      username: [
        { required: true, message: '请输入用户名称', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
      ],
      password: [
        { required: true, message: '请输入用户密码', trigger: 'blur' },
        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' },
      ],
      email: [{ required: true, message: '请输入用户邮箱', trigger: 'blur' }],
      mobile: [{ required: true, message: '请输入用户手机', trigger: 'blur' }],
    })
    /* **************************************************************************************** */
    // 获取用户列表
    const getUsersList = () => {
      getParams('/users', queryInfo, (data: any) => {
        usersList.users = data.users
        total.value = data.total
      })
    }
    const handleSizeChange = (val: number) => {
      queryInfo.pagesize = val
      getUsersList()
    }
    const handleCurrentChange = (val: number) => {
      queryInfo.pagenum = val
      getUsersList()
    }
    const handleAddClose = (done: Function) => {
      addFormRef.value.resetFields()
      done()
    }
    const handleEditClose = (done: Function) => {
      editFormRef.value.resetFields()
      done()
    }
    // 添加用户
    const add = () => {
      addFormRef.value.validate((valid: boolean) => {
        if (!valid) return
        post('/users', addForm, undefined, true)
        getUsersList()
        addDialogVisible.value = false
      })
    }
    // 显示修改用户对话框
    const showEditDialog = async (userId: number) => {
      const { data } = await get('/users/' + userId)
      editForm.data = data
      editDialogVisible.value = true
    }
    // 修改用户
    const edit = () => {
      editFormRef.value.validate((valid: boolean) => {
        if (!valid) return
        put(
          '/users/' + editForm.data.id,
          {
            email: editForm.data.email,
            mobile: editForm.data.mobile,
          },
          undefined,
          true
        )
        editDialogVisible.value = false
        getUsersList()
      })
    }
    // 删除用户
    const removed = (userId: number) => {
      ElMessageBox.confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          remove(
            '/users/' + userId,
            () => {
              getUsersList()
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
    // 设置用户状态
    const setState = (userId: number, userState: boolean) => {
      put(`/users/${userId}/state/${userState}`, undefined, undefined, true)
    }

    onMounted(() => {
      getUsersList()
    })

    return {
      queryInfo,
      usersList,
      total,
      getUsersList,
      handleSizeChange,
      handleCurrentChange,
      addDialogVisible,
      addFormRef,
      addForm,
      editDialogVisible,
      editFormRef,
      editForm,
      usersRules,
      handleAddClose,
      handleEditClose,
      add,
      showEditDialog,
      edit,
      removed,
      setState,
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
