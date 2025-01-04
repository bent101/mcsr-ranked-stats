<script lang="ts">
  import playoffsDeco from "$lib/assets/playoffs-deco.png";
  import { lastPlayoffsSeason } from "$lib/last-playoffs-season";
  import { cn } from "$lib/utils";
  import type { PlayoffsResponse } from "$lib/ranked-api";
  import PixelChevronLeft from "$lib/components/PixelChevronLeft.svelte";
  import PixelChevronRight from "$lib/components/PixelChevronRight.svelte";

  export let playoffs: PlayoffsResponse;
</script>

<div class="flex items-center justify-center gap-4">
  <div class="flex items-center gap-6">
    <a
      class={cn(
        "translate-y-0.5 rounded-full p-2 hover:bg-white/5",
        playoffs.data.season === 1 && "pointer-events-none opacity-30",
      )}
      href={`/playoffs/${playoffs.prev}`}
      data-sveltekit-noscroll
      data-sveltekit-replacestate
    >
      <PixelChevronLeft class="size-6 fill-zinc-400" />
    </a>
    <div class="flex flex-col items-center text-xl md:block md:text-4xl">
      <h1 class="inline text-zinc-300" translate="no">MCSR Ranked Playoffs</h1>
      <span class="text-zinc-500">Season {playoffs.data.season}</span>
    </div>
    <a
      class={cn(
        "translate-y-0.5 rounded-full p-2 hover:bg-white/5",
        playoffs.next === null && "pointer-events-none opacity-30",
      )}
      href={playoffs.next === lastPlayoffsSeason
        ? `/playoffs`
        : `/playoffs/${playoffs.next}`}
      data-sveltekit-noscroll
      data-sveltekit-replacestate
    >
      <PixelChevronRight class="size-6 fill-zinc-400" />
    </a>
  </div>
</div>
<div class="mx-auto flex max-w-2xl items-center gap-1 pt-1 opacity-40">
  <div class="h-px flex-1 bg-gradient-to-l from-white to-transparent"></div>
  <img
    src={playoffsDeco}
    alt=""
    class="size-6 -rotate-45 [image-rendering:pixelated]"
  />
  <div class="h-px flex-1 bg-gradient-to-r from-white to-transparent"></div>
</div>
