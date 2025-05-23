<script lang="ts">
  import MatchSummary from "./MatchSummary.svelte";
  import MultiSwitch from "$lib/components/MultiSwitch.svelte";
  import Switch from "$lib/components/Switch.svelte";
  import { formatTime, type FormattedDetailedMatch } from "$lib/formatters";
  import { createLocalStorageStore, isDarkColor } from "$lib/utils";
  import { page } from "$app/stores";
  import MatchTimeline from "./MatchTimeline.svelte";
  import PlayerHead3D from "./PlayerHead3D.svelte";
  import PlayerLink from "./PlayerLink.svelte";
  import RefreshBtn from "./RefreshBtn.svelte";
  import { goto } from "$app/navigation";
  import { getContext } from "svelte";
  import { showingLeaderboard } from "$lib/globals";

  export let match: FormattedDetailedMatch;

  const showingSplits = createLocalStorageStore("showingSplits", false);
  const detailLevel = createLocalStorageStore("detailLevel", 1);

  let scrollingContainer: HTMLElement | undefined;

  const resetScroll = () => {
    if (scrollingContainer) {
      scrollingContainer.scrollTo({ top: 0, left: 0 });
    }
  };
  $: match, resetScroll();

  const close = () => {
    goto(
      "/" +
        $page.url.pathname.split("/").filter(Boolean).slice(0, -1).join("/"),
      { noScroll: true, replaceState: true },
    );
  };
</script>

<div class="flex h-full flex-col p-2 pb-8 pl-4 md:pb-2">
  <div class="flex items-center pl-2 justify-between">
    <MatchSummary {match} />
    <button
      on:click={close}
      class="ml-2 h-9 w-9 rounded-full stroke-zinc-500 stroke-2 hover:bg-zinc-700/50"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <line x1="6" y1="6" x2="18" y2="18" />
        <line x1="6" y1="18" x2="18" y2="6" />
      </svg>
    </button>
  </div>
  {#if match.timelines}
    <div class="m-2">
      {#each match.timelines[$detailLevel] as timeline, i}
        <div class="m-0.5 flex items-center gap-2">
          <div class="-m-5 scale-[35%]">
            <PlayerHead3D uuid={match.playerUUIDs[i]} />
          </div>
          <div class="flex-1">
            <MatchTimeline {timeline} />
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <div
    bind:this={scrollingContainer}
    class="m-2 mr-0 flex-1 overflow-scroll overscroll-none scrollbar-thin scrollbar-track-zinc-800 scrollbar-thumb-zinc-600 hover:scrollbar-thumb-zinc-500"
  >
    <div class="flex w-max gap-4">
      {#each match.playerUUIDs as playerUUID, i}
        {@const timeline = match.timelines?.[$detailLevel][i]}
        {@const displayedTimeline = $showingSplits
          ? timeline?.slice(0, -1)
          : timeline?.slice(1)}
        {@const eloChange = match.eloChanges[i]}
        {@const playerName = match.playerNames[i]}
        <div class="w-max min-w-[16rem] last:min-w-0 2xl:min-w-[18rem]">
          <div class="flex bg-zinc-800/70 backdrop-blur-md">
            <div class="-mr-4 origin-top-left translate-y-1 scale-[60%]">
              <PlayerHead3D uuid={playerUUID} />
            </div>
            <div class="flex-1">
              <h3 class="-mb-2 origin-left text-lg font-semibold text-zinc-300">
                <PlayerLink name={playerName} uuid={playerUUID} />

                {#if playerUUID === match.winnerUUID}
                  <span
                    class="ml-1.5 inline-block -translate-y-0.5 rounded-full bg-green-400 px-1.5 text-[0.6875rem] font-extrabold leading-[0.875rem] text-green-950"
                    >WINNER</span
                  >
                {/if}
              </h3>
              {#if eloChange}
                {@const { before, change } = eloChange}
                <div
                  class="inline-block {change > 0
                    ? 'text-green-400'
                    : change < 0
                      ? 'text-red-400'
                      : 'text-blue-400'} text-xs font-extrabold"
                >
                  {before} → {before + change} elo ({change >= 0
                    ? "+"
                    : ""}{change})
                </div>
              {/if}
            </div>
          </div>

          {#if displayedTimeline}
            <div class="mt-2 flex gap-1">
              <div class="w-14">
                {#each displayedTimeline as event (event.name)}
                  {@const time = $showingSplits
                    ? event.splitAfter.length
                    : event.timestamp}
                  {@const textColor = isDarkColor(event.color)
                    ? "text-white/60"
                    : "text-black/80"}
                  <!-- in:scale={{ start: 0.7, duration: 150, delay: 150 }} -->
                  <div class="flex h-7 items-center">
                    <div
                      class="w-full -translate-y-0.5 overflow-clip rounded-full px-1.5 text-center text-sm font-bold {textColor}"
                      style="background-color: {event.color}"
                    >
                      {formatTime(time)}
                    </div>
                  </div>
                {/each}
              </div>
              <ol class="flex-1">
                {#each displayedTimeline as event (event.name)}
                  {@const name = $showingSplits
                    ? event.splitAfter?.name
                    : event.name}
                  {@const diff = $showingSplits
                    ? event.splitAfter?.diff
                    : event.diff}
                  {@const pairToRight = $showingSplits
                    ? event.splitAfter?.pairToRight
                    : event.pairToRight}
                  {@const pairToLeft = $showingSplits
                    ? event.splitAfter?.pairToLeft
                    : event.pairToLeft}
                  <!-- in:scale={{ start: 0.7, duration: 150, delay: 150 }} -->
                  <li class="h-7 w-full origin-left">
                    {#if pairToRight}
                      <div class="flex">
                        {#if diff}
                          <div
                            class="mx-1 w-14 translate-y-0.5 text-center text-sm font-semibold"
                            style="color: {diff.color};"
                          >
                            {formatTime(diff.time, { signed: true })}
                          </div>
                        {:else}
                          <div class="ml-1 w-14" />
                        {/if}
                        <div class="flex-1 text-center">{name}</div>
                      </div>
                    {:else}
                      {#if !pairToLeft}
                        <span class="ml-2">{name}</span>
                      {/if}
                      {#if diff}
                        <span
                          class="ml-2 translate-y-0.5 text-sm font-semibold"
                          style="color: {diff.color};"
                          >{formatTime(diff.time, { signed: true })}</span
                        >
                      {/if}
                    {/if}
                  </li>
                {/each}
              </ol>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  </div>
  {#if match.timelines}
    <div class="flex justify-between pr-2">
      <Switch
        bind:onFirst={$showingSplits}
        options={["Splits", "Timestamps"]}
      />
      <MultiSwitch
        bind:selectedIdx={$detailLevel}
        label="Detail"
        options={["low", "med", "high", "all"]}
      />
    </div>
  {:else}
    <div class="p-12 font-semibold text-zinc-500">
      <div class="mx-auto w-max">
        Timelines aren't available for this match
        <br /><br />
        If the match just ended, try refreshing
        <br /><br />
        <RefreshBtn />
      </div>
    </div>
  {/if}
</div>
