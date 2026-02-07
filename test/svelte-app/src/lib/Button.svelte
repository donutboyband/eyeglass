<script lang="ts">
  interface Props {
    variant?: 'primary' | 'secondary'
    onclick?: () => void
    children?: import('svelte').Snippet
  }

  let { variant = 'primary', onclick, children }: Props = $props()
</script>

<button class="btn btn-{variant}" {onclick}>
  {@render children?.()}
</button>

<style>
  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
  }

  .btn-primary {
    background: #ff3e00;
    color: white;
  }

  .btn-primary:hover {
    background: #d63600;
  }

  .btn-secondary {
    background: #e2e8f0;
    color: #475569;
  }

  .btn-secondary:hover {
    background: #cbd5e1;
  }
</style>
