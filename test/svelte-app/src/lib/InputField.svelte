<script lang="ts">
  interface Props {
    label: string
    value: string
    placeholder?: string
  }

  let { label, value = $bindable(), placeholder = '' }: Props = $props()
</script>

<div class="input-field">
  <label>
    <span class="label-text">{label}</span>
    <input
      type="text"
      bind:value
      {placeholder}
    />
  </label>
</div>

<style>
  .input-field {
    margin-bottom: 16px;
  }

  label {
    display: block;
  }

  .label-text {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 6px;
  }

  input {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.15s;
  }

  input:focus {
    border-color: #ff3e00;
    box-shadow: 0 0 0 3px rgba(255, 62, 0, 0.1);
  }
</style>
