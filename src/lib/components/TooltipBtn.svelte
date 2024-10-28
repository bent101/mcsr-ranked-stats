<script lang="ts">
  import Tooltip from "./Tooltip.svelte";

  export let tooltip: string;

  let button: HTMLElement | undefined;
</script>

<button bind:this={button} {...$$props} on:click>
  <slot />
</button>
<Tooltip anchor={button}>
  {tooltip}
</Tooltip>
