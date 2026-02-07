import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Load Eyeglass inspector
import '../../../packages/inspector/dist/index.js'

createApp(App).mount('#app')
