<script lang="ts">
  import { browser } from "$app/environment";
  import {
    afterNavigate,
    goto,
    invalidate,
    preloadData,
  } from "$app/navigation";
  import { page } from "$app/stores";
  import Graph from "$lib/components/Graph.svelte";
  import MatchDetailsFrame from "$lib/components/MatchDetailsFrame.svelte";
  import MatchesTableRow from "$lib/components/MatchesTableRow.svelte";
  import PlayerProfile from "$lib/components/PlayerProfile.svelte";
  import RefreshBtn from "$lib/components/RefreshBtn.svelte";
  import { getAllMatches, getMatches } from "$lib/formatters";
  import { curDate, matchesPerPage } from "$lib/globals";
  import { getLeaderboardURL } from "$lib/urls";
  import { blurActiveElement, isTyping } from "$lib/utils";
  import { getContext, onMount } from "svelte";

  export let data;
  $: numMatches = data.playerData.statistics.season.playedMatches.ranked;
  $: numWins = data.playerData.statistics.season.wins.ranked;
  $: numLosses = data.playerData.statistics.season.loses.ranked;

  let infiniteScrollPadding: HTMLElement | undefined;
  let loadingAllMatches = false;
  // let showingStats = false;

  const showMoreMatches = async () => {
    if (data.matches.noMoreMatches || loadingAllMatches) return;
    const matches = await getMatches(
      data.playerData.nickname,
      data.curPage++,
      matchesPerPage,
    );
    data.matches.data = [...data.matches.data, ...matches];
    data.matches.noMoreMatches = matches.length < matchesPerPage;
  };

  const showAllMatches = async () => {
    loadingAllMatches = true;

    data.matches.data = await getAllMatches(
      data.playerData.nickname,
      numMatches,
    );

    loadingAllMatches = false;
    data.matches.noMoreMatches = true;
  };

  let io: IntersectionObserver;

  onMount(() => {
    if (infiniteScrollPadding) {
      io = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          showMoreMatches();
        }
      });
      io.observe(infiniteScrollPadding);
    }
  });

  afterNavigate(() => {
    const curPlayerOnLb = data.lb.users.find(
      (user) =>
        user.nickname.toLowerCase() === data.playerData.nickname.toLowerCase(),
    );

    if (curPlayerOnLb) {
      if (
        curPlayerOnLb.eloRate !== data.playerData.eloRate ||
        curPlayerOnLb.eloRank !== data.playerData.eloRank
      ) {
        invalidate(getLeaderboardURL());
      }
    }
  });

  $: matchId = $page.params.matchID
    ? parseInt($page.params.matchID)
    : undefined;

  $: nonDecayMatches = data.matches.data.filter((m) => !m.isDecay);
  $: firstMatchId = nonDecayMatches[0].id;

  function getMatchIdByDistance(distance: number) {
    if (!matchId) return undefined;

    const index = nonDecayMatches.findIndex((m) => m.id === matchId) + distance;

    return nonDecayMatches[index]?.id;
  }

  function preloadMatchIfExists(matchId: number | undefined) {
    if (matchId) {
      queueMicrotask(() =>
        preloadData(`/stats/${data.playerData.nickname}/${matchId}`),
      );
    }
  }

  function goToMatch(matchId: number) {
    goto(`/stats/${data.playerData.nickname}/${matchId}`, {
      replaceState: true,
      noScroll: true,
    });
  }
</script>

<svelte:body
  on:keydown={(e) => {
    if (isTyping(e)) return;
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) return;

    switch (e.key) {
      case "j":
      case "ArrowDown":
        const nextMatchId = getMatchIdByDistance(1);
        goToMatch(nextMatchId ?? firstMatchId);
        preloadMatchIfExists(getMatchIdByDistance(2));
        preloadMatchIfExists(getMatchIdByDistance(3));
        break;
      case "k":
      case "ArrowUp":
        const prevMatchId = getMatchIdByDistance(-1);
        goToMatch(prevMatchId ?? firstMatchId);
        preloadMatchIfExists(getMatchIdByDistance(-2));
        preloadMatchIfExists(getMatchIdByDistance(-3));
        break;
      default:
        return;
    }
    e.preventDefault();
    blurActiveElement();
  }}
/>

<svelte:head>
  <title>{data.playerData.nickname} | MCSR Ranked</title>
</svelte:head>

