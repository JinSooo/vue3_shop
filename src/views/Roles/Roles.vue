<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>权限管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图区域 -->
  <el-card class="box-card">
    <div class="addBtn">
      <!-- 添加角色按钮 -->
      <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
    </div>
    <!-- 表格区域 -->
    <el-table :data="rolesList" border style="width: 100%">
      <el-table-column type="expand">
        <template v-slot="{ row }">
          <el-row
            v-for="(item1, index1) in row.children"
            :key="index1"
            :class="[index1 === 0 ? 'tborder' : '', 'bborder', 'vcenter']"
            justify="center"
          >
            <el-col :span="5">
              <el-tag closable @close="handleTagClose(row, item1.id)">{{ item1.authName }}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <el-col :span="19">
              <el-row
                v-for="(item2, index2) in item1.children"
                :key="index2"
                :class="[index2 === item1.children.length - 1 ? '' : 'bborder', 'vcenter']"
                :gutter="20"
              >
                <el-col :span="6">
                  <el-tag closable type="success" @close="handleTagClose(row, item2.id)">{{ item2.authName }}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag
                    closable
                    type="warning"
                    v-for="(item3, index3) in item2.children"
                    :key="index3"
                    @close="handleTagClose(row, item3.id)"
                  >
                    {{ item3.authName }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50" label="#"> </el-table-column>
      <el-table-column prop="roleName" label="角色名称"> </el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(row.id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" @click="removed(row.id)"></el-button>
          <el-button type="warning" icon="el-icon-setting" @click="dealRights(row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色对话框 -->
    <el-dialog title="添加用户" v-model="addDialogVisible" width="30%" :before-close="handleAddClose">
      <el-form :model="addForm" :rules="rolesRules" ref="addFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="add">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改角色对话框 -->
    <el-dialog title="修改用户" v-model="editDialogVisible" width="30%" :before-close="handleEditClose">
      <el-form :model="editForm" :rules="rolesRules" ref="editFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="edit">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog title="修改用户" v-model="dealDialogVisible" width="30%">
      <el-tree
        :data="rightsList"
        show-checkbox
        node-key="id"
        :default-checked-keys="defaultRights"
        :props="defaultProps"
        accordion
        ref="treeRef"
      >
      </el-tree>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dealDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="savedealRights">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import { get, post, put, remove } from '@/util/ajax'
import { ElMessage, ElMessageBox } from 'element-plus'
import { defineComponent, onMounted, ref, reactive } from 'vue'
export default defineComponent({
  name: 'Roles',
  setup() {
    // 角色列表
    const rolesList = ref<any>([])
    // 是否显示添加对话框
    const addDialogVisible = ref(false)
    // 获取添加用户表单元素
    const addFormRef = ref()
    // 添加用户表单数据
    const addForm = reactive({
      roleName: '',
      roleDesc: '',
    })
    // 是否显示修改对话框
    const editDialogVisible = ref(false)
    // 获取添加用户表单元素
    const editFormRef = ref()
    // 添加用户表单数据
    const editForm = ref<any>([])
    // 表单规则
    const rolesRules = reactive({
      roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
      roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }],
    })
    const dealDialogVisible = ref(false)
    const rightsList = ref<any>([])
    // 权限列表
    const defaultRights = ref<any>([])
    // 配置树形控件默认选项
    const defaultProps = reactive({
      children: 'children',
      label: 'authName',
    })
    const treeRef = ref()
    const selectedId = ref(0)
    /* **************************************************************************************** */
    // 获取角色列表
    const getRolesList = async () => {
      const { data } = await get('/roles')
      rolesList.value = data
    }
    // 获取权限列表
    const getRightsList = async () => {
      const { data } = await get('/rights/tree')
      rightsList.value = data
    }
    const handleAddClose = (done: Function) => {
      addFormRef.value.resetFields()
      done()
    }
    const handleEditClose = (done: Function) => {
      editFormRef.value.resetFields()
      done()
    }
    // 添加角色
    const add = () => {
      addFormRef.value.validate((valid: boolean) => {
        if (!valid) return
        post('/roles', addForm, undefined, true)
        getRolesList()
        addFormRef.value.resetFields()
        addDialogVisible.value = false
      })
    }
    // 显示修改用户对话框
    const showEditDialog = async (roleId: number) => {
      const { data } = await get('/roles/' + roleId)
      editForm.value = data
      editDialogVisible.value = true
    }
    // 修改角色
    const edit = () => {
      editFormRef.value.validate((valid: boolean) => {
        if (!valid) return
        put(
          '/roles/' + editForm.value.roleId,
          {
            roleName: editForm.value.roleName,
            roleDesc: editForm.value.roleDesc,
          },
          undefined,
          true
        )
        getRolesList()
        editFormRef.value.resetFields()
        editDialogVisible.value = false
      })
    }
    // 删除角色
    const removed = (roleId: number) => {
      ElMessageBox.confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          remove(
            '/roles/' + roleId,
            () => {
              getRolesList()
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
    // 获取角色所有权限的id
    const getDefaultRights = (node: any, arr: any) => {
      node.forEach((n: any) => {
        if (n.children) return getDefaultRights(n.children, arr)
        arr.push(n.id)
      })
    }
    // 显示分配权限对话框
    const dealRights = async (role: any) => {
      selectedId.value = role.id
      getRightsList()
      defaultRights.value = []
      getDefaultRights(role.children, defaultRights.value)
      dealDialogVisible.value = true
      console.log(defaultRights.value)
    }
    // 保存角色权限
    const savedealRights = () => {
      const dealRights = [...treeRef.value.getCheckedKeys(), ...treeRef.value.getHalfCheckedKeys()]
      post(
        '/roles/' + selectedId.value + '/rights',
        { rids: dealRights.join(',') },
        () => {
          getRolesList()
          dealDialogVisible.value = false
        },
        true
      )
    }
    // 删除tag
    const handleTagClose = (role: any, rightsId: any) => {
      ElMessageBox.confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          remove(
            `/roles/${role.id}/rights/${rightsId}`,
            (res: any) => {
              role.children = res
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
      getRolesList()
    })

    return {
      rolesList,
      addDialogVisible,
      addFormRef,
      addForm,
      rolesRules,
      handleAddClose,
      add,
      editDialogVisible,
      editFormRef,
      editForm,
      handleEditClose,
      showEditDialog,
      edit,
      removed,
      defaultProps,
      dealDialogVisible,
      dealRights,
      defaultRights,
      rightsList,
      treeRef,
      savedealRights,
      handleTagClose,
    }
  },
})
</script>

<style lang="less" scoped>
.addBtn {
  margin-bottom: 20px;
}
.tborder {
  border-top: 1px solid #eee;
}
.bborder {
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin: 10px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
