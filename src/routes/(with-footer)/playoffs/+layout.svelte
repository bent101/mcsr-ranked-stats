<script lang="ts">
  import Tabs from "$lib/components/Tabs.svelte";
  import { writable } from "svelte/store";
  import PlayoffsBracket from "./PlayoffsBracket.svelte";
  import PlayoffsPlayers from "./PlayoffsPlayers.svelte";
  import PlayoffsResults from "./PlayoffsResults.svelte";
  import PlayoffsSchedule from "./PlayoffsSchedule.svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  export let data;
  $: ({ playoffs } = data);

  let curHoveredPlayer = writable<string | null>(null);
  let curHoveredMatchId = writable<number | null>(null);

  const desktopTabs = ["Results", "Schedule", "Players"] as const;
  let desktopTab: (typeof desktopTabs)[number] = "Results";
</script>

<svelte:head>
  <title>Playoffs | MCSR Ranked</title>
</svelte:head>

<div class="relative mx-auto max-w-screen-2xl px-4 pb-16 pt-8 font-minecraft">
  <div class="flex items-center justify-center gap-4">
    <div class="flex items-center gap-6">
      <button
        class="size-10 shrink-0 rounded-full font-minecraft text-3xl text-zinc-600 disabled:opacity-50 hover:bg-white/5"
        disabled={playoffs.data.season === 1}
        on:click={() => {
          goto(`?season=${playoffs.prev}`);
        }}
      >
        <span class="inline-block -translate-y-px">&lt;</span>
      </button>
      <div class="flex flex-col items-center text-2xl sm:block sm:text-4xl">
        <h1 class="inline text-zinc-300" translate="no">
          MCSR Ranked Playoffs
        </h1>
        <span class="text-zinc-500">Season {playoffs.data.season}</span>
      </div>
      <button
        class="size-10 shrink-0 rounded-full font-minecraft text-3xl text-zinc-600 disabled:opacity-50 hover:bg-white/5"
        disabled={playoffs.next === null}
        on:click={() => {
          goto(`?season=${playoffs.next}`);
        }}
      >
        <span class="inline-block -translate-y-px translate-x-0.5">&gt;</span>
      </button>
    </div>
  </div>
  <div class="mx-auto flex max-w-2xl items-center gap-1 pt-1">
    <div
      class="h-px flex-1 bg-gradient-to-l from-white/60 to-transparent"
    ></div>
    <img
      src="/playoffs-deco.png"
      alt=""
      class=" size-5 -rotate-45 opacity-60 [image-rendering:pixelated]"
    />
    <div
      class="h-px flex-1 bg-gradient-to-r from-white/60 to-transparent"
    ></div>
  </div>
  <div class="flex">
    <div class="flex-1 overflow-x-auto">
      <PlayoffsBracket
        playoffsData={playoffs.data}
        {curHoveredPlayer}
        {curHoveredMatchId}
      />
    </div>
    <div class="w-[24rem] shrink-0 pl-2">
      <Tabs tabs={desktopTabs} bind:currentTab={desktopTab} />
      <div class="h-4" />
      {#if desktopTab === "Results"}
        <PlayoffsResults playoffsData={playoffs.data} {curHoveredPlayer} />
      {:else if desktopTab === "Schedule"}
        <PlayoffsSchedule
          playoffsData={playoffs.data}
          {curHoveredPlayer}
          {curHoveredMatchId}
        />
      {:else if desktopTab === "Players"}
        <PlayoffsPlayers
          playoffsData={playoffs.data}
          {curHoveredPlayer}
          {curHoveredMatchId}
        />
      {/if}
    </div>
  </div>
</div>
<!-- 
<MatchDetailsFrame>
  <slot />
</MatchDetailsFrame> -->