<div class="sticky top-header-height z-10 bg-zinc-900/70 backdrop-blur-md">
  <PlayerProfile isHeader showAllStats playerData={data.playerData} />
</div>

<div class="pl-4">
  <div class="contents lg:hidden">
    <div class="mx-auto max-w-3xl p-8 pl-2">
      <div class="relative">
        <!-- {#key data.playerData.nickname} -->
        {#if data.playerData.eloRate}
          <Graph matches={data.matches.data} />
        {/if}
        <!-- {/key} -->
        {#if browser}
          <button
            on:click={showAllMatches}
            disabled={loadingAllMatches || data.matches.noMoreMatches}
            class="absolute bottom-[calc(20px+2.4rem)] left-[calc(16px+2.4rem)] rounded-full border-[0.125rem] border-zinc-700 bg-zinc-950 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-zinc-500 disabled:opacity-70 hover:border-zinc-400 hover:text-zinc-300 disabled:hover:border-zinc-700 disabled:hover:text-zinc-500"
          >
            {loadingAllMatches
              ? "Loading..."
              : data.matches.noMoreMatches
                ? "Showing all"
                : "Show all"}
          </button>
        {:else}
          <div class="absolute inset-0 grid place-items-center">
            <p class="animate-pulse text-lg font-semibold text-zinc-500">
              Loading graph...
            </p>
          </div>
        {/if}
      </div>
    </div>
  </div>

  <div class="flex flex-col pr-4 md:flex-row md:items-start">
    <div class="mx-auto max-w-[26rem] flex-1 overflow-hidden sm:mx-0">
      <div
        class="mb-2 flex items-center gap-1.5 border-b-2 border-zinc-800 p-4 pb-1 pr-1 text-sm font-bold tabular-nums"
      >
        <h2 class="uppercase text-zinc-400">
          Matches <span class="tracking-tight text-zinc-500"
            >({numMatches})</span
          >
        </h2>
        {#if numMatches > 0}
          <span class="text-zinc-700">•</span>
          <div class="text-zinc-600">
            <span class="tracking-tight text-zinc-500">{numWins}</span>W
            <span class="tracking-tight text-zinc-500">{numLosses}</span>L
          </div>
        {/if}
        <div class="ml-auto"><RefreshBtn /></div>
      </div>
      {#if data.matches.data && data.matches.data.length > 0}
        <div>
          {#each data.matches.data as match}
            <MatchesTableRow {match} />
          {/each}
        </div>
        <div
          class="pb-[34rem] text-center text-zinc-600"
          bind:this={infiniteScrollPadding}
        >
          {#if data.matches.noMoreMatches}
            <p class="pt-16">No more matches</p>
          {:else}
            {#each { length: matchesPerPage } as _}
              <div class="p-2.5">
                <div class="h-5 animate-pulse rounded-full bg-zinc-800/50" />
              </div>
            {/each}
          {/if}
        </div>
      {:else}
        <div class="pt-16 text-center text-zinc-600">
          No matches yet this season
        </div>
      {/if}
    </div>
    <div class="hidden lg:contents">
      <div class="sticky top-56 h-max flex-1">
        <div class="relative">
          <!-- {#key data.playerData.nickname} -->
          {#if data.playerData.eloRate}
            <Graph matches={data.matches.data} />
          {/if}
          <!-- {/key} -->
          {#if browser}
            <button
              on:click={showAllMatches}
              disabled={loadingAllMatches || data.matches.noMoreMatches}
              class="absolute bottom-[58px] left-[60px] rounded-full border-[0.125rem] border-zinc-700 bg-zinc-950 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-zinc-500 disabled:opacity-70 hover:border-zinc-400 hover:text-zinc-300 disabled:hover:border-zinc-700 disabled:hover:text-zinc-500"
            >
              {loadingAllMatches
                ? "Loading..."
                : data.matches.noMoreMatches
                  ? "Showing all"
                  : "Show all"}
            </button>
          {:else}
            <div class="absolute inset-0 grid place-items-center">
              <p class="animate-pulse text-lg font-semibold text-zinc-500">
                Loading graph...
              </p>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>

  {#key data.playerData.nickname}
    <MatchDetailsFrame>
      <slot />
    </MatchDetailsFrame>
  {/key}

  <!-- {#if showingStats}
	<DetailedPlayerStats
		on:close={() => {
			showingStats = false;
		}}
		playerName={data.playerData.nickname}
		{numMatches}
		playerData={data.playerData} />
{/if} -->
</div>
