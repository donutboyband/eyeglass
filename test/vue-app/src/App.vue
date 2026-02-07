<script setup lang="ts">
import { ref } from 'vue'
import Card from './components/Card.vue'
import Button from './components/Button.vue'
import InputField from './components/InputField.vue'
import TextArea from './components/TextArea.vue'

const count = ref(0)
const name = ref('')
const email = ref('')
const message = ref('')

function handleSubmit() {
  alert(`Hello, ${name.value}!`)
}
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>Eyeglass Vue Test</h1>
      <p>Testing Vue component detection</p>
    </header>

    <main>
      <Card title="Counter Example">
        <p>Current count: <strong>{{ count }}</strong></p>
        <div class="button-group">
          <Button variant="secondary" @click="count--">
            Decrement
          </Button>
          <Button @click="count++">
            Increment
          </Button>
          <Button variant="secondary" @click="count = 0">
            Reset
          </Button>
        </div>
      </Card>

      <Card title="Form Example">
        <InputField
          label="Name"
          v-model="name"
          placeholder="Enter your name..."
        />
        <InputField
          label="Email"
          v-model="email"
          placeholder="Enter your email..."
        />
        <TextArea
          label="Message"
          v-model="message"
          placeholder="Enter your message..."
        />
        <Button @click="handleSubmit">
          Submit
        </Button>
      </Card>

      <Card title="Vue Components">
        <p>Click on different elements to see their Vue component info in the Eyeglass inspector.</p>
        <ul>
          <li>Component names should be detected</li>
          <li>File paths should be shown</li>
          <li>Props should be visible</li>
        </ul>
      </Card>
    </main>
  </div>
</template>

<style scoped>
.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.header h1 {
  color: #42b883;
  margin-bottom: 8px;
}

.header p {
  color: #64748b;
}

.button-group {
  display: flex;
  gap: 8px;
}

p {
  color: #475569;
  margin: 0 0 16px 0;
}

ul {
  color: #475569;
  margin: 0;
  padding-left: 20px;
}

li {
  padding: 4px 0;
}
</style>
