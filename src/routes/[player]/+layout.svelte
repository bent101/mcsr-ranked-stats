<script lang="ts">
	import { browser } from "$app/environment";
	import { afterNavigate, invalidate } from "$app/navigation";
	import Graph from "$lib/components/Graph.svelte";
	import MatchDetailsFrame from "$lib/components/MatchDetailsFrame.svelte";
	import MatchesTableRow from "$lib/components/MatchesTableRow.svelte";
	import PlayerProfile from "$lib/components/PlayerProfile.svelte";
	import RefreshBtn from "$lib/components/RefreshBtn.svelte";
	import { getAllMatches, getMatches } from "$lib/formatters";
	import { curDate, matchesPerPage } from "$lib/globals";
	import { getLeaderboardURL } from "$lib/urls";
	import { onMount } from "svelte";

	export let data;
	$: numMatches = data.playerData.season_played;

	let infiniteScrollPadding: HTMLElement | undefined;
	let loadingAllMatches = false;
	// let showingStats = false;

	const showMoreMatches = async () => {
		if (data.matches.noMoreMatches || loadingAllMatches) return;
		const matches = await getMatches(data.playerData.nickname, data.curPage++, matchesPerPage);
		data.matches.data = [...data.matches.data, ...matches];
		data.matches.noMoreMatches = matches.length < matchesPerPage;
	};

	const showAllMatches = async () => {
		loadingAllMatches = true;

		data.matches.data = await getAllMatches(data.playerData.nickname, numMatches);

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
		const curPlayerOnLb = data.lb.users.find((user) => user.nickname === data.playerData.nickname);

		if (curPlayerOnLb) {
			if (
				curPlayerOnLb.elo_rate !== data.playerData.elo_rate ||
				curPlayerOnLb.elo_rank !== data.playerData.elo_rank
			) {
				invalidate(getLeaderboardURL());
			}
		}
	});
</script>

<svelte:head>
	<title>{data.playerData.nickname} | MCSR Ranked stats</title>
</svelte:head>

<div class="hidden h-8 xl:block" />
<div class="sticky top-0 z-10 bg-zinc-900/70 backdrop-blur-md">
	<PlayerProfile isHeader showAllStatsBtn playerData={data.playerData} />
</div>
<div class="h-8 lg:hidden" />

<div class="contents lg:hidden">
	<div class="mx-auto max-w-3xl p-8 pl-2">
		<div class="relative">
			<Graph matches={data.matches.data} />
			{#if browser}
				<button
					on:click={showAllMatches}
					disabled={loadingAllMatches || data.matches.noMoreMatches}
					class="absolute bottom-[calc(50px+0.2rem)] left-[calc(70px+0.2rem)] rounded-full border-[0.125rem] border-zinc-700 bg-zinc-950 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-zinc-500 disabled:opacity-70 hover:border-zinc-400 hover:text-zinc-300 disabled:hover:border-zinc-700 disabled:hover:text-zinc-500">
					{loadingAllMatches
						? "Loading..."
						: data.matches.noMoreMatches
						? "Showing all"
						: "Show all"}
				</button>
			{:else}
				<div class="absolute inset-0 grid place-items-center">
					<p class="text-zinc-500 text-lg font-semibold animate-pulse">Loading graph...</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<div class="flex flex-col items-center px-4 md:flex-row md:items-start">
	<div>
		<div class="h-8" />
		<div class="w-[30rem]">
			<div class="mb-2 flex items-center border-b-2 border-zinc-800 p-4 pb-1 pl-4">
				<h2 class="text-sm font-bold uppercase text-zinc-400">Matches</h2>
				<div class="ml-2 rounded-full bg-zinc-400 px-2 py-0.5 text-xs font-extrabold text-zinc-900">
					{numMatches}
				</div>
				<div class="ml-auto"><RefreshBtn /></div>
			</div>
			{#if data.matches.data && data.matches.data.length > 0}
				<ol class="pb-16">
					{#each data.matches.data as match}
						<li>
							<MatchesTableRow {match} curDate={$curDate} />
						</li>
					{/each}
				</ol>
				<div class="pb-[36rem] text-center text-zinc-600" bind:this={infiniteScrollPadding}>
					{data.matches.noMoreMatches ? "No more matches" : "Loading..."}
				</div>
			{:else}
				<div class="text-center text-zinc-600">No matches yet this season</div>
			{/if}
		</div>
	</div>
	<div class="hidden lg:contents">
		<div class="sticky top-40 h-max flex-1">
			<div class="relative">
				<Graph matches={data.matches.data} />
				{#if browser}
					<button
						on:click={showAllMatches}
						disabled={loadingAllMatches || data.matches.noMoreMatches}
						class="absolute bottom-[58px] left-[78px] rounded-full border-[0.125rem] border-zinc-700 bg-zinc-950 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-zinc-500 disabled:opacity-70 hover:border-zinc-400 hover:text-zinc-300 disabled:hover:border-zinc-700 disabled:hover:text-zinc-500">
						{loadingAllMatches
							? "Loading..."
							: data.matches.noMoreMatches
							? "Showing all"
							: "Show all"}
					</button>
				{:else}
					<div class="absolute inset-0 grid place-items-center">
						<p class="text-zinc-500 text-lg font-semibold animate-pulse">Loading graph...</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<MatchDetailsFrame>
	<slot />
</MatchDetailsFrame>

<!-- {#if showingStats}
	<DetailedPlayerStats
		on:close={() => {
			showingStats = false;
		}}
		playerName={data.playerData.nickname}
		{numMatches}
		playerData={data.playerData} />
{/if} -->
