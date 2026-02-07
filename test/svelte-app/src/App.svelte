<script lang="ts">
  import Card from './lib/Card.svelte'
  import Button from './lib/Button.svelte'
  import InputField from './lib/InputField.svelte'
  import TextArea from './lib/TextArea.svelte'

  let count = $state(0)
  let name = $state('')
  let email = $state('')
  let message = $state('')

  function handleSubmit() {
    alert(`Hello, ${name}!`)
  }
</script>

<div class="app">
  <header class="header">
    <h1>Eyeglass Svelte Test</h1>
    <p>Testing Svelte component detection</p>
  </header>

  <main>
    <Card title="Counter Example">
      <p>Current count: <strong>{count}</strong></p>
      <div class="button-group">
        <Button variant="secondary" onclick={() => count--}>
          Decrement
        </Button>
        <Button onclick={() => count++}>
          Increment
        </Button>
        <Button variant="secondary" onclick={() => count = 0}>
          Reset
        </Button>
      </div>
    </Card>

    <Card title="Form Example">
      <InputField
        label="Name"
        bind:value={name}
        placeholder="Enter your name..."
      />
      <InputField
        label="Email"
        bind:value={email}
        placeholder="Enter your email..."
      />
      <TextArea
        label="Message"
        bind:value={message}
        placeholder="Enter your message..."
      />
      <Button onclick={handleSubmit}>
        Submit
      </Button>
    </Card>

    <Card title="Svelte Components">
      <p>Click on different elements to see their Svelte component info in the Eyeglass inspector.</p>
      <ul>
        <li>Component names should be detected</li>
        <li>File paths should be shown</li>
        <li>Props should be visible</li>
      </ul>
    </Card>
  </main>
</div>

<style>
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
    color: #ff3e00;
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
