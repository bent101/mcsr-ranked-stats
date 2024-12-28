<script lang="ts">
  import playoffsDeco from "$lib/assets/playoffs-deco.png";
  import { cn } from "$lib/utils";

  export let data;
  $: ({ playoffs } = data);
</script>

<div class="flex items-center justify-center gap-4">
  <div class="flex items-center gap-6">
    <a
      class={cn(
        "grid size-10 shrink-0 place-items-center rounded-full text-3xl text-zinc-400 hover:bg-white/5",
        playoffs.data.season === 1 && "pointer-events-none opacity-30",
      )}
      href={`?season=${playoffs.prev}`}
      data-sveltekit-noscroll
      data-sveltekit-replacestate
    >
      <span class="inline-block -translate-y-px select-none">&lt;</span>
    </a>
    <div class="flex flex-col items-center text-xl md:block md:text-4xl">
      <h1 class="inline text-zinc-300" translate="no">MCSR Ranked Playoffs</h1>
      <span class="text-zinc-500">Season {playoffs.data.season}</span>
    </div>
    <a
      class={cn(
        "grid size-10 shrink-0 place-items-center rounded-full font-minecraft text-3xl text-zinc-400 hover:bg-white/5",
        playoffs.next === null && "pointer-events-none opacity-30",
      )}
      href={`?season=${playoffs.next}`}
      data-sveltekit-noscroll
      data-sveltekit-replacestate
    >
      <span class="inline-block -translate-y-px translate-x-0.5 select-none"
        >&gt;</span
      >
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
