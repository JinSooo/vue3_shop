<template>
  <div class="container">
    <!-- 卡片视图 -->
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avatar_container">
        <img src="../assets/logo.png" alt="" />
      </div>

      <!-- 验证表单区域 -->
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="el-icon-s-goods" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="btn-box">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="loginFormReset">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { setToken } from '@/util/session'
import { Manager } from '@/util/type'
import { defineComponent, reactive, ref } from 'vue'
import router from '../router'
import { post } from '../util/ajax'
export default defineComponent({
  name: 'Login',
  setup() {
    // 获取表单元素
    const loginFormRef = ref()
    // 表单数据
    const loginForm = reactive({
      username: '',
      password: '',
    })
    // 表单规则
    const loginRules = reactive({
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' },
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' },
      ],
    })
    /* **************************************************************************************** */
    // 重置表单内容
    const loginFormReset = () => {
      loginFormRef.value.resetFields()
    }
    const login = () => {
      loginFormRef.value.validate(async (isValidate: boolean) => {
        if (!isValidate) return
        post(
          '/login',
          loginForm,
          (data: Manager) => {
            setToken(data.token)
            router.push('/home')
          },
          true
        )
      })
    }

    return {
      loginFormRef,
      loginForm,
      loginRules,
      loginFormReset,
      login,
    }
  },
})
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  background: #2b4b6b;

  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar_container {
  width: 120px;
  height: 120px;
  background: #fff;
  border-radius: 50%;
  border: 1px solid #eee;
  box-shadow: 0 0 10px #eee;
  padding: 10px;

  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);

  img {
    width: 120px;
    height: 120px;
    background: #eee;
    border-radius: 50%;
  }
}

.el-form {
  width: 100%;
  position: absolute;
  bottom: 0;
  padding: 0 20px;
  box-sizing: border-box;

  .btn-box {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }
}

.login-box {
  position: relative;
  width: 450px;
  height: 300px;
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 0 2px #000;
}
</style>
