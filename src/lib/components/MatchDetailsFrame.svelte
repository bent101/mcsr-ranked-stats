<script lang="ts">
  import { page } from "$app/stores";
  import { cn } from "$lib/utils";
</script>

<div class="pointer-events-none fixed inset-x-0 bottom-0 z-10 px-4">
  <div
    class={cn(
      "frame duration-250 pointer-events-auto relative ml-auto max-w-xl overflow-hidden rounded-t-3xl border border-zinc-700/60 bg-zinc-800 shadow-lg shadow-black/30 transition-transform 2xl:ml-[49rem] 2xl:max-w-2xl 3xl:max-w-3xl",
      $page.params.matchID || $page.params.playerUUID
        ? "translate-y-0 pb-0"
        : "translate-y-[calc(var(--frame-height)-6rem)] pb-[calc(var(--frame-height)-6rem)]",
    )}
  >
    <slot />
  </div>
</div>

<style>
  :root {
    --top-margin: 22rem;
    @media (min-width: 768px) {
      --top-margin: 5rem;
    }

    --frame-height: min(33rem, calc(100svh - var(--top-margin)));
  }

  .frame {
    height: var(--frame-height);
  }
</style>
