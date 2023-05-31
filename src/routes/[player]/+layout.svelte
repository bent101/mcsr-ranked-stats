<script lang="ts">
	import { formatMatches, getLeaderboardURL, getMatchesURL } from "$lib/utils.js";
	import { afterNavigate, invalidate } from "$app/navigation";
	import { onMount } from "svelte";
	import PlayerProfile from "$lib/PlayerProfile.svelte";
	import { matchesPerPage } from "$lib/globals";
	import Graph from "./Graph.svelte";
	import MatchesTableRow from "$lib/MatchesTableRow.svelte";

	export let data;
	let infiniteScrollPadding: HTMLElement | undefined;

	const addMoreMatches = async () => {
		if (data.noMoreMatches) return;
		const matches = await fetch(getMatchesURL(data.playerData.nickname, data.curPage++))
			.then((res) => res.json())
			.then((res) => formatMatches(res.data ?? [], data.playerData.nickname));
		data.matches = [...data.matches, ...matches];
		data.noMoreMatches = matches.length < matchesPerPage;
	};

	let io: IntersectionObserver;

	onMount(() => {
		if (infiniteScrollPadding) {
			io = new IntersectionObserver(([entry]) => {
				if (entry.isIntersecting) {
					addMoreMatches();
				}
			});
			io.observe(infiniteScrollPadding);
		}
	});

	$: numMatches =
		data.playerData.records[2].win +
		data.playerData.records[2].lose +
		data.playerData.records[2].draw;

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

<div class="flex">
	<div>
		<div class="hidden h-8 xl:block" />
		<div class="sticky top-0 z-10 w-[32rem] bg-zinc-900/70 backdrop-blur-md">
			<PlayerProfile playerData={data.playerData} />
		</div>
		<div class="m-4 p-4">
			<h2
				class="mb-2 mt-4 border-b-2 border-zinc-800 pb-1 pl-4 text-sm font-bold uppercase text-zinc-400">
				Matches <span
					class="ml-2 rounded-full bg-zinc-400 px-2 py-0.5 text-xs font-extrabold text-zinc-900"
					>{numMatches}</span>
			</h2>
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
	<div class="sticky top-0 flex h-screen flex-1 flex-col gap-4 p-8 pl-0">
		<Graph matches={data.matches} />
		<div class="relative flex-1">
			<div
				class="absolute bottom-0 left-0 min-w-[30rem] rounded-3xl bg-zinc-800 p-4 shadow-lg shadow-black/30">
				<slot />
			</div>
		</div>
	</div>
</div>
