<script lang="ts">
	import {
		getAvatar,
		formatTime,
		getMatchesURL,
		formatMatches,
		getLeaderboardURL,
		getPlayerURL,
	} from "$lib/utils.js";
	import { afterNavigate, invalidate } from "$app/navigation";
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import PlayerProfile from "./PlayerProfile.svelte";

	export let data;
	let curPage = 1;
	let noMoreMatches = true;
	let matchesContainer: Element;

	$: numMatches =
		data.playerData.records[2].win +
		data.playerData.records[2].lose +
		data.playerData.records[2].draw;

	afterNavigate(() => {
		// matchesContainer.scrollTop = 0;
		curPage = 1;
		noMoreMatches = data.recentMatches.length < 20;

		const curPlayerOnLb = data.lb.users.find((user) => user.nickname === data.playerData.nickname);

		if (curPlayerOnLb && curPlayerOnLb.elo_rate !== data.playerData.elo_rate) {
			invalidate(getLeaderboardURL());
		}
	});

	const addMoreMatches = async () => {
		if (noMoreMatches) return;
		const matches = await fetch(getMatchesURL(data.playerData.nickname, curPage++))
			.then((res) => res.json())
			.then((res) => formatMatches(res.data ?? [], data.playerData.nickname));
		data.recentMatches = [...data.recentMatches, ...matches];
		if (matches.length < 20) noMoreMatches = true;
	};
</script>

<svelte:head>
	<title>{data.playerData.nickname}'s stats</title>
</svelte:head>

<div bind:this={matchesContainer} class="max-h-full overflow-y-scroll overscroll-y-contain">
	<div class="sticky top-0 z-10 bg-zinc-900/70 backdrop-blur-md">
		<PlayerProfile playerData={data.playerData} />
	</div>

	<div class="m-4 flex w-max flex-col items-center p-4">
		<h2
			class="mx-4 mb-2 mt-0 w-full border-b-2 border-zinc-800 px-4 pb-2 font-bold uppercase text-zinc-400">
			Matches <span
				class="ml-2 rounded-full bg-zinc-400 px-2 py-0.5 text-sm font-bold text-zinc-900"
				>{numMatches}</span>
		</h2>
		<ol class="">
			{#each data.recentMatches as { isDecay, opponent, outcome, forfeit, time, eloChange, date, id }}
				{@const selected = $page.url.pathname === `/${data.playerData.nickname}/${id}`}
				{@const color = outcome
					? { won: "text-green-400", lost: "text-red-400", draw: "text-blue-400" }[outcome]
					: "zinc"}
				<li class={selected ? "sticky" : ""}>
					{#if isDecay}
						<div
							class="group flex items-center gap-2 rounded-lg px-4 py-1.5 hocus-within:bg-zinc-800">
							<div class="w-40 italic text-zinc-500">Elo decay</div>
							<div class="w-20 text-sm font-bold uppercase text-red-400">
								{eloChange >= 0 ? "+" : ""}{eloChange} elo
							</div>
							<div class="w-20" />
							<!-- <div class=" w-36 text-zinc-600">{date}</div> -->
						</div>
					{:else}
						<a
							data-sveltekit-replacestate
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
		{#if !noMoreMatches}
			<button
				class=" m-2 mb-96 rounded-full px-4 py-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
				on:click={addMoreMatches}>Show more</button>
		{:else if curPage > 1}
			<div class="m-2 px-4 py-2 text-zinc-500">No more to show</div>
		{/if}
	</div>
	<div class="fixed bottom-4 right-4">
		<slot />
	</div>
</div>
