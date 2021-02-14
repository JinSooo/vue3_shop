import lang from 'element-plus/lib/locale/lang/zh-cn'
import locale from 'element-plus/lib/locale'
import { App } from 'vue'
import {
  ElButton,
  ElCard,
  ElForm,
  ElFormItem,
  ElInput,
  ElContainer,
  ElHeader,
  ElAside,
  ElMain,
  ElMenu,
  ElSubmenu,
  ElMenuItem,
} from 'element-plus'

export default (app: App<Element>) => {
  locale.use(lang)
  app.use(ElButton)
  app.use(ElCard)
  app.use(ElForm)
  app.use(ElFormItem)
  app.use(ElInput)
  app.use(ElContainer)
  app.use(ElHeader)
  app.use(ElMain)
  app.use(ElAside)
  app.use(ElMenu)
  app.use(ElSubmenu)
  app.use(ElMenuItem)

  // app.config.globalProperties.$message = ElMessage
  // app.provide('$message', ElMessage)
}
