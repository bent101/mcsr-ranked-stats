<script lang="ts">
	import { formatMatches, getLeaderboardURL, getMatchesURL } from "$lib/utils.js";
	import { afterNavigate, goto, invalidate } from "$app/navigation";
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import PlayerProfile from "./PlayerProfile.svelte";
	import type { AfterNavigate } from "@sveltejs/kit";
	import { matchesPerPage } from "$lib/globals";
	import Graph from "./Graph.svelte";

	export let data;
	let infiniteScrollPadding: HTMLElement;

	const addMoreMatches = async () => {
		console.log("add more matches");
		if (data.noMoreMatches) return;
		console.log("more matches");
		const matches = await fetch(getMatchesURL(data.playerData.nickname, data.curPage++))
			.then((res) => res.json())
			.then((res) => formatMatches(res.data ?? [], data.playerData.nickname));
		data.matches = [...data.matches, ...matches];
		data.noMoreMatches = matches.length < matchesPerPage;
	};

	let io: IntersectionObserver;

	onMount(() => {
		io = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				addMoreMatches();
			}
		});
		io.observe(infiniteScrollPadding);
	});

	$: numMatches =
		data.playerData.records[2].win +
		data.playerData.records[2].lose +
		data.playerData.records[2].draw;

	afterNavigate((navigation: AfterNavigate) => {
		const curPlayerOnLb = data.lb.users.find((user) => user.nickname === data.playerData.nickname);

		if (curPlayerOnLb && curPlayerOnLb.elo_rate !== data.playerData.elo_rate) {
			invalidate(getLeaderboardURL());
		}
	});
</script>

<svelte:head>
	<title>{data.playerData.nickname}'s stats</title>
</svelte:head>

<div class="sticky top-0 z-10 bg-zinc-900/70 backdrop-blur-md">
	<PlayerProfile playerData={data.playerData} />
</div>
<div class="flex">
	<div class="m-4 flex w-max flex-col items-center p-4">
		<h2
			class="mx-4 mb-2 mt-0 w-full border-b-2 border-zinc-800 px-4 pb-2 font-bold uppercase text-zinc-400">
			Matches <span
				class="ml-2 rounded-full bg-zinc-400 px-2 py-0.5 text-sm font-bold text-zinc-900"
				>{numMatches}</span>
		</h2>
		<ol class="pb-16">
			{#each data.matches as { isDecay, opponent, outcome, forfeit, time, eloChange, date, id }}
				{@const selected = $page.url.pathname === `/${data.playerData.nickname}/${id}`}
				{@const color = outcome
					? { won: "text-green-400", lost: "text-red-400", draw: "text-blue-400" }[outcome]
					: "text-zinc-400"}
				<li class={selected ? "sticky" : ""}>
					{#if isDecay}
						<div
							class="group flex items-center gap-2 rounded-lg px-4 py-1.5 hocus-within:bg-zinc-800">
							<div class="w-40 italic text-zinc-500">Elo decay</div>
							<div class="w-20 text-center text-sm font-bold uppercase text-red-400">
								{eloChange >= 0 ? "+" : ""}{eloChange} elo
							</div>
							<div class="w-20" />
							<!-- <div class=" w-36 text-zinc-600">{date}</div> -->
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
									? `text-sm font-semibold uppercase ${
											selected ? 'text-zinc-300' : 'text-zinc-600'
									  }`
									: ''} {selected ? 'text-zinc-300' : 'text-zinc-500'} ">
								{outcome === "draw" ? "" : forfeit ? "Forfeit" : time}
							</div>
							<!-- <div class="w-36 text-right text-zinc-{selected ? 50 : 600}">{date}</div> -->
						</a>
					{/if}
				</li>
			{/each}
		</ol>
		<div class="mb-[80vh] text-center text-zinc-600" bind:this={infiniteScrollPadding}>
			{data.noMoreMatches ? "No more matches" : "Loading..."}
		</div>
	</div>
	<div class="relative flex-1 pr-16">
		<div class="sticky top-40">
			<Graph matches={data.matches} />
		</div>
	</div>
</div>

<div class="fixed bottom-4 right-4">
	<slot />
</div>
