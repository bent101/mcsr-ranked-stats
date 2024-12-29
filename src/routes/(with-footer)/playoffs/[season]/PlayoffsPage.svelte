<script lang="ts">
  import PlayoffsHeader from "./PlayoffsHeader.svelte";

  import Tabs from "$lib/components/Tabs.svelte";
  import { writable } from "svelte/store";
  import PlayoffsBracket from "./PlayoffsBracket.svelte";
  import PlayoffsPlayers from "./PlayoffsPlayers.svelte";
  import PlayoffsResults from "./PlayoffsResults.svelte";
  import PlayoffsSchedule from "./PlayoffsSchedule.svelte";
  import { rem2px } from "$lib/utils";
  import type { PlayoffsResponse } from "$lib/ranked-api";

  export let playoffs: PlayoffsResponse;

  let curHoveredPlayer = writable<string | null>(null);
  let curHoveredMatchId = writable<number | null>(null);

  const desktopTabs = ["Results", "Schedule", "Players"] as const;
  const mobileTabs = ["Bracket", ...desktopTabs] as const;

  // these arent reactive by design -- if the tab list changes, the tab shouldnt change,
  // but the tab should start out as the first tab in the list
  let desktopTab: (typeof desktopTabs)[number] = desktopTabs[0];
  let mobileTab: (typeof mobileTabs)[number] = mobileTabs[0];
</script>

<svelte:head>
  <title>Playoffs | MCSR Ranked</title>
</svelte:head>

<div class="relative mx-auto max-w-[1600px] px-4 pb-16 pt-8 font-minecraft">
  <PlayoffsHeader {playoffs} />

  <!-- desktop layout -->
  <div class="hidden lg:flex">
    <div class="flex-1 overflow-x-auto">
      <PlayoffsBracket {playoffs} {curHoveredPlayer} {curHoveredMatchId} />
    </div>
    <div class="relative w-[26rem] shrink-0 pl-2">
      <div
        class="pointer-events-none absolute inset-y-0 right-full z-10 w-6 bg-gradient-to-r from-transparent to-zinc-900"
      ></div>
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

  <!-- mobile layout -->
  <div class="lg:hidden">
    <div
      class="sticky top-header-height z-10 -mx-4 bg-zinc-900/90 px-4 backdrop-blur-md"
    >
      <div class="mx-auto max-w-md">
        <Tabs
          tabs={mobileTabs}
          spaceEvenly
          bind:currentTab={mobileTab}
          onSwitch={() => {
            if (window.scrollY > rem2px(7.5)) {
              window.scrollTo(0, rem2px(7.5));
            }
          }}
        />
      </div>
    </div>
    <div class="h-4" />
    {#if mobileTab === "Bracket"}
      {#key playoffs.data.season}
        <div class="overflow-x-auto">
          <PlayoffsBracket {playoffs} {curHoveredPlayer} {curHoveredMatchId} />
        </div>
      {/key}
    {:else if mobileTab === "Results"}
      <div class="mx-auto max-w-md">
        <PlayoffsResults playoffsData={playoffs.data} {curHoveredPlayer} />
      </div>
    {:else if mobileTab === "Schedule"}
      <div class="mx-auto max-w-md">
        <PlayoffsSchedule
          playoffsData={playoffs.data}
          {curHoveredPlayer}
          {curHoveredMatchId}
        />
      </div>
    {:else if mobileTab === "Players"}
      <div class="mx-auto max-w-md">
        <PlayoffsPlayers
          playoffsData={playoffs.data}
          {curHoveredPlayer}
          {curHoveredMatchId}
        />
      </div>
    {/if}
  </div>
</div>

<slot />
