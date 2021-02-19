<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>添加商品</el-breadcrumb-item>
  </el-breadcrumb>
  <!-- 卡片视图区域 -->
  <el-card>
    <!-- 提示信息 -->
    <el-alert title="添加商品信息" type="info" show-icon :closable="false" center> </el-alert>
    <!-- 步骤条 -->
    <el-steps :active="parseInt(activeIndex)" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <!-- 表格区域 -->
    <el-form :model="goodsForm" :rules="goodsRules" ref="goodsFormRef" label-position="top">
      <!-- 标签页 -->
      <el-tabs tab-position="left" v-model="activeIndex" :before-leave="handleLeave">
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="goodsForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="goodsForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="goodsForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="goodsForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
              v-model="goodsForm.goods_cat"
              :options="cateList"
              :props="props"
              clearable
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <el-form-item v-for="params in manyParamsList" :key="params.attr_id" :label="params.attr_name">
            <el-checkbox-group v-model="params.attr_vals">
              <el-checkbox v-for="(val, index) in params.attr_vals" :key="index" :label="val" border></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <el-form-item v-for="params in onlyParamsList" :key="params.attr_id" :label="params.attr_name">
            <el-input v-model="params.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <el-upload
            action="http://127.0.0.1:8888/api/private/v1/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :headers="headers"
            :file-list="fileList"
            list-type="picture"
          >
            <el-button type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <el-form-item>
            <el-input class="textarea" type="textarea" v-model="goodsForm.goods_introduce"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="add">添加商品</el-button>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <!-- 对话框 -->
    <el-dialog title="查看图片" v-model="dialogVisible" width="40%">
      <img :src="dialogSrc" alt="" />
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
import router from '@/router'
import { get, getParams, post } from '@/util/ajax'
import { getToken } from '@/util/session'
import { ElMessage } from 'element-plus'
import { defineComponent, reactive, ref, onMounted } from 'vue'
export default defineComponent({
  name: 'Add',
  setup() {
    // 当前激活的index
    const activeIndex = ref('0')
    // 添加商品的对象表单
    const goodsForm = reactive<any>({
      goods_name: '',
      goods_cat: [],
      goods_price: 0,
      goods_number: 0,
      goods_weight: 0,
      goods_introduce: '',
      pics: [],
      attrs: [],
    })
    // 表单规则
    const goodsRules = reactive({
      goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
      goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
      goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
      goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
    })
    // 获取添加用户表单元素
    const goodsFormRef = ref()
    // 商品分类列表
    const cateList = ref<any>()
    // 级联选择器配置对象
    const props = reactive({ expandTrigger: 'hover', label: 'cat_name', value: 'cat_id' })
    // 动态参数列表
    const manyParamsList = ref<any>()
    // 静态属性列表
    const onlyParamsList = ref<any>()
    // 图片文件列表
    const fileList = reactive([])
    // 请求头信息
    const headers = reactive({
      Authorization: getToken(),
    })
    // 对话框图片的路径
    const dialogSrc = ref('')
    // 对话框显示隐藏
    const dialogVisible = ref(false)
    /* **************************************************************************************** */
    // 获取商品分类列表
    const getCateList = async () => {
      const res: any = await get('/categories')
      cateList.value = res.data
    }
    // 获取商品参数列表
    const getParamsList = async (type: string) => {
      const res: any = await getParams(`categories/${goodsForm.goods_cat[2]}/attributes`, { sel: type })
      if (type === 'many') {
        // 格式化vals
        res.data.forEach((d: any) => {
          d.attr_vals = d.attr_vals.split(',')
        })
      }
      return res.data
    }
    const handleChange = async (val: any) => {
      if (val?.length === 3) {
        goodsForm.goods_cat = val
        onlyParamsList.value = await getParamsList('only')
        manyParamsList.value = await getParamsList('many')
      } else {
        goodsForm.goods_cat = []
      }
    }
    const handleLeave = (activeName: any, oldActiveName: any) => {
      if (oldActiveName === '0') {
        if (!goodsForm.goods_cat.length) {
          ElMessage.error('请先选择商品分类')
          return false
        }
      }
    }
    const handleRemove = (file: any, fileList: any) => {
      const index = goodsForm.pics.findIndex((item: any) => {
        return item.pic === file.response.data.tmp_path
      })
      goodsForm.pics.splice(index, 1)
    }
    const handlePreview = (file: any) => {
      dialogSrc.value = file.response.data.url
      dialogVisible.value = true
    }
    const handleSuccess = (res: any) => {
      goodsForm.pics.push({
        pic: res.data.tmp_path,
      })
    }
    // 添加商品
    const add = () => {
      goodsFormRef.value.validate((valid: boolean) => {
        if (!valid) return ElMessage.error('请填写必要的信息')
        // 格式化数据
        manyParamsList.value.forEach((m: any) => {
          m.attr_vals.forEach((val: any) => {
            goodsForm.attrs.push({
              attr_id: m.attr_id,
              attr_value: val,
            })
          })
        })
        onlyParamsList.value.forEach((m: any) => {
          goodsForm.attrs.push({
            attr_id: m.attr_id,
            attr_value: m.attr_vals,
          })
        })
        goodsForm.goods_cat = goodsForm.goods_cat.join(',')

        post(
          '/goods',
          goodsForm,
          () => {
            router.push('/goods')
          },
          true
        )
      })
    }

    /* **************************************************************************************** */
    onMounted(() => {
      getCateList()
    })
    return {
      add,
      dialogSrc,
      dialogVisible,
      headers,
      handleSuccess,
      fileList,
      handleRemove,
      handlePreview,
      manyParamsList,
      onlyParamsList,
      handleLeave,
      handleChange,
      cateList,
      props,
      goodsRules,
      goodsFormRef,
      activeIndex,
      goodsForm,
    }
  },
})
</script>

<style lang="less" scoped>
.el-steps {
  margin: 20px 0;
}
.el-dialog {
  img {
    width: 100%;
  }
}
.textarea {
  font-size: 16px;
  letter-spacing: 1.2rem;
}
</style>
