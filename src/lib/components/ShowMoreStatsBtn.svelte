<script lang="ts">
  import { browser } from "$app/environment";
  import { createLocalStorageStore } from "$lib/utils";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  const showNotifDot = createLocalStorageStore(
    "showMoreStatsNotifDot",
    browser
  );
</script>

<button
  on:click={(event) => {
    dispatch("showstats");
    event.currentTarget.blur();
    $showNotifDot = false;
  }}
  class="relative mt-2 rounded-full border-[0.125rem] border-zinc-700 bg-zinc-950 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-zinc-500 disabled:opacity-70 hover:border-zinc-400 hover:text-zinc-300"
>
  Show more stats
  {#if $showNotifDot}
    <div class="absolute -right-0.5 top-0 h-2 w-2 rounded-full bg-blue-500" />
  {/if}
</button>
