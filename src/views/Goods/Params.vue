<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>参数列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图区域 -->
  <el-card class="box-card">
    <!-- 提示信息 -->
    <el-alert title="注意: 只允许为第三级分类设置相关参数!!!" type="warning" show-icon :closable="false"> </el-alert>
    <!-- 选择商品分类 -->
    <div class="selected">
      选择商品分类:&nbsp;&nbsp;
      <el-cascader
        v-model="selectedCate"
        :options="cateList"
        :props="props"
        clearable
        @change="handleChange"
      ></el-cascader>
    </div>
    <!-- 标签页 -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" :disabled="isEnable">添加参数</el-button>
        <el-table :data="manyParamsList" border style="width: 100%">
          <el-table-column type="expand">
            <template v-slot="{ row }">
              <el-tag v-for="(tag, index) in row.attr_vals" :key="index" closable @close="handleTagClose(row, index)">
                {{ tag }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
          <el-table-column label="操作" width="200px">
            <template v-slot="{ row }">
              <el-button type="primary" icon="el-icon-edit" @click="showDialog(row.attr_id)"></el-button>
              <el-button type="danger" icon="el-icon-delete" @click="removed(row.attr_id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="only">
        <el-button type="primary" :disabled="isEnable" @click="dialogVisible = true">添加属性</el-button>
        <el-table :data="onlyParamsList" border style="width: 100%">
          <el-table-column type="expand">
            <template v-slot="{ row }">
              <el-tag v-for="(tag, index) in row.attr_vals" :key="index" closable @close="handleTagClose(row, index)">
                {{ tag }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column type="index" label="#"> </el-table-column>
          <el-table-column prop="attr_name" label="参数名称"> </el-table-column>
          <el-table-column label="操作" width="200px">
            <template v-slot="{ row }">
              <el-button type="primary" icon="el-icon-edit" @click="showDialog(row.attr_id)"></el-button>
              <el-button type="danger" icon="el-icon-delete" @click="removed(row.attr_id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <!-- 对话框 -->
    <el-dialog
      :title="(activeName === 'many' ? '动态' : '静态') + '参数'"
      v-model="dialogVisible"
      width="30%"
      @close="handleClose"
    >
      <el-form :model="form" :rules="formRules" ref="formRef" label-width="80px">
        <el-form-item :label="activeName === 'many' ? '动态参数' : '静态属性'" prop="attr_name">
          <el-input v-model="form.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
import { get, getParams, post, put, remove } from '@/util/ajax'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, defineComponent, nextTick, onMounted, reactive, ref } from 'vue'
export default defineComponent({
  name: 'Params',
  setup() {
    // 选择的商品分类
    const selectedCate = ref()
    // 商品分类列表
    const cateList = ref<any>()
    // 级联选择器配置对象
    const props = reactive({ expandTrigger: 'hover', label: 'cat_name', value: 'cat_id' })
    // 激活的标签页名字
    const activeName = ref('many')
    // 动态参数列表
    const manyParamsList = ref<any>([])
    // 静态属性列表
    const onlyParamsList = ref<any>([])
    // 对话框的显示与隐藏
    const dialogVisible = ref(false)
    // 获取添加用户表单元素
    const formRef = ref()
    // 添加用户表单数据
    const form = reactive({
      attr_name: '',
      attr_id: 0,
    })
    // 表单规则
    const formRules = reactive({
      attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }],
    })
    const inputVisible = ref(false)
    const inputValue = ref('')
    const saveTagInput = ref()
    /* **************************************************************************************** */
    // 是否启用按钮
    const isEnable = computed(() => {
      return selectedCate.value ? false : true
    })
    /* **************************************************************************************** */
    // 获取商品分类列表
    const getCateList = async () => {
      const res: any = await get('/categories')
      cateList.value = res.data
    }
    // 获取参数列表
    const getParamsList = async () => {
      const res: any = await getParams(`/categories/${selectedCate.value}/attributes`, { sel: activeName.value })
      // 格式化vals
      res.data.forEach((d: any) => {
        d.attr_vals = d.attr_vals.split(',')
      })

      if (activeName.value === 'many') return (manyParamsList.value = res.data)
      onlyParamsList.value = res.data
    }
    const handleChange = (val: any) => {
      if (val?.length === 3) {
        selectedCate.value = val[2]
        getParamsList()
      } else {
        selectedCate.value = null
        manyParamsList.value = []
        onlyParamsList.value = []
      }
    }
    const handleClose = () => {
      formRef.value.resetFields()
      form.attr_id = 0
    }
    const handleClick = () => {
      getParamsList()
    }
    // 提交信息
    const confirm = () => {
      formRef.value.validate((valid: boolean) => {
        if (!valid) return
        console.log(form)
        if (form.attr_id === 0) {
          post(
            `/categories/${selectedCate.value}/attributes`,
            {
              attr_name: form.attr_name,
              attr_sel: activeName.value,
            },
            () => {
              getParamsList()
              dialogVisible.value = false
            },
            true
          )
        } else {
          put(
            `/categories/${selectedCate.value}/attributes/${form.attr_id}`,
            {
              attr_name: form.attr_name,
              attr_sel: activeName.value,
            },
            () => {
              getParamsList()
              dialogVisible.value = false
            },
            true
          )
        }
      })
    }
    const showDialog = async (paramsId: number) => {
      const res: any = await getParams(`/categories/${selectedCate.value}/attributes/${paramsId}`, {
        sel: activeName.value,
      })
      form.attr_name = res.data.attr_name
      form.attr_id = res.data.attr_id
      dialogVisible.value = true
    }
    // 删除用户
    const removed = (attrId: number) => {
      ElMessageBox.confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          remove(
            `/categories/${selectedCate.value}/attributes/${attrId}`,
            () => {
              getParamsList()
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
    const handleTagClose = (row: any, tag: any) => {
      row.attr_vals.splice(tag, 1)
      put(
        `/categories/${selectedCate.value}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: activeName.value,
          attr_vals: row.attr_vals.join(','),
        },
        undefined,
        true
      )
    }

    const showInput = () => {
      inputVisible.value = true
      nextTick(() => {
        saveTagInput.value.$refs.input.focus()
      })
    }

    const handleInputConfirm = (row: any) => {
      if (inputValue.value !== '') {
        row.attr_vals.push(inputValue.value)
        put(
          `/categories/${selectedCate.value}/attributes/${row.attr_id}`,
          {
            attr_name: row.attr_name,
            attr_sel: activeName.value,
            attr_vals: row.attr_vals.join(','),
          },
          undefined,
          true
        )
      }
      inputVisible.value = false
      inputValue.value = ''
    }
    /* **************************************************************************************** */
    onMounted(() => {
      getCateList()
    })

    return {
      inputVisible,
      inputValue,
      saveTagInput,
      handleInputConfirm,
      showInput,
      handleTagClose,
      removed,
      showDialog,
      confirm,
      formRules,
      formRef,
      form,
      dialogVisible,
      handleClose,
      onlyParamsList,
      isEnable,
      manyParamsList,
      handleClick,
      activeName,
      handleChange,
      selectedCate,
      cateList,
      props,
    }
  },
})
</script>

<style lang="less" scoped>
.selected {
  margin: 20px 0 10px 0;
}
.el-table {
  margin-top: 20px;
}
.el-tag {
  margin-right: 10px;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
