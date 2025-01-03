<script lang="ts" generics="T">
  import type { Writable } from "svelte/store";
  import { isTouchScreen } from "$lib/globals";

  export let store: Writable<T | null>;
  export let value: T;
  export let disabled: boolean = false;

  $: isHovered = !disabled && value === $store && !$isTouchScreen;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  on:mouseenter={() => ($store = value)}
  on:mouseleave={() => ($store = null)}
  class={$$props.class}
>
  <slot {isHovered} />
</div>
