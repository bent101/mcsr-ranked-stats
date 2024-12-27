<script lang="ts">
  import PlayoffsBracket from "./PlayoffsBracket.svelte";
  import { writable } from "svelte/store";
  import PlayoffsResults from "./PlayoffsResults.svelte";
  import PlayoffsSchedule from "./PlayoffsSchedule.svelte";
  import MatchDetailsFrame from "$lib/components/MatchDetailsFrame.svelte";
  import PlayoffsPlayers from "./PlayoffsPlayers.svelte";
  import Tabs from "$lib/components/Tabs.svelte";

  export let data;
  $: ({ playoffsData } = data);

  let curHoveredPlayer = writable<string | null>(null);
  let curHoveredMatchId = writable<number | null>(null);

  const desktopTabs = ["Results", "Schedule", "Players"] as const;
  let desktopTab: (typeof desktopTabs)[number] = "Results";
</script>

<svelte:head>
  <title>Playoffs | MCSR Ranked</title>
</svelte:head>

<div class="relative mx-auto max-w-screen-2xl px-4 pb-16 pt-8 font-minecraft">
  <h1 class="text-2xl font-bold text-zinc-300 sm:text-4xl" translate="no">
    MCSR Ranked Playoffs
  </h1>
  <div class="flex">
    <div class="flex-1 overflow-x-auto">
      <PlayoffsBracket {playoffsData} {curHoveredPlayer} {curHoveredMatchId} />
    </div>
    <div class="w-[24rem] shrink-0 pl-2">
      <Tabs tabs={desktopTabs} bind:currentTab={desktopTab} />
      <div class="h-4" />
      {#if desktopTab === "Results"}
        <PlayoffsResults {playoffsData} {curHoveredPlayer} />
      {:else if desktopTab === "Schedule"}
        <PlayoffsSchedule
          {playoffsData}
          {curHoveredPlayer}
          {curHoveredMatchId}
        />
      {:else if desktopTab === "Players"}
        <PlayoffsPlayers
          {playoffsData}
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
