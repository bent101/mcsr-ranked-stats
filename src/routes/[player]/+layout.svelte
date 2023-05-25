<script lang="ts">
	import { formatMatches, getLeaderboardURL, getMatchesURL } from "$lib/utils.js";
	import { afterNavigate, invalidate } from "$app/navigation";
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import PlayerProfile from "./PlayerProfile.svelte";
	import type { AfterNavigate } from "@sveltejs/kit";
	import { matchesPerPage } from "$lib/globals";
	import Graph from "./Graph.svelte";

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

	afterNavigate((navigation: AfterNavigate) => {
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
	<div class="flex flex-col">
		<div class="sticky top-0 z-10 w-full bg-zinc-900/70 backdrop-blur-md">
			<PlayerProfile playerData={data.playerData} />
		</div>
		<div class="m-4 flex w-max flex-col items-center p-4">
			<h2
				class="mx-4 mb-2 mt-8 w-full border-b-2 border-zinc-800 px-4 pb-2 text-sm font-bold uppercase text-zinc-400">
				Matches <span
					class="ml-2 rounded-full bg-zinc-400 px-2 py-0.5 text-xs font-extrabold text-zinc-900"
					>{numMatches}</span>
			</h2>
			{#if data.matches && data.matches.length > 0}
				<ol class="relative pb-16">
					{#each data.matches as { isDecay, opponent, outcome, forfeit, time, eloChange, date, id }}
						{@const selected = $page.url.pathname === `/${data.playerData.nickname}/${id}`}
						{@const color = outcome
							? { won: "text-green-400", lost: "text-red-400", draw: "text-blue-400" }[outcome]
							: "text-zinc-400"}
						<li>
							{#if isDecay}
								<div
									class="group flex items-center gap-2 rounded-lg px-4 py-1.5 hocus-within:bg-zinc-800">
									<div class="w-40 italic text-zinc-500">Elo decay</div>
									<div class="w-20 text-center text-sm font-bold uppercase text-red-400">
										{eloChange >= 0 ? "+" : ""}{eloChange} elo
									</div>
									<div class="w-20" />
									<div class=" w-12 text-right text-zinc-600">{date}</div>
								</div>
							{:else}
								<a
									data-sveltekit-replacestate
									data-sveltekit-noscroll
									href="/{data.playerData.nickname}/{id}"
									class="group flex items-center gap-2 rounded-lg border px-4 py-1.5 text-left {selected
										? 'border-zinc-500 bg-zinc-800'
										: 'border-transparent hocus-within:bg-zinc-800'}">
									<div
										class="w-40 overflow-hidden overflow-ellipsis {selected
											? 'text-zinc-50'
											: 'text-zinc-300'}">
										<a
											data-sveltekit-replacestate="off"
											data-sveltekit-noscroll="off"
											href="/{opponent}"
											class=" hover:underline hover:underline-offset-4">{opponent}</a>
									</div>
									<div class="w-20 text-center uppercase {color} text-sm font-bold">
										<span class="{selected ? ' hidden' : 'inline group-hocus-within:hidden'} "
											>{outcome}</span>
										<span class={selected ? " inline" : "hidden group-hocus-within:inline"}
											>{eloChange >= 0 ? "+" : ""}{eloChange} elo</span>
									</div>
									<div
										class="w-20 text-center font-extrabold tracking-wider {forfeit
											? `text-xs font-semibold uppercase tracking-normal ${
													selected ? 'text-zinc-300' : 'text-zinc-600'
											  }`
											: ''} {selected ? 'text-zinc-300' : 'text-zinc-500'} ">
										{outcome === "draw" ? "" : forfeit ? "Forfeit" : time}
									</div>
									<div class="w-12 text-right {selected ? 'text-zinc-50' : 'text-zinc-600'}">
										{date}
									</div>
								</a>
							{/if}
						</li>
					{/each}
				</ol>
				<div class="mb-[80vh] text-center text-zinc-600" bind:this={infiniteScrollPadding}>
					{data.noMoreMatches ? "No more matches" : "Loading..."}
				</div>
			{:else}
				<div class="w-[26.625rem] text-center text-zinc-600">No matches yet this season</div>
			{/if}
		</div>
	</div>
	<div class="sticky top-0 flex h-screen flex-1 flex-col gap-4 p-8 pl-0">
		<Graph matches={data.matches} />
		<div class="relative flex-1">
			<div
				class="absolute bottom-0 left-0 w-max min-w-[30rem] rounded-3xl bg-zinc-800 p-4 shadow-lg shadow-black/30">
				<slot />
			</div>
		</div>
	</div>
</div>
