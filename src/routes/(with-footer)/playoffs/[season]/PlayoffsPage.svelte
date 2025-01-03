<script lang="ts">
  import PlayoffsHeader from "./PlayoffsHeader.svelte";

  import Tabs from "$lib/components/Tabs.svelte";
  import type { PlayoffsResponse } from "$lib/ranked-api";
  import { rem2px } from "$lib/utils";
  import { writable } from "svelte/store";
  import { playoffsTimeTravel } from "./playoffs-time-travel";
  import PlayoffsBracket from "./PlayoffsBracket.svelte";
  import PlayoffsPlayers from "./PlayoffsPlayers.svelte";
  import PlayoffsResults from "./PlayoffsResults.svelte";
  import PlayoffsSchedule from "./PlayoffsSchedule.svelte";
  import { curDate } from "$lib/globals";
  import { formatDate } from "date-fns";

  export let realPlayoffs: PlayoffsResponse;

  $: playoffs = playoffsTimeTravel(realPlayoffs, $curDate);

  let curHoveredPlayer = writable<string | null>(null);
  let curHoveredMatchId = writable<number | null>(null);

  $: desktopTabs =
    playoffs.data.results != null && playoffs.data.results.length > 0
      ? ["Results", "Schedule", "Players"]
      : ["Schedule", "Players"];
  $: mobileTabs = ["Bracket", ...desktopTabs];

  let desktopTab = "Schedule";
  let mobileTab = "Schedule";
</script>

<svelte:head>
  <title>Playoffs | MCSR Ranked</title>
</svelte:head>

{#if realPlayoffs.data.matches.length > 0}
  {@const times = realPlayoffs.data.matches
    .filter((m) => m.startTime !== null)
    .map((m) => m.startTime)}
  {@const minTime = Math.min(...times) - 2 * 60 * 60}
  {@const maxTime = Math.max(...times) + 2 * 60 * 60}
  <div class="p-4">
    <div
      class="flex justify-between text-sm tabular-nums tracking-tighter text-zinc-500"
    >
      <span>
        {formatDate(new Date(minTime * 1000), "MM/dd/yy, h:mm aa")}
      </span>
      <span>
        {formatDate(new Date($curDate * 1000), "MM/dd/yy, hh:mm:ss aa")}
      </span>
      <span>
        {formatDate(new Date(maxTime * 1000), "MM/dd/yy, h:mm aa")}
      </span>
    </div>
    <input
      type="range"
      min={minTime}
      max={maxTime}
      step={60 * 15}
      bind:value={$curDate}
      class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-700 accent-light-green"
    />
  </div>
{/if}

<div
  class="relative mx-auto max-w-[1470px] px-4 pb-16 pt-4 font-minecraft md:pt-8"
>
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
            if (window.scrollY > rem2px(6.5)) {
              window.scrollTo(0, rem2px(6.5));
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
