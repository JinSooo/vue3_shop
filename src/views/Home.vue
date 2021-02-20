<template>
  <el-container class="home-container">
    <!-- 头部内容 -->
    <el-header>
      <div class="content">
        <img src="../assets/logo.png" alt="" />
        <p>电商管理系统</p>
        <el-button type="info" @click="logout">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <!-- 侧边栏内容 -->
      <el-aside :width="asideWidth">
        <!-- 伸缩按钮 -->
        <div class="toggle_btn" @click="toggle">|||</div>
        <!-- 导航菜单 -->
        <el-menu
          :uniqueOpened="true"
          :default-active="defaultIndex"
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          :collapse="isToggle"
          :collapse-transition="false"
          router
        >
          <el-submenu class="submenu" v-for="menu in menuList.menus" :key="menu.id" :index="menu.path + ''">
            <template #title>
              <i class="el-icon-menu"></i>
              <span>{{ menu.authName }}</span>
            </template>
            <el-menu-item
              v-for="menuChild in menu.children"
              :key="menuChild.id"
              :index="menuChild.path + ''"
              :route="menuChild.path"
              @click="saveIndex(menuChild.path)"
            >
              <template #title>
                <i class="el-icon-location"></i>
                <span>{{ menuChild.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { getIndex, setIndex } from '@/util/session'
import { get } from '@/util/ajax'
import { defineComponent, onMounted, reactive, ref } from 'vue'
import router from '@/router'
import { ElMessage } from 'element-plus'
export default defineComponent({
  name: 'Home',
  setup() {
    // 伸缩侧边栏
    const isToggle = ref(false)
    // 侧边栏宽度
    const asideWidth = ref('200px')
    // 默认激活的菜单列
    const defaultIndex = ref('')
    // 侧边栏菜单数据
    const menuList = reactive<{ menus: Array<object> }>({ menus: [] })

    /* **************************************************************************************** */
    // 开关伸缩侧边栏
    const toggle = () => {
      isToggle.value = !isToggle.value
      if (isToggle.value) {
        asideWidth.value = '64px'
      } else {
        asideWidth.value = '200px'
      }
    }
    // 获取左侧菜单数据
    const getMenus = () => {
      get('/menus', (res: Array<object>) => {
        menuList.menus = res
      })
    }
    // 保存默认激活的菜单列
    const saveIndex = (index: string) => {
      setIndex(index)
    }
    // 退出登录
    const logout = () => {
      window.sessionStorage.clear()
      ElMessage.info('注销成功')
      router.push('/login')
    }
    /* **************************************************************************************** */
    onMounted(() => {
      getMenus()
      defaultIndex.value = getIndex() || ''
    })

    return {
      defaultIndex,
      isToggle,
      asideWidth,
      toggle,
      menuList,
      saveIndex,
      logout,
    }
  },
})
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background: #373d41;
}
.el-aside {
  background: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.toggle_btn {
  width: 100%;
  height: 30px;
  background: #4a5064;
  color: #fff;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
}
.content {
  margin-left: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  font-family: '楷体';
  font-size: 20px;
  color: #fff;
  img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
}
.submenu {
  width: 200px;
}
.el-button {
  position: absolute;
  right: 30px;
}
</style>
