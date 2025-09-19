/**********************************
 * @Description: 入口文件
 * @FilePath: main.js
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/04 22:41:32
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import hljsVuePlugin from '@highlightjs/vue-plugin'
import ElementPlus from 'element-plus' // 引入element-plus库
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import xml from 'highlight.js/lib/languages/xml.js'
import VForm3 from 'vform3-builds'
import { createApp } from 'vue'
import App from './App.vue'
import { setupDirectives } from './directives'
import { setupRouter } from './router'
import { setupStore } from './store'
import { setupNaiveDiscreteApi } from './utils'
import 'element-plus/dist/index.css' // 引入element-plus样式
import 'vform3-builds/dist/designer.style.css' // 引入VForm3样式
import '@/styles/reset.css'
import '@/styles/global.css'
import 'uno.css'
import 'highlight.js/styles/stackoverflow-light.css'

async function bootstrap() {
  hljs.registerLanguage('javascript', javascript)
  hljs.registerLanguage('xml', xml)
  const app = createApp(App)
  setupStore(app)
  setupDirectives(app)
  await setupRouter(app)
  app.mount('#app')
  app.use(hljsVuePlugin)
  app.use(ElementPlus) // 全局注册element-plus
  app.use(VForm3) // 全局注册VForm3，同时注册了v-form-designer、v-form-render等组件
  setupNaiveDiscreteApi()
}

bootstrap()
