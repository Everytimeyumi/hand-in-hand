import { createApp } from 'vue'
import './app.scss'
import "./common/css/ui-scss/background.scss";
import { createPinia } from 'pinia'
import { createUI } from 'taro-ui-vue3'
import 'taro-ui-vue3/dist/style/index.scss'
import './common/css/ui-scss/main.css'
import './common/css/ui-scss/icon.css'
import { useIndexStore } from './stores/index'
// require ('./utils/uni_app_event_sdk_release')
// require ('./utils/uni_app_jserror_sdk_release')
// import  wesight from './utils/wesight.mini'  //wes 测试sdk

const App = createApp({
setup(options) {
  const login = useIndexStore() 
   login.wxLogin()
  //  wesight.init({
  //   url: "https://pa.wetest.qq.com/minisafe/insight/miniapp/cgi",
  //   secret_id: "479730cc766241c48d34c935de6efd2a",  //密钥ID
  //   secret_key: "ae66732ca929462c832d2c6f214bdb05", //密钥KEY
  //   });
  },
})
import component from './components'// 引入公共组件
// 链式添加一项 .use(component) 来引入配置好的公共组件
createApp(App).use(component).mount('#app')
const tuv3 = createUI()
App.use(tuv3)
App.use(createPinia())
export default App

