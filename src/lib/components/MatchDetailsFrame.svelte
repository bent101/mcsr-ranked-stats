<script lang="ts">
  import { page } from "$app/stores";
  import { cn } from "$lib/utils";
</script>

<div class="pointer-events-none fixed inset-x-0 bottom-4 z-10 px-4 md:bottom-0">
  <div
    class={cn(
      "frame duration-250 pointer-events-auto relative ml-auto max-w-xl overflow-hidden rounded-3xl border border-zinc-700/60 bg-zinc-800 shadow-lg shadow-black/30 transition-[transform,height] md:rounded-b-none 2xl:ml-[49rem] 2xl:max-w-2xl 3xl:max-w-3xl",
      $page.params.matchID || $page.params.playerUUID
        ? "h-[min(33rem,calc(100vh-11rem))]"
        : "h-24",
    )}
  >
    <slot />
  </div>
</div>
