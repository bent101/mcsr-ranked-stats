<script lang="ts">
	import { afterNavigate, invalidate, invalidateAll } from "$app/navigation";
	import Graph from "$lib/components/Graph.svelte";
	import MatchesTableRow from "$lib/components/MatchesTableRow.svelte";
	import PlayerProfile from "$lib/components/PlayerProfile.svelte";
	import RefreshBtn from "$lib/components/RefreshBtn.svelte";
	import { formatMatches } from "$lib/formatters";
	import { isLgScreen, matchesPerPage } from "$lib/globals";
	import { getLeaderboardURL, getMatchesURL } from "$lib/urls";
	import { flatten } from "@unovis/ts";
	import { onMount } from "svelte";

	export let data;
	$: numMatches = data.playerData.season_played;

	let infiniteScrollPadding: HTMLElement | undefined;
	let loadingAllMatches = false;

	const getMatches = (page: number, perPage: number) => {
		return fetch(getMatchesURL(data.playerData.nickname, page, perPage))
			.then((res) => res.json())
			.then((res) => formatMatches(res.data ?? [], data.playerData.nickname));
	};

	const showMoreMatches = async () => {
		if (data.noMoreMatches || loadingAllMatches) return;
		const matches = await getMatches(data.curPage++, matchesPerPage);
		data.matches = [...data.matches, ...matches];
		data.noMoreMatches = matches.length < matchesPerPage;
	};

	const showAllMatches = async () => {
		loadingAllMatches = true;

		const numPages = Math.ceil(numMatches / 50);

		data.matches = flatten(
			await Promise.all(
				Array(numPages)
					.fill(undefined)
					.map((_, i) => getMatches(i, 50))
			)
		);

		loadingAllMatches = false;
		data.noMoreMatches = true;
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
	<title>{data.playerData.nickname}'s stats | MCSR Ranked stats</title>
</svelte:head>

<div class="hidden h-8 xl:block" />
<div class="sticky top-0 z-10 bg-zinc-900/70 backdrop-blur-md">
	<div class="">
		<PlayerProfile playerData={data.playerData} />
	</div>
</div>
<div class="h-8 lg:hidden" />
{#if !$isLgScreen}
	<div class="mx-auto max-w-3xl p-8 pl-2">
		<div class="relative h-[calc(max(24rem,60vh))]">
			<Graph matches={data.matches} />
			<button
				on:click={showAllMatches}
				disabled={loadingAllMatches || data.noMoreMatches}
				class="absolute bottom-[50px] left-[70px] w-32 rounded-full border-2 border-zinc-700 bg-zinc-950 px-2 py-1 text-xs font-extrabold uppercase tracking-wide text-zinc-500 disabled:opacity-70"
				>{loadingAllMatches
					? "Loading..."
					: data.noMoreMatches
					? "Showing all"
					: "Show all"}</button>
		</div>
	</div>
{/if}
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
			{#if data.matches && data.matches.length > 0}
				<ol class="pb-16">
					{#each data.matches as match}
						<li>
							<MatchesTableRow {match} />
						</li>
					{/each}
				</ol>
				<div class="mb-[80vh] text-center text-zinc-600" bind:this={infiniteScrollPadding}>
					{data.noMoreMatches ? "No more matches" : "Loading..."}
				</div>
			{:else}
				<div class="text-center text-zinc-600">No matches yet this season</div>
			{/if}
		</div>
	</div>
	{#if $isLgScreen}
		<div class="sticky top-32 h-max flex-1">
			<div class="relative h-[calc(max(24rem,60vh))]">
				<Graph matches={data.matches} />
				<button
					on:click={showAllMatches}
					disabled={loadingAllMatches || data.noMoreMatches}
					class="absolute bottom-[50px] left-[70px] w-32 rounded-full border-2 border-zinc-700 bg-zinc-950 px-2 py-1 text-xs font-extrabold uppercase tracking-wide text-zinc-500 disabled:opacity-70"
					>{loadingAllMatches
						? "Loading..."
						: data.noMoreMatches
						? "Showing all"
						: "Show all"}</button>
			</div>
		</div>
	{/if}
</div>
<div class="pointer-events-none fixed bottom-0 left-0 right-0">
	<div
		class="pointer-events-auto relative mx-auto min-h-[6rem] w-[35rem] rounded-t-3xl bg-zinc-800 shadow-lg shadow-black/30 md:mr-4 2xl:ml-[52rem] 2xl:w-[43rem] 3xl:w-[52rem]">
		<slot />
	</div>
</div>
