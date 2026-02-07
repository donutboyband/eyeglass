<script lang="ts">
  interface Props {
    label: string
    value: string
    placeholder?: string
    rows?: number
  }

  let { label, value = $bindable(), placeholder = '', rows = 4 }: Props = $props()
</script>

<div class="textarea-field">
  <label>
    <span class="label-text">{label}</span>
    <textarea
      bind:value
      {placeholder}
      {rows}
    ></textarea>
  </label>
</div>

<style>
  .textarea-field {
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

  textarea {
    width: 100%;
    padding: 10px 14px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    font-family: inherit;
    outline: none;
    resize: vertical;
    transition: border-color 0.15s;
  }

  textarea:focus {
    border-color: #ff3e00;
    box-shadow: 0 0 0 3px rgba(255, 62, 0, 0.1);
  }
</style>
