import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

// Load Eyeglass inspector
import '../../../packages/inspector/dist/index.js'

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
