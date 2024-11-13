<script lang="ts">
  import { navigating } from "$app/stores";
  import { spring } from "svelte/motion";
  import { fade } from "svelte/transition";
  import { afterNavigate } from "$app/navigation";
  import type { TimeoutId } from "$lib/utils";

  let progress = spring(0, { stiffness: 0.03, damping: 1 });

  $: if ($progress >= 100) {
    progress = spring(0);
  }

  let timeoutId: TimeoutId = -1;

  const beforeNavigationStart = () => {
    if ($navigating !== null) {
      timeoutId = setTimeout(() => {
        progress.stiffness = 0.03;
        $progress = 80;
        timeoutId = -1;
      }, 250);
    }
  };

  $: isNavigating = $navigating !== null;

  $: if (isNavigating) {
    beforeNavigationStart();
  }

  afterNavigate(() => {
    if (timeoutId === -1 && $progress !== 0) {
      progress.stiffness = 0.35;
      $progress = 100;
    } else {
      clearTimeout(timeoutId);
      timeoutId = -1;
    }
  });
</script>

<div class="fixed inset-x-0 top-0 z-50 h-1.5">
  {#if $progress > 0}
    <div
      transition:fade={{ duration: 100 }}
      style="width: {$progress}%"
      class="h-full bg-zinc-600 text-xs text-zinc-700"
    />
  {/if}
</div>
