import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import installElementPlus from './plugins/element'
import 'element-plus/lib/theme-chalk/index.css'

import './assets/css/global.css'

const app = createApp(App)
installElementPlus(app)
app.use(router)

app.mount('#app')
